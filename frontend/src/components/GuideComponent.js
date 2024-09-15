import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Box } from '@chakra-ui/react';
import React from 'react';

function GuideComponent({ currentSection, sections, navigateToSection }) {
  return (
    <div className="guide">
      <h2>Guide</h2>
      <Accordion allowToggle>
        {sections.map((section, index) => (
          <AccordionItem key={index} isDisabled={!section.unlocked}>
            <h2>
              <AccordionButton onClick={() => navigateToSection(index)}>
                <Box flex="1" textAlign="left" fontWeight={currentSection === index ? 'bold' : 'normal'}>
                  {section.title}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel>
              {/* Add content related to the section here if needed */}
              <p>{section.description}</p> {/* Optional */}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

export default GuideComponent;
