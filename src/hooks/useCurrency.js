import { useContext, useCallback, useState, useEffect } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { fetchExchangeRates } from '../services/api';

export const useCurrency = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useCurrency must be used within FinanceProvider');

  const { currency, setCurrency } = context;
  const [exchangeRates, setExchangeRates] = useState(null);

  useEffect(() => {
    const getRates = async () => {
      // Base is INR since we store in INR
      const rates = await fetchExchangeRates('INR');
      if (rates) setExchangeRates(rates);
    };
    getRates();
  }, []);

  const formatCurrency = useCallback((amount) => {
    let convertedAmount = amount;
    
    // If we have rates and target is not INR, convert it
    if (exchangeRates && currency !== 'INR' && exchangeRates[currency]) {
      convertedAmount = amount * exchangeRates[currency];
    }

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(convertedAmount);
  }, [currency, exchangeRates]);

  return { currency, setCurrency, formatCurrency };
};
