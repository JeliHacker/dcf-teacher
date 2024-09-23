from transformers import AutoTokenizer, AutoModel
import torch
import json
from mongoqueries import get_chunks
import numpy as np
from langchain.vectorstores import PGVector
from langchain.embeddings import HuggingFaceEmbeddings
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document
import psycopg2


# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
model = AutoModel.from_pretrained("ProsusAI/finbert")
model.eval()

# Connection string to PostgreSQL with pgvector
CONNECTION_STRING = "postgresql+psycopg2://postgres:test@localhost:5433/vector_db"
COLLECTION_NAME = '10k_embeddings'

def store_embeddings(): 
    chunks = get_chunks()  # Fetch chunks from MongoDB
    documents = []

    for chunk in chunks: 
        content = chunk["content"]
        chunk_id = chunk["chunkID"]
        context = chunk["context"]

        doc = Document(
            page_content = content, 
            metadata = {
                "chunkID": chunk_id,
                "content": content,
                "context": context
            }
        )
        documents.append(doc)

    # Store documents and their embeddings in pgvector
    db = PGVector.from_documents(
        documents=documents,
        embedding=embeddings,
        connection_string=CONNECTION_STRING,
        collection_name=COLLECTION_NAME
    )
    print(f"Stored {len(documents)} documents in pgvector.")

    return db



def embed_text(text): 
    input = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**input)
    
    # hidden_states = output.last_hidden_state

    # Get the embeddings from last hidden state 
    embeddings = outputs.last_hidden_state.mean(dim=1)
    return embeddings.squeeze().tolist()

class CustomHuggingFaceEmbeddings(HuggingFaceEmbeddings):
    def embed_documents(self, texts):
        return [embed_text(text) for text in texts]
    
    def embed_query(self, text):
        return embed_text(text)

embeddings = CustomHuggingFaceEmbeddings(model_name="ProsusAI/finbert")


vector_db = store_embeddings()

query = "Does the company manufacture iphones, ipads?"

similar = vector_db.similarity_search_with_score(query, k=1)
for doc in similar: 
    print(doc)