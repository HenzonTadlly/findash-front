import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {
  Container, Typography, CircularProgress, Box, Button, Modal, TextField,
  Select, MenuItem, FormControl, InputLabel, IconButton, Stack, Paper,
  Snackbar, Alert, Divider, Avatar,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { ExpensesPieChart } from '../components/ExpensesPieChart';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  date: string;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export function Dashboard() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [textContent, setTextContent] = useState('');

  async function fetchTransactions(year: number, month: number) {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/transactions', { params: { year, month } });
      setTransactions(response.data);
    } catch (err) {
      setError('Não foi possível carregar as transações.');
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  function handleLogout() {
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  }

  function handleOpenEditModal(transaction: Transaction) {
    setTransactionToEdit(transaction);
    setTitle(transaction.title);
    setAmount(String(transaction.amount));
    setCategory(transaction.category);
    setType(transaction.type);
    setDate(new Date(transaction.date).toISOString().split('T')[0]);
    setIsModalOpen(true);
  }

  function handleOpenCreateModal() {
    setTransactionToEdit(null);
    setTitle('');
    setAmount('');
    setCategory('');
    setType('EXPENSE');
    setDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setTransactionToEdit(null);
  }

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const transactionData = { title, amount: parseFloat(amount), category, type, date: new Date(date).toISOString() };
    try {
      if (transactionToEdit) {
        await api.put(`/transactions/${transactionToEdit.id}`, transactionData);
        setSnackbarMessage('Transação atualizada com sucesso!');
      } else {
        await api.post('/transactions', transactionData);
        setSnackbarMessage('Transação criada com sucesso!');
      }
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      handleCloseModal();
      fetchTransactions(selectedYear, selectedMonth);
    } catch (error) {
      setSnackbarMessage('Erro ao salvar a transação.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Tem certeza?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      setSnackbarMessage('Transação deletada com sucesso!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      fetchTransactions(selectedYear, selectedMonth);
    } catch (error) {
      setSnackbarMessage('Erro ao deletar a transação.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  }

  async function handleImportSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await api.post('/transactions/import', { textContent });
      setSnackbarMessage('Transações importadas com sucesso!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      setIsImportModalOpen(false);
      setTextContent('');
      fetchTransactions(selectedYear, selectedMonth);
    } catch (error) {
      setSnackbarMessage('Erro ao importar as transações.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  }

  const totalIncome = transactions.filter((t) => t.type === 'INCOME').reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpense = transactions.filter((t) => t.type === 'EXPENSE').reduce((acc, t) => acc + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  if (isLoading && transactions.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  if (error) return <Container><Typography color="error" sx={{ mt: 4 }}>{error}</Typography></Container>;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>Meu Dashboard</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<CloudUploadIcon />} onClick={() => setIsImportModalOpen(true)}>Importar</Button>
            <Button variant="contained" onClick={handleOpenCreateModal}>Nova Transação</Button>
            <IconButton onClick={handleLogout} color="inherit" title="Sair"><LogoutIcon /></IconButton>
          </Stack>
        </Box>

        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <FormControl sx={{ minWidth: 150 }} size="small"><InputLabel>Mês</InputLabel><Select value={selectedMonth} label="Mês" onChange={(e: SelectChangeEvent<number>) => setSelectedMonth(e.target.value as number)}>{Array.from({ length: 12 }, (_, i) => (<MenuItem key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}</MenuItem>))}</Select></FormControl>
          <FormControl sx={{ minWidth: 120 }} size="small"><InputLabel>Ano</InputLabel><Select value={selectedYear} label="Ano" onChange={(e: SelectChangeEvent<number>) => setSelectedYear(e.target.value as number)}>{Array.from({ length: 5 }, (_, i) => (<MenuItem key={currentYear - i} value={currentYear - i}>{currentYear - i}</MenuItem>))}</Select></FormControl>
        </Stack>
        
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
          <Stack spacing={3} sx={{ flexGrow: 1 }}>
            <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: 'success.dark', width: 56, height: 56 }}><ArrowUpwardIcon /></Avatar>
              <Box><Typography variant="body1" color="text.secondary">Receitas</Typography><Typography variant="h5" sx={{ fontWeight: 'bold' }}>R$ {totalIncome.toFixed(2)}</Typography></Box>
            </Paper>
            <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: 'error.dark', width: 56, height: 56 }}><ArrowDownwardIcon /></Avatar>
              <Box><Typography variant="body1" color="text.secondary">Despesas</Typography><Typography variant="h5" sx={{ fontWeight: 'bold' }}>R$ {totalExpense.toFixed(2)}</Typography></Box>
            </Paper>
            <Paper elevation={3} sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.dark', width: 56, height: 56 }}><AccountBalanceWalletIcon /></Avatar>
              <Box><Typography variant="body1" color="text.secondary">Saldo</Typography><Typography variant="h5" sx={{ fontWeight: 'bold', color: balance >= 0 ? 'success.main' : 'error.main' }}>R$ {balance.toFixed(2)}</Typography></Box>
            </Paper>
          </Stack>
          <Box sx={{ width: { xs: '100%', md: '33%' } }}>
            <ExpensesPieChart transactions={transactions} />
          </Box>
        </Stack>

        <Divider sx={{ my: 4 }} />
        <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>Histórico de Transações</Typography>

        {isLoading ? (<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>) : transactions.length === 0 ? (<Paper sx={{ p: 4, textAlign: 'center', mt: 2, borderRadius: 2 }}><Typography variant="h6">Nenhuma transação encontrada.</Typography></Paper>) : (<Stack spacing={2}>{transactions.map((transaction) => (<Paper key={transaction.id} elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2, borderLeft: 5, borderColor: transaction.type === 'INCOME' ? 'success.main' : 'error.main' }}><Box sx={{ flexGrow: 1 }}><Typography variant="body1" sx={{ fontWeight: 'bold' }}>{transaction.title}</Typography><Typography variant="body2" color="text.secondary">{transaction.category}</Typography></Box><Box sx={{ textAlign: 'right' }}><Typography variant="body1" sx={{ fontWeight: 'bold', color: transaction.type === 'INCOME' ? 'success.main' : 'error.main' }}>{transaction.type === 'INCOME' ? '+' : '-'} R$ {Number(transaction.amount).toFixed(2)}</Typography><Typography variant="body2" color="text.secondary">{new Date(transaction.date).toLocaleDateString()}</Typography></Box><Stack direction="row"><IconButton size="small" onClick={() => handleOpenEditModal(transaction)}><EditIcon /></IconButton><IconButton size="small" onClick={() => handleDelete(transaction.id)}><DeleteIcon /></IconButton></Stack></Paper>))}</Stack>)}

        <Modal open={isModalOpen} onClose={handleCloseModal}><Box sx={style} component="form" onSubmit={handleFormSubmit}><Typography variant="h6" component="h2">{transactionToEdit ? 'Editar Transação' : 'Criar Nova Transação'}</Typography><TextField margin="normal" required fullWidth label="Título" value={title} onChange={e => setTitle(e.target.value)} /><TextField margin="normal" required fullWidth label="Valor" type="number" value={amount} onChange={e => setAmount(e.target.value)} /><TextField margin="normal" required fullWidth label="Categoria" value={category} onChange={e => setCategory(e.target.value)} /><TextField margin="normal" required fullWidth type="date" value={date} onChange={e => setDate(e.target.value)} /><FormControl fullWidth margin="normal"><InputLabel>Tipo</InputLabel><Select value={type} label="Tipo" onChange={(e: SelectChangeEvent) => setType(e.target.value as 'INCOME' | 'EXPENSE')}><MenuItem value="EXPENSE">Despesa</MenuItem><MenuItem value="INCOME">Receita</MenuItem></Select></FormControl><Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>{transactionToEdit ? 'Salvar Alterações' : 'Criar'}</Button></Box></Modal>
        
        <Modal open={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}><Box sx={style} component="form" onSubmit={handleImportSubmit}><Typography variant="h6" component="h2">Importar Fatura</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Cole o conteúdo da sua fatura no formato: DD/MM/AAAA - DESCRIÇÃO - R$ VALOR</Typography><TextField margin="normal" required fullWidth multiline rows={10} label="Conteúdo da Fatura" value={textContent} onChange={e => setTextContent(e.target.value)} placeholder={'25/09/2025 - IFOOD*RESTAURANTE BOM PRATO - R$ 55,40\n24/09/2025 - UBER TRIP - R$ 12,00'} /><Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>Processar e Importar</Button></Box></Modal>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}><Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>{snackbarMessage}</Alert></Snackbar>
      </Container>
    </Box>
  );
}