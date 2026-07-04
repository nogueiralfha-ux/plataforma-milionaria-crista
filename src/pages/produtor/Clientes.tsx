import { useState } from 'react';
import { Users, Search, Mail, MessageSquare, BookOpen } from 'lucide-react';

export default function Clientes() {
  const [searchTerm, setSearchTerm] = useState('');

  const [clientes] = useState([
    { id: 1, nome: 'Ana Júlia Ramos', email: 'anajulia@gmail.com', whatsapp: '(11) 98765-4321', compras: 3, progresso: '85%', ingresso: '12/05/2026' },
    { id: 2, nome: 'Pedro Henrique Lima', email: 'pedro.lima@gmail.com', whatsapp: '(21) 99888-7766', compras: 1, progresso: '40%', ingresso: '01/06/2026' },
    { id: 3, nome: 'Caleb Oliveira', email: 'caleb@igreja.org', whatsapp: '(31) 99122-3344', compras: 2, progresso: '100%', ingresso: '15/04/2026' },
    { id: 4, nome: 'Milena Coutinho', email: 'milena.c@hotmail.com', whatsapp: '(19) 98122-4455', compras: 1, progresso: '12%', ingresso: '25/06/2026' }
  ]);

  const filtered = clientes.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.whatsapp.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Alunos e Clientes
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Gerencie e acompanhe a evolução, progresso de cursos e dados de contato de todos os seus compradores.
          </p>
        </div>
      </div>

      {/* Caixa de Pesquisa */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nome, email ou WhatsApp do aluno..."
          className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-sm text-[#1A1A1A] placeholder-gray-400"
        />
      </div>

      {/* Tabela de Clientes */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-4 pl-6">Nome do Aluno</th>
                <th className="p-4">Contato</th>
                <th className="p-4 text-center">Compras</th>
                <th className="p-4 text-center">Progresso de Aulas</th>
                <th className="p-4 pr-6 text-right">Data de Ingresso</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <span className="font-bold text-[#1A1A1A] block">{c.nome}</span>
                  </td>
                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      {c.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MessageSquare className="w-3.5 h-3.5 text-green-500" />
                      {c.whatsapp}
                    </div>
                  </td>
                  <td className="p-4 text-center font-bold text-gray-700">{c.compras} produtos</td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-[#0F3D2E] h-2 rounded-full" 
                          style={{ width: c.progresso }}
                        ></div>
                      </div>
                      <span className="text-xs font-bold text-[#0F3D2E]">{c.progresso}</span>
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right text-xs text-gray-400 font-mono">{c.ingresso}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-400">
                    Nenhum aluno encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
