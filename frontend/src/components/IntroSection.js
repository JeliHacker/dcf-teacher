import React from 'react';
import time_value_of_money from '../assets/time_value_of_money.png';
import { Button } from '@chakra-ui/react';
import './IntroSection.css';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';

function IntroSection({ onComplete }) {
    return (
        <div className="section">
            <div className="intro-section">
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div className="intro-text">
                        <h3>The Time Value of Money</h3>
                        If I offered you $100 today, or $100 a year from now, which would you take? What if I offered you $100 today, or $110 a year from now?
                        <br />
                        These scenarios involve the time value of money. For the first option, you probably chose to have $100 today
                        A dollar today is worth more than a dollar tomorrow. There's a couple reasons for this. First off, in practical terms,
                        inflation eats away at the value of money. Over time, you can buy fewer things with the same amount of money. $100 could buy a working car in the 1930s.
                        Not so today.
                        The other reason that future money is worth less than current money is due to opportunity cost. Money you have can be invested today.
                        If you can achieve a 10% return on your investment in the next year, then $100 today and $110 a year from today are worth the same amount of money.
                        What if you could achieve a 50% return on investment? Then $100 today equals $150 a year from today. You would take $100 now instead of $110 later.
                        What if you could only achieve a 1% return on investment? Then $100 today equals $101 a year from today. Now you might be more inclined to take $110 later instead of $100 now.

                    </div>

                    <img src={time_value_of_money} alt={"Time Value of Money"} className="intro-image" />
                </div>

                <MultipleChoiceQuestion topic={'time value of money'} />

                {/* <div className="intro-text">
                    <h3>The Two Assumptions</h3>
                    So, we know that money today is worth more than money tomorrow. But how much more? To determine how to compare future cash flows to current ones, we use a <strong>discount rate</strong>.
                    There is a formula for this. 
                    <br />
                   
                </div>

                <p>

                </p>
                <h5>Cash Flows and Growth Rates</h5>
                <p>
                    Every company exists to make money. However, not every company is profitable. Some companies, such as startups, have never been profitable, and hope to one day become profitable.
                    Other companies may have been profitable in the past but are no longer.
                    Companies that are profitable generate free cash flow. Free cash flow is all the cash a company brings in, minus money is invests back in the company.
                </p> */}

            </div>

            <Button onClick={onComplete} style={{ marginTop: '20px' }}>
                Pick a stock to value!
            </Button>
        </div>
    );
}

export default IntroSection;

