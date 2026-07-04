import { useState } from 'react';
import { TrendingUp, DollarSign, ArrowUpRight, BarChart, Percent, Activity } from 'lucide-react';

export default function Relatorios() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Relatórios e Métricas
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Analise o crescimento do seu negócio, faturamento líquido, conversão de checkout e taxas de reembolso.
          </p>
        </div>
      </div>

      {/* Cartões de Desempenho */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Faturamento Líquido</p>
            <p className="text-3xl font-black text-[#0F3D2E]">R$ 828.400</p>
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +18.4% este mês
            </span>
          </div>
          <div className="p-3 bg-[#0F3D2E]/5 rounded-2xl text-[#0F3D2E]">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Conversão de Checkout</p>
            <p className="text-3xl font-black text-[#B8860B]">18.6%</p>
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-0.5 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +2.1% esta semana
            </span>
          </div>
          <div className="p-3 bg-[#B8860B]/5 rounded-2xl text-[#B8860B]">
            <Percent className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0F3D2E] p-6 rounded-2xl text-white shadow-md flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Lucro por Venda</p>
            <p className="text-3xl font-black text-[#E5C384]">R$ 498,50</p>
            <span className="text-[10px] text-[#A7C4BC] font-bold mt-1 block">Média calculada vitalícia</span>
          </div>
          <div className="p-3 bg-white/10 rounded-2xl text-[#E5C384]">
            <Activity className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Gráficos CSS Puros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Faturamento Anual */}
        <div className="bg-white p-6 lg:p-8 rounded-2xl border border-[#E5E7EB] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0F3D2E] mb-1">Faturamento Semestral</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Receita bruta em R$ (Milhares)</p>
          </div>
          
          <div className="flex items-end gap-4 h-48 mt-8">
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="bg-[#F1F3F2] rounded-t w-full h-[30%]"></div>
              <span className="text-[10px] text-gray-400 font-bold">Jan</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="bg-[#F1F3F2] rounded-t w-full h-[45%]"></div>
              <span className="text-[10px] text-gray-400 font-bold">Fev</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="bg-[#E5C384] rounded-t w-full h-[60%]"></div>
              <span className="text-[10px] text-[#B8860B] font-bold">Mar</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="bg-[#0F3D2E] rounded-t w-full h-[85%]"></div>
              <span className="text-[10px] text-[#0F3D2E] font-bold">Abr</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <div className="bg-[#0F3D2E] rounded-t w-full h-[100%]"></div>
              <span className="text-[10px] text-[#0F3D2E] font-bold">Mai</span>
            </div>
          </div>
        </div>

        {/* Divisão de Vendas por Canal */}
        <div className="bg-white p-6 lg:p-8 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#0F3D2E] mb-1">Origem das Compras</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest">Divisão de faturamento</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#1A1A1A]">
                <span>Tráfego Orgânico</span>
                <span>R$ 512.000 (62%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#0F3D2E] h-2.5 rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#1A1A1A]">
                <span>Indicações de Afiliados</span>
                <span>R$ 248.000 (30%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#E5C384] h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#1A1A1A]">
                <span>Tráfego Pago Direto</span>
                <span>R$ 68.400 (8%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-[#B8860B] h-2.5 rounded-full" style={{ width: '8%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
