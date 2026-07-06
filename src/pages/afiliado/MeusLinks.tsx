import { LinkIcon, Copy, ExternalLink, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchApi } from '../../utils/api';

export default function MeusLinks() {
  const [copiedLink, setCopiedLink] = useState<number | null>(null);
  const [refTag, setRefTag] = useState('AF88291');
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchApi<any[]>('/api/produtos');
        setProdutos(data.filter((p: any) => p.status === 'Ativo'));
      } catch (err) {
        console.error('Erro ao carregar produtos para links:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const links = produtos.flatMap((p: any) => {
    // Extract slug from linkAfiliado or construct it
    const slug = p.linkAfiliado 
      ? p.linkAfiliado.split('/inv/')[1] || p.linkAfiliado.split('/p/')[1] || p.nome.toLowerCase().replace(/\s+/g, '-')
      : p.link_afiliado 
        ? p.link_afiliado.split('/inv/')[1] || p.link_afiliado.split('/p/')[1] || p.nome.toLowerCase().replace(/\s+/g, '-')
        : p.nome.toLowerCase().replace(/\s+/g, '-');
        
    return [
      {
        id: p.id,
        produto: p.nome,
        tipo: 'Página de Vendas / Checkout',
        url: `/inv/${slug}?ref=${refTag}`,
        cliques: (p.vendas || 0) * 4 + 12,
        vendas: p.vendas || 0
      }
    ];
  });

  const handleCopy = (url: string, id: number) => {
    const realLink = url.startsWith('/') 
      ? window.location.origin + url 
      : url.replace('https://plataforma.com', window.location.origin);
      
    navigator.clipboard.writeText(realLink);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Meus Links
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Copie seus links de afiliado exclusivos para divulgar e receber comissões.
          </p>
        </div>
        <button className="flex items-center px-6 py-3 bg-white border border-[#E5E7EB] text-[#0F3D2E] rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-gray-50 transition-colors shadow-sm">
          <Filter className="w-5 h-5 mr-2" />
          Filtrar
        </button>
      </div>

      {/* Personalização do Link */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-sm max-w-md space-y-2">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Identificador de Vendas Personalizado (Ref/Slug)</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={refTag}
            onChange={(e) => setRefTag(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
            placeholder="Ex: antonionogueira"
            className="flex-1 px-4 py-2.5 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm font-bold text-[#0F3D2E]"
          />
        </div>
        <p className="text-[10px] text-gray-400">Personalize o código final dos seus links de afiliado. Substitua os números por uma palavra ou seu nome.</p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Carregando links de produtos...</div>
      ) : links.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Nenhum produto ativo encontrado para afiliação.</div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-[#E5E7EB] text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  <th className="p-4 pl-8">Produto</th>
                  <th className="p-4">Tipo de Link</th>
                  <th className="p-4">Link Único</th>
                  <th className="p-4 text-center">Cliques</th>
                  <th className="p-4 text-center">Vendas</th>
                  <th className="p-4 pr-8 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-8">
                      <div className="font-bold text-[#1A1A1A]">{link.produto}</div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#F1F3F2] text-[#0F3D2E]">
                        {link.tipo}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 max-w-[200px] truncate text-sm text-gray-500 font-mono">
                        <LinkIcon className="w-3 h-3 text-gray-400 flex-shrink-0" />
                        {link.url.startsWith('/') ? window.location.origin + link.url : link.url.replace('https://plataforma.com', window.location.origin)}
                      </div>
                    </td>
                    <td className="p-4 text-center text-sm font-medium text-gray-600">{link.cliques}</td>
                    <td className="p-4 text-center text-sm font-bold text-green-600">{link.vendas}</td>
                    <td className="p-4 pr-8">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleCopy(link.url, link.id)}
                          className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#E5C384]/20 hover:bg-[#E5C384]/30 transition-colors text-xs font-bold text-[#0F3D2E]"
                        >
                          {copiedLink === link.id ? (
                            <span className="text-[#0F3D2E]">Copiado!</span>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copiar
                            </>
                          )}
                        </button>
                        <a href={link.url.startsWith('/') ? window.location.origin + link.url : link.url.replace('https://plataforma.com', window.location.origin)} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-[#0F3D2E] transition-colors rounded-lg hover:bg-gray-100">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
