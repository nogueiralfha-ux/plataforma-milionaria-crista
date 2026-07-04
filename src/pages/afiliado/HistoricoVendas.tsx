import { useState } from 'react';
import { DollarSign, Search, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export default function HistoricoVendas() {
  const [searchTerm, setSearchTerm] = useState('');

  const sales = [
    { id: 'VND992182', comprador: 'Lucas Oliveira', produto: 'Método Milionário Cristão', valor: 297.00, comissao: 148.50, data: '03/07/2026', status: 'Aprovada' },
    { id: 'VND991823', comprador: 'Deborah Santos', produto: 'Jornada da Prosperidade', valor: 197.00, comissao: 98.50, data: '02/07/2026', status: 'Aprovada' },
    { id: 'VND990192', comprador: 'Mateus Albuquerque', produto: 'Método Milionário Cristão', valor: 297.00, comissao: 148.50, data: '28/06/2026', status: 'Aprovada' },
    { id: 'VND989182', comprador: 'Ruth Fonseca', produto: 'Fórmula das Vendas Bíblicas', valor: 97.00, comissao: 48.50, data: '25/06/2026', status: 'Pendente' },
    { id: 'VND987182', comprador: 'Sarah Bezerra', produto: 'Método Milionário Cristão', valor: 297.00, comissao: 148.50, data: '20/06/2026', status: 'Reembolsada' }
  ];

  const filteredSales = sales.filter(sale => 
    sale.comprador.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalComissoes = sales
    .filter(s => s.status === 'Aprovada')
    .reduce((sum, s) => sum + s.comissao, 0);

  const pendenteComissoes = sales
    .filter(s => s.status === 'Pendente')
    .reduce((sum, s) => sum + s.comissao, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Minhas Vendas
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Acompanhe o status e a liberação de comissões de cada venda realizada através de seus links.
          </p>
        </div>
      </div>

      {/* Cartões de Estatísticas Financeiras */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Comissões Aprovadas</p>
          <p className="text-3xl font-black text-[#0F3D2E]">R$ {totalComissoes.toFixed(2)}</p>
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-green-50/50 rounded-full translate-x-4 translate-y-4 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Comissões Pendentes</p>
          <p className="text-3xl font-black text-amber-600">R$ {pendenteComissoes.toFixed(2)}</p>
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-amber-50/50 rounded-full translate-x-4 translate-y-4 flex items-center justify-center">
            <Clock className="w-6 h-6 text-amber-600 opacity-20" />
          </div>
        </div>

        <div className="bg-[#0F3D2E] p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Total de Indicações</p>
          <p className="text-3xl font-black text-[#E5C384]">{sales.length}</p>
        </div>
      </div>

      {/* Caixa de Pesquisa e Filtros */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por comprador, produto ou ID da transação..."
          className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-sm text-[#1A1A1A] placeholder-gray-400"
        />
      </div>

      {/* Tabela de Vendas */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-4 pl-6">ID Venda</th>
                <th className="p-4">Data</th>
                <th className="p-4">Produto</th>
                <th className="p-4">Comprador</th>
                <th className="p-4 text-right">Comissão</th>
                <th className="p-4 pr-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6 font-mono text-xs text-gray-500">{sale.id}</td>
                  <td className="p-4 text-gray-500 text-xs">{sale.data}</td>
                  <td className="p-4 font-semibold text-[#1A1A1A]">{sale.produto}</td>
                  <td className="p-4 text-gray-700">{sale.comprador}</td>
                  <td className="p-4 text-right font-bold text-[#0F3D2E]">R$ {sale.comissao.toFixed(2)}</td>
                  <td className="p-4 pr-6 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      sale.status === 'Aprovada' ? 'bg-green-50 text-green-700' :
                      sale.status === 'Pendente' ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {sale.status === 'Aprovada' && <CheckCircle className="w-3 h-3" />}
                      {sale.status === 'Pendente' && <Clock className="w-3 h-3" />}
                      {sale.status === 'Reembolsada' && <AlertTriangle className="w-3 h-3" />}
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredSales.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    Nenhuma venda encontrada.
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
