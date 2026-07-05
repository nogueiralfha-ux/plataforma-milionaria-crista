import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, MoreVertical, Copy, X, Save, Video, FileText } from 'lucide-react';
import { fetchApi, putApi } from '../../utils/api';


export default function Produtos() {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [produtos, setProdutos] = useState<any[]>([]);

  // Modal edit states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [editNome, setEditNome] = useState('');
  const [editPreco, setEditPreco] = useState('');
  const [editComissao, setEditComissao] = useState('');
  const [editStatus, setEditStatus] = useState('Ativo');
  const [editVideoAulaUrl, setEditVideoAulaUrl] = useState('');
  const [editPdfMaterialNome, setEditPdfMaterialNome] = useState('');
  
  const fetchProdutos = async () => {
    try {
      const data = await fetchApi<any[]>('/api/produtos');
      setProdutos(data);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  };

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleOpenEdit = (produto: any) => {
    setSelectedProduct(produto);
    setEditNome(produto.nome);
    setEditPreco(produto.preco.replace('R$ ', '').replace(',00', '').trim());
    setEditComissao(produto.comissao.replace('%', ''));
    setEditStatus(produto.status);
    setEditVideoAulaUrl(produto.videoAulaUrl || 'https://vimeo.com/83918239');
    setEditPdfMaterialNome(produto.pdfMaterialNome || `${produto.nome.toLowerCase().replace(/\s+/g, '-')}-ebook.pdf`);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      const data = await putApi(`/api/produtos/${selectedProduct.id}`, {
        nome: editNome,
        preco: editPreco,
        comissao: editComissao,
        status: editStatus,
        videoAulaUrl: editVideoAulaUrl,
        pdfMaterialNome: editPdfMaterialNome
      });
      if (data.success) {
        fetchProdutos();
        setIsEditModalOpen(false);
      } else {
        alert('Erro ao atualizar produto.');
      }
    } catch (err) {
      alert('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Meus Produtos
          </h2>
        </div>
        <Link 
          to="/produtor/criar-produto"
          className="flex items-center px-6 py-3 bg-[#E5C384] text-[#0F3D2E] rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-[#D4B373] transition-colors shadow-lg"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Novo Produto
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                <th className="p-4 pl-8">Produto</th>
                <th className="p-4">Preço</th>
                <th className="p-4">Vendas</th>
                <th className="p-4 text-center">Comissão</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Link Afiliados</th>
                <th className="p-4 pr-8 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {produtos.map((produto) => (
                <tr key={produto.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-8">
                    <div className="font-bold text-[#1A1A1A]">{produto.nome}</div>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-600">{produto.preco}</td>
                  <td className="p-4 text-sm font-medium text-gray-600">{produto.vendas}</td>
                  <td className="p-4 text-sm font-black text-[#0F3D2E] text-center bg-[#0F3D2E]/5 rounded-lg border border-[#0F3D2E]/10">{produto.comissao}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      produto.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {produto.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleCopy(produto.linkAfiliado)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#F1F3F2] hover:bg-[#E5E7EB] transition-colors text-xs font-bold text-[#0F3D2E] mx-auto"
                    >
                      {copiedLink === produto.linkAfiliado ? (
                        <span className="text-green-600 font-bold">Copiado!</span>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copiar Convite
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-4 pr-8">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenEdit(produto)}
                        className="p-2 text-gray-400 hover:text-[#0F3D2E] transition-colors rounded-lg hover:bg-gray-100"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[#0F3D2E] transition-colors rounded-lg hover:bg-gray-100">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] max-w-lg w-full p-6 lg:p-8 space-y-6 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-xl font-serif font-black text-[#0F3D2E]">Editar Configurações</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Nome do Produto</label>
                <input 
                  type="text" 
                  required
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Preço (R$)</label>
                  <input 
                    type="number" 
                    required
                    value={editPreco}
                    onChange={(e) => setEditPreco(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Comissão (%)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    max="100"
                    value={editComissao}
                    onChange={(e) => setEditComissao(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm font-bold text-[#0F3D2E]"
                  />
                </div>
              </div>

              {/* Course Content fields */}
              <div className="space-y-4 border-t border-gray-100 pt-4">
                <h4 className="text-xs font-bold text-[#0F3D2E] uppercase tracking-widest">Conteúdo de Curso</h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <Video size={12} /> Link da Vídeo Aula
                    </label>
                    <input 
                      type="text"
                      value={editVideoAulaUrl}
                      onChange={(e) => setEditVideoAulaUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      <FileText size={12} /> Nome do PDF / E-book
                    </label>
                    <input 
                      type="text"
                      value={editPdfMaterialNome}
                      onChange={(e) => setEditPdfMaterialNome(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status do Produto</label>
                <select 
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm bg-white"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>

              <button 
                type="submit"
                className="w-full flex justify-center items-center gap-2 px-6 py-3.5 bg-[#0F3D2E] text-white rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-[#0B2E23] transition-colors shadow-md"
              >
                <Save className="w-4 h-4" />
                Salvar Alterações
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
