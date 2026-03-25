import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdList, MdAddCircle, MdPieChart, MdAccountBalanceWallet } from 'react-icons/md';
import { useCurrency } from '../hooks/useCurrency';
import './Sidebar.css';

const Sidebar = () => {
  const { currency, setCurrency } = useCurrency();
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <MdDashboard /> },
    { name: 'Transactions', path: '/transactions', icon: <MdList /> },
    { name: 'Add Transaction', path: '/transactions/new', icon: <MdAddCircle /> },
    { name: 'Budget', path: '/budget', icon: <MdAccountBalanceWallet /> },
    { name: 'Analytics', path: '/analytics', icon: <MdPieChart /> }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <MdAccountBalanceWallet className="logo-icon" />
        <h2>FinTrack</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.name} 
            to={item.path} 
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'block' }}>Currency</label>
        <select 
          className="form-control" 
          value={currency} 
          onChange={(e) => setCurrency(e.target.value)}
          style={{ padding: '0.4rem', fontSize: '0.85rem' }}
        >
          <option value="INR">INR (₹)</option>
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
        </select>
      </div>
    </aside>
  );
};

export default Sidebar;
