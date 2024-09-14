from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()
API_KEY = os.getenv('API_KEY')
genai.configure(api_key=API_KEY)

# model = genai.GenerativeModel("gemini-1.5-flash")

# response = model.generate_content('Which states have the highest property tax rates, and which states have the lowest?')
# print(response.text)


if __name__ == "__main__":
    text = "Hello world. My name is Eli."
    result = genai.embed_content(model="models/text-embedding-004", content=text)
    print(result)
    
    model = genai.GenerativeModel("gemini-1.5-flash")

    response = model.generate_content(f'You already know my name. What is it? (Hint: my name is Eli)')
    print(response.text)