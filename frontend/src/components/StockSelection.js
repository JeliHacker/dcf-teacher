import React from 'react';
import appleLogo from '../assets/aapl.png';
import teslaLogo from '../assets/tsla.png';
import nikeLogo from '../assets/nke.png';

function StockSelection({ onSelectStock }) {
  const stocks = [
    { name: 'Apple', logo: appleLogo },
    { name: 'Tesla', logo: teslaLogo },
    { name: 'Nike', logo: nikeLogo },
  ];

  return (
    <div className="stock-selection">
      <h3>Select a company:</h3>
      <div className="stocks">
        {stocks.map((stock, index) => (
          <div key={index} className="stock" onClick={() => onSelectStock(stock.name)}>
            <img src={stock.logo} alt={stock.name} className="stock-logo" />
            <p>{stock.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StockSelection;

