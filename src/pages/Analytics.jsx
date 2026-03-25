import React, { useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { useCurrency } from '../hooks/useCurrency';
import './Analytics.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#4287f5'];

const Analytics = () => {
  const { transactions } = useTransactions();
  const { currency } = useCurrency(); // to know what to format with but we can just use Intl safely

  const { categoryData, trendData, comparisonData } = useMemo(() => {
    // Category Data (Pie Chart) - Expenses only
    const categoriesMap = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        categoriesMap[t.category] = (categoriesMap[t.category] || 0) + Number(t.amount);
      }
    });
    const categoryData = Object.keys(categoriesMap).map(key => ({
      name: key,
      value: categoriesMap[key]
    })).sort((a, b) => b.value - a.value);

    // Monthly Trend Data (Line Chart)
    const monthsMap = {};
    transactions.forEach(t => {
      const month = format(new Date(t.date), 'MMM yyyy');
      if (!monthsMap[month]) {
        monthsMap[month] = { name: month, income: 0, expense: 0, sortKey: new Date(t.date).getTime() };
      }
      if (t.type === 'income') monthsMap[month].income += Number(t.amount);
      if (t.type === 'expense') monthsMap[month].expense += Number(t.amount);
    });
    
    // Sort chronologically
    const trendData = Object.values(monthsMap).sort((a, b) => a.sortKey - b.sortKey);

    // Comparison Data (Bar Chart) - Overall Income vs Expense
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach(t => {
      if (t.type === 'income') totalIncome += Number(t.amount);
      if (t.type === 'expense') totalExpense += Number(t.amount);
    });

    const comparisonData = [
      { name: 'Income vs Expense', Income: totalIncome, Expense: totalExpense }
    ];

    return { categoryData, trendData, comparisonData };
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="fade-in analytics-page">
        <header className="page-header">
          <h1>Analytics</h1>
          <p>Visualize your financial trends.</p>
        </header>
        <div className="empty-state glass-panel">
          <p>Please add some transactions to generate analytics.</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip glass-panel" style={{ padding: '1rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)' }}>
          <p className="label" style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{label || payload[0].name}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color, margin: 0 }}>
              {entry.name}: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: currency, maximumFractionDigits: 0 }).format(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fade-in analytics-page">
      <header className="page-header">
        <h1>Analytics</h1>
        <p>Visualize your financial trends.</p>
      </header>

      <div className="charts-grid">
        <div className="chart-container glass-panel">
          <h3>Income vs Expense</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="Income" fill="var(--success-color)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="var(--danger-color)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container glass-panel">
          <h3>Expenses by Category</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container glass-panel full-width">
          <h3>Monthly Cashflow Trend</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-secondary)" />
                <YAxis stroke="var(--text-secondary)" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="income" name="Income" stroke="var(--success-color)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="expense" name="Expense" stroke="var(--danger-color)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
