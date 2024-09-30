import dcf_teacher_intro from '../assets/dcf_teacher_intro.png';

function InstructionsComponent({ text }) {
  return (
    <div className="section">
      <div>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div className="intro-text">
            <h3>Welcome to DCF Teacher!</h3>
            
            <p>DCF Teacher is an interactive tutorial for learning how to value a stock.
              DCF stands for <span className="italics">discounted cash flows.</span> In a DCF valuation, you imagine all the cash a business will create in the future,
              and count it all up. By discounting cash flows, you treat upcoming cash flows as more valuable than cash far in the future, because of the time value of money.
              Discounted cash flow valuation is the preferred method of valuation for famed investors such as Warren Buffett.
            </p>
            <p>
              This tutorial will walk you through the process of valuing a stock. You will pick a company to value, and you will be asked to find numbers in that company's financial statements.
              Follow the instructions on the left side of the screen.
            </p>
            <p>This website leverages artificial intelligence (specifically, Google's Gemini model) to help you learn. Use the chat feature on the left to ask questions. 
              You will also get personalized feedback on your answers.</p>
            <p>
              If any of that sounded confusing, don't worry, this tutorial will walk you through the process. For now, get started by picking a company to value in the next section!
            </p>
          </div>
          <img src={dcf_teacher_intro} alt={"DCF Teacher"} className="intro-image" />
        </div>
      </div>
    </div>
  );
}

export default InstructionsComponent;