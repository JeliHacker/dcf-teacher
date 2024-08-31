import React from 'react';

function GuideComponent({ currentSection, sections, navigateToSection }) {
  return (
    <div className="guide">
      <h2>Guide</h2>
      <ul>
        {sections.map((section, index) => (
          <li key={index}>
            <button
              disabled={!section.unlocked}
              onClick={() => navigateToSection(index)}
              style={{ fontWeight: currentSection === index ? 'bold' : 'normal' }}
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GuideComponent;

