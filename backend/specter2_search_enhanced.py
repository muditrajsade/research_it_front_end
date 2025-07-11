import torch
import numpy as np
from sentence_transformers import SentenceTransformer
from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from typing import List, Dict, Any, Optional, Tuple
import requests
import time
import logging
from dataclasses import dataclass
import arxiv
import re

@dataclass
class PaperMetadata:
    arxiv_id: str
    title: str
    authors: List[str]
    abstract: str
    published: str
    categories: List[str]
    doi: Optional[str] = None
    journal_ref: Optional[str] = None

class ArxivMetadataFetcher:
    def __init__(self):
        self.cache = {}
        self.client = arxiv.Client()
    
    def _clean_arxiv_id(self, arxiv_id: str) -> str:
        """Clean arxiv ID to standard format"""
        if arxiv_id.startswith('arXiv:'):
            return arxiv_id[6:]
        return arxiv_id
    
    def fetch_metadata(self, arxiv_ids: List[str]) -> Dict[str, PaperMetadata]:
        """Fetch metadata for multiple arXiv IDs"""
        results = {}
        uncached_ids = []
        
        # Check cache first
        for arxiv_id in arxiv_ids:
            clean_id = self._clean_arxiv_id(arxiv_id)
            if clean_id in self.cache:
                results[clean_id] = self.cache[clean_id]
            else:
                uncached_ids.append(clean_id)
        
        # Fetch uncached metadata
        if uncached_ids:
            try:
                search = arxiv.Search(id_list=uncached_ids)
                papers = list(self.client.results(search))
                
                for paper in papers:
                    clean_id = self._clean_arxiv_id(paper.entry_id.split('/')[-1])
                    metadata = PaperMetadata(
                        arxiv_id=clean_id,
                        title=paper.title,
                        authors=[author.name for author in paper.authors],
                        abstract=paper.summary,
                        published=paper.published.isoformat(),
                        categories=paper.categories,
                        doi=paper.doi,
                        journal_ref=paper.journal_ref
                    )
                    self.cache[clean_id] = metadata
                    results[clean_id] = metadata
                    
            except Exception as e:
                logging.error(f"Error fetching metadata: {e}")
        
        return results

class SPECTER2Search:
    def __init__(self, collection_name: str = "arxiv_papers"):
        self.collection_name = collection_name
        self.model = None
        self.client = None
        self.metadata_fetcher = ArxivMetadataFetcher()
        self.gpu_count = torch.cuda.device_count()
        
        # Initialize
        self._initialize_model()
        self._initialize_qdrant()
    
    def _initialize_model(self):
        """Initialize SPECTER2 model"""
        try:
            # Use a sentence transformer model that works similarly to SPECTER2
            self.model = SentenceTransformer('allenai/specter2')
            logging.info("SPECTER2 model loaded successfully")
        except Exception as e:
            logging.error(f"Failed to load SPECTER2 model: {e}")
            # Fallback to a scientific text model
            self.model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
            logging.info("Using fallback model")
    
    def _initialize_qdrant(self):
        """Initialize Qdrant client"""
        try:
            self.client = QdrantClient(":memory:")  # In-memory for demo
            # For production, use: QdrantClient(host="localhost", port=6333)
            
            # Create collection if it doesn't exist
            collections = self.client.get_collections()
            if self.collection_name not in [col.name for col in collections.collections]:
                self.client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=VectorParams(
                        size=768,  # SPECTER2 embedding dimension
                        distance=Distance.COSINE
                    )
                )
            logging.info("Qdrant initialized successfully")
        except Exception as e:
            logging.error(f"Failed to initialize Qdrant: {e}")
            raise
    
    def search(self, query_text: str, top_k: int = 10, search_mode: str = "balanced", 
               fetch_metadata: bool = True) -> Tuple[List[Any], float, Dict[str, PaperMetadata]]:
        """Search for papers using SPECTER2 embeddings"""
        start_time = time.time()
        
        # Encode query
        query_embedding = self.model.encode([query_text])
        
        # Search in Qdrant
        search_results = self.client.search(
            collection_name=self.collection_name,
            query_vector=query_embedding[0].tolist(),
            limit=top_k
        )
        
        search_time = (time.time() - start_time) * 1000
        
        # Fetch metadata if requested
        metadata_dict = {}
        if fetch_metadata and search_results:
            arxiv_ids = [result.payload.get('arxiv_id', '') for result in search_results]
            metadata_dict = self.metadata_fetcher.fetch_metadata(arxiv_ids)
        
        return search_results, search_time, metadata_dict
    
    def smart_search(self, query_text: str, top_k: int = 10, min_good_results: int = 3,
                    fetch_metadata: bool = True) -> Tuple[List[Any], float, str, Dict[str, PaperMetadata]]:
        """Smart search that selects the best mode automatically"""
        # For demo, just use balanced mode
        results, search_time, metadata_dict = self.search(
            query_text, top_k, "balanced", fetch_metadata
        )
        return results, search_time, "balanced", metadata_dict
    
    def compare_search_modes(self, query_text: str, top_k: int = 10, 
                           fetch_metadata: bool = True) -> Tuple[Dict[str, Dict], str, Dict[str, PaperMetadata]]:
        """Compare all search modes"""
        modes = ["fast", "balanced", "quality"]
        results = {}
        all_metadata = {}
        
        for mode in modes:
            mode_results, search_time, metadata_dict = self.search(
                query_text, top_k, mode, fetch_metadata
            )
            
            # Calculate metrics
            scores = [result.score for result in mode_results]
            avg_score = np.mean(scores) if scores else 0
            high_confidence = sum(1 for score in scores if score > 0.8)
            good_results = sum(1 for score in scores if score > 0.7)
            
            results[mode] = {
                'results': mode_results,
                'search_time': search_time,
                'avg_score': avg_score,
                'high_confidence': high_confidence,
                'good_results': good_results
            }
            
            all_metadata.update(metadata_dict)
        
        # Select best mode (simple heuristic)
        best_mode = max(results.keys(), key=lambda m: results[m]['avg_score'])
        
        return results, best_mode, all_metadata

    def add_demo_data(self):
        """Add some demo data for testing"""
        demo_papers = [
            {
                'arxiv_id': '2010.15980',
                'title': 'SPECTER: Document-level Representation Learning using Citation-informed Transformers',
                'text': 'We present SPECTER, a pre-trained language model to generate document-level embedding of scientific papers.'
            },
            {
                'arxiv_id': '1706.03762',
                'title': 'Attention Is All You Need',
                'text': 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms.'
            },
            {
                'arxiv_id': '1810.04805',
                'title': 'BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding',
                'text': 'We introduce BERT, a new language representation model which stands for Bidirectional Encoder Representations from Transformers.'
            }
        ]
        
        points = []
        for i, paper in enumerate(demo_papers):
            embedding = self.model.encode([paper['text']])
            points.append(PointStruct(
                id=i,
                vector=embedding[0].tolist(),
                payload={'arxiv_id': paper['arxiv_id'], 'title': paper['title']}
            ))
        
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )
        logging.info(f"Added {len(demo_papers)} demo papers")