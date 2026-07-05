import React, { useState, useRef } from 'react';
import { Save, Image as ImageIcon, CheckCircle, X, Video, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../../utils/api';


export default function CriarProduto() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [comissao, setComissao] = useState('');
  const [imagem, setImagem] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  // New fields for course content delivery
  const [videoAulaUrl, setVideoAulaUrl] = useState('');
  const [pdfMaterialNome, setPdfMaterialNome] = useState('');

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagem(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removerImagem = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagem(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !preco) return;
    
    setSalvando(true);
    
    try {
      const data = await postApi('/api/produtos', { nome, preco, comissao, videoAulaUrl, pdfMaterialNome });
      if (data.success) {
        setSalvando(false);
        setSucesso(true);
        setTimeout(() => {
          navigate('/produtor/produtos');
        }, 2000);
      } else {
        setSalvando(false);
        alert('Erro ao cadastrar produto.');
      }
    } catch (err) {
      setSalvando(false);
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
          Novo Produto
        </h2>
        <p className="text-sm text-gray-500 max-w-xs sm:text-right">
          Cadastre seu produto, defina comissões e disponibilize para milhares de afiliados.
        </p>
      </div>

      {sucesso && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="font-bold text-sm">Produto e Materiais salvos com sucesso! Redirecionando...</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-[#1A1A1A]">Nome do Produto *</label>
              <input 
                type="text" 
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384]" 
                placeholder="Ex: Método Milionário Cristão" 
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-[#1A1A1A]">Descrição</label>
              <textarea 
                rows={3} 
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384]" 
                placeholder="Descreva os benefícios e o que o aluno vai aprender..."
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1A1A1A]">Preço de Venda (R$) *</label>
              <input 
                type="number" 
                required
                min="0"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384]" 
                placeholder="97.00" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1A1A1A]">Comissão do Afiliado (%)</label>
              <input 
                type="number" 
                min="0"
                max="100"
                value={comissao}
                onChange={(e) => setComissao(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384]" 
                placeholder="50" 
              />
            </div>

            {/* Conteúdos e Materiais Anexados */}
            <div className="space-y-4 md:col-span-2 border-t border-gray-100 pt-6 mt-2">
              <h3 className="font-bold text-lg text-[#0F3D2E]">Conteúdo e Entrega Automática</h3>
              <p className="text-xs text-gray-400">Insira as URLs dos vídeos e o nome dos arquivos que serão entregues por e-mail/WhatsApp imediatamente após a compra.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-gray-400" /> URL da Vídeo-Aula (Vimeo/YouTube)
                  </label>
                  <input 
                    type="text" 
                    value={videoAulaUrl}
                    onChange={(e) => setVideoAulaUrl(e.target.value)}
                    placeholder="Ex: https://vimeo.com/83918239"
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm" 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-gray-400" /> Nome do E-book / PDF a Entregar
                  </label>
                  <input 
                    type="text" 
                    value={pdfMaterialNome}
                    onChange={(e) => setPdfMaterialNome(e.target.value)}
                    placeholder="Ex: e-book-sabedoria-financeira.pdf"
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm" 
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-[#1A1A1A]">Imagem de Capa</label>
              <div 
                onClick={handleImageClick}
                className="border-2 border-dashed border-[#E5E7EB] rounded-xl p-8 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative overflow-hidden min-h-[160px]"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/png, image/jpeg, image/jpg" 
                  className="hidden" 
                />
                
                {imagem ? (
                  <>
                    <img src={imagem} alt="Capa do Produto" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button 
                        type="button"
                        onClick={removerImagem}
                        className="p-2 bg-white text-red-600 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-10 h-10 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500 font-bold mb-1">Clique para fazer upload</p>
                    <p className="text-xs text-gray-400 uppercase tracking-widest">PNG, JPG até 5MB</p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E5E7EB] flex justify-end">
            <button 
              type="submit" 
              disabled={salvando || sucesso}
              className="flex items-center px-8 py-3 bg-[#0F3D2E] text-white rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-[#0B2E23] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {salvando ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Salvando...
                </span>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Produto e Conteúdos
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
