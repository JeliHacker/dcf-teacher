<div align="center">
  <img src="https://github.com/user-attachments/assets/ce6795d1-6370-4ce8-9e02-a2634a3ac92d" height="400">
</div>

## What is this?
DCF Teacher is an online discounted cash flow (DCF) tutorial, which teaches users how to value a stock. DCF is the preferred financial model of famed investors such as Warren Buffett. By learning how to come to an intrinsic value for a company, we hope to give people an intellectual framework to make investment decisions, should they choose to invest in individual stocks.
## AfroTech AI Hackathon 2024
We submitted DCF Teacher to the 2024 (AfroTech AI Hackathon)[https://afrotech.devpost.com/]. The hackathon gave participants the following instructions:
```
Participants will be challenged to build or update a software application
that integrates APIs from Google Gemini or OpenAI and fits into one of the following categories:


Health and Medical
Sustainability
Cyber Security and Risk
Skills-based Workforce Development
```
DCF Teacher falls under the "Skills-based Workforce Development" category. We discuss the philosophy behind the project below.
## Philosophy
We were inspired by [this](https://newprairiepress.org/cgi/viewcontent.cgi?article=1127&context=jft#:~:text=The%20financial%20survey%20revealed%20the,sample%20indicate%20that%20those%20with) 2011 study by Hudson et. al. on investment behavior among different demographics.

In 2011, the median wealth for caucasian households was ~$110,000 whereas for black households it was ~$7,000. However, white people's incomes were less than 2x that of black people's, so income alone doesn't explain the wealth disparity. What does explain the gap is that black people are much less likely to invest in the stock market.

The number one self-reported reason people gave for not investing was "I do not understand how the stock market works". This project aims to provide financial education in the form of an interactive walkthrough for estimating the intrinsic value of a stock using discounted cash flow valuation (DCF). 

Discounted cash flow analysis is a fundamental part of value investing, a practice that looks at stocks as pieces of business rather than pieces of paper. We believe the concept of seeing stocks as pieces of real businesses is foundational to understanding how the stock market works and gives people confidence in their investing decisions. 

We believe closing the racial wealth gap is necessary to achieve equality of opportunity in America, and getting more people invested in the stock market is an important part of that. DCF Teacher aims to encourage stock market participation in people who feel intimidated or ignorant about stocks.

In addition to the broader wealth gap, black people are underrepresented in the finance industry in America. We hope that an accessible tutorial such as DCF Teacher can expose young people to an important aspect of business by quickly giving them a skill that professionals use every day.

To be clear, picking individual stocks, much less calculating their intrinsic value, is not required for successful investing. Most people would do well to invest in the broader market in the form of index funds. Nevertheless, learning DCF valuation helps one get a sense for why stock prices are what they are, and could lead to further interest and possibly the start of a career in finance, especially for young people.

Direct quote from the study: "To entice the African American community to be more active investors, it seems that
part of a holistic solution must include financial education."



## How to Contribute
1. Clone the project with `git clone https://github.com/JeliHacker/dcf-teacher-afrotech.git`. Then, navigate into the project: `cd dcf-teacher-afrotech`.
2. Create a `.env` file in the `/backend` folder. On macOS/Linux: `touch /backend/.env` On Windows: `New-Item -Path backend\.env -ItemType File`.
3. You need two environment variables: `API_KEY` and `USER_AGENT`. For the `API_KEY`, you can get a Gemini key from [the docs](https://ai.google.dev/gemini-api/docs/api-key). For `USER_AGENT`, put in an email address. 
    Example .env file:
    ```
    API_KEY="your-gemini-api-key-here"
    USER_AGENT="your-email@example.com"
    ```
4. Download [Poetry](https://python-poetry.org). On macOS/Linux:  `curl -sSL https://install.python-poetry.org | python3 -`. On Windows: `(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | python -`.
5. Setup Poetry env: `poetry env use python3.12`. Make sure Python 3.12 is installed on your system. You can check this by running `python --version`.
6. Install the Python dependencies with `poetry install`.
7. Activate poetry virtual environment using: `poetry shell`.
8. Run the API with `flask run --port 8000`.
9. Install the dependencies in the `frontend` folder with `cd frontend && npm install`.
10. Run `npm start` from the `frontend` folder.
Contact @I-Johnson if you face any issues

11. You're all set! Look at the [issues](https://github.com/JeliHacker/dcf-teacher-afrotech/issues) tab or read the rest of the README to find something to work on, open a PR and describe your changes. 

