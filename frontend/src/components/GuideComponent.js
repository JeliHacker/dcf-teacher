import { Button } from '@chakra-ui/react';
import React from 'react';
import './GuideComponent.css';

function GuideComponent({ currentSection, sections, navigateToSection, onClose }) {
  return (
    <div className="guide">
      <h2>Guide</h2>
      <hr className='separator'/>
      <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        {sections.map((section, index) => (
          <li key={index} style={{ marginBottom: '10px', display: 'flex' }}>
            <Button
              variant="outline"
              onClick={() => {navigateToSection(index); onClose();}}
              isDisabled={!section.unlocked}
              fontWeight={currentSection === index ? 'bold' : 'normal'}
              colorScheme={currentSection === index ? 'blue' : 'gray'}
              width="100%"
              height="50px"
              justifyContent="flex-start"
              whiteSpace="normal"
              padding="1rem"
              textAlign="left"
              borderWidth="2px"      
              borderColor="gray.400"  
              borderStyle="solid"
            >
              {section.title}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GuideComponent;
