import { useState, useEffect } from 'react';
import { BookOpen, Video, FileText, Download, Play, CheckCircle } from 'lucide-react';
import { fetchApi } from '../../utils/api';

type Adquirido = {
  id: number;
  nome: string;
  preco: string;
  videoAulaUrl: string;
  pdfMaterialNome: string;
  dataCompra: string;
};

const defaultAdquiridos: Adquirido[] = [
  {
    id: 1,
    nome: 'Método Milionário Cristão',
    preco: 'R$ 997,00',
    videoAulaUrl: 'https://vimeo.com/83918239',
    pdfMaterialNome: 'metodo-milionario-cristao-ebook.pdf',
    dataCompra: '25/06/2026'
  }
];

export default function Biblioteca() {
  const [produtos, setProdutos] = useState<Adquirido[]>([]);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchBiblioteca = async () => {
      try {
        const data = await fetchApi<Adquirido[]>('/api/cliente/biblioteca');
        setProdutos(data);
      } catch (err) {
        console.error('Erro ao buscar biblioteca:', err);
      }
    };
    fetchBiblioteca();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Minha Biblioteca
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Acesse seus cursos, assista às vídeo-aulas e faça o download dos materiais e e-books adquiridos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {produtos.map((produto) => (
          <div key={produto.id} className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden shadow-xs hover:border-[#E5C384] transition-all flex flex-col justify-between">
            
            {/* Header do Curso */}
            <div className="p-6 bg-[#0F3D2E]/5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#0F3D2E] text-[#E5C384] rounded-xl">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm lg:text-base">{produto.nome}</h4>
                  <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-widest mt-0.5">Adquirido em {produto.dataCompra}</span>
                </div>
              </div>
            </div>

            {/* Conteúdos e Ações */}
            <div className="p-6 space-y-4 flex-1">
              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-700">Vídeo-Aula do Método</span>
                </div>
                <button 
                  onClick={() => setActiveVideo(produto.videoAulaUrl)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#0F3D2E] text-white hover:bg-[#0B2E23] rounded-lg text-xs font-bold transition-all shadow-xs"
                >
                  <Play className="w-3 h-3 fill-white" /> Assistir
                </button>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-700 truncate max-w-[160px]">{produto.pdfMaterialNome}</span>
                </div>
                {/* Simulated download */}
                <a 
                  href={`/assets/${produto.pdfMaterialNome}`}
                  download
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Download iniciado: ${produto.pdfMaterialNome}`);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#E5C384]/20 hover:bg-[#E5C384]/30 text-[#0F3D2E] rounded-lg text-xs font-bold transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Baixar PDF
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-[#E5E7EB] max-w-2xl w-full p-4 space-y-4 shadow-2xl relative text-center">
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <h3 className="font-serif font-black text-sm uppercase text-[#0F3D2E]">Sala de Aula Virtual</h3>
              <button 
                onClick={() => setActiveVideo(null)}
                className="px-2.5 py-1 text-xs bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Fechar
              </button>
            </div>
            
            {/* Aspect ratio video placeholder */}
            <div className="w-full aspect-video bg-black rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop" 
                alt="Video poster" 
                className="absolute inset-0 w-full h-full object-cover opacity-45"
              />
              <Play className="w-12 h-12 text-[#E5C384] fill-[#E5C384] animate-pulse cursor-pointer relative z-10" />
              <span className="text-white text-xs font-mono mt-4 relative z-10">Reproduzindo aula de {activeVideo}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
