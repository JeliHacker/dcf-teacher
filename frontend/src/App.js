import { ChakraProvider } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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
import Navbar from './components/Navbar';
import About from './pages/About';
import Tutorial from './pages/Tutorial';
import Browse from './pages/Browse';

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedStockTicker, setSelectedStockTicker] = useState(null);
  const [sectionCompleted, setSectionCompleted] = useState(false);
  const [sections, setSections] = useState([
    { index: 0, title: 'Step 0: Introduction', content: 'Welcome to DCF Teacher!', unlocked: true, completed: true },
    { index: 1, title: 'Step 1: What are Discounted Cash Flows?', content: 'Welcome to DCF Teacher!', unlocked: true, completed: true },
    { index: 2, title: 'Step 2: Select a Company', content: 'Select a company to analyze.', unlocked: true, completed: false },
    { index: 3, title: 'Step 3: Gather Data', content: 'Gather financial data for the selected company.', unlocked: false, completed: false },
    // { index: 4, title: 'Step 4: Calculate Free Cash Flow', content: 'Calculate the Free Cash Flow.', unlocked: false, completed: false },
    // { index: 5, title: 'Step 5: Determine Growth Rate', content: 'Determine the growth rate of Free Cash Flow.', unlocked: false, completed: false },
    { index: 4, title: 'Step 4: Set Discount and Growth Rate', content: 'Select an appropriate discount rate.', unlocked: false, completed: false },
    // Add more sections as needed
  ]);
  const { chatHistory, isLoading, userMessage, setUserMessage, sendMessage } = useChat();

  function updateSectionCompleted(sectionIndex, isCompleted) {
    setSections(prevSections =>
      prevSections.map(section =>
        section.index === sectionIndex
          ? { ...section, completed: isCompleted }  // Update the 'completed' property
          : section
      )
    );
  }

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

  const handleStockSelect = (stockTicker) => {
    // Assuming that you have a way to determine the CIK and accession number based on the selected stock
    const stockDetails = {
      'aapl': { cik: '0000320193', accessionNumber: '0000320193-21-000065', ticker: 'aapl' },
      'tsla': { cik: '0001318605', accessionNumber: '0001318605-21-000063', ticker: 'tsla' },
      'nke': { cik: '0000320187', accessionNumber: '0000320187-21-000056', ticker: 'nke' },
    };

    setSelectedStock(stockDetails[stockTicker]);
    setSelectedStockTicker(stockTicker);
    // let message = `I want to analyze ${stockTicker.toUpperCase()}.`;
    // sendMessage(message, stockTicker);
    completeSection();
  };

  const onSubmitAnswers = (answers) => {
    console.log(answers);
  };

  return (
    <ChakraProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={
            <Tutorial
              sections={sections}
              currentSection={currentSection}
              navigateToSection={navigateToSection}
              chatHistory={chatHistory}
              isLoading={isLoading}
              userMessage={userMessage}
              setUserMessage={setUserMessage}
              sendMessage={sendMessage}
              selectedStock={selectedStock}
              selectedStockTicker={selectedStockTicker}
              onSubmitAnswers={onSubmitAnswers}
              updateSectionCompleted={updateSectionCompleted}
              setSectionCompleted={setSectionCompleted}
              completeSection={completeSection}
              handleStockSelect={handleStockSelect}
            />
          } />
          <Route path="/about" element={<About />} />
          <Route path="/browse" element={
            <Browse handleStockSelect={handleStockSelect} />
          } />
        </Routes>
      </Router>
    </ChakraProvider >
  );
}

export default App;
