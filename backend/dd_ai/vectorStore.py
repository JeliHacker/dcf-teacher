from pymilvus import connections, db

# Connect to Milvus
connections.connect(alias="default", host="localhost", port="19530")

vectordb = db.create_database("store_embeddings")
db.using_database("store_embeddings")

print(db.list_database())



print("Milvus connected successfully")
