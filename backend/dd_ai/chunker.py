import re
import json
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError

# MongoDB connection for local instance
uri = "mongodb://localhost:27017/"  # Local MongoDB URI
client = MongoClient(uri)  # No need for ServerApi when connecting locally
db = client['chunkStore']  # Replace with your database name
chunks_collection = db['chunks']   # Replace with your collection name

def chunk_10k_file(file_path, document_id, overlap_chars=1000):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    sections = [
        ("Business Overview", r"(?i)Item 1\.\s"),
        ("Risk Factors", r"(?i)Item 1A\.\s"),
        ("Unresolved Staff Comments", r"(?i)Item 1B\.\s"),
        ("Other", r"(?i)Item 1C\.\s"),
        ("Properties", r"(?i)Item 2\.\s"),
        ("Legal Proceedings", r"(?i)Item 3\.\s"),
        ("Mine Safety Disclosures", r"(?i)Item 4\.\s"),
        ("Market Information", r"(?i)Item 5\.\s"),
        ("Selected Financial Data", r"(?i)Item 6\.\s"),
        ("Management's Discussion and Analysis", r"(?i)Item 7\.\s"),
        ("Quantitative and Qualitative Disclosures About Market Risk", r"(?i)Item 7A\.\s"),
        ("Financial Statements", r"(?i)Item 8\.\s"),
        ("Changes in and Disagreements with Accountants", r"(?i)Item 9\.\s"),
        ("Controls and Procedures", r"(?i)Item 9A\.\s"),
        ("Other Information", r"(?i)Item 9B\.\s"),
        ("Additional Information", r"(?i)Item 9C\.\s"),
        ("Directors and Executive Officers", r"(?i)Item 10\.\s"),
        ("Executive Compensation", r"(?i)Item 11\.\s"),
        ("Security Ownership of Certain Beneficial Owners", r"(?i)Item 12\.\s"),
        ("Certain Relationships and Related Transactions", r"(?i)Item 13\.\s"),
        ("Principal Accounting Fees and Services", r"(?i)Item 14\.\s"),
        ("Exhibits, Financial Statement Schedules", r"(?i)Item 15\.\s")
    ]

    # Find the start positions of each section
    positions = []
    for section_name, pattern in sections:
        match = re.search(pattern, content)
        if match:
            item_id_match = re.search(r"Item (\d+[A-Za-z]?)", pattern)
            item_id = item_id_match.group(1) if item_id_match else f"Unknown_{section_name}"
            positions.append((section_name, item_id, match.start()))

    # Sort positions by their occurrence in the document
    positions.sort(key=lambda x: x[2])

    # Dictionary to hold chunks under document_id
    result = {
        "_id": document_id,  # Use document_id as MongoDB _id
        "chunks": []  # List of chunks
    }
    chunk_id = 1  # Initialize chunk ID

    # Create chunks with overlap
    for i in range(len(positions)):
        start = positions[i][2]  # Start from the section's start position
        end = positions[i+1][2] if i+1 < len(positions) else len(content)  # Until the next section or end of content

        chunk_content = content[start:end].strip()

        # Initialize context as an empty string
        context = ""

        # Add context from the previous chunk
        if i > 0:
            prev_start = positions[i-1][2]
            prev_end = start
            prev_content = content[prev_start:prev_end]

            sentences = re.findall(r'[^.!?]+[.!?]', prev_content)
            if sentences:
                context = ' '.join(sentences[-3:]).strip()  # Use last 3 sentences or fewer

        # Append chunk to the result dictionary under the document ID
        result["chunks"].append({
            "chunkID": f"{document_id}_chunk_{chunk_id}",
            "title": positions[i][0],  # Section title
            "itemID": positions[i][1],  # Item ID
            "context": context,  # Add the context from the previous chunk
            "content": chunk_content
        })

        chunk_id += 1  # Increment chunk ID

    # Insert the entire document with chunks into MongoDB
    try:
        chunks_collection.insert_one(result)
    except DuplicateKeyError:
        print(f"Document with _id {document_id} already exists. Skipping...")
    else:
        print(f"Document with _id {document_id} has been stored in MongoDB.")

# Usage
file_path = "./extracted_sections_apple.txt"
document_id = "AAPL_2023_10K"
chunk_10k_file(file_path, document_id)