import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute'; // 1. Importar nosso segurança

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  // Rotas Públicas
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/cadastro',
    element: <Register />,
  },
  // Rotas Protegidas
  {
    element: <ProtectedRoute />, // 2. O componente de proteção é o "pai"
    children: [
      // 3. Todas as rotas aqui dentro são filhas e, portanto, protegidas
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
      // Se tivéssemos uma página de perfil, ela iria aqui também:
      // { path: '/perfil', element: <Profile /> },
    ],
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}