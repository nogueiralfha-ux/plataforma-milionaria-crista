import React, { useState, useEffect } from 'react';
import { Wallet, CheckCircle, RefreshCw, Landmark, ArrowUpRight } from 'lucide-react';
import { fetchApi, postApi } from '../../utils/api';


export default function SolicitarSaque() {
  const [solicitando, setSolicitando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [pixKey, setPixKey] = useState('');
  const [pixType, setPixType] = useState('cpf');
  const [valorSaque, setValorSaque] = useState('');

  const [availableBalance, setAvailableBalance] = useState(2450.00);
  const [saquesAntigos, setSaquesAntigos] = useState<any[]>([]);

  const fetchSaques = async () => {
    try {
      const data = await fetchApi<any[]>('/api/saques');
      
      // Calculate remaining balance dynamically starting from initial 2450.00 minus any saques in DB
      let withdrawn = 0;
      data.forEach((s: any) => {
        if (s.status === 'Pago' || s.status === 'Pendente') {
          withdrawn += s.valor;
        }
      });
      setAvailableBalance(2450.00 - withdrawn);
      setSaquesAntigos(data);
    } catch (err) {
      console.error('Erro ao carregar saques:', err);
    }
  };

  useEffect(() => {
    fetchSaques();
  }, []);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    const valor = parseFloat(valorSaque);
    if (isNaN(valor) || valor <= 0 || valor > availableBalance) {
      alert('Valor de saque inválido ou saldo insuficiente!');
      return;
    }

    setSolicitando(true);
    setSucesso(false);

    try {
      const currentUserString = localStorage.getItem('current_user');
      const currentUser = currentUserString ? JSON.parse(currentUserString) : null;
      const nome = currentUser?.nome || 'antonio luiz socorro nogueira';

      const data = await postApi('/api/saques', {
        valor,
        chave: pixKey,
        nome,
        banco: 'Transferência PIX'
      });
      if (data.success) {
        setSucesso(true);
        setValorSaque('');
        setPixKey('');
        fetchSaques();
        setTimeout(() => {
          setSucesso(false);
        }, 4000);
      } else {
        alert('Erro ao solicitar saque.');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    } finally {
      setSolicitando(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Solicitar Saque
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Resgate suas comissões de afiliado direto para sua conta bancária via PIX de forma rápida.
          </p>
        </div>
      </div>

      {sucesso && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">Saque solicitado com sucesso!</p>
            <p className="text-xs text-green-700 mt-0.5">As comissões serão creditadas via PIX na sua conta bancária em até 2 horas úteis.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Formulário de Saque */}
        <form onSubmit={handleWithdraw} className="bg-white p-6 lg:p-8 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-6 lg:col-span-7 h-fit">
          <h3 className="text-lg font-bold text-[#0F3D2E] border-b border-gray-100 pb-3 flex items-center gap-2">
            <Landmark className="w-5 h-5" /> Nova Transferência PIX
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tipo de Chave</label>
              <select 
                value={pixType} 
                onChange={(e) => setPixType(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm bg-white"
              >
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
                <option value="email">Email</option>
                <option value="phone">Telefone / Celular</option>
                <option value="random">Chave Aleatória (EVP)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Chave PIX</label>
              <input 
                type="text" 
                required
                value={pixKey} 
                onChange={(e) => setPixKey(e.target.value)}
                placeholder={pixType === 'cpf' ? '000.000.000-00' : 'Sua chave aqui...'}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Valor do Resgate (R$)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 font-bold text-sm">
                R$
              </div>
              <input 
                type="number" 
                required
                step="0.01"
                min="20"
                max={availableBalance}
                value={valorSaque}
                onChange={(e) => setValorSaque(e.target.value)}
                placeholder="0,00"
                className="w-full pl-10 pr-20 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] font-bold text-lg text-[#0F3D2E]"
              />
              <button 
                type="button"
                onClick={() => setValorSaque(availableBalance.toFixed(2))}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs font-bold text-[#B8860B] hover:text-[#916a08] transition-colors"
              >
                Sacar Tudo
              </button>
            </div>
            <span className="text-[11px] text-gray-400 block">Tarifa de saque: Grátis • Limite mínimo: R$ 20,00</span>
          </div>

          <button 
            type="submit"
            disabled={solicitando}
            className="w-full flex justify-center items-center gap-2 px-8 py-4 bg-[#0F3D2E] text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[#0B2E23] transition-colors shadow-md disabled:opacity-50"
          >
            {solicitando ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Processando PIX...
              </>
            ) : 'Solicitar Resgate'}
          </button>
        </form>

        {/* Saldos e Histórico */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card de Saldos */}
          <div className="bg-[#0F3D2E] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Disponível para Saque</p>
            <p className="text-4xl font-black text-[#E5C384]">R$ {availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            
            <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-6">
              <div>
                <p className="text-[9px] uppercase tracking-wider opacity-60">A Liberar (30d)</p>
                <p className="text-base font-bold">R$ 1.840,00</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider opacity-60">Total Pago</p>
                <p className="text-base font-bold">R$ 2.250,00</p>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-6 -translate-y-6"></div>
          </div>

          {/* Histórico Recente */}
          <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-4">
            <h4 className="font-bold text-[#1A1A1A] border-b border-gray-50 pb-2 text-sm">Resgates Recentes</h4>
            <div className="space-y-3">
              {saquesAntigos.map((saque) => (
                <div key={saque.id} className="flex justify-between items-center text-xs py-1 border-b border-gray-50 last:border-0 last:pb-0">
                  <div>
                    <p className="font-bold text-[#1A1A1A]">{saque.banco}</p>
                    <p className="text-gray-400 font-mono text-[10px] mt-0.5">{saque.id} • {saque.data}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">R$ {saque.valor.toFixed(2)}</p>
                    <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Pago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
