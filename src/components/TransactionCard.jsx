import React from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { format } from 'date-fns';
import { useCurrency } from '../hooks/useCurrency';
import './TransactionCard.css';

const TransactionCard = ({ transaction, onDelete, onEdit }) => {
  const { formatCurrency } = useCurrency();
  const isExpense = transaction.type === 'expense';

  return (
    <div className={`transaction-card ${isExpense ? 'expense' : 'income'} ${transaction.recurring ? 'recurring' : ''}`}>
      <div className="tc-details">
        <h4 className="tc-title">
          {transaction.title}
          {transaction.recurring && <span className="badge-recurring">Recurring</span>}
        </h4>
        <div className="tc-meta">
          <span className="tc-category">{transaction.category}</span>
          <span className="tc-date">{format(new Date(transaction.date), 'MMM dd, yyyy')}</span>
        </div>
      </div>
      <div className="tc-actions-amount">
        <div className={`tc-amount ${isExpense ? 'negative' : 'positive'}`}>
          {isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
        </div>
        <div className="tc-actions">
          {onEdit && (
            <button className="btn-icon edit" onClick={() => onEdit(transaction)} title="Edit">
              <MdEdit />
            </button>
          )}
          {onDelete && (
            <button className="btn-icon delete" onClick={() => onDelete(transaction.id)} title="Delete">
              <MdDelete />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
