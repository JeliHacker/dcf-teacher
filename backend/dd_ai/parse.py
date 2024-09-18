import requests 
from bs4 import BeautifulSoup 
import re 
import pandas as pd 

def read_10k_file(file_path):
    with open(file_path, 'r') as f:
        return f.read() 

def extract_document_sections(raw_10k):
    doc_start_pattern = re.compile(r'<DOCUMENT>', re.IGNORECASE)
    doc_end_pattern = re.compile(r'</DOCUMENT>', re.IGNORECASE)
    type_pattern = re.compile(f'<TYPE>[^\n]+')

    doc_start_is = [x.end() for x in doc_start_pattern.finditer(raw_10k)]
    doc_end_is = [x.start() for x in doc_end_pattern.finditer(raw_10k)]
    doc_types = [x[len('<TYPE>'):] for x in type_pattern.findall(raw_10k)]

    document = {}
    for doc_type, doc_start, doc_end in zip(doc_types, doc_start_is, doc_end_is):
        if doc_type == '10-K':
            document[doc_type] = raw_10k[doc_start:doc_end]
    return document


def extract_items(document):
    regex = re.compile(r'(ITEM\s+|>Item\s+)(\d+[A-Za-z]*)\.?', re.IGNORECASE)
    matches = regex.finditer(document['10-K'])

    test_df = pd.DataFrame([(x.group(), x.start(), x.end()) for x in matches])
    test_df.columns = ['item', 'start', 'end']
    test_df['item'] = test_df['item'].str.lower()

    filtered_df = test_df[test_df['item'].str.endswith('.')].copy()

    replacements = {
        '&#160;': ' ',
        '&nbsp;': ' ',
        '&#8217;': '\'',
        '&#8220;': '"',
        '&#8221;': '"',
        '&#8211;': '-',
        ' ': '',
        r'\.': '',
        '>': ''
    }

    for old, new in replacements.items():
        filtered_df.loc[:, 'item'] = filtered_df['item'].str.replace(old, new, regex=True)

    pos_dat = filtered_df.sort_values('start', ascending=True).drop_duplicates(subset=['item'], keep='last')
    pos_dat.set_index('item', inplace=True)

    print(pos_dat)  # Debug output to see item positions

    return pos_dat

    
def extract_item_content(document, pos_dat, item_start, item_end): 
    extracted_item_content = document['10-K'][pos_dat['start'].loc[item_start]:pos_dat['start'].loc[item_end]]
    return BeautifulSoup(extracted_item_content, 'lxml').get_text("\n\n")

def write_to_file(file_path, content):
    with open(file_path, 'a') as f:
        f.write(content + "\n\n")

def main(): 
    raw_10k = read_10k_file('full-submission copy.txt')
    document = extract_document_sections(raw_10k)
    pos_dat = extract_items(document)
    sections = ['item1', 'item1a', 'item1b', 'item1c', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7', 'item7a', 'item8', 
                'item9', 'item9a', 'item9b', 'item9c', 'item10', 'item11', 'item12', 'item13', 'item14', 'item15']
    
    output_file = 'extracted_sections_apple.txt'
    
    for i in range(len(sections) - 1): 
        item_start = sections[i]
        item_end = sections[i + 1]
        if item_start in pos_dat.index and item_end in pos_dat.index:
            item_content = extract_item_content(document, pos_dat, item_start, item_end)
            write_to_file(output_file, item_content)
            # print(item_content)
if __name__ == '__main__': 
    main() 


