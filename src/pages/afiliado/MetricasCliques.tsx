import { useState, useEffect } from 'react';
import { MousePointerClick, TrendingUp, Compass, Target, Play, RotateCcw, PlusCircle, ShoppingBag } from 'lucide-react';

type SourceData = {
  name: string;
  cliques: number;
  vendas: number;
};

const initialSources: SourceData[] = [
  { name: 'Instagram Orgânico', cliques: 184, vendas: 26 },
  { name: 'WhatsApp Grupos', cliques: 112, vendas: 25 },
  { name: 'Tráfego Pago (Facebook Ads)', cliques: 88, vendas: 6 },
  { name: 'YouTube Shorts', cliques: 56, vendas: 6 },
  { name: 'TikTok', cliques: 44, vendas: 2 }
];

export default function MetricasCliques() {
  const [sources, setSources] = useState<SourceData[]>([]);

  // Load from localStorage or initialize
  useEffect(() => {
    const saved = localStorage.getItem('plataforma_utm_sources');
    if (saved) {
      try {
        setSources(JSON.parse(saved));
      } catch (e) {
        setSources(initialSources);
      }
    } else {
      setSources(initialSources);
      localStorage.setItem('plataforma_utm_sources', JSON.stringify(initialSources));
    }
  }, []);

  const saveToStorage = (updated: SourceData[]) => {
    setSources(updated);
    localStorage.setItem('plataforma_utm_sources', JSON.stringify(updated));
  };

  // Simulate Actions
  const handleAddClick = (index: number) => {
    const updated = sources.map((source, idx) => 
      idx === index ? { ...source, cliques: source.cliques + 1 } : source
    );
    saveToStorage(updated);
  };

  const handleAddSale = (index: number) => {
    const updated = sources.map((source, idx) => 
      idx === index ? { ...source, cliques: source.cliques + 1, vendas: source.vendas + 1 } : source
    );
    saveToStorage(updated);
  };

  const handleReset = () => {
    if (confirm('Deseja resetar as estatísticas para os valores padrões?')) {
      saveToStorage(initialSources);
    }
  };

  // Calculations
  const totalCliques = sources.reduce((acc, curr) => acc + curr.cliques, 0);
  const totalVendas = sources.reduce((acc, curr) => acc + curr.vendas, 0);
  const conversionRate = totalCliques > 0 ? ((totalVendas / totalCliques) * 100) : 0;

  // Find best performing source by conversion
  const bestSource = sources.reduce((best, curr) => {
    const currRate = curr.cliques > 0 ? (curr.vendas / curr.cliques) : 0;
    const bestRate = best.cliques > 0 ? (best.vendas / best.cliques) : 0;
    return currRate > bestRate ? curr : best;
  }, initialSources[0]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Cliques e Conversões
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Entenda de onde vêm seus visitantes e quais canais trazem mais resultados financeiros para o reino.
          </p>
        </div>
        <button 
          onClick={handleReset}
          className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 hover:bg-gray-50 transition-colors text-xs font-bold rounded-lg text-gray-500"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Resetar Dados
        </button>
      </div>

      {/* Cartões Rápidos Dinâmicos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total de Cliques</p>
            <p className="text-3xl font-black text-[#0F3D2E]">{totalCliques}</p>
          </div>
          <div className="p-3 bg-[#0F3D2E]/5 rounded-2xl text-[#0F3D2E]">
            <MousePointerClick className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Conversão Média</p>
            <p className="text-3xl font-black text-[#B8860B]">{conversionRate.toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-[#B8860B]/5 rounded-2xl text-[#B8860B]">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0F3D2E] p-6 rounded-2xl text-white shadow-md flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Melhor Origem</p>
            <p className="text-lg font-black text-[#E5C384] truncate max-w-[200px]">{bestSource.name}</p>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl text-[#E5C384]">
            <Target className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Fontes de Tráfego e Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Tabela de Fontes Dinâmica */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-[#0F3D2E] mb-1">Origem dos Visitantes</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Rastreamento de parâmetros UTM</p>
          </div>

          <div className="space-y-4">
            {sources.map((source, index) => {
              const rate = source.cliques > 0 ? ((source.vendas / source.cliques) * 100) : 0;
              return (
                <div key={source.name} className="flex justify-between items-center pb-3.5 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <Compass className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-bold text-[#1A1A1A]">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Cliques</p>
                      <p className="text-sm font-bold text-gray-700">{source.cliques}</p>
                    </div>
                    <div className="text-right w-16">
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">Conv.</p>
                      <p className="text-sm font-black text-[#0F3D2E]">{rate.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Gráfico Visual Dinâmico com base nos cliques reais */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#0F3D2E] mb-1">Engajamento Semanal</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Frequência de Cliques</p>
          </div>

          <div className="flex items-end gap-3 h-36 mt-8">
            {sources.slice(0, 5).map((s, idx) => {
              // Calculate dynamic height based on share of clicks
              const pct = totalCliques > 0 ? (s.cliques / totalCliques) * 150 : 10;
              const heightStyle = `${Math.max(10, Math.min(100, pct))}%`;
              const colors = ['bg-[#F1F3F2]', 'bg-[#F1F3F2]', 'bg-[#E5C384]', 'bg-[#0F3D2E]', 'bg-[#F1F3F2]'];
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div 
                    className={`rounded-t w-full transition-all duration-500 ${colors[idx]}`}
                    style={{ height: heightStyle }}
                  ></div>
                  <span className="text-[9px] text-gray-400 uppercase font-bold truncate w-full text-center">
                    {s.name.substring(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simulador de Cliques e Parâmetros UTM */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 lg:p-8 space-y-6 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Play className="w-5 h-5 text-[#B8860B]" />
          <div>
            <h3 className="text-lg font-bold text-[#0F3D2E]">Simulador de Tráfego UTM</h3>
            <p className="text-xs text-gray-400">Use os botões abaixo para simular cliques e vendas de leads usando parâmetros UTM nos seus links de afiliado.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sources.map((source, index) => (
            <div key={source.name} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col justify-between gap-3">
              <span className="text-xs font-bold text-gray-700">{source.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAddClick(index)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-white border border-gray-200 hover:bg-[#0F3D2E]/5 text-gray-600 hover:text-[#0F3D2E] text-xs font-bold rounded-lg transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  +1 Clique
                </button>
                <button
                  onClick={() => handleAddSale(index)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 bg-[#0F3D2E] hover:bg-[#0B2E23] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#E5C384]" />
                  +1 Venda
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
