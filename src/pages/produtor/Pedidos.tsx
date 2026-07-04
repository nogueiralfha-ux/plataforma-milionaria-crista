import { useState } from 'react';
import { Search, ShoppingBag, CheckCircle, Clock, XCircle, CreditCard, DollarSign } from 'lucide-react';

export default function Pedidos() {
  const [searchTerm, setSearchTerm] = useState('');

  const [pedidos] = useState([
    { id: 'ORD-98218', data: '03/07/2026', cliente: 'Roberto Firmino', produto: 'Método Milionário Cristão', valor: 'R$ 997,00', metodo: 'PIX', status: 'Aprovado' },
    { id: 'ORD-98102', data: '02/07/2026', cliente: 'Beatriz Azevedo', produto: 'Jornada da Prosperidade', valor: 'R$ 497,00', metodo: 'Cartão de Crédito', status: 'Aprovado' },
    { id: 'ORD-97812', data: '29/06/2026', cliente: 'Carlos Henrique', produto: 'Método Milionário Cristão', valor: 'R$ 997,00', metodo: 'Boleto Bancário', status: 'Pendente' },
    { id: 'ORD-97541', data: '25/06/2026', cliente: 'Júlia Mendes', produto: 'Jornada da Prosperidade', valor: 'R$ 497,00', metodo: 'Cartão de Crédito', status: 'Recusado' }
  ]);

  const filtered = pedidos.filter(p => 
    p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Pedidos e Vendas
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Acompanhe o fluxo de caixa, as transações em tempo real e o status de pagamento de cada pedido feito.
          </p>
        </div>
      </div>

      {/* Busca */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por cliente, transação ou produto..."
          className="flex-1 bg-transparent border-0 focus:ring-0 focus:outline-none text-sm text-[#1A1A1A] placeholder-gray-400"
        />
      </div>

      {/* Tabela de Pedidos */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-4 pl-6">Cód. Transação</th>
                <th className="p-4">Data</th>
                <th className="p-4">Produto</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Pagamento</th>
                <th className="p-4 text-right">Valor</th>
                <th className="p-4 pr-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6 font-mono text-xs text-gray-400">{p.id}</td>
                  <td className="p-4 text-xs text-gray-400 font-mono">{p.data}</td>
                  <td className="p-4 font-bold text-[#1A1A1A]">{p.produto}</td>
                  <td className="p-4 text-gray-700 font-medium">{p.cliente}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-semibold bg-gray-100 px-2 py-0.5 rounded-md">
                      {p.metodo === 'Cartão de Crédito' && <CreditCard className="w-3.5 h-3.5" />}
                      {p.metodo === 'PIX' && <DollarSign className="w-3.5 h-3.5 text-green-600" />}
                      {p.metodo === 'Boleto Bancário' && <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />}
                      {p.metodo}
                    </span>
                  </td>
                  <td className="p-4 text-right font-black text-[#0F3D2E]">{p.valor}</td>
                  <td className="p-4 pr-6 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      p.status === 'Aprovado' ? 'bg-green-50 text-green-700' :
                      p.status === 'Pendente' ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {p.status === 'Aprovado' && <CheckCircle className="w-3 h-3" />}
                      {p.status === 'Pendente' && <Clock className="w-3 h-3" />}
                      {p.status === 'Recusado' && <XCircle className="w-3 h-3" />}
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    Nenhum pedido encontrado.
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
