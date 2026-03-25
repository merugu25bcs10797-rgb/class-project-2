import { useContext, useMemo } from 'react';
import { FinanceContext } from '../context/FinanceContext';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export const useBudget = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useBudget must be used within FinanceProvider');

  const { budget, updateBudget, transactions } = context;

  const currentMonthStats = useMemo(() => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);

    const monthlyExpenses = transactions.filter(t => {
      if (t.type !== 'expense') return false;
      const tDate = new Date(t.date);
      return isWithinInterval(tDate, { start, end });
    });

    const totalSpending = monthlyExpenses.reduce((sum, t) => sum + Number(t.amount), 0);
    const remainingBudget = budget.monthlyBudget - totalSpending;
    const percentageUsed = budget.monthlyBudget > 0 ? (totalSpending / budget.monthlyBudget) * 100 : 0;

    return {
      totalSpending,
      remainingBudget,
      percentageUsed: Math.min(percentageUsed, 100).toFixed(1)
    };
  }, [transactions, budget.monthlyBudget]);

  return {
    budget,
    updateBudget,
    ...currentMonthStats
  };
};
