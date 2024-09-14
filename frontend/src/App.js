import React, { useState } from 'react';
import GuideComponent from './components/GuideComponent';
import SectionComponent from './components/SectionComponent';
import StockSelection from './components/StockSelection';
import FinancialStatements from './components/FinancialStatements';
import TeacherChat from './components/TeacherChat';
import './App.css';
import InstructionsComponent from './components/InstructionsComponent';
import UserSubmissionComponent from './components/UserSubmissionComponent';
import useChat from './hooks/useChat';
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedStock, setSelectedStock] = useState(null);
  const [sections, setSections] = useState([
    { title: 'Step 1: Select a Company', content: 'Select a company to analyze.', unlocked: true, completed: false },
    { title: 'Step 2: Gather Data', content: 'Gather financial data for the selected company.', unlocked: false, completed: false },
    { title: 'Step 3: Calculate Free Cash Flow', content: 'Calculate the Free Cash Flow.', unlocked: false, completed: false },
    { title: 'Step 4: Determine Growth Rate', content: 'Determine the growth rate of Free Cash Flow.', unlocked: false, completed: false },
    { title: 'Step 5: Select Discount Rate', content: 'Select an appropriate discount rate.', unlocked: false, completed: false },
    // Add more sections as needed
  ]);
  const { chatHistory, isLoading, userMessage, setUserMessage, sendMessage } = useChat();

  const completeSection = () => {
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

  const handleStockSelect = (stockName) => {
    // Assuming that you have a way to determine the CIK and accession number based on the selected stock
    const stockDetails = {
      'aapl': { cik: '0000320193', accessionNumber: '0000320193-21-000065', ticker: 'aapl' },
      'tsla': { cik: '0001318605', accessionNumber: '0001318605-21-000063', ticker: 'tsla' },
      'nke': { cik: '0000320187', accessionNumber: '0000320187-21-000056', ticker: 'nke' },
    };

    console.log("handleStockSelect");
    setSelectedStock(stockDetails[stockName]);
    let message = `I want to analyze ${stockName}.`;
    sendMessage(message);
    console.log("i tried to send the message");
    completeSection();
  };

  const onSubmitAnswers = (answers) => {
    console.log(answers);
  };

  return (

    <ChakraProvider>
      <div className="App">
        <GuideComponent
          currentSection={currentSection}
          sections={sections}
          navigateToSection={navigateToSection}
        />
        <div className="Panel2">

          {currentSection === 0 ? (
            <SectionComponent
              title={sections[currentSection].title}
              onComplete={completeSection}
              completed={sections[currentSection].completed}
            >
              <StockSelection onSelectStock={handleStockSelect} />
            </SectionComponent>
          ) : currentSection === 1 && selectedStock ? (
            <SectionComponent
              title={sections[currentSection].title}
              onComplete={completeSection}
              completed={sections[currentSection].completed}
            >
              <InstructionsComponent text="Gather financial data for the selected company." />
              <FinancialStatements
                cik={selectedStock.cik}
                accessionNumber={selectedStock.accessionNumber}
                ticker={selectedStock.ticker}
                onComplete={completeSection}
              />

            </SectionComponent>

          ) : currentSection === 2 && selectedStock ? (
            <SectionComponent
              title={sections[currentSection].title}
              content={sections[currentSection].content}
              onComplete={completeSection}
              completed={sections[currentSection].completed}
            >
              <InstructionsComponent text="Now, get the operating cash flows and the capital expenditures for each of the past 10 years." />
              <FinancialStatements
                cik={selectedStock.cik}
                accessionNumber={selectedStock.accessionNumber}
                ticker={selectedStock.ticker}
                onComplete={completeSection}
              />
            </SectionComponent>
          ) : (
            <SectionComponent
              title={sections[currentSection].title}
              content={sections[currentSection].content}
              onComplete={completeSection}
              completed={sections[currentSection].completed}
            />
          )}
        </div>
        <div className='right-column'>
          <TeacherChat
            chatHistory={chatHistory}
            isLoading={isLoading}
            userMessage={userMessage}
            setUserMessage={setUserMessage}
            sendMessage={sendMessage}
          />
          <hr className="separator" />
          <UserSubmissionComponent currentSection={currentSection} sections={sections} onSubmit={onSubmitAnswers} />
        </div>
      </div>
    </ChakraProvider>

  );
}

export default App;
