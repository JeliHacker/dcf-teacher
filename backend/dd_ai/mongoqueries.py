from pymongo import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb://localhost:27017/"
client = MongoClient(uri, server_api=ServerApi('1'))

db = client['chunkStore']
chunks_collection = db['chunks']


def get_chunks(): 
    document = chunks_collection.find_one()
    return document["chunks"] if document else []

def get_document_id(document_id): 
    document = chunks_collection.find_one()
    return document["documentID"] if document else None

