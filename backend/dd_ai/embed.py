from transformers import AutoTokenizer, AutoModel
import torch
import json


tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
model = AutoModel.from_pretrained("ProsusAI/finbert")

# Putting the model in evaluation mode is important because it disables certain layers that are only active during training, 
# such as dropout layers and batch normalization layers. This ensures that the model's predictions are deterministic and 
# consistent during inference, leading to more reliable and stable results.
model.eval()


def embed_text(text, model, tokenizer): 
    input = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**input)
    
    # hidden_states = output.last_hidden_state

    # Get the embeddings from last hidden state 
    embeddings = outputs.last_hidden_state.mean(dim=1)
    return embeddings


def load_chunks(json_file_path):
    with open(json_file_path, 'r', encoding='utf-8') as file: 
        return json.load(file)

def embed_chunks(json_file_path, model, tokenizer):
    chunks = load_chunks(json_file_path)
    embeddings = {}

    for chunk in chunks: 
        content = chunk["content"]
        chunk_id = chunk["chunkID"]

        chunk_embedding = embed_text(content, model, tokenizer)

        #store embedding in a dict (for now) or save directly in vectorDB
        embeddings[chunk_id] = chunk_embedding
    return embeddings

json_file_path = "./dd_ai/my_chunks.json"
embeddings = embed_chunks(json_file_path, model, tokenizer)

for chunk_id, embedding in embeddings.items(): 
    print(f'Chunk ID: {chunk_id}, Embedding Shape: {embedding.shape}')