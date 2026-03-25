import React, { useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useCurrency } from '../hooks/useCurrency';
import TransactionCard from '../components/TransactionCard';
import BudgetCard from '../components/BudgetCard';
import './Dashboard.css';

const Dashboard = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const { formatCurrency } = useCurrency();

  const { totalIncome, totalExpenses, netBalance } = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === 'income') income += Number(t.amount);
      if (t.type === 'expense') expense += Number(t.amount);
    });
    return {
      totalIncome: income,
      totalExpenses: expense,
      netBalance: income - expense
    };
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="fade-in dashboard-page">
      <header className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's a summary of your finances.</p>
      </header>

      <div className="metrics-grid">
        <div className="metric-card glass-panel">
          <div className="metric-title">Total Income</div>
          <div className="metric-value positive">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="metric-card glass-panel">
          <div className="metric-title">Total Expenses</div>
          <div className="metric-value negative">{formatCurrency(totalExpenses)}</div>
        </div>
        <div className="metric-card glass-panel">
          <div className="metric-title">Net Balance</div>
          <div className={`metric-value ${netBalance >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(netBalance)}
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-col">
          <div className="section-header">
            <h3>Recent Transactions</h3>
          </div>
          {recentTransactions.length > 0 ? (
            <div className="recent-transactions">
              {recentTransactions.map(tx => (
                <TransactionCard 
                  key={tx.id} 
                  transaction={tx} 
                  onDelete={deleteTransaction} 
                />
              ))}
            </div>
          ) : (
            <div className="empty-state glass-panel">
              <p>No transactions found. Start adding some!</p>
            </div>
          )}
        </div>
        <div className="side-col">
          <BudgetCard />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
