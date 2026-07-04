import { useState } from 'react';
import { Video, FileText, Download, Copy, Check, Eye } from 'lucide-react';

export default function MateriaisDivulgacao() {
  const [copiedScriptId, setCopiedScriptId] = useState<number | null>(null);

  const videos = [
    {
      id: 1,
      title: 'UGC Vídeo - Ganho de Escala',
      description: 'Vídeo estilo depoimento orgânico focado nos primeiros R$ 10.000 faturados na plataforma.',
      fileName: '“Crie_um_vídeo_estilo_UGC_onde.mp4',
      size: '2.5 MB'
    },
    {
      id: 2,
      title: 'UGC Vídeo - Liberdade e Família',
      description: 'Apresentação estilo UGC ligando negócios digitais com valores familiares e princípios cristãos.',
      fileName: '“Crie_um_vídeo_estilo_UGC_onde (1).mp4',
      size: '2.6 MB'
    }
  ];

  const scripts = [
    {
      id: 1,
      hook: 'Gancho: "O segredo que nunca te contaram sobre Provérbios e Finanças..."',
      copy: 'Você já percebeu que a Bíblia fala mais sobre dinheiro do que sobre céu e inferno? Pois é. Descobri um ecossistema cristão que me ensinou a aplicar a sabedoria de Salomão nos meus negócios digitais. Em menos de 30 dias eu saí do zero e faturei minhas primeiras comissões. Clique no link e conheça o Método Milionário Cristão!'
    },
    {
      id: 2,
      hook: 'Gancho: "Trabalhando em casa e honrando a Deus..."',
      copy: 'Cansado de promessas de dinheiro fácil que não alinham com seus valores? A Plataforma Milionária Cristã é o único lugar onde você aprende marketing de afiliados de forma íntegra, transparente e baseada em princípios eternos. Mude a realidade financeira da sua família hoje mesmo!'
    }
  ];

  const handleCopyScript = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptId(id);
    setTimeout(() => setCopiedScriptId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Materiais de Divulgação
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Acesse criativos UGC de alta conversão, modelos de copys e scripts validados para acelerar suas vendas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Videos UGC Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Video className="w-5 h-5 text-[#0F3D2E]" />
            <h3 className="font-bold text-lg text-[#1A1A1A]">Vídeos UGC Recentes</h3>
          </div>

          <div className="space-y-4">
            {videos.map((vid) => (
              <div key={vid.id} className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between gap-4 hover:border-[#E5C384] transition-all">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#0F3D2E]/5 rounded-xl text-[#0F3D2E] flex-shrink-0">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1a1a1a] text-sm lg:text-base">{vid.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{vid.description}</p>
                    <span className="inline-block text-[10px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded mt-2">{vid.size} • MP4</span>
                  </div>
                </div>
                
                <div className="flex gap-2.5 border-t border-gray-50 pt-4">
                  {/* We can point download button to root server or a dummy download */}
                  <a 
                    href={`/${vid.fileName}`} 
                    download 
                    className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-[#0F3D2E] text-white hover:bg-[#0B2E23] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Baixar Vídeo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Copy / Scripts Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <FileText className="w-5 h-5 text-[#0F3D2E]" />
            <h3 className="font-bold text-lg text-[#1A1A1A]">Scripts e Copys Validadas</h3>
          </div>

          <div className="space-y-4">
            {scripts.map((scr) => (
              <div key={scr.id} className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4 hover:border-[#E5C384] transition-all">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#B8860B] uppercase tracking-widest block">{scr.hook}</span>
                  <p className="text-xs lg:text-sm text-gray-600 leading-relaxed font-serif italic">
                    "{scr.copy}"
                  </p>
                </div>
                
                <button 
                  onClick={() => handleCopyScript(scr.copy, scr.id)}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#0F3D2E]/5 hover:bg-[#0F3D2E]/10 text-[#0F3D2E] font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                >
                  {copiedScriptId === scr.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copiar Copy
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
