import axios from 'axios';

// 1. Cria uma instância do axios com a configuração base da nossa API
const api = axios.create({
  // A URL base é o endereço do nosso back-end que está no ar na Vercel
  baseURL: 'https://findash-api.vercel.app' 
});

// 2. Lógica de inicialização para autenticação
//    Este código é executado uma única vez quando o app carrega
const token = localStorage.getItem('authToken');
if (token) {
  // Se encontrarmos um token salvo, já configuramos todas as futuras
  // requisições da nossa 'api' para enviá-lo no cabeçalho.
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// 3. Exportamos a instância configurada para ser usada em todo o app
export default api;