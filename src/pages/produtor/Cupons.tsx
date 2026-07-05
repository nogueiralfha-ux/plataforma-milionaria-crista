import React, { useState, useEffect } from 'react';
import { PlusCircle, Ticket, Trash2, CheckCircle, RefreshCw } from 'lucide-react';


type Cupom = {
  id: number;
  codigo: string;
  desconto: number; // percentage
  status: string;
  usos: number;
};

const initialCupons: Cupom[] = [
  { id: 1, codigo: 'BEMVINDO10', desconto: 10, status: 'Ativo', usos: 45 },
  { id: 2, codigo: 'PROSPERIDADE20', desconto: 20, status: 'Ativo', usos: 12 },
  { id: 3, codigo: 'REINO50', desconto: 50, status: 'Inativo', usos: 8 }
];

export default function Cupons() {
  const [cupons, setCupons] = useState<Cupom[]>([]);
  const [codigo, setCodigo] = useState('');
  const [desconto, setDesconto] = useState('');
  const [sucesso, setSucesso] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('produtor_cupons');
    if (saved) {
      try {
        setCupons(JSON.parse(saved));
      } catch (e) {
        setCupons(initialCupons);
      }
    } else {
      setCupons(initialCupons);
      localStorage.setItem('produtor_cupons', JSON.stringify(initialCupons));
    }
  }, []);

  const saveToStorage = (updated: Cupom[]) => {
    setCupons(updated);
    localStorage.setItem('produtor_cupons', JSON.stringify(updated));
  };

  const handleAddCupom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo || !desconto) return;

    const newCupom: Cupom = {
      id: Date.now(),
      codigo: codigo.toUpperCase().trim(),
      desconto: parseInt(desconto),
      status: 'Ativo',
      usos: 0
    };

    const updated = [newCupom, ...cupons];
    saveToStorage(updated);
    setCodigo('');
    setDesconto('');
    setSucesso(true);

    setTimeout(() => setSucesso(false), 3000);
  };

  const handleDelete = (id: number) => {
    if (confirm('Deseja excluir este cupom?')) {
      const updated = cupons.filter(c => c.id !== id);
      saveToStorage(updated);
    }
  };

  const toggleStatus = (id: number) => {
    const updated = cupons.map(c => 
      c.id === id ? { ...c, status: c.status === 'Ativo' ? 'Inativo' : 'Ativo' } : c
    );
    saveToStorage(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Cupons de Desconto
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Crie códigos promocionais para impulsionar suas campanhas de vendas e eventos.
          </p>
        </div>
      </div>

      {sucesso && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="font-bold text-sm">Cupom criado com sucesso!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Formulário Novo Cupom */}
        <form onSubmit={handleAddCupom} className="bg-white p-6 lg:p-8 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-6 lg:col-span-4 h-fit">
          <h3 className="text-lg font-bold text-[#0F3D2E] border-b border-gray-100 pb-3 flex items-center gap-2">
            <Ticket className="w-5 h-5" /> Criar Cupom
          </h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Código do Cupom</label>
              <input 
                type="text" 
                required
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex: PÁSCOA30"
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm font-mono font-bold"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Desconto (%)</label>
              <input 
                type="number" 
                required
                min="1"
                max="100"
                value={desconto}
                onChange={(e) => setDesconto(e.target.value)}
                placeholder="30"
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full flex justify-center items-center gap-2 px-6 py-3.5 bg-[#0F3D2E] text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[#0B2E23] transition-colors shadow-md"
          >
            <PlusCircle className="w-4 h-4" />
            Adicionar Cupom
          </button>
        </form>

        {/* Lista de Cupons */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  <th className="p-4 pl-6">Código</th>
                  <th className="p-4 text-center">Desconto</th>
                  <th className="p-4 text-center">Utilizações</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 pr-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB] text-sm">
                {cupons.map((cupom) => (
                  <tr key={cupom.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-gray-700">{cupom.codigo}</td>
                    <td className="p-4 text-center text-green-600 font-bold">{cupom.desconto}% OFF</td>
                    <td className="p-4 text-center text-gray-500 font-medium">{cupom.usos} vezes</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleStatus(cupom.id)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          cupom.status === 'Ativo' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
                        }`}
                      >
                        {cupom.status}
                      </button>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button 
                        onClick={() => handleDelete(cupom.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-gray-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
