import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Paper, Typography, Box } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpensesPieChartProps {
  transactions: {
    amount: number;
    category: string;
    type: 'INCOME' | 'EXPENSE';
  }[];
}

export function ExpensesPieChart({ transactions }: ExpensesPieChartProps) {
  const expenses = transactions.filter(t => t.type === 'EXPENSE');
  const spendingByCategory = expenses.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    acc[category] = (acc[category] || 0) + Number(amount);
    return acc;
  }, {} as Record<string, number>);
  
  const chartData = {
    labels: Object.keys(spendingByCategory),
    datasets: [
      {
        label: 'Despesas por Categoria',
        data: Object.values(spendingByCategory),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (expenses.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">Despesas por Categoria</Typography>
        <Typography sx={{ mt: 2 }}>Nenhuma despesa registrada.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
        Despesas por Categoria
      </Typography>
      <Box sx={{ height: { xs: 250, sm: 300 } }}>
        <Pie data={chartData} options={{ maintainAspectRatio: false, responsive: true }} />
      </Box>
    </Paper>
  );
}