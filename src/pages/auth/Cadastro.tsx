import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';


export default function Cadastro() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Cliente');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nome, email, password, role })
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setSuccess(true);
        localStorage.setItem('current_user', JSON.stringify(data.user));
        setTimeout(() => {
          navigate('/painel');
        }, 1500);
      } else {
        setError(data.error || 'Erro ao realizar cadastro.');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
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
            Crie sua conta
          </h2>
          <p className="mt-2 text-center text-xs text-gray-500 uppercase tracking-widest font-bold">
            Junte-se à Plataforma Milionária Cristã
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p>Cadastro realizado com sucesso! Redirecionando...</p>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nome Completo</label>
              <input 
                type="text" 
                required 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-[#E5E7EB] placeholder-gray-400 text-[#1A1A1A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] focus:border-[#E5C384] text-sm transition-all" 
                placeholder="Seu nome" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Endereço de E-mail</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-[#E5E7EB] placeholder-gray-400 text-[#1A1A1A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] focus:border-[#E5C384] text-sm transition-all" 
                placeholder="exemplo@gmail.com" 
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
                placeholder="Crie uma senha" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tipo de Conta</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-[#E5E7EB] text-[#1A1A1A] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] focus:border-[#E5C384] text-sm bg-white transition-all"
              >
                <option value="Cliente">Cliente</option>
                <option value="Afiliado">Afiliado</option>
                <option value="Produtor">Produtor</option>
              </select>
            </div>
          </div>

          <div>
            <button 
              type="submit"
              className="w-full flex items-center justify-center px-8 py-3.5 border border-transparent text-sm font-bold uppercase tracking-widest rounded-xl text-[#0F3D2E] bg-[#E5C384] hover:bg-[#D4B373] shadow-lg transition-colors cursor-pointer"
            >
              Cadastrar
            </button>
          </div>

          <div className="text-center text-xs text-gray-500 uppercase tracking-wider font-bold">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-[#0F3D2E] hover:text-[#E5C384] transition-colors">
              Faça Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

