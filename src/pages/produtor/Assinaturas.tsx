import { useState } from 'react';
import { PlaySquare, DollarSign, Users, TrendingUp, Compass, ArrowUpRight } from 'lucide-react';

export default function Assinaturas() {
  const [assinantes] = useState([
    { id: 1, nome: 'Estevão Ferreira', plano: 'Clube Milionário Mensal', valor: 'R$ 97,00', status: 'Ativo', data: '03/07/2026' },
    { id: 2, nome: 'Samuel Barboza', plano: 'Clube Milionário Anual', valor: 'R$ 997,00', status: 'Ativo', data: '01/07/2026' },
    { id: 3, nome: 'Priscila Vasconcelos', plano: 'Clube Milionário Mensal', valor: 'R$ 97,00', status: 'Ativo', data: '28/06/2026' },
    { id: 4, nome: 'Lucas de Souza', plano: 'Clube Milionário Mensal', valor: 'R$ 97,00', status: 'Cancelado', data: '15/06/2026' }
  ]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Assinaturas
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Controle os planos recorrentes, receitas mensais (MRR) e a base de membros ativos da sua comunidade.
          </p>
        </div>
      </div>

      {/* Cartões Financeiros de Assinaturas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">MRR (Receita Recorrente)</p>
          <p className="text-3xl font-black text-[#0F3D2E]">R$ 14.850</p>
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-green-50/50 rounded-full translate-x-4 translate-y-4 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Assinantes Ativos</p>
          <p className="text-3xl font-black text-[#0F3D2E]">184</p>
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-blue-50/50 rounded-full translate-x-4 translate-y-4 flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600 opacity-20" />
          </div>
        </div>

        <div className="bg-[#0F3D2E] p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Taxa de Churn (Cancelamento)</p>
          <p className="text-3xl font-black text-[#E5C384]">2.4%</p>
        </div>
      </div>

      {/* Tabela de Membros / Assinantes */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#0F3D2E]">Lista de Assinantes</h3>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Renovações e pagamentos recorrentes</p>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-4 pl-4">Assinante</th>
                <th className="p-4">Plano</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Adesão</th>
                <th className="p-4 pr-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm">
              {assinantes.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-4">
                    <span className="font-bold text-[#1A1A1A]">{member.nome}</span>
                  </td>
                  <td className="p-4 text-gray-600 text-xs font-medium">{member.plano}</td>
                  <td className="p-4 font-bold text-gray-700">{member.valor}</td>
                  <td className="p-4 text-gray-400 text-xs font-mono">{member.data}</td>
                  <td className="p-4 pr-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      member.status === 'Ativo' ? 'bg-green-50 text-green-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {member.status}
                    </span>
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
