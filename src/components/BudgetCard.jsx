import React from 'react';
import { useBudget } from '../hooks/useBudget';
import { useCurrency } from '../hooks/useCurrency';

const BudgetCard = () => {
  const { budget, totalSpending, remainingBudget, percentageUsed } = useBudget();
  const { formatCurrency } = useCurrency();
  
  const isOverBudget = remainingBudget < 0;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <h3 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Monthly Budget Overview
      </h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: isOverBudget ? 'var(--danger-color)' : 'var(--text-primary)' }}>
            {formatCurrency(totalSpending)}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            of {formatCurrency(budget.monthlyBudget)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: '600', color: isOverBudget ? 'var(--danger-color)' : 'var(--success-color)' }}>
            {formatCurrency(Math.abs(remainingBudget))}
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {isOverBudget ? 'Over Budget' : 'Remaining'}
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--surface-color-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
        <div 
          style={{ 
            height: '100%', 
            width: `${Math.min(percentageUsed, 100)}%`, 
            backgroundColor: isOverBudget ? 'var(--danger-color)' : (percentageUsed > 80 ? 'var(--warning-color)' : 'var(--primary-color)'),
            transition: 'width 0.5s ease',
            borderRadius: 'var(--radius-full)'
          }}
        />
      </div>
      <div style={{ textAlign: 'right', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
        {percentageUsed}% used
      </div>
    </div>
  );
};

export default BudgetCard;
