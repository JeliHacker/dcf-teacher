from transformers import AutoTokenizer, AutoModel
import torch

tokenizer = AutoTokenizer.from_pretrained("ProsusAI/finbert")
model = AutoModel.from_pretrained("ProsusAI/finbert")

def embed(text): 
    input = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        output = model(**input)
    
    hidden_states = output.last_hidden_state

    cls_embeddings = hidden_states[:, 0, :]
    mean_embeddings = hidden_states.mean(1)
    
    print("cls_embeddings.shape: ", cls_embeddings)
    print('mean_embeddings.shape: ', mean_embeddings)


text = "Apple is looking at buying U.K. startup for $1 billion"

embed(text)