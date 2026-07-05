import { Monitor, Smartphone, Settings2, CheckCircle, Video, LayoutTemplate, X, Mail, MessageSquare, ShieldCheck, CreditCard, QrCode, FileText } from 'lucide-react';
import { useState } from 'react';
import { postApi } from '../../utils/api';

export default function Checkout() {
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  
  const [corPrincipal, setCorPrincipal] = useState('#0F3D2E');
  const [corBotao, setCorBotao] = useState('#E5C384');

  // Personalização
  const [videoUrl, setVideoUrl] = useState('');
  const [textoPersuasivo, setTextoPersuasivo] = useState('Faça parte agora mesmo da maior comunidade cristã de empreendedores e transforme seus resultados.');
  const [mostrarDepoimentos, setMostrarDepoimentos] = useState(true);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Checkout Form States
  const [compradorNome, setCompradorNome] = useState('');
  const [compradorEmail, setCompradorEmail] = useState('');
  const [compradorTel, setCompradorTel] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState<'pix' | 'cartao' | 'boleto'>('pix');

  // Card specific states
  const [cartaoNumero, setCartaoNumero] = useState('');
  const [cartaoNome, setCartaoNome] = useState('');
  const [cartaoValidade, setCartaoValidade] = useState('');
  const [cartaoCvv, setCartaoCvv] = useState('');

  const [checkoutSucessoInfo, setCheckoutSucessoInfo] = useState<any>(null);
  
  const handleSave = () => {
    setSalvando(true);
    setSucesso(false);
    
    // Simulate save
    setTimeout(() => {
      setSalvando(false);
      setSucesso(true);
      
      setTimeout(() => {
        setSucesso(false);
      }, 3000);
    }, 1500);
  };

  const handleCheckoutBuy = async () => {
    if (!compradorNome || !compradorEmail || !compradorTel) {
      alert('Por favor, preencha todos os campos no formulário para simular a compra!');
      return;
    }

    if (metodoPagamento === 'cartao' && (!cartaoNumero || !cartaoNome || !cartaoValidade || !cartaoCvv)) {
      alert('Por favor, preencha as informações do cartão de crédito/débito!');
      return;
    }

    const readableMetodo = metodoPagamento === 'pix' ? 'PIX' : metodoPagamento === 'cartao' ? 'Cartão de Crédito/Débito' : 'Boleto Bancário';

    try {
      // 1. Initiate purchase (creates order on backend)
      const payData = await postApi('/api/checkout/pay', {
        compradorNome,
        compradorEmail,
        compradorTel,
        produtoNome: 'Método Milionário Cristão',
        valor: 'R$ 97,00',
        metodo: readableMetodo
      });

      if (payData.success) {
        // If card or PIX, simulate instant webhook approval
        if (metodoPagamento !== 'boleto') {
          const webhookData = await postApi('/api/checkout/webhook', { orderId: payData.orderId });

          if (webhookData.success) {
            setCheckoutSucessoInfo({
              orderId: payData.orderId,
              nome: compradorNome,
              email: webhookData.delivery.email,
              tel: webhookData.delivery.whatsapp,
              pdf: webhookData.delivery.pdf,
              metodo: readableMetodo,
              status: 'Aprovado'
            });
          }
        } else {
          // For boleto, keep it pending and show barcode + simulated settlement trigger
          setCheckoutSucessoInfo({
            orderId: payData.orderId,
            nome: compradorNome,
            email: compradorEmail,
            tel: compradorTel,
            pdf: 'metodo-milionario-cristao-ebook.pdf',
            metodo: readableMetodo,
            status: 'Pendente',
            barcode: '34191.79001 01043.513184 91020.150008 7 98200000009700'
          });
        }
      }

      // Reset inputs
      setCompradorNome('');
      setCompradorEmail('');
      setCompradorTel('');
      setCartaoNumero('');
      setCartaoNome('');
      setCartaoValidade('');
      setCartaoCvv('');
    } catch (err) {
      alert('Erro ao processar pagamento com o servidor.');
    }
  };

  const handleConfirmBoletoPayment = async (orderId: string) => {
    try {
      const data = await postApi('/api/checkout/webhook', { orderId });
      if (data.success) {
        setCheckoutSucessoInfo((prev: any) => ({
          ...prev,
          status: 'Aprovado',
          pdf: data.delivery.pdf
        }));
      }
    } catch (err) {
      alert('Erro ao confirmar compensação do boleto.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
          Customizar Checkout
        </h2>
        <p className="text-sm text-gray-500 max-w-xs sm:text-right">
          Aumente suas conversões personalizando a página de pagamento com vídeos, textos e provas sociais.
        </p>
      </div>
      
      {sucesso && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="font-bold text-sm">Configurações de checkout salvas com sucesso!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor */}
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 space-y-6 lg:col-span-4 h-fit">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-4 mb-6">
            <Settings2 className="w-5 h-5 text-[#0F3D2E]" />
            <h3 className="font-bold text-[#1A1A1A]">Configurações Visuais</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1A1A1A]">Produto</label>
              <select className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384]">
                <option>Método Milionário Cristão</option>
                <option>Jornada da Prosperidade</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1A1A1A]">Cor Principal</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={corPrincipal} 
                    onChange={(e) => setCorPrincipal(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0" 
                  />
                  <span className="text-xs text-gray-500 font-mono uppercase">{corPrincipal}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-[#1A1A1A]">Cor do Botão</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={corBotao}
                    onChange={(e) => setCorBotao(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0" 
                  />
                  <span className="text-xs text-gray-500 font-mono uppercase">{corBotao}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#E5E7EB]">
              <div className="flex items-center gap-2 pb-4 mb-4">
                <LayoutTemplate className="w-5 h-5 text-[#0F3D2E]" />
                <h3 className="font-bold text-[#1A1A1A]">Elementos da Página</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1A1A1A]">URL do Vídeo (YouTube/Vimeo)</label>
                  <input 
                    type="text" 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Ex: https://youtube.com/..."
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384]" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[#1A1A1A]">Texto Persuasivo</label>
                  <textarea 
                    rows={3}
                    value={textoPersuasivo}
                    onChange={(e) => setTextoPersuasivo(e.target.value)}
                    placeholder="Convite final para a compra..."
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384]" 
                  />
                </div>

                <label className="flex items-center gap-3 p-4 border border-[#E5E7EB] rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={mostrarDepoimentos}
                    onChange={(e) => setMostrarDepoimentos(e.target.checked)}
                    className="rounded border-gray-300 text-[#0F3D2E] w-5 h-5 focus:ring-[#E5C384]" 
                  />
                  <span className="text-sm font-bold text-[#1A1A1A]">Mostrar Depoimentos de Alunos</span>
                </label>
              </div>
            </div>

            <button 
              type="button" 
              onClick={handleSave}
              disabled={salvando}
              className="w-full flex justify-center items-center px-8 py-4 bg-[#0F3D2E] text-white rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-[#0B2E23] transition-colors shadow-lg mt-8 disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-8 bg-[#F1F3F2] rounded-2xl border border-[#E5E7EB] p-4 flex flex-col items-center overflow-hidden w-full transition-all duration-300">
           <div className="flex gap-4 mb-6">
             <button 
               onClick={() => setPreviewMode('desktop')}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-sm font-bold border transition-all ${
                 previewMode === 'desktop'
                   ? 'bg-white text-[#0F3D2E] border-[#E5E7EB]'
                   : 'text-gray-500 hover:bg-white/50 border-transparent'
               }`}
             >
               <Monitor className="w-4 h-4" /> Desktop
             </button>
             <button 
               onClick={() => setPreviewMode('mobile')}
               className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-sm font-bold border transition-all ${
                 previewMode === 'mobile'
                   ? 'bg-white text-[#0F3D2E] border-[#E5E7EB]'
                   : 'text-gray-500 hover:bg-white/50 border-transparent'
               }`}
             >
               <Smartphone className="w-4 h-4" /> Mobile
             </button>
           </div>
           
           <div className={`bg-white rounded-xl shadow-xl overflow-hidden min-h-[600px] border border-gray-200 flex flex-col transition-all duration-500 ${
             previewMode === 'mobile' ? 'max-w-[375px] w-full border-8 border-slate-900 rounded-3xl' : 'w-full'
           }`}>
             {/* Fake Checkout Header */}
             <div className="p-8 text-white relative transition-colors duration-300" style={{ backgroundColor: corPrincipal }}>
               <div className="text-xl font-serif font-bold text-[#E5C384]">Plataforma Milionária</div>
               <div className="mt-8 mb-4">
                 <h4 className="text-3xl font-bold">Método Milionário Cristão</h4>
                 <p className="opacity-80 mt-2 text-lg">Acesso vitalício + Todos os Bônus Inclusos</p>
               </div>
             </div>
             
             {/* Fake Checkout Content */}
             <div className="flex-1 bg-gray-50 p-4 lg:p-8">
               <div className={`grid gap-6 lg:gap-8 ${previewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-5'}`}>
                 
                 {/* Lado Esquerdo: Persuasão (Vídeo, Texto, Prova Social) */}
                 <div className={`${previewMode === 'mobile' ? 'col-span-1' : 'lg:col-span-3'} space-y-6 lg:space-y-8`}>
                   
                   {/* Vídeo */}
                   {videoUrl ? (
                     <div className="w-full aspect-video bg-black rounded-xl shadow-lg flex items-center justify-center overflow-hidden relative group">
                       <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop" alt="Thumbnail" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                       <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center z-10 shadow-xl group-hover:scale-110 transition-transform cursor-pointer">
                         <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                       </div>
                     </div>
                   ) : (
                     <div className="w-full aspect-video bg-gray-200 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                       <div className="text-gray-400 flex flex-col items-center gap-2">
                         <Video className="w-8 h-8" />
                         <span className="text-sm font-bold">Sem vídeo configurado</span>
                       </div>
                     </div>
                   )}

                   {/* Texto Persuasivo */}
                   {textoPersuasivo && (
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                       <h3 className="font-bold text-lg text-[#1A1A1A] mb-2">Por que comprar agora?</h3>
                       <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm lg:text-base">{textoPersuasivo}</p>
                     </div>
                   )}

                   {/* Depoimentos */}
                   {mostrarDepoimentos && (
                     <div className="space-y-4">
                       <h3 className="font-bold text-lg text-[#1A1A1A]">O que dizem os alunos</h3>
                       <div className={`grid gap-4 ${previewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
                         <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                           <div className="flex gap-1 text-[#E5C384] mb-3 text-sm">★★★★★</div>
                           <p className="text-xs lg:text-sm text-gray-600 italic mb-4">"Mudou minha vida e minha visão sobre negócios e espiritualidade. Apliquei o método e tripliquei minhas vendas em 2 meses."</p>
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                               <img src="https://i.pravatar.cc/100?img=11" alt="Avatar" className="w-full h-full object-cover" />
                             </div>
                             <p className="text-xs font-bold text-[#1A1A1A]">João Silva</p>
                           </div>
                         </div>
                         <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                           <div className="flex gap-1 text-[#E5C384] mb-3 text-sm">★★★★★</div>
                           <p className="text-xs lg:text-sm text-gray-600 italic mb-4">"Conteúdo denso e direto ao ponto. O suporte da comunidade é incrível e os princípios são bíblicos."</p>
                           <div className="flex items-center gap-3">
                             <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                               <img src="https://i.pravatar.cc/100?img=5" alt="Avatar" className="w-full h-full object-cover" />
                             </div>
                             <p className="text-xs font-bold text-[#1A1A1A]">Maria Costa</p>
                           </div>
                         </div>
                       </div>
                     </div>
                   )}
                 </div>

                 {/* Lado Direito: Formulário de Pagamento */}
                 <div className={previewMode === 'mobile' ? 'col-span-1' : 'lg:col-span-2'}>
                   <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 space-y-5 sticky top-8">
                     <h3 className="font-bold text-[#1A1A1A] border-b border-gray-100 pb-3">Dados Pessoais</h3>
                     <div className="space-y-3">
                       <input 
                         type="text"
                         required
                         value={compradorNome}
                         onChange={(e) => setCompradorNome(e.target.value)}
                         placeholder="Seu Nome Completo"
                         className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#E5C384] focus:outline-none"
                       />
                       <input 
                         type="email"
                         required
                         value={compradorEmail}
                         onChange={(e) => setCompradorEmail(e.target.value)}
                         placeholder="Seu Melhor E-mail"
                         className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#E5C384] focus:outline-none"
                       />
                       <input 
                         type="tel"
                         required
                         value={compradorTel}
                         onChange={(e) => setCompradorTel(e.target.value)}
                         placeholder="WhatsApp (ex: 11999998888)"
                         className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#E5C384] focus:outline-none"
                       />
                     </div>
                     
                     <h3 className="font-bold text-[#1A1A1A] border-b border-gray-100 pb-3 pt-2">Forma de Pagamento</h3>
                     
                     {/* Payment selector tabs */}
                     <div className="grid grid-cols-3 gap-1 bg-gray-100 p-1 rounded-lg">
                       <button 
                         type="button"
                         onClick={() => setMetodoPagamento('pix')}
                         className={`py-1.5 text-[10px] font-bold rounded transition-all ${
                           metodoPagamento === 'pix' ? 'bg-white text-[#0F3D2E] shadow-sm' : 'text-gray-500'
                         }`}
                       >
                         PIX
                       </button>
                       <button 
                         type="button"
                         onClick={() => setMetodoPagamento('cartao')}
                         className={`py-1.5 text-[10px] font-bold rounded transition-all ${
                           metodoPagamento === 'cartao' ? 'bg-white text-[#0F3D2E] shadow-sm' : 'text-gray-500'
                         }`}
                       >
                         Cartão
                       </button>
                       <button 
                         type="button"
                         onClick={() => setMetodoPagamento('boleto')}
                         className={`py-1.5 text-[10px] font-bold rounded transition-all ${
                           metodoPagamento === 'boleto' ? 'bg-white text-[#0F3D2E] shadow-sm' : 'text-gray-500'
                         }`}
                       >
                         Boleto
                       </button>
                     </div>

                     {/* Payment details depending on selected method */}
                     <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs">
                       {metodoPagamento === 'pix' && (
                         <div className="text-center text-gray-500 space-y-1 py-2">
                           <QrCode size={24} className="mx-auto text-gray-400" />
                           <p className="font-bold">PIX Copia e Cola imediato</p>
                           <p className="text-[10px] opacity-80">Liberação do e-book na mesma hora.</p>
                         </div>
                       )}

                       {metodoPagamento === 'cartao' && (
                         <div className="space-y-2 py-1">
                           <div className="flex gap-2 items-center text-[10px] font-bold text-gray-400 mb-1">
                             <CreditCard size={12} />
                             <span>DADOS DO CARTÃO</span>
                           </div>
                           <input 
                             type="text" 
                             required
                             value={cartaoNumero}
                             onChange={(e) => setCartaoNumero(e.target.value)}
                             placeholder="Número do Cartão" 
                             className="w-full px-2.5 py-1.5 border border-gray-200 rounded bg-white text-[11px]" 
                           />
                           <input 
                             type="text" 
                             required
                             value={cartaoNome}
                             onChange={(e) => setCartaoNome(e.target.value)}
                             placeholder="Nome Impresso no Cartão" 
                             className="w-full px-2.5 py-1.5 border border-gray-200 rounded bg-white text-[11px]" 
                           />
                           <div className="grid grid-cols-2 gap-2">
                             <input 
                               type="text" 
                               required
                               value={cartaoValidade}
                               onChange={(e) => setCartaoValidade(e.target.value)}
                               placeholder="MM/AA" 
                               className="w-full px-2.5 py-1.5 border border-gray-200 rounded bg-white text-[11px] text-center" 
                             />
                             <input 
                               type="text" 
                               required
                               value={cartaoCvv}
                               onChange={(e) => setCartaoCvv(e.target.value)}
                               placeholder="CVV" 
                               className="w-full px-2.5 py-1.5 border border-gray-200 rounded bg-white text-[11px] text-center" 
                             />
                           </div>
                         </div>
                       )}

                       {metodoPagamento === 'boleto' && (
                         <div className="text-center text-gray-500 space-y-1 py-2">
                           <FileText size={24} className="mx-auto text-gray-400" />
                           <p className="font-bold">Boleto Bancário à Vista</p>
                           <p className="text-[10px] opacity-80">Acesso enviado por e-mail e liberado após confirmação bancária (24h-48h).</p>
                         </div>
                       )}
                     </div>

                     <div className="pt-4 border-t border-gray-100 mt-6">
                       <div className="flex justify-between items-center mb-4">
                          <span className="font-bold text-gray-600 text-xs">Total a pagar</span>
                          <span className="text-2xl font-black" style={{ color: corPrincipal }}>R$ 97,00</span>
                       </div>
                       <button
                         type="button"
                         onClick={handleCheckoutBuy}
                         className="w-full h-12 rounded-lg flex flex-col items-center justify-center transition-colors duration-300 shadow-lg cursor-pointer border-0" 
                         style={{ backgroundColor: corBotao }}
                       >
                          <span className="font-bold text-[#0F3D2E] uppercase tracking-widest text-xs">Comprar Agora</span>
                       </button>
                     </div>
                   </div>
                 </div>
                 
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Simulador de Envio Automatizado */}
      {checkoutSucessoInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] max-w-lg w-full p-6 lg:p-8 space-y-6 shadow-2xl relative text-center">
            <div className="mx-auto w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-600">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-serif font-black text-[#0F3D2E]">
                {checkoutSucessoInfo.status === 'Aprovado' ? 'Pagamento Aprovado!' : 'Boleto Gerado!'}
              </h3>
              <p className="text-xs text-gray-500 font-mono">ID do Pedido: {checkoutSucessoInfo.orderId}</p>
              <p className="text-xs font-bold text-gray-600 uppercase">Método: {checkoutSucessoInfo.metodo}</p>
            </div>

            {/* Boleto specific actions */}
            {checkoutSucessoInfo.status === 'Pendente' && checkoutSucessoInfo.barcode && (
              <div className="bg-amber-50 p-4 border border-amber-200 rounded-2xl text-left space-y-3">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">CÓDIGO DE BARRAS</span>
                <div className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    readOnly 
                    value={checkoutSucessoInfo.barcode} 
                    className="w-full text-xs font-mono bg-white border border-amber-200 p-2 rounded focus:outline-none" 
                  />
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(checkoutSucessoInfo.barcode);
                      alert('Código de barras copiado!');
                    }}
                    className="px-3 py-2 bg-amber-600 text-white rounded text-xs font-bold"
                  >
                    Copiar
                  </button>
                </div>
                <div className="pt-2 border-t border-amber-200/50">
                  <p className="text-[10px] text-amber-700 leading-relaxed font-bold">Simule a compensação bancária abaixo para processar o webhook imediatamente e testar a liberação do curso:</p>
                  <button
                    onClick={() => handleConfirmBoletoPayment(checkoutSucessoInfo.orderId)}
                    className="w-full mt-2.5 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase rounded-lg transition-colors"
                  >
                    Simular Compensação de Boleto
                  </button>
                </div>
              </div>
            )}

            {checkoutSucessoInfo.status === 'Aprovado' && (
              <div className="bg-gray-50 p-5 rounded-2xl text-left space-y-4 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-b border-gray-200 pb-2">Notificação de Envio Simulado</h4>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">E-mail enviado para: <span className="font-mono font-medium text-gray-500">{checkoutSucessoInfo.email}</span></p>
                    <p className="text-[11px] text-gray-400 mt-1">Anexo enviado: <span className="font-semibold">{checkoutSucessoInfo.pdf}</span></p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg flex-shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">WhatsApp enviado para: <span className="font-mono font-medium text-gray-500">{checkoutSucessoInfo.tel}</span></p>
                    <p className="text-[11px] text-gray-400 mt-1">"Graça e Paz! Seu pagamento do Método Milionário Cristão foi confirmado. Acesse agora pelo link..."</p>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-2">
              <button 
                onClick={() => setCheckoutSucessoInfo(null)}
                className="w-full py-3 bg-[#0F3D2E] hover:bg-[#0B2E23] text-white font-bold rounded-xl text-xs uppercase tracking-widest transition-colors shadow-md"
              >
                Concluir e Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
