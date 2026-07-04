import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Exclusive Admin credentials check
    if (email === 'nogueiralfha@gmail.com' && password === 'missionario405') {
      const adminUser = {
        email: 'nogueiralfha@gmail.com',
        nome: 'Pr. Nogueira',
        superAdmin: true,
        role: 'admin'
      };
      localStorage.setItem('current_user', JSON.stringify(adminUser));
      navigate('/painel');
    } else {
      setError('Credenciais incorretas. Apenas o administrador geral nogueiralfha@gmail.com pode acessar a plataforma.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] font-sans text-[#1A1A1A] py-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg border border-[#E5E7EB]">
        <div>
          <div className="mx-auto w-12 h-12 rounded-xl bg-[#0F3D2E] flex items-center justify-center font-bold text-[#E5C384] text-lg shadow-md mb-2">
            MC
          </div>
          <h2 className="text-center text-3xl font-serif font-black italic tracking-tighter text-[#0F3D2E]">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-center text-xs text-gray-500 uppercase tracking-widest font-bold">
            Administrador Geral Exclusivo
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Endereço de E-mail</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-[#E5E7EB] placeholder-gray-400 text-[#1A1A1A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] focus:border-[#E5C384] text-sm transition-all" 
                placeholder="nogueiralfha@gmail.com" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Senha de Acesso</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-[#E5E7EB] placeholder-gray-400 text-[#1A1A1A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] focus:border-[#E5C384] text-sm transition-all" 
                placeholder="Sua senha" 
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" defaultChecked className="h-4 w-4 text-[#0F3D2E] focus:ring-[#E5C384] border-[#E5E7EB] rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-500 font-bold uppercase tracking-wider">
                Lembrar de mim
              </label>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full flex items-center justify-center px-8 py-3.5 border border-transparent text-sm font-bold uppercase tracking-widest rounded-xl text-[#0F3D2E] bg-[#E5C384] hover:bg-[#D4B373] shadow-lg transition-colors cursor-pointer"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
}
