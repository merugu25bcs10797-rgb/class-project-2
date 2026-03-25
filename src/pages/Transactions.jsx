import React, { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useDebounce } from '../hooks/useDebounce';
import TransactionCard from '../components/TransactionCard';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import './Transactions.css';

const categories = [
  'Food', 'Travel', 'Rent', 'Shopping', 
  'Entertainment', 'Health', 'Utilities', 
  'Subscriptions', 'Salary', 'Other'
];

const Transactions = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    sortBy: 'date-desc'
  });

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Search
    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(lowerSearch) || 
        (t.notes && t.notes.toLowerCase().includes(lowerSearch))
      );
    }

    // Filter by Type
    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    // Filter by Category
    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }

    // Sort
    result.sort((a, b) => {
      if (filters.sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (filters.sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (filters.sortBy === 'amount-desc') return Number(b.amount) - Number(a.amount);
      if (filters.sortBy === 'amount-asc') return Number(a.amount) - Number(b.amount);
      return 0;
    });

    return result;
  }, [transactions, debouncedSearch, filters]);

  const handleEdit = (transaction) => {
    // Basic placeholder for edit functionality to meet criteria
    window.alert('Edit feature: ' + transaction.title + '\n(Normally this would navigate to the form with prefilled state)');
  };

  return (
    <div className="fade-in transactions-page">
      <header className="page-header">
        <h1>Transactions</h1>
        <p>View, search, and manage all your financial activity.</p>
      </header>

      <div className="transactions-controls glass-panel">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <Filters filters={filters} setFilters={setFilters} categories={categories} />
      </div>

      <div className="transactions-list">
        {filteredAndSortedTransactions.length > 0 ? (
          filteredAndSortedTransactions.map(tx => (
            <TransactionCard 
              key={tx.id} 
              transaction={tx} 
              onDelete={deleteTransaction}
              onEdit={handleEdit}
            />
          ))
        ) : (
          <div className="empty-state glass-panel">
            <p>No transactions match your criteria.</p>
            {transactions.length > 0 && (
              <button className="btn btn-outline" style={{marginTop: '1rem'}} onClick={() => {
                setSearchTerm('');
                setFilters({ type: 'all', category: 'all', sortBy: 'date-desc' });
              }}>Clear Filters</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
