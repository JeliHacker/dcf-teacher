# DCF Teacher
## How to Contribute
1. Clone the project with `git clone https://github.com/JeliHacker/dcf-teacher-afrotech.git`
2. Install the dependencies with `npm install`
3. Create a `.env` file in the `/backend` folder. You can use this command: `touch /backend/.env`.
4. You need two environment variables: `API_KEY` and `USER_AGENT`. For the `API_KEY`, you can get a Gemini key from [the docs](https://ai.google.dev/gemini-api/docs/api-key). For `USER_AGENT`, put in an email address. 
    Example .env file:
    ```
    API_KEY="fiqmD31Ficirm5$jdoaW"
    USER_AGENT="ilovetolearn@gmail.com"
    ```
5. You're all set! Look at the [issues](https://github.com/JeliHacker/dcf-teacher-afrotech/issues) tab or read the rest of the README to find something to work on, open a PR and describe your changes. 
## Next Steps
- display 3 financial statements in sections 2: Balance Sheet, Income Statement, Statement of Cash Flows
- add answer submission box for user to type numbers. Evaluate answers, require correct answer before user can move on.

  
## AfroTech AI Hackathon 2024


https://newprairiepress.org/cgi/viewcontent.cgi?article=1127&context=jft#:~:text=The%20financial%20survey%20revealed%20the,sample%20indicate%20that%20those%20with

The median wealth for caucasian households was ~$110,000 whereas for black households it was ~$7,000. However, white people's incomes are less than 2x that of black people's, so income alone doesn't explain the wealth disparity. What does explain the disparity is that black people are much less likely to be invested in the stock market.

The number one self-reported reason that people did not invest was "I do not understand how the stock market works". This project aims to provide financial education in the form of an interactive walkthrough for getting the intrinsic value of a stock using discounted cash flow valuation (DCF). 

Discounted cash flow analysis is a fundamental part of value investing, which looks at stocks as pieces of business rather than letters and their associated prices. Understanding that by buying stocks, you are buying a piece of a business, and knowing how to determine the value of that business, is foundational to understanding how the stock market works and gives people confidence in their investing decisions. 

Of course, picking individual stocks, much less calculating their intrinsic value, is not required for successful investing. Studies have shown that most people would do well to invest in the broader market in the form of index funds. Nevertheless, by learning DCF valuation, people should get a sense of why stock prices are what they are, and could lead to further interest and possibly the start of a career in finance, especially for young people.

Direct quote from the study: "To entice the African American community to be more active investors, it seems that
part of a holistic solution must include financial education."

### Possibly helpful resources
https://github.com/alphanome-ai/sec-parser