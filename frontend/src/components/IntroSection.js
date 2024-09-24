import React from 'react';
import dcf_teacher_intro from '../assets/dcf_teacher_intro.png';
import { Button } from '@chakra-ui/react';
import './IntroSection.css';

function IntroSection({ onComplete }) {
    return (
        <div className="section">

            <div className="intro-section">
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <img src={dcf_teacher_intro} alt={"DCF Teacher"} className="intro-image" />

                    <div className="intro-text">
                        <h3>Welcome to DCF Teacher!</h3>
                        <p>DCF Teacher is an interactive tutorial for learning how to value a stock.
                            DCF stands for <span className="italics">discounted cash flows.</span> In a DCF valuation, you image all the cash a business will create in the future,
                            and conut it all up. By discounting cash flows, you treat upcoming cash flows as more valuable than cash far in the future, because of the time value of money.
                            Discounted cash flow valuation is the preferred method of valuation for famed investors such as Warren Buffett.
                        </p>
                        <p>
                            On the right side of your screen you'll see two sections: a teacher chat box, and a place to submit answers. You can ask the teacher anything.
                            You'll use the answer box to submit stock data we ask you to find, or to answer multiple choice questions at the end of a section.
                        </p>
                        <p>
                            If any of that sounded confusing, don't worry, this tutorial will walk you through the process. For now, get started by picking a company to value in the next section!
                        </p>
                    </div>
                </div>
                <div>
                    <h5>The Time Value of Money</h5>
                    <p>
                        If I offered you $100 today, or $100 a year from today, which would you take? What if I offered you $100 today, or $110 a year from today?
                        These scenarios involve the time value of money.
                        A dollar today is worth more than a dollar tomorrow. There's a couple reasons for this. First off, in practical terms,
                        inflation eats away at the value of money. Over time, you can buy fewer things with the same amount of money. $100 could buy a working car in the 1930s.
                        Not so today.
                        The other reason that future money is worth less than current money is due to opportunity cost. Money you have can be invested today. 
                        If you can achieve a 10% return on your investment in the next year, then $100 today and $110 a year from today are worth the same amount of money.
                        What if you could achieve a 50% return on investment? Then $100 today equals $150 a year from today. You would take $100 now instead of $110 later.
                        What if you could only achieve a 1% return on investment? Then $100 today equals $101 a year from today. Now you might be more inclined to take $110 later instead of $100 now.
                    </p>
                    <h2>Ask a multiple choice question here???</h2>
                    <h5>Discount Rate</h5>
                    <p>

                    </p>
                    <h5>Cash Flows and Growth Rates</h5>
                    <p>
                        Every company exists to make money. However, not every company is profitable. Some companies, such as startups, have never been profitable, and hope to one day become profitable.
                        Other companies may have been profitable in the past but are no longer.
                        Companies that are profitable generate free cash flow. Free cash flow is all the cash a company brings in, minus money is invests back in the company.
                    </p>
                </div>
            </div>

            <Button onClick={onComplete} style={{ marginTop: '20px' }}>
                Pick a stock to value!
            </Button>
        </div>
    );
}

export default IntroSection;

