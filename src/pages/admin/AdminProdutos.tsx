import { useState } from 'react';
import { CheckCircle, XCircle, ShieldAlert, Award } from 'lucide-react';

export default function AdminProdutos() {
  const [products, setProducts] = useState([
    { id: 1, nome: 'Método Milionário Cristão', produtor: 'Pr. Gabriel Santos', preco: 'R$ 997,00', comissao: '50%', status: 'Ativo' },
    { id: 2, nome: 'Jornada da Prosperidade', produtor: 'Samuel Barboza', preco: 'R$ 497,00', comissao: '40%', status: 'Ativo' },
    { id: 3, nome: 'Fórmula das Vendas Bíblicas', produtor: 'Mateus Albuquerque', preco: 'R$ 97,00', comissao: '50%', status: 'Pendente' },
    { id: 4, nome: 'O Código de Salomão', produtor: 'Caleb Oliveira', preco: 'R$ 297,00', comissao: '60%', status: 'Pendente' }
  ]);

  const handleApprove = (id: number) => {
    const updated = products.map(p => p.id === id ? { ...p, status: 'Ativo' } : p);
    setProducts(updated);
  };

  const handleReject = (id: number) => {
    const updated = products.map(p => p.id === id ? { ...p, status: 'Recusado' } : p);
    setProducts(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Moderar Produtos
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Aprove ou recuse os produtos e materiais digitais submetidos pelos produtores parceiros.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-4 pl-6">Nome do Produto</th>
                <th className="p-4">Produtor</th>
                <th className="p-4 text-center">Preço</th>
                <th className="p-4 text-center">Comissão</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Moderação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <span className="font-bold text-[#1A1A1A] block">{p.nome}</span>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{p.produtor}</td>
                  <td className="p-4 text-center text-gray-700 font-bold">{p.preco}</td>
                  <td className="p-4 text-center text-gray-500 font-bold">{p.comissao}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      p.status === 'Ativo' ? 'bg-green-50 text-green-700' :
                      p.status === 'Pendente' ? 'bg-amber-50 text-amber-700' :
                      'bg-rose-50 text-rose-700'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    {p.status === 'Pendente' ? (
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={() => handleReject(p.id)}
                          className="p-2 text-rose-600 hover:bg-rose-50 transition-colors rounded-lg"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleApprove(p.id)}
                          className="p-2 text-green-600 hover:bg-green-50 transition-colors rounded-lg"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block pr-2">Concluído</span>
                    )}
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
