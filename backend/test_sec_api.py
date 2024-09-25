import unittest
from unittest.mock import patch, MagicMock
from sec_api import get_data_given_ticker_and_year_and_category  # Adjust the import based on your module structure

class TestGetDataGivenTickerAndYearAndAlternativeKeys(unittest.TestCase):

    # TSLA 2023 capital_expenditures
    @patch('sec_api.requests.get') 
    def test_successful_data_retrieval(self, mock_get):
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'facts': {
                'us-gaap': {
                    'PaymentsToAcquirePropertyPlantAndEquipment': {
                        'units': {
                            'USD': [
                                {'form': '10-K', 'frame': 'CY2023', 'val': 8898000000}
                            ]
                        }
                    }
                }
            }
        }
        mock_get.return_value = mock_response
        
        # Test with valid data
        result = get_data_given_ticker_and_year_and_category('TSLA', '2023', 'capital_expenditures')
        self.assertEqual(result, 8898000000)  
        
        
    # AAPL 2023 capital_expenditures
    @patch('sec_api.requests.get')  # Mock the requests.get call
    def test_successful_data_retrieval(self, mock_get):
        # Mock response data that the SEC API would return
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'facts': {
                'us-gaap': {
                    'PaymentsToAcquirePropertyPlantAndEquipment': {
                        'units': {
                            'USD': [
                                {'form': '10-K', 'frame': 'CY2023', 'val': 10959000000}
                            ]
                        }
                    }
                }
            }
        }
        mock_get.return_value = mock_response
        
        # Test with valid data
        result = get_data_given_ticker_and_year_and_category('AAPL', '2023', 'capital_expenditures')
        self.assertEqual(result, 10959000000)  # Expected value from the mocked response
        
        
    @patch('sec_api.requests.get')  # Mock the requests.get call
    def test_successful_data_retrieval(self, mock_get):
        # Mock response data that the SEC API would return
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'facts': {
                'us-gaap': {
                    'PaymentsToAcquirePropertyPlantAndEquipment': {
                        'units': {
                            'USD': [
                                {'form': '10-K', 'frame': 'CY2023', 'val': 10959000000}
                            ]
                        }
                    }
                }
            }
        }
        mock_get.return_value = mock_response
        
        result = get_data_given_ticker_and_year_and_category('AAPL', '2023', 'capital_expenditures')
        self.assertEqual(result, 10959000000)
        
        
    # AAPL 2022 capital_expenditures
    @patch('sec_api.requests.get')  # Mock the requests.get call
    def test_successful_data_retrieval(self, mock_get):
        # Mock response data that the SEC API would return
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'facts': {
                'us-gaap': {
                    'PaymentsToAcquirePropertyPlantAndEquipment': {
                        'units': {
                            'USD': [
                                {'form': '10-K', 'frame': 'CY2022', 'val': 10708000000}
                            ]
                        }
                    }
                }
            }
        }
        mock_get.return_value = mock_response
        
        result = get_data_given_ticker_and_year_and_category('AAPL', '2022', 'capital_expenditures')
        self.assertEqual(result, 10708000000)
        
    
    # AAPL 2022 cash_flows_from_operations
    @patch('sec_api.requests.get')  # Mock the requests.get call
    def test_successful_data_retrieval(self, mock_get):
        # Mock response data that the SEC API would return
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'facts': {
                'us-gaap': {
                    'NetCashProvidedByUsedInOperatingActivities': {
                        'units': {
                            'USD': [
                                {'form': '10-K', 'frame': 'CY2022', 'val': 122151000000, 'end': '2022-09-24'}
                            ]
                        }
                    }
                }
            }
        }
        mock_get.return_value = mock_response
        
        result = get_data_given_ticker_and_year_and_category('AAPL', '2022', 'cash_flows_from_operations')
        self.assertEqual(result, 122151000000)
        
    
    # Test where the category does not exist
    @patch('sec_api.requests.get')
    def test_keyerror_handling(self, mock_get):
        # Mock response where the key does not exist
        mock_response = MagicMock()
        mock_response.json.return_value = {
            'facts': {
                'us-gaap': {}
            }
        }
        mock_get.return_value = mock_response
        
        result = get_data_given_ticker_and_year_and_category('TSLA', '2023', 'poop')
        self.assertIsNone(result) 
        

if __name__ == '__main__':
    unittest.main()
