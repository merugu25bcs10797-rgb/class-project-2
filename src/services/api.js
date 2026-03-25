import axios from 'axios';

// Public API for fetching exchange rates
// Example using a public free API: https://api.exchangerate-api.com/v4/latest/USD
export const fetchExchangeRates = async (base = 'INR') => {
  try {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${base}`);
    return response.data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return null;
  }
};
