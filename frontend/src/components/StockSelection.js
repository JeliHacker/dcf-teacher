import React from 'react';
import appleLogo from '../assets/aapl.png';
import teslaLogo from '../assets/tsla.png';
import nikeLogo from '../assets/nke.png';
import './StockSelection.css';

function StockSelection({ onSelectStock }) {
  const stocks = [
    { name: 'Apple', ticker: 'aapl', logo: appleLogo },
    { name: 'Tesla', ticker: 'tsla', logo: teslaLogo },
    { name: 'Nike', ticker: 'nke', logo: nikeLogo },
  ];

  return (
    <div className="stock-selection">
      <h3>Select a company:</h3>
      <div className="stocks">
        {stocks.map((stock, index) => (
          <div key={index} className="stock" onClick={() => onSelectStock(stock.ticker)}>
            <div className="stock-logo-container">
              <img src={stock.logo} alt={stock.name} className="stock-logo" />
            </div>
            <p className="stock-title">{stock.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StockSelection;

