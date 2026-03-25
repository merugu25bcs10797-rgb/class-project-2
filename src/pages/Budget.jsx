import React, { useState } from 'react';
import { useBudget } from '../hooks/useBudget';
import { useTransactions } from '../hooks/useTransactions';
import BudgetCard from '../components/BudgetCard';
import TransactionCard from '../components/TransactionCard';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { toast } from 'react-toastify';
import './Budget.css';

const Budget = () => {
  const { budget, updateBudget } = useBudget();
  const { transactions, deleteTransaction } = useTransactions();
  const [newBudget, setNewBudget] = useState(budget.monthlyBudget);

  const handleUpdateBudget = (e) => {
    e.preventDefault();
    if (newBudget > 0) {
      updateBudget(Number(newBudget));
      toast.success('Budget updated successfully!');
    }
  };

  const currentMonthExpenses = transactions.filter(t => {
    if (t.type !== 'expense') return false;
    const now = new Date();
    return isWithinInterval(new Date(t.date), { start: startOfMonth(now), end: endOfMonth(now) });
  });

  return (
    <div className="fade-in budget-page">
      <header className="page-header">
        <h1>Budget Tracking</h1>
        <p>Manage your monthly spending limits and monitor your expenses.</p>
      </header>

      <div className="budget-content">
        <div className="budget-settings glass-panel">
          <h3 style={{ marginBottom: '1rem' }}>Budget Settings</h3>
          <form onSubmit={handleUpdateBudget} className="budget-form">
            <div className="form-group">
              <label className="form-label">Monthly Limit</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="number" 
                  className="form-control" 
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  min="1"
                />
                <button type="submit" className="btn btn-primary">Update</button>
              </div>
            </div>
          </form>
          <div style={{ marginTop: '2rem' }}>
            <BudgetCard />
          </div>
        </div>

        <div className="budget-transactions">
          <h3 style={{ marginBottom: '1rem' }}>This Month's Expenses</h3>
          {currentMonthExpenses.length > 0 ? (
            currentMonthExpenses.map(tx => (
              <TransactionCard key={tx.id} transaction={tx} onDelete={deleteTransaction} />
            ))
          ) : (
            <div className="empty-state glass-panel">
              <p>No expenses recorded this month.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Budget;
