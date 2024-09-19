import React from 'react';
import dcf_teacher_intro from '../assets/dcf_teacher_intro.png';
import { Button } from '@chakra-ui/react';
import './IntroSection.css';

function IntroSection({ title, children, onComplete, completed }) {
    return (
        <div className="section">
            <h2>{title}</h2>
            {children}

            <div className="intro-section">
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

            <Button onClick={onComplete} style={{ marginTop: '20px' }}>
                Pick a stock to value!
            </Button>
        </div>
    );
}

export default IntroSection;

