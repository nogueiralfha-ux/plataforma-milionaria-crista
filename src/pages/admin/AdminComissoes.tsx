import { useState } from 'react';
import { DollarSign, CheckCircle, RefreshCw, XCircle, Landmark } from 'lucide-react';

export default function AdminComissoes() {
  const [saques, setSaques] = useState([
    { id: 'SQ-9932', nome: 'Ana Paula Vasconcelos', chave: 'anapaula@gmail.com', valor: 450.00, data: '03/07/2026', status: 'Pendente' },
    { id: 'SQ-9931', nome: 'João Lucas Teixeira', chave: '000.111.222-33', valor: 1250.00, data: '02/07/2026', status: 'Pendente' },
    { id: 'SQ-9921', nome: 'Pr. Gabriel Santos', chave: 'gabriel@gmail.com', valor: 850.00, data: '18/06/2026', status: 'Pago' }
  ]);

  const [processandoId, setProcessandoId] = useState<string | null>(null);

  const handleApproveSaque = (id: string) => {
    setProcessandoId(id);
    
    // Simulate PIX bank transfer
    setTimeout(() => {
      const updated = saques.map(s => s.id === id ? { ...s, status: 'Pago' } : s);
      setSaques(updated);
      setProcessandoId(null);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Aprovação de Saques PIX
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Processe e autorize as transferências de comissão solicitadas pelos afiliados da plataforma.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-4 pl-6">ID Resgate</th>
                <th className="p-4">Solicitante</th>
                <th className="p-4">Chave PIX</th>
                <th className="p-4">Data</th>
                <th className="p-4 text-right">Valor Solicitado</th>
                <th className="p-4 pr-6 text-center">Status / Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB] text-sm">
              {saques.map((saque) => (
                <tr key={saque.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6 font-mono text-xs text-gray-400">{saque.id}</td>
                  <td className="p-4 font-bold text-[#1A1A1A]">{saque.nome}</td>
                  <td className="p-4 text-xs text-gray-500 font-mono">{saque.chave}</td>
                  <td className="p-4 text-xs text-gray-400 font-mono">{saque.data}</td>
                  <td className="p-4 text-right font-bold text-gray-700">R$ {saque.valor.toFixed(2)}</td>
                  <td className="p-4 pr-6 text-center">
                    {saque.status === 'Pendente' ? (
                      <button 
                        onClick={() => handleApproveSaque(saque.id)}
                        disabled={processandoId !== null}
                        className="flex items-center gap-1 px-4 py-1.5 bg-[#0F3D2E] hover:bg-[#0B2E23] text-white font-bold text-xs rounded-xl transition-all shadow-xs mx-auto disabled:opacity-50"
                      >
                        {processandoId === saque.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Enviando PIX...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3.5 h-3.5 text-[#E5C384]" />
                            Autorizar PIX
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-50 text-green-700">
                        {saque.status}
                      </span>
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
