import { ChakraProvider } from '@chakra-ui/react';
import React, { useState } from 'react';
import './App.css';
import CashFlowProjectionsComponent from './components/CashFlowProjectionsComponent.js';
import ChatDrawer from './components/ChatDrawer.js';
import FinancialStatements from './components/FinancialStatements';
import GuideDrawer from './components/GuideDrawer';
import InstructionsComponent from './components/InstructionsComponent';
import IntroSection from './components/IntroSection';
import SectionComponent from './components/SectionComponent';
import StockSelection from './components/StockSelection';
import UserSubmissionComponent from './components/UserSubmissionComponent';
import useChat from './hooks/useChat';

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedStockTicker, setSelectedStockTicker] = useState(null);
  const [sectionCompleted, setSectionCompleted] = useState(false);
  const [sections, setSections] = useState([
    { title: 'Step 0: Introduction', content: 'Welcome to DCF Teacher!', unlocked: true, completed: true },
    { title: 'Step 1: What are Discounted Cash Flows?', content: 'Welcome to DCF Teacher!', unlocked: true, completed: true },
    { title: 'Step 2: Select a Company', content: 'Select a company to analyze.', unlocked: true, completed: false },
    { title: 'Step 3: Gather Data', content: 'Gather financial data for the selected company.', unlocked: false, completed: false },
    { title: 'Step 4: Calculate Free Cash Flow', content: 'Calculate the Free Cash Flow.', unlocked: false, completed: false },
    { title: 'Step 5: Determine Growth Rate', content: 'Determine the growth rate of Free Cash Flow.', unlocked: false, completed: false },
    { title: 'Step 6: Select Discount Rate', content: 'Select an appropriate discount rate.', unlocked: false, completed: false },
    // Add more sections as needed
  ]);
  const { chatHistory, isLoading, userMessage, setUserMessage, sendMessage } = useChat();

  const completeSection = () => {
    console.log("completeSection");
    const updatedSections = sections.map((section, index) => {
      if (index === currentSection) {
        return { ...section, completed: true };
      } else if (index === currentSection + 1) {
        return { ...section, unlocked: true };
      }
      return section;
    });
    setSections(updatedSections);
    setCurrentSection(currentSection + 1);
  };

  const navigateToSection = (index) => {
    setCurrentSection(index);
  };

  const handleStockSelect = (stockTicker) => {
    // Assuming that you have a way to determine the CIK and accession number based on the selected stock
    const stockDetails = {
      'aapl': { cik: '0000320193', accessionNumber: '0000320193-21-000065', ticker: 'aapl' },
      'tsla': { cik: '0001318605', accessionNumber: '0001318605-21-000063', ticker: 'tsla' },
      'nke': { cik: '0000320187', accessionNumber: '0000320187-21-000056', ticker: 'nke' },
    };

    setSelectedStock(stockDetails[stockTicker]);
    setSelectedStockTicker(stockTicker);
    let message = `I want to analyze ${stockTicker}.`;
    sendMessage(message, stockTicker);  
    completeSection();
  };

  const onSubmitAnswers = (answers) => {
    console.log(answers);
  };

  return (
    <ChakraProvider>
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
            setSectionCompleted={setSectionCompleted}
          />
        </div>
        <div className="Panel2">

          {currentSection === 0 ? (
            <SectionComponent
              title={sections[currentSection].title}
              content={sections[currentSection].content}
              onComplete={completeSection}
              completed={true}
              setSectionCompleted={setSectionCompleted}
              sectionIndex={currentSection}
              navigateToSection={navigateToSection}
            >
              <IntroSection
                title={sections[currentSection].title}
                onComplete={completeSection}
                completed={sections[currentSection].completed}
              />
            </SectionComponent>
          ) : currentSection === 1 ? (
            <SectionComponent
              title={sections[currentSection].title}
              content={sections[currentSection].content}
              onComplete={completeSection}
              completed={true}
              setSectionCompleted={setSectionCompleted}
              sectionIndex={currentSection}
              navigateToSection={navigateToSection}
            >
              <IntroSection
                title={sections[currentSection].title}
                onComplete={completeSection}
                completed={sections[currentSection].completed}
              />
            </SectionComponent>
          ) : currentSection === 2 ? (
            <SectionComponent
              title={sections[currentSection].title}
              content={sections[currentSection].content}
              onComplete={completeSection}
              completed={sectionCompleted}
              setSectionCompleted={setSectionCompleted}
              sectionIndex={currentSection}
              navigateToSection={navigateToSection}
            >
              <StockSelection onSelectStock={handleStockSelect} />
            </SectionComponent>
          ) : currentSection === 3 && selectedStock ? (
            <SectionComponent
              title={sections[currentSection].title}
              content={sections[currentSection].content}
              onComplete={completeSection}
              completed={sectionCompleted}
              setSectionCompleted={setSectionCompleted}
              sectionIndex={currentSection}
              navigateToSection={navigateToSection}
            >
              <InstructionsComponent text='The "cash flows" in discounted cash flows are free cash flow. Free cash flow is cash the company is bringin in minus any capital expenditures.' />
              <FinancialStatements
                cik={selectedStock.cik}
                accessionNumber={selectedStock.accessionNumber}
                ticker={selectedStock.ticker}
                onComplete={completeSection}
              />

            </SectionComponent>
          ) : currentSection === 4 && selectedStock ? (
            <SectionComponent
              title={sections[currentSection].title}
              content={sections[currentSection].content}
              onComplete={completeSection}
              completed={sectionCompleted}
              setSectionCompleted={setSectionCompleted}
              sectionIndex={currentSection}
              navigateToSection={navigateToSection}
            >
              <InstructionsComponent text="Now, get the operating cash flows and the capital expenditures for each of the past 10 years." />
              <FinancialStatements
                cik={selectedStock.cik}
                accessionNumber={selectedStock.accessionNumber}
                ticker={selectedStock.ticker}
                onComplete={completeSection}
              />
            </SectionComponent>
          ) : currentSection === 5 && selectedStock ? (
            <SectionComponent
              title={sections[currentSection].title}
              content={sections[currentSection].content}
              onComplete={completeSection}
              completed={sectionCompleted}
              setSectionCompleted={setSectionCompleted}
              sectionIndex={currentSection}
              navigateToSection={navigateToSection}
            >
              <InstructionsComponent text="Now, get the operating cash flows and the capital expenditures for each of the past 10 years." />
              <FinancialStatements
                cik={selectedStock.cik}
                accessionNumber={selectedStock.accessionNumber}
                ticker={selectedStock.ticker}
                onComplete={completeSection}
              />
            </SectionComponent>
          ) : currentSection === 6 && selectedStock ? (
            <SectionComponent
              title={sections[currentSection].title}
              content={sections[currentSection].content}
              onComplete={completeSection}
              completed={sectionCompleted}
              setSectionCompleted={setSectionCompleted}
              sectionIndex={currentSection}
              navigateToSection={navigateToSection}
            >
              <CashFlowProjectionsComponent ticker={selectedStock.ticker} />
            </SectionComponent>
          ) : (
            <SectionComponent
              title={sections[currentSection].title}
              content={sections[currentSection].content}
              onComplete={completeSection}
              completed={sections[currentSection].completed}
              setSectionCompleted={setSectionCompleted}
              sectionIndex={currentSection}
              navigateToSection={navigateToSection}
            />
          )}
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
