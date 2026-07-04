import { useState } from 'react';
import { Users, Search, Ban, CheckCircle, ShieldCheck } from 'lucide-react';

export default function AdminUsuarios() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([
    { id: 1, nome: 'Pr. Gabriel Santos', email: 'gabriel.santos@gmail.com', role: 'Produtor', status: 'Ativo' },
    { id: 2, nome: 'Ana Paula Vasconcelos', email: 'anapaula@gmail.com', role: 'Afiliado', status: 'Ativo' },
    { id: 3, nome: 'João Lucas Teixeira', email: 'joao.lucas@gmail.com', role: 'Afiliado', status: 'Pendente' },
    { id: 4, nome: 'Ruth Fonseca', email: 'ruth.fonseca@gmail.com', role: 'Cliente', status: 'Ativo' },
    { id: 5, nome: 'Mateus Albuquerque', email: 'mateus.a@gmail.com', role: 'Produtor', status: 'Banido' }
  ]);

  const handleToggleStatus = (id: number) => {
    const updated = users.map(user => {
      if (user.id === id) {
        const nextStatus = user.status === 'Ativo' ? 'Banido' : 'Ativo';
        return { ...user, status: nextStatus };
      }
      return user;
    });
    setUsers(updated);
  };

  const filtered = users.filter(u => 
    u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Usuários Cadastrados
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Visualize e controle as permissões e o status de todos os usuários registrados no ecossistema cristão.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome, e-mail ou tipo de conta..."
          className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-sm text-[#1A1A1A] placeholder-gray-400"
        />
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-4 pl-6">Nome do Usuário</th>
                <th className="p-4">E-mail</th>
                <th className="p-4 text-center">Tipo de Perfil</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <span className="font-bold text-[#1A1A1A] block">{user.nome}</span>
                  </td>
                  <td className="p-4 text-gray-500 font-mono text-xs">{user.email}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F1F3F2] text-[#0F3D2E]">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      user.status === 'Ativo' ? 'bg-green-50 text-green-700' :
                      user.status === 'Pendente' ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button 
                      onClick={() => handleToggleStatus(user.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                        user.status === 'Banido' 
                          ? 'bg-green-50 hover:bg-green-100 text-green-700' 
                          : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                      }`}
                    >
                      {user.status === 'Banido' ? 'Reativar' : 'Bloquear'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
