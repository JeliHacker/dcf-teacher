import re

def chunk_10k_file(file_path, output_dir, overlap_chars=1000):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    sections = [
        ("Business Overview", r"Item 1\.\s"),
        ("Risk Factors", r"Item 1A\.\s"),
        ("Unresolved Staff Comments", r"Item 1B\.\s"),
        ("Other", r"Item 1C\.\s"),
        ("Properties", r"Item 2\.\s"),
        ("Legal Proceedings", r"Item 3\.\s"),
        ("Mine Safety Disclosures", r"Item 4\.\s"),
        ("Market Information", r"Item 5\.\s"),
        ("Selected Financial Data", r"Item 6\.\s"),
        ("Management's Discussion and Analysis", r"Item 7\.\s"),
        ("Quantitative and Qualitative Disclosures About Market Risk", r"Item 7A\.\s"),
        ("Financial Statements", r"Item 8\.\s"),
        ("Changes in and Disagreements with Accountants", r"Item 9\.\s"),
        ("Controls and Procedures", r"Item 9A\.\s"),
        ("Other Information", r"Item 9B\.\s"),
        ("Additional Information", r"Item 9C\.\s"),
        ("Directors and Executive Officers", r"Item 10\.\s"),
        ("Executive Compensation", r"Item 11\.\s"),
        ("Security Ownership of Certain Beneficial Owners", r"Item 12\.\s"),
        ("Certain Relationships and Related Transactions", r"Item 13\.\s"),
        ("Principal Accounting Fees and Services", r"Item 14\.\s"),
        ("Exhibits, Financial Statement Schedules", r"Item 15\.\s")
    ]

    # Find the start positions of each section
    positions = []
    for section_name, pattern in sections:
        match = re.search(pattern, content)
        if match:
            positions.append((section_name, match.start()))

    # Sort positions by their occurrence in the document
    positions.sort(key=lambda x: x[1])
    # Create chunks with overlap
    for i in range(len(positions)):
        start = positions[i][1]  # Start from the section's start position
        end = positions[i+1][1] if i+1 < len(positions) else len(content)  # Until the next section or end of content
        
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

        # Write chunk to file
        chunk_filename = f"{output_dir}/{positions[i][0].replace(' ', '_')}.txt"
        with open(chunk_filename, 'w', encoding='utf-8') as chunk_file:
            chunk_file.write(chunk_content)

    print(f"Chunking complete. Files saved in {output_dir}")

# Usage
file_path = "./extracted_sections_apple.txt"
output_dir = "./my_chunks"
chunk_10k_file(file_path, output_dir)
