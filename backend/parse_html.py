import re
import os


HEADERS = {'User-Agent': os.getenv('USER_AGENT')}




text = """
XML 17 R3.htm IDEA: XBRL DOCUMENTCONSOLIDATED STATEMENTS OF OPERATIONS - USD ($)
shares in Thousands, $ in Millions
12 Months EndedSep. 30, 2023Sep. 24, 2022Sep. 25, 2021Net sales$ 383,285$ 394,328$ 365,817Cost of sales214,137223,546212,981Gross margin169,148170,782152,836Operating expenses:   Research and development29,91526,25121,914Selling, general and administrative24,93225,09421,973Total operating expenses54,84751,34543,887Operating income114,301119,437108,949Other income/(expense), net(565)(334)258Income before provision for income taxes113,736119,103109,207Provision for income taxes16,74119,30014,527Net income$ 96,995$ 99,803$ 94,680Earnings per share:   Basic (in dollars per share)$ 6.16$ 6.15$ 5.67Diluted (in dollars per share)$ 6.13$ 6.11$ 5.61Shares used in computing earnings per share:   Basic (in shares)15,744,23116,215,96316,701,272Diluted (in shares)15,812,54716,325,81916,864,919Products   Net sales$ 298,085$ 316,199$ 297,392Cost of sales189,282201,471192,266Services   Net sales85,20078,12968,425Cost of sales$ 24,855$ 22,075$ 20,715
"""

# Regular expression to match numerical values and their preceding labels
pattern = r"(\w+\s*\w*)\s*(\$\s*\d+\,\d*|\d+\,\d*)"

matches = re.findall(pattern, text)

# Print the extracted values and their labels
for label, value in matches:
    print(f"{label}: {value}")

