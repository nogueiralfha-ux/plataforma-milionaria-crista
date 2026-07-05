import { useState, useEffect } from 'react';
import { DollarSign, CheckCircle, RefreshCw, XCircle, Landmark } from 'lucide-react';
import { fetchApi, putApi } from '../../utils/api';

export default function AdminComissoes() {
  const [saques, setSaques] = useState<any[]>([]);
  const [processandoId, setProcessandoId] = useState<string | null>(null);

  const fetchSaques = async () => {
    try {
      const data = await fetchApi<any[]>('/api/saques');
      setSaques(data);
    } catch (err) {
      console.error('Erro ao buscar saques:', err);
    }
  };

  useEffect(() => {
    fetchSaques();
  }, []);

  const handleApproveSaque = async (id: string) => {
    setProcessandoId(id);
    
    try {
      const data = await putApi(`/api/saques/${id}/status`, { status: 'Pago' });
      if (data.success) {
        fetchSaques();
      } else {
        alert('Erro ao autorizar saque.');
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor.');
    } finally {
      setProcessandoId(null);
    }
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
