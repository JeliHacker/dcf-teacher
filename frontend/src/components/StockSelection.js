import React from 'react';
import appleLogo from '../assets/aapl.png';
import nikeLogo from '../assets/nke.png';
import teslaLogo from '../assets/tsla.png';
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
            <img src={stock.logo} alt={stock.name} className="stock-logo" />
            <p>{stock.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StockSelection;

