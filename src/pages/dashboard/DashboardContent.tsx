import { useLocation } from 'react-router-dom';

export default function DashboardContent() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  
  // Create a readable title from the path
  const title = pathParts.length > 1 
    ? pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1).replace('-', ' ')
    : 'Painel';

  const role = pathParts[0] ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1) : '';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
          {title === 'Dashboard' ? 'Visão Geral' : title}
        </h2>
        <p className="text-sm text-gray-500 max-w-xs sm:text-right">
          {title === 'Dashboard' 
            ? 'Dados consolidados referentes ao crescimento do reino e prosperidade financeira de seus produtores.' 
            : `Conteúdo de ${title} em desenvolvimento. Será refinado em breve.`}
        </p>
      </div>

      {title === 'Dashboard' ? (
        <>
          {/* Métricas Principais - Carrossel com Snap no Mobile, Grade no Desktop */}
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:pb-0">
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs relative overflow-hidden min-w-[260px] flex-shrink-0 snap-center lg:min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Faturamento Total</p>
              <p className="text-3xl font-black text-[#0F3D2E]">R$ 1.240.500</p>
              <div className="absolute bottom-0 right-0 w-16 h-16 bg-[#FDFCFB] rotate-45 translate-x-8 translate-y-8 opacity-50 border border-[#E5C384]"></div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs min-w-[260px] flex-shrink-0 snap-center lg:min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Alunos Ativos</p>
              <p className="text-3xl font-black text-[#0F3D2E]">48.209</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs min-w-[260px] flex-shrink-0 snap-center lg:min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Conversão Média</p>
              <p className="text-3xl font-black text-[#B8860B]">12.4%</p>
            </div>
            <div className="bg-[#0F3D2E] p-6 rounded-2xl text-white shadow-md min-w-[260px] flex-shrink-0 snap-center lg:min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">Comissões Pagas</p>
              <p className="text-3xl font-black text-[#E5C384]">R$ 412k</p>
            </div>
          </div>

          {/* Gráficos e Detalhes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0F3D2E] mb-1">Crescimento Semanal</h3>
                <p className="text-xs text-gray-400 uppercase tracking-widest">Fluxo de novos afiliados</p>
              </div>
              <div className="flex items-end gap-2.5 h-28 mt-8">
                <div className="flex-1 bg-[#F1F3F2] rounded-t h-[40%]"></div>
                <div className="flex-1 bg-[#F1F3F2] rounded-t h-[60%]"></div>
                <div className="flex-1 bg-[#E5C384] rounded-t h-[90%] transition-all hover:h-[95%]"></div>
                <div className="flex-1 bg-[#0F3D2E] rounded-t h-[75%] transition-all hover:h-[80%]"></div>
                <div className="flex-1 bg-[#F1F3F2] rounded-t h-[85%]"></div>
                <div className="flex-1 bg-[#0F3D2E] rounded-t h-[100%] transition-all hover:h-[100%]"></div>
                <div className="flex-1 bg-[#F1F3F2] rounded-t h-[70%]"></div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8">
              <div>
                <h3 className="text-lg font-bold text-[#0F3D2E] mb-4">Vendas Recentes</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#1A1A1A]">Ana Paula V.</span>
                      <span className="text-[10px] text-gray-400 font-mono">PROD #4421</span>
                    </div>
                    <span className="text-xs font-black text-green-600 uppercase">R$ 297</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#1A1A1A]">João Lucas T.</span>
                      <span className="text-[10px] text-gray-400 font-mono">AFIL #1092</span>
                    </div>
                    <span className="text-xs font-black text-green-600 uppercase">R$ 1.490</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#1A1A1A]">Matheus B.</span>
                      <span className="text-[10px] text-gray-400 font-mono">PROD #8821</span>
                    </div>
                    <span className="text-xs font-black text-green-600 uppercase">R$ 89</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 border border-dashed border-[#E5E7EB] rounded-2xl bg-white/50">
          <p className="text-[#0F3D2E] font-bold">Conteúdo em desenvolvimento</p>
          <p className="text-xs text-gray-400 mt-2 uppercase tracking-widest">Em breve</p>
        </div>
      )}
    </div>
  );
}
