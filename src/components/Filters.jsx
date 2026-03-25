import React from 'react';

const Filters = ({ filters, setFilters, categories }) => {
  const handleTypeChange = (e) => setFilters({ ...filters, type: e.target.value });
  const handleCategoryChange = (e) => setFilters({ ...filters, category: e.target.value });
  const handleSortChange = (e) => setFilters({ ...filters, sortBy: e.target.value });

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
      <select className="form-control" style={{ width: 'auto', minWidth: '150px' }} value={filters.type} onChange={handleTypeChange}>
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      
      <select className="form-control" style={{ width: 'auto', minWidth: '150px' }} value={filters.category} onChange={handleCategoryChange}>
        <option value="all">All Categories</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      
      <select className="form-control" style={{ width: 'auto', minWidth: '200px' }} value={filters.sortBy} onChange={handleSortChange}>
        <option value="date-desc">Newest First</option>
        <option value="date-asc">Oldest First</option>
        <option value="amount-desc">Amount: High to Low</option>
        <option value="amount-asc">Amount: Low to High</option>
      </select>
    </div>
  );
};

export default Filters;
