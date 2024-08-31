import React from 'react';

function SectionComponent({ title, content, onComplete, completed }) {
  return (
    <div className="section">
      <h2>{title}</h2>
      <p>{content}</p>
      {!completed && (
        <button onClick={onComplete}>Complete Section</button>
      )}
      {completed && <p>Section Completed!</p>}
    </div>
  );
}

export default SectionComponent;

