import { Button } from '@chakra-ui/react';
import React from 'react';

function GuideComponent({ currentSection, sections, navigateToSection }) {
  return (
    <div className="guide">
      <h2>Guide</h2>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {sections.map((section, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <Button
              variant="outline"
              onClick={() => navigateToSection(index)}
              isDisabled={!section.unlocked}
              fontWeight={currentSection === index ? 'bold' : 'normal'}
              colorScheme={currentSection === index ? 'blue' : 'gray'}
              width="100%"
              height="50px"
              justifyContent="flex-start"
              whiteSpace="normal"
              padding="1rem"
              textAlign="left"
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
