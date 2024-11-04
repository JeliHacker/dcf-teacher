import React, { useState } from "react";
import { Box, VStack, Input } from "@chakra-ui/react";
import Autosuggest from "react-autosuggest";
import StockSelection from "../components/StockSelection";
import { useNavigate } from 'react-router-dom';

// Example stock data - this could come from an API in the real app
const stockData = [
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "MSFT", name: "Microsoft Corporation" },
  { ticker: "GOOGL", name: "Alphabet Inc." },
  { ticker: "AMZN", name: "Amazon.com, Inc." },
  { ticker: "TSLA", name: "Tesla, Inc." },
  // Add more stock data here...
];

const Browse = ({ handleStockSelect }) => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Function to handle input change in the search box
  const onSearchChange = (event, { newValue }) => {
    setSearchValue(newValue);
  };

  // Function to fetch suggestions based on the search input
  const onSuggestionsFetchRequested = ({ value }) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    const filteredSuggestions =
      inputLength === 0
        ? []
        : stockData.filter(
            (stock) =>
              stock.name.toLowerCase().includes(inputValue) ||
              stock.ticker.toLowerCase().includes(inputValue)
          );

    setSuggestions(filteredSuggestions);
  };

  // Function to clear suggestions when the search box is cleared
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // Define how to render a suggestion in the dropdown
  const renderSuggestion = (suggestion) => (
    <div>
      {suggestion.ticker} - {suggestion.name}
    </div>
  );

  const navigate = useNavigate();

  // When the user selects a suggestion
  const onSuggestionSelected = (event, { suggestion }) => {
    handleStockSelect(suggestion.ticker); // Call handleStockSelect with the selected stock ticker
    const ticker = suggestion.ticker;
    navigate(`/stock/${ticker}`);
  };

  // Input properties for the Autosuggest component
  const inputProps = {
    placeholder: "Search for a stock...",
    value: searchValue,
    onChange: onSearchChange,
  };

  // Chakra input style for the search box
  const renderInputComponent = (inputProps) => (
    <Input
      {...inputProps}
      focusBorderColor="teal.400"
      size="lg"
      width="100%"
      backgroundColor="white"
      borderRadius="md"
      boxShadow="sm"
      p={4}
    />
  );

  return (
    <Box
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundColor="gray.100"
      p={4}
    >
        
      <VStack spacing={6} width="50%">
      <StockSelection onSelectStock={handleStockSelect} />
        <Box width="100%">
          {/* Autosuggest Component with custom input component */}
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(suggestion) => suggestion.ticker}
            renderSuggestion={renderSuggestion}
            onSuggestionSelected={onSuggestionSelected}
            inputProps={inputProps}
            renderInputComponent={renderInputComponent}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default Browse;
