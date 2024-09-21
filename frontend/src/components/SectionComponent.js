import React from 'react';

function SectionComponent({ title, children, onComplete, completed }) {
  return (
    <div className="section">
      <h2>{title}</h2>
      {children}
      {completed && <p>Section Completed!</p>}
    </div>
  );
}

export default SectionComponent;

