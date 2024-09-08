from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()
API_KEY = os.getenv('API_KEY')
genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-1.5-flash")
response = model.generate_content('Which states have the highest property tax rates, and which states have the lowest?')
print(response.text)



