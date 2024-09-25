import React from 'react';
import { Button } from '@chakra-ui/react';

function SectionComponent({ title, children, onComplete, completed, sectionIndex, navigateToSection }) {
  return (
    <div className="section">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
        {sectionIndex != 0 && (
          <Button
            onClick={() => navigateToSection(sectionIndex - 1)}>
            ←Prev
          </Button>
        )}

        <h2 style={{ marginLeft: '10px', marginRight: '10px', width:'50%' }}>{title}</h2>

        <Button
          onClick={() => onComplete(sectionIndex)}
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

