import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const FinanceContext = createContext();

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('finance_budget');
    return saved ? JSON.parse(saved) : { monthlyBudget: 50000 };
  });

  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_budget', JSON.stringify(budget));
  }, [budget]);

  const addTransaction = (transaction) => {
    const newTx = { ...transaction, id: uuidv4() };
    setTransactions(prev => [newTx, ...prev]);
  };

  const updateTransaction = (id, updatedData) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateBudget = (amount) => {
    setBudget({ monthlyBudget: amount });
  };

  return (
    <FinanceContext.Provider value={{
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      budget,
      updateBudget,
      currency,
      setCurrency
    }}>
      {children}
    </FinanceContext.Provider>
  );
};
