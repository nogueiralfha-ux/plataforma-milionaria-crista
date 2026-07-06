import { Monitor, Smartphone, Settings2, CheckCircle, Video, LayoutTemplate, X, Mail, MessageSquare, ShieldCheck, CreditCard, QrCode, FileText, Truck, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchApi, postApi } from '../../utils/api';

export default function Checkout() {
  const { slug } = useParams();
  const isPublicCheckout = !!slug;

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
  const [compradorCpf, setCompradorCpf] = useState('');
  const [compradorCep, setCompradorCep] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [valorFrete, setValorFrete] = useState(0);
  const [metodoPagamento, setMetodoPagamento] = useState<'pix' | 'cartao' | 'boleto'>('pix');

  const calcularFrete = (cep: string, qtd: number) => {
    if (qtd >= 3) {
      setValorFrete(0);
      return;
    }
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length < 5) {
      setValorFrete(0);
      return;
    }
    const regiao = parseInt(cleanCep[0]);
    let valor = 19.90;
    if (regiao === 0 || regiao === 1) { // SP
      valor = 12.90;
    } else if (regiao === 2) { // RJ/ES
      valor = 17.90;
    } else if (regiao === 3) { // MG
      valor = 15.90;
    } else if (regiao >= 8) { // Sul
      valor = 22.90;
    } else { // Outras regiões
      valor = 29.90;
    }
    setValorFrete(valor);
  };

  // Card specific states
  const [cartaoNumero, setCartaoNumero] = useState('');
  const [cartaoNome, setCartaoNome] = useState('');
  const [cartaoValidade, setCartaoValidade] = useState('');
  const [cartaoCvv, setCartaoCvv] = useState('');

  const [checkoutSucessoInfo, setCheckoutSucessoInfo] = useState<any>(null);
  
  const [selectedProductData, setSelectedProductData] = useState<any>(null);
  const [produtosList, setProdutosList] = useState<any[]>([]);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        const data = await fetchApi<any[]>('/api/produtos');
        setProdutosList(data);
        if (slug) {
          // Find the product whose linkAfiliado contains the slug
          const found = data.find(p => p.linkAfiliado && p.linkAfiliado.includes(slug));
          if (found) {
            setSelectedProductData(found);
          } else {
            // Try matching prefix
            const slugPrefix = slug.split('-')[0].toLowerCase();
            const foundPrefix = data.find(p => p.nome.toLowerCase().includes(slugPrefix));
            if (foundPrefix) {
              setSelectedProductData(foundPrefix);
            }
          }
        } else if (data.length > 0) {
          setSelectedProductData(data[0]);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do produto para checkout:', err);
      }
    };
    loadProductData();
  }, [slug]);

  const currentProductName = selectedProductData ? selectedProductData.nome : 'Método Milionário Cristão';
  const currentProductPrice = selectedProductData ? selectedProductData.preco : 'R$ 97,00';
  
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
    if (!compradorNome || !compradorEmail || !compradorTel || !compradorCpf) {
      alert('Por favor, preencha todos os campos no formulário, incluindo o CPF/CNPJ!');
      return;
    }

    if (selectedProductData?.tipo === 'Físico' && !compradorCep) {
      alert('Por favor, informe o CEP para entrega do produto físico!');
      return;
    }

    if (metodoPagamento === 'cartao' && (!cartaoNumero || !cartaoNome || !cartaoValidade || !cartaoCvv)) {
      alert('Por favor, preencha as informações do cartão de crédito/débito!');
      return;
    }

    const readableMetodo = metodoPagamento === 'pix' ? 'PIX' : metodoPagamento === 'cartao' ? 'Cartão de Crédito/Débito' : 'Boleto Bancário';
    const precoNumerico = parseFloat(currentProductPrice.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 97.00;
    const subtotal = precoNumerico * quantidade;
    const totalPagar = subtotal + (selectedProductData?.tipo === 'Físico' ? valorFrete : 0);

    try {
      // 1. Initiate purchase (creates order on backend)
      const payData = await postApi('/api/checkout/pay', {
        compradorNome,
        compradorEmail,
        compradorTel,
        compradorCpf,
        produtoNome: `${currentProductName} (${quantidade}x)`,
        valor: `R$ ${totalPagar.toFixed(2).replace('.', ',')}`,
        metodo: readableMetodo
      });

      if (payData.success) {
        if (payData.isRealAsaas) {
          // Real Asaas Integration
          if (metodoPagamento === 'cartao') {
            if (payData.invoiceUrl) {
              window.location.href = payData.invoiceUrl; // Redirect immediately to Asaas card payment page
              return;
            }
          }
          
          // For Pix or other real pending methods
          setCheckoutSucessoInfo({
            orderId: payData.orderId,
            nome: compradorNome,
            email: compradorEmail,
            tel: compradorTel,
            pdf: selectedProductData?.pdfMaterialNome || 'metodo-milionario-cristao-ebook.pdf',
            metodo: readableMetodo,
            status: 'Pendente',
            qrCodeUrl: payData.qrCodeUrl,
            pixKey: payData.pixKey,
            isRealAsaas: true
          });
        } else {
          // Simulated Simulator Mode
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
            // For boleto simulation
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
      }

      // Reset inputs
      setCompradorNome('');
      setCompradorEmail('');
      setCompradorTel('');
      setCompradorCpf('');
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
    <div className={`${isPublicCheckout ? 'p-2 sm:p-6 bg-gray-50 min-h-screen' : 'space-y-8'} animate-in fade-in duration-500 max-w-7xl`}>
      {!isPublicCheckout && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Customizar Checkout
          </h2>
          <p className="text-sm text-gray-500 max-w-xs sm:text-right">
            Aumente suas conversões personalizando a página de pagamento com vídeos, textos e provas sociais.
          </p>
        </div>
      )}
      
      {sucesso && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="font-bold text-sm">Configurações de checkout salvas com sucesso!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor */}
        {!isPublicCheckout && (
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 space-y-6 lg:col-span-4 h-fit">
          <div className="flex items-center gap-2 border-b border-[#E5E7EB] pb-4 mb-6">
            <Settings2 className="w-5 h-5 text-[#0F3D2E]" />
            <h3 className="font-bold text-[#1A1A1A]">Configurações Visuais</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1A1A1A]">Produto</label>
              <select 
                value={selectedProductData?.id || ''}
                onChange={(e) => {
                  const found = produtosList.find(p => p.id === parseInt(e.target.value));
                  if (found) setSelectedProductData(found);
                }}
                className="w-full px-4 py-3 border border-[#E5E7EB] text-[#1A1A1A] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm"
              >
                {produtosList.map(p => (
                  <option key={p.id} value={p.id}>{p.nome}</option>
                ))}
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
        )}

        {/* Preview */}
        <div className={`${isPublicCheckout ? 'lg:col-span-12 max-w-5xl mx-auto' : 'lg:col-span-8'} bg-[#F1F3F2] rounded-2xl border border-[#E5E7EB] p-4 flex flex-col items-center overflow-hidden w-full transition-all duration-300`}>
           {!isPublicCheckout && (
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
           )}
           
           <div className={`bg-white rounded-xl shadow-xl overflow-hidden min-h-[600px] border border-gray-200 flex flex-col transition-all duration-500 ${
             previewMode === 'mobile' ? 'max-w-[375px] w-full border-8 border-slate-900 rounded-3xl' : 'w-full'
           }`}>
             {/* Fake Checkout Header */}
             <div className="p-8 text-white relative transition-colors duration-300" style={{ backgroundColor: corPrincipal }}>
               <div className="text-xl font-serif font-bold text-[#E5C384]">Plataforma Milionária</div>
               <div className="mt-8 mb-4">
                 <h4 className="text-3xl font-bold">{currentProductName}</h4>
                 <p className="opacity-80 mt-2 text-lg">
                   {selectedProductData?.tipo === 'Físico' 
                     ? 'Produto Físico Original • Envio Rápido e Seguro' 
                     : selectedProductData?.tipo === 'Digital'
                       ? 'Download Digital Imediato • Acesso Vitalício'
                       : 'Acesso Vitalício + Todos os Bônus Inclusos'}
                 </p>
               </div>
             </div>
             
             {/* Fake Checkout Content */}
             <div className="flex-1 bg-gray-50 p-4 lg:p-8">
               <div className={`grid gap-6 lg:gap-8 ${previewMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-5'}`}>
                 
                 {/* Lado Esquerdo: Persuasão (Vídeo, Texto, Prova Social) */}
                 <div className={`${previewMode === 'mobile' ? 'col-span-1' : 'lg:col-span-3'} space-y-6 lg:space-y-8`}>
                   
                   {/* Mídia Dinâmica dependendo do tipo de produto */}
                   {selectedProductData?.tipo === 'Físico' ? (
                     <div className="w-full p-6 text-white rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition-colors duration-300" style={{ backgroundColor: corPrincipal }}>
                       <Truck className="w-12 h-12 text-[#E5C384] mb-3 animate-bounce" />
                       <h4 className="font-bold text-lg text-[#E5C384]">Entrega Física com Frete Rápido</h4>
                       <p className="text-xs text-gray-200 mt-1 max-w-sm">Você receberá o produto no seu endereço de entrega informado abaixo. Código de rastreio dos Correios ou Transportadora enviado via WhatsApp.</p>
                       <span className="mt-4 px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#E5C384]">Envio Seguro & Rastreável</span>
                     </div>
                   ) : selectedProductData?.tipo === 'Digital' ? (
                     <div className="w-full p-6 text-white rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition-colors duration-300" style={{ backgroundColor: corPrincipal }}>
                       <FileText className="w-12 h-12 text-[#E5C384] mb-3" />
                       <h4 className="font-bold text-lg text-[#E5C384]">Entrega Digital Instantânea</h4>
                       <p className="text-xs text-gray-200 mt-1 max-w-sm">Liberamos o material digital / PDF imediatamente na sua área de membros após a aprovação do seu pagamento.</p>
                       <span className="mt-4 px-3 py-1 bg-white/10 rounded-full text-[10px] uppercase font-bold tracking-widest text-[#E5C384]">Download Liberado</span>
                     </div>
                   ) : (
                     /* Curso / Outros */
                     videoUrl ? (
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
                     )
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
                        <input 
                          type="text"
                          required
                          value={compradorCpf}
                          onChange={(e) => setCompradorCpf(e.target.value)}
                          placeholder="CPF ou CNPJ (apenas números)"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#E5C384] focus:outline-none"
                        />
                     </div>
                      
                     {selectedProductData?.tipo === 'Físico' && (
                        <div className="space-y-1.5 animate-in fade-in duration-300">
                          <h3 className="font-bold text-[#1A1A1A] border-b border-gray-100 pb-2 pt-2">Quantidade</h3>
                          <select 
                            value={quantidade}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              setQuantidade(val);
                              calcularFrete(compradorCep, val);
                            }}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#E5C384] focus:outline-none bg-white font-bold text-[#0F3D2E]"
                          >
                            <option value={1}>1 unidade (Frete Normal)</option>
                            <option value={2}>2 unidades (Frete Normal)</option>
                            <option value={3}>3 unidades (Frete Grátis 🔥)</option>
                            <option value={4}>4 unidades (Frete Grátis 🔥)</option>
                            <option value={5}>5 unidades (Frete Grátis 🔥)</option>
                          </select>
                          {quantidade >= 3 && (
                            <span className="text-[10px] text-green-600 font-bold block animate-bounce">🔥 Parabéns! Você ganhou Frete Grátis!</span>
                          )}
                        </div>
                      )}

                     {selectedProductData?.tipo === 'Físico' && (
                       <div className="space-y-3 animate-in fade-in duration-300">
                         <h3 className="font-bold text-[#1A1A1A] border-b border-gray-100 pb-3 pt-2 flex items-center gap-1.5">
                           <MapPin className="w-3.5 h-3.5 text-gray-400" /> Endereço de Entrega
                         </h3>
                         <input 
                           type="text"
                           required
                           value={compradorCep}
                           onChange={(e) => {
                             const val = e.target.value;
                             setCompradorCep(val);
                             calcularFrete(val, quantidade);
                           }}
                           placeholder="CEP (ex: 01001-000)"
                           className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#E5C384] focus:outline-none"
                         />
                         <div className="grid grid-cols-3 gap-2">
                           <input 
                             type="text"
                             required
                             placeholder="Rua / Avenida"
                             className="col-span-2 w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#E5C384] focus:outline-none"
                           />
                           <input 
                             type="text"
                             required
                             placeholder="Número"
                             className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#E5C384] focus:outline-none"
                           />
                         </div>
                         <div className="grid grid-cols-2 gap-2">
                           <input 
                             type="text"
                             required
                             placeholder="Cidade"
                             className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#E5C384] focus:outline-none"
                           />
                           <input 
                             type="text"
                             required
                             placeholder="Estado (UF)"
                             className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-[#E5C384] focus:outline-none"
                           />
                         </div>
                       </div>
                     )}
                     
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

                     {(() => {
                        const precoNumerico = parseFloat(currentProductPrice.replace('R$', '').replace(/\./g, '').replace(',', '.').trim()) || 97.00;
                        const subtotal = precoNumerico * quantidade;
                        const totalPagar = subtotal + (selectedProductData?.tipo === 'Físico' ? (quantidade >= 3 ? 0 : valorFrete) : 0);
                        return (
                          <div className="pt-4 border-t border-gray-100 mt-6 space-y-2">
                            <div className="flex justify-between items-center text-xs text-gray-600">
                              <span>Subtotal ({quantidade}x)</span>
                              <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                            {selectedProductData?.tipo === 'Físico' && (
                              <div className="flex justify-between items-center text-xs text-gray-600">
                                <span>Frete</span>
                                {quantidade >= 3 ? (
                                  <span className="text-green-600 font-bold uppercase tracking-wider text-[10px]">Grátis</span>
                                ) : compradorCep.length >= 5 ? (
                                  <span>R$ {valorFrete.toFixed(2).replace('.', ',')}</span>
                                ) : (
                                  <span className="text-gray-400 italic">Informe o CEP</span>
                                )}
                              </div>
                            )}
                            <div className="flex justify-between items-center mb-4 pt-2 border-t border-gray-100">
                               <span className="font-bold text-gray-600 text-xs">Total a pagar</span>
                               <span className="text-2xl font-black" style={{ color: corPrincipal }}>
                                 R$ {totalPagar.toFixed(2).replace('.', ',')}
                               </span>
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
                        );
                      })()}
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
                {checkoutSucessoInfo.status === 'Aprovado' 
                  ? 'Pagamento Aprovado!' 
                  : checkoutSucessoInfo.qrCodeUrl 
                    ? 'Aguardando Pagamento PIX' 
                    : 'Boleto Gerado!'}
              </h3>
              <p className="text-xs text-gray-500 font-mono">ID do Pedido: {checkoutSucessoInfo.orderId}</p>
              <p className="text-xs font-bold text-gray-600 uppercase">Método: {checkoutSucessoInfo.metodo}</p>
            </div>

            {/* Real Asaas PIX details */}
            {checkoutSucessoInfo.status === 'Pendente' && checkoutSucessoInfo.qrCodeUrl && (
              <div className="bg-emerald-50 p-5 border border-emerald-200 rounded-3xl text-left space-y-4">
                <span className="text-[10px] font-bold text-[#0F3D2E] uppercase block tracking-wider text-center">ESCANEIE O QR CODE PARA PAGAR</span>
                
                <div className="mx-auto w-48 h-48 bg-white p-2 rounded-xl border border-emerald-100 shadow-sm flex items-center justify-center">
                  <img src={checkoutSucessoInfo.qrCodeUrl} alt="QR Code PIX" className="w-full h-full object-contain" />
                </div>

                {checkoutSucessoInfo.pixKey && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase block">PIX Copia e Cola</span>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        readOnly 
                        value={checkoutSucessoInfo.pixKey} 
                        className="w-full text-xs font-mono bg-white border border-emerald-100 p-2.5 rounded-lg focus:outline-none text-gray-600 truncate" 
                      />
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(checkoutSucessoInfo.pixKey);
                          alert('Cópia do PIX realizada!');
                        }}
                        className="px-4 py-2 bg-[#0F3D2E] text-white rounded-lg text-xs font-bold whitespace-nowrap hover:bg-[#0B2E23] transition-colors"
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="pt-2 border-t border-emerald-200/50">
                  <p className="text-[10px] text-emerald-800 leading-relaxed text-center font-bold">Após efetuar o pagamento do PIX, clique no botão abaixo para verificar a liberação automática do seu acesso.</p>
                  <button
                    onClick={async () => {
                      try {
                        const statusData = await fetchApi<{ success: boolean; status: string }>(`/api/checkout/status/${checkoutSucessoInfo.orderId}`);
                        if (statusData.success && statusData.status === 'Aprovado') {
                          setCheckoutSucessoInfo((prev: any) => ({
                            ...prev,
                            status: 'Aprovado'
                          }));
                          alert('Pagamento confirmado com sucesso! Seu acesso já está liberado na biblioteca.');
                        } else {
                          alert('Aguardando confirmação de pagamento do PIX. Pode levar até 1 minuto após o pagamento.');
                        }
                      } catch (e) {
                        alert('Erro ao consultar status do pagamento.');
                      }
                    }}
                    className="w-full mt-2.5 py-2.5 bg-[#0F3D2E] hover:bg-[#0B2E23] text-white font-bold text-xs uppercase rounded-xl transition-colors shadow-sm"
                  >
                    Verificar Confirmação de Pagamento
                  </button>
                </div>
              </div>
            )}

            {/* Boleto specific actions */}
            {checkoutSucessoInfo.status === 'Pendente' && !checkoutSucessoInfo.qrCodeUrl && checkoutSucessoInfo.barcode && (
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
