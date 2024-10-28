// src/pages/Tutorial.js
import React from 'react';
import GuideDrawer from '../components/GuideDrawer';
import ChatDrawer from '../components/ChatDrawer';
import UserSubmissionComponent from '../components/UserSubmissionComponent';
import SectionComponent from '../components/SectionComponent';
import InstructionsComponent from '../components/InstructionsComponent';
import IntroSection from '../components/IntroSection';
import StockSelection from '../components/StockSelection';
import FinancialStatements from '../components/FinancialStatements';
import CashFlowProjectionsComponent from '../components/CashFlowProjectionsComponent';

const Tutorial = ({
  sections, 
  currentSection, 
  navigateToSection, 
  chatHistory, 
  isLoading, 
  userMessage, 
  setUserMessage, 
  sendMessage, 
  selectedStock, 
  onSubmitAnswers, 
  selectedStockTicker, 
  updateSectionCompleted, 
  setSectionCompleted, 
  completeSection, 
  handleStockSelect
}) => {
  return (
    <div className="App">
      <div className='right-column'>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}>
          <GuideDrawer
            className="GuideDrawer"
            currentSection={sections[currentSection].title}
            sections={sections}
            navigateToSection={navigateToSection}
          />
          <ChatDrawer
            chatHistory={chatHistory}
            isLoading={isLoading}
            userMessage={userMessage}
            setUserMessage={setUserMessage}
            sendMessage={sendMessage}
            ticker={selectedStock !== null ? selectedStock.ticker : ''}
          />
        </div>
        <hr className='separator' />
        <UserSubmissionComponent
          currentSection={currentSection}
          sections={sections}
          onSubmit={onSubmitAnswers}
          selectedStockTicker={selectedStockTicker}
          setSectionCompleted={updateSectionCompleted}
        />
      </div>
      <div className="Panel2">
        <SectionComponent
          title={sections[currentSection].title}
          content={sections[currentSection].content}
          onComplete={completeSection}
          completed={sections[currentSection].completed}
          setSectionCompleted={setSectionCompleted}
          sectionIndex={currentSection}
          navigateToSection={navigateToSection}
        >
          {currentSection === 0 ? (
            <InstructionsComponent text='The "cash flows" in discounted cash flows are free cash flow. Free cash flow is cash the company is bringing in minus any capital expenditures.' />
          ) : currentSection === 1 ? (
            <IntroSection
              title={sections[currentSection].title}
              onComplete={completeSection}
              completed={sections[currentSection].completed}
            />
          ) : currentSection === 2 ? (
            <StockSelection onSelectStock={handleStockSelect} />
          ) : currentSection === 3 && selectedStock ? (
            <FinancialStatements
              cik={selectedStock.cik}
              accessionNumber={selectedStock.accessionNumber}
              ticker={selectedStock.ticker}
              onComplete={completeSection}
            />
          ) : currentSection === 4 && selectedStock ? (
            <CashFlowProjectionsComponent ticker={selectedStock.ticker} />
          ) : null}
        </SectionComponent>
      </div>
    </div>
  );
};

export default Tutorial;

