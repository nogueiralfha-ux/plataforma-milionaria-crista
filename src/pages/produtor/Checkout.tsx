import { Monitor, Smartphone, Settings2, CheckCircle, Video, LayoutTemplate, X, Mail, MessageSquare, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

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

  const handleCheckoutBuy = () => {
    if (!compradorNome || !compradorEmail || !compradorTel) {
      alert('Por favor, preencha todos os campos no formulário para simular a compra!');
      return;
    }

    const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
    const newOrder = {
      id: orderId,
      data: new Date().toLocaleDateString('pt-BR'),
      cliente: compradorNome,
      email: compradorEmail,
      whatsapp: compradorTel,
      produto: 'Método Milionário Cristão',
      valor: 'R$ 97,00',
      metodo: 'PIX',
      status: 'Aprovado'
    };

    // Save order
    const savedOrders = JSON.parse(localStorage.getItem('pedidos_salvos') || '[]');
    localStorage.setItem('pedidos_salvos', JSON.stringify([newOrder, ...savedOrders]));

    // Unlock in client's library
    const unlockedProduct = {
      id: Date.now(),
      nome: 'Método Milionário Cristão',
      preco: 'R$ 97,00',
      videoAulaUrl: 'https://vimeo.com/83918239',
      pdfMaterialNome: 'metodo-milionario-cristao-ebook.pdf',
      dataCompra: new Date().toLocaleDateString('pt-BR')
    };
    const savedLib = JSON.parse(localStorage.getItem('cliente_biblioteca') || '[]');
    localStorage.setItem('cliente_biblioteca', JSON.stringify([unlockedProduct, ...savedLib]));

    setCheckoutSucessoInfo({
      orderId,
      nome: compradorNome,
      email: compradorEmail,
      tel: compradorTel,
      pdf: 'metodo-milionario-cristao-ebook.pdf'
    });

    // Reset inputs
    setCompradorNome('');
    setCompradorEmail('');
    setCompradorTel('');
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

                 {/* Lado Direito: Formulário de Pagamento REAL */}
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
                     
                     <h3 className="font-bold text-[#1A1A1A] border-b border-gray-100 pb-3 pt-2">Pagamento</h3>
                     <div className="flex gap-2">
                       <div className="flex-1 h-12 border-2 border-[#0F3D2E] rounded-lg flex items-center justify-center bg-[#0F3D2E]/5 text-[#0F3D2E] font-bold text-xs">PIX (Imediato)</div>
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
              <h3 className="text-2xl font-serif font-black text-[#0F3D2E]">Pagamento Aprovado!</h3>
              <p className="text-xs text-gray-500 font-mono">ID do Pedido: {checkoutSucessoInfo.orderId}</p>
            </div>

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
