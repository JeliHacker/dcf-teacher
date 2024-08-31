import React, { useState } from 'react';
import GuideComponent from './components/GuideComponent';
import SectionComponent from './components/SectionComponent';
import './App.css';

function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [sections, setSections] = useState([
    { title: 'Step 1: Select a Company', content: 'Select a company to analyze.', unlocked: true, completed: false },
    { title: 'Step 2: Gather Data', content: 'Gather financial data for the selected company.', unlocked: false, completed: false },
    { title: 'Step 3: Calculate Free Cash Flow', content: 'Calculate the Free Cash Flow.', unlocked: false, completed: false },
    { title: 'Step 4: Determine Growth Rate', content: 'Determine the growth rate of Free Cash Flow.', unlocked: false, completed: false },
    { title: 'Step 5: Select Discount Rate', content: 'Select an appropriate discount rate.', unlocked: false, completed: false },
    // Add more sections as needed
  ]);

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

  return (
    <div className="App">
      <GuideComponent
        currentSection={currentSection}
        sections={sections}
        navigateToSection={navigateToSection}
      />
      <SectionComponent
        title={sections[currentSection].title}
        content={sections[currentSection].content}
        onComplete={completeSection}
        completed={sections[currentSection].completed}
      />
    </div>
  );
}

export default App;
