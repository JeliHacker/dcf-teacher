import React from 'react';
import { Button } from '@chakra-ui/react';

function SectionComponent({ title, children, onComplete, completed, setSectionCompleted, sectionIndex, navigateToSection }) {
  return (
    <div className="section">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
        <Button
          onClick={() => navigateToSection(sectionIndex - 1)}
          isDisabled={sectionIndex === 0}
        >
          ←Prev
        </Button>

        <h2 style={{ width: '50%' }}>
          {title.replace(/^Step \d+: /, '')}
        </h2>

        <Button
          onClick={() => {
            onComplete(sectionIndex);
            setSectionCompleted(false);
          }}
          isDisabled={!completed}
        >
          Next→
        </Button>
      </div>
      {children}
    </div>
  );
}

export default SectionComponent;

