import { useState } from 'react';
import { DollarSign, BarChart2, TrendingUp, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function AdminFinanceiro() {
  const [transacoes] = useState([
    { id: 'TX-99012', data: '03/07/2026', produto: 'Método Milionário Cristão', produtor: 'Pr. Gabriel Santos', valor: 997.00, taxaPlataforma: 99.70, status: 'Aprovada' },
    { id: 'TX-99011', data: '02/07/2026', produto: 'Jornada da Prosperidade', produtor: 'Samuel Barboza', valor: 497.00, taxaPlataforma: 49.70, status: 'Aprovada' },
    { id: 'TX-99010', data: '01/07/2026', produto: 'Fórmula das Vendas Bíblicas', produtor: 'Mateus Albuquerque', valor: 97.00, taxaPlataforma: 9.70, status: 'Aprovada' }
  ]);

  const volumeTotal = transacoes.reduce((acc, curr) => acc + curr.valor, 0);
  const taxaTotal = transacoes.reduce((acc, curr) => acc + curr.taxaPlataforma, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Relatório Financeiro Geral
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Acompanhe o faturamento bruto consolidado, taxa de processamento e faturamento líquido da Plataforma Milionária Cristã.
          </p>
        </div>
      </div>

      {/* Cartões Rápidos do Financeiro da Plataforma */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Volume Geral de Vendas (GMV)</p>
          <p className="text-3xl font-black text-[#0F3D2E]">R$ 1.280.400</p>
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-green-50/50 rounded-full translate-x-4 translate-y-4 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Lucro da Plataforma (Taxa 10%)</p>
          <p className="text-3xl font-black text-[#B8860B]">R$ 128.040</p>
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-amber-50/50 rounded-full translate-x-4 translate-y-4 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-[#B8860B] opacity-20" />
          </div>
        </div>

        <div className="bg-[#0F3D2E] p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Taxa de Conversão Geral</p>
          <p className="text-3xl font-black text-[#E5C384]">14.2%</p>
        </div>
      </div>

      {/* Listagem de Transações */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-[#0F3D2E]">Fluxo de Caixa Recente</h3>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Divisão detalhada das tarifas de intermediação</p>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-4 pl-4">ID Transação</th>
                <th className="p-4">Data</th>
                <th className="p-4">Produto</th>
                <th className="p-4">Produtor</th>
                <th className="p-4 text-right">Valor Venda</th>
                <th className="p-4 text-right">Taxa Intermediação</th>
                <th className="p-4 pr-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm">
              {transacoes.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-4 font-mono text-xs text-gray-400">{t.id}</td>
                  <td className="p-4 text-gray-400 text-xs font-mono">{t.data}</td>
                  <td className="p-4 font-bold text-[#1A1A1A]">{t.produto}</td>
                  <td className="p-4 text-gray-600 font-semibold">{t.produtor}</td>
                  <td className="p-4 text-right font-bold text-gray-700">R$ {t.valor.toFixed(2)}</td>
                  <td className="p-4 text-right font-black text-[#0F3D2E]">R$ {t.taxaPlataforma.toFixed(2)}</td>
                  <td className="p-4 pr-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {t.status}
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
