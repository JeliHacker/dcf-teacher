import re
import json
import os

def chunk_10k_file(file_path, output_json_path, document_id, overlap_chars=1000):
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
            item_id = re.search(r"Item (\d+[A-Za-z]?)", pattern).group(1)
            positions.append((section_name, item_id, match.start()))


    # Sort positions by their occurrence in the document
    positions.sort(key=lambda x: x[2])
    chunks = []
    chunk_id = 1  # Initialize chunk ID
    
    # Create chunks with overlap
    for i in range(len(positions)):
        start = positions[i][2]  # Start from the section's start position
        end = positions[i+1][2] if i+1 < len(positions) else len(content)  # Until the next section or end of content
        
        # Add overlap to the next chunk if not the last chunk
        if i < len(positions) - 1:
            end_with_overlap = min(end + overlap_chars, len(content))
        else:
            end_with_overlap = end

        chunk_content = content[start:end_with_overlap].strip()

        # Add overlap from previous chunk to current chunk
        if i > 0:
            overlap_start = max(0, start - overlap_chars)
            overlap_text = content[overlap_start:start].strip()
            chunk_content = f"[PREVIOUS CONTEXT START]\n{overlap_text}\n[PREVIOUS CONTEXT END]\n\n{chunk_content}"

        # Prepare chunk for JSON
        chunks.append({
            "chunkID": f"{document_id}_chunk_{chunk_id}",
            "documentID": document_id,
            "title": positions[i][0],  # Section title
            "itemID": positions[i][1],  # Item number from the regex
            "content": chunk_content
        })

        chunk_id += 1  # Increment chunk ID

    # Write chunks to JSON file
    with open(output_json_path, 'w', encoding='utf-8') as json_file:
        json.dump(chunks, json_file, indent=4)

    print(f"Chunking complete. Chunks saved to {output_json_path}")

# Usage
file_path = "./extracted_sections_google.txt"
output_json_path = "./my_chunks_google.json"
document_id = "AAPL_2023_10K"
chunk_10k_file(file_path, output_json_path, document_id)
