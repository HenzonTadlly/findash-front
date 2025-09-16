import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  // 1. Verificar se o token existe no localStorage
  const token = localStorage.getItem('authToken');

  // 2. Se o token não existir, redireciona para a página de login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se o token existir, renderiza a página filha (Dashboard, etc.)
  //    O <Outlet /> é o componente do React Router que representa a rota aninhada.
  return <Outlet />;
}