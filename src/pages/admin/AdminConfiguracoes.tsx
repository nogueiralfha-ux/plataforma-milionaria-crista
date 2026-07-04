import { useState } from 'react';
import { Settings, Save, CheckCircle, Database } from 'lucide-react';

export default function AdminConfiguracoes() {
  const [siteName, setSiteName] = useState('Plataforma Milionária Cristã');
  const [fee, setFee] = useState('10');
  const [supportEmail, setSupportEmail] = useState('suporte@plataformamilionariacrista.com');
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setSucesso(false);

    // Simulate saving settings
    setTimeout(() => {
      setSalvando(false);
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Configurações
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Ajuste os parâmetros fundamentais do sistema, taxas operacionais de transações e chaves de integração.
          </p>
        </div>
      </div>

      {sucesso && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="font-bold text-sm">Configurações globais salvas com sucesso!</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8">
        <form className="space-y-6" onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-2 md:col-span-2">
              <h3 className="font-bold text-lg text-[#0F3D2E] border-b border-gray-50 pb-2 flex items-center gap-2">
                <Settings className="w-5 h-5" /> Parâmetros de Identidade
              </h3>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-[#1A1A1A]">Nome da Plataforma</label>
              <input 
                type="text" 
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384]" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1A1A1A]">Taxa de Intermediação (%)</label>
              <input 
                type="number" 
                required
                min="0"
                max="100"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1A1A1A]">E-mail de Suporte da Plataforma</label>
              <input 
                type="email" 
                required
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm" 
              />
            </div>

            <div className="space-y-2 md:col-span-2 border-t border-gray-50 pt-6 mt-2">
              <h3 className="font-bold text-lg text-[#0F3D2E] border-b border-gray-50 pb-2 flex items-center gap-2">
                <Database className="w-5 h-5" /> Integrações e Banco de Dados
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Status da Conexão Firebase</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span className="text-xs font-bold text-gray-700">Ativo (24 conexões)</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold block">Servidor de Gateway (PIX)</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span className="text-xs font-bold text-gray-700">Online & Integrado</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-6 border-t border-[#E5E7EB] flex justify-end">
            <button 
              type="submit" 
              disabled={salvando}
              className="flex items-center px-8 py-3.5 bg-[#0F3D2E] text-white rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-[#0B2E23] transition-colors shadow-lg disabled:opacity-50"
            >
              {salvando ? (
                'Salvando...'
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
