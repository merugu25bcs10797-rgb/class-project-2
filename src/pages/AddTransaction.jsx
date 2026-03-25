import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { toast } from 'react-toastify';
import './AddTransaction.css';

const categories = [
  'Food', 'Travel', 'Rent', 'Shopping', 
  'Entertainment', 'Health', 'Utilities', 
  'Subscriptions', 'Salary', 'Other'
];

const schema = yup.object().shape({
  title: yup.string().required('Title is required').max(50, 'Max 50 characters'),
  amount: yup.number().transform((value, originalValue) => originalValue === "" ? null : value).typeError('Amount must be a number').positive('Amount must be positive').required('Amount is required'),
  category: yup.string().required('Category is required').notOneOf([''], 'Please select a category'),
  date: yup.date().typeError('Please select a valid date').required('Date is required'),
  type: yup.string().oneOf(['income', 'expense']).required('Type is required'),
  notes: yup.string().max(200, 'Max 200 characters').optional(),
  recurring: yup.boolean()
});

const AddTransaction = () => {
  const { addTransaction } = useTransactions();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      category: '',
      recurring: false
    }
  });

  const transactionType = watch('type');

  const onSubmit = (data) => {
    addTransaction({
      ...data,
      date: data.date.toISOString(),
    });
    toast.success('Transaction added successfully!');
    navigate('/transactions');
  };

  return (
    <div className="fade-in add-transaction-page">
      <header className="page-header">
        <h1>Add Transaction</h1>
        <p>Record a new income or expense manually.</p>
      </header>

      <div className="glass-panel form-container">
        <form onSubmit={handleSubmit(onSubmit)} className="transaction-form">
          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Type</label>
              <div className="type-toggle">
                <label className={`toggle-btn ${transactionType === 'expense' ? 'active-expense' : ''}`}>
                  <input type="radio" value="expense" {...register('type')} className="sr-only" />
                  Expense
                </label>
                <label className={`toggle-btn ${transactionType === 'income' ? 'active-income' : ''}`}>
                  <input type="radio" value="income" {...register('type')} className="sr-only" />
                  Income
                </label>
              </div>
              {errors.type && <p className="form-error">{errors.type.message}</p>}
            </div>
            
            <div className="form-group flex-1">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" {...register('date')} />
              {errors.date && <p className="form-error">{errors.date.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Title</label>
            <input type="text" className="form-control" placeholder="e.g. Weekly Groceries" {...register('title')} />
            {errors.title && <p className="form-error">{errors.title.message}</p>}
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Amount</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>$</span>
                <input type="number" step="0.01" className="form-control" style={{ paddingLeft: '2rem' }} placeholder="0.00" {...register('amount')} />
              </div>
              {errors.amount && <p className="form-error">{errors.amount.message}</p>}
            </div>

            <div className="form-group flex-1">
              <label className="form-label">Category</label>
              <select className="form-control" {...register('category')}>
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <p className="form-error">{errors.category.message}</p>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea className="form-control" rows="3" placeholder="Add any extra details here..." {...register('notes')}></textarea>
            {errors.notes && <p className="form-error">{errors.notes.message}</p>}
          </div>

          {transactionType === 'expense' && (
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input type="checkbox" {...register('recurring')} />
                <span className="checkbox-text">This is a recurring expense (e.g. subscription, rent)</span>
              </label>
            </div>
          )}

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Transaction</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
