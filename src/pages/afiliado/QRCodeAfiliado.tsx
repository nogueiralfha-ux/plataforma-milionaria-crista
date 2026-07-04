import { useState } from 'react';
import { QrCode, Download, Copy, Check, Printer } from 'lucide-react';

export default function QRCodeAfiliado() {
  const [selectedProduct, setSelectedProduct] = useState('Método Milionário Cristão');
  const [selectedVerse, setSelectedVerse] = useState('Deuteronômio 8:18 - Pois é Ele quem te dá força para adquirir riqueza.');
  const [bgColor, setBgColor] = useState('#0F3D2E');
  const [textColor, setTextColor] = useState('#E5C384');
  const [copied, setCopied] = useState(false);

  const productLinks: { [key: string]: string } = {
    'Método Milionário Cristão': 'https://plataforma.com/p/mmc?ref=AF88291',
    'Jornada da Prosperidade': 'https://plataforma.com/p/jdp?ref=AF88291',
    'Fórmula das Vendas Bíblicas': 'https://plataforma.com/p/fvb?ref=AF88291'
  };

  const verses = [
    'Deuteronômio 8:18 - Pois é Ele quem te dá força para adquirir riqueza.',
    'Provérbios 10:22 - A bênção do Senhor traz riqueza e não traz dores.',
    'Salmo 112:3 - Na sua casa haverá prosperidade e riqueza.',
    'Josué 1:8 - Então farás prosperar o teu caminho e serás bem-sucedido.'
  ];

  const affiliateLink = productLinks[selectedProduct];
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&color=${bgColor.replace('#', '')}&data=${encodeURIComponent(affiliateLink)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-4">
        <div>
          <h2 className="text-4xl sm:text-6xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Gerador de QR Code
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Crie cartazes físicos ou imagens com seu QR Code de afiliado para divulgar em eventos, igrejas ou redes sociais.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Painel de Configurações */}
        <div className="bg-white p-6 lg:p-8 rounded-2xl border border-[#E5E7EB] shadow-sm space-y-6 lg:col-span-5 h-fit">
          <h3 className="text-lg font-bold text-[#0F3D2E] border-b border-gray-100 pb-3">Personalizar Cartão</h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Produto Relacionado</label>
              <select 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm"
              >
                {Object.keys(productLinks).map((prod) => (
                  <option key={prod} value={prod}>{prod}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Versículo Bíblico de Fundo</label>
              <select 
                value={selectedVerse} 
                onChange={(e) => setSelectedVerse(e.target.value)}
                className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E5C384] text-sm"
              >
                {verses.map((v) => (
                  <option key={v} value={v}>{v.split(' - ')[0]}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cor de Fundo</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0" 
                  />
                  <span className="text-xs text-gray-500 font-mono uppercase">{bgColor}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Cor do Texto</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0 p-0" 
                  />
                  <span className="text-xs text-gray-500 font-mono uppercase">{textColor}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Seu Link de Afiliado</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={affiliateLink}
                  className="flex-1 bg-gray-50 px-3 py-2 border border-[#E5E7EB] rounded-lg text-xs font-mono text-gray-500 focus:outline-none"
                />
                <button 
                  onClick={handleCopy}
                  className="p-2.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-50 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Preview do Cartão */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-gray-50 border border-gray-200 rounded-2xl min-h-[400px]">
          <div 
            id="print-card"
            className="w-full max-w-[340px] rounded-2xl shadow-xl p-8 flex flex-col items-center justify-between text-center min-h-[460px] border transition-all duration-300"
            style={{ backgroundColor: bgColor, color: textColor, borderColor: `${textColor}20` }}
          >
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-[0.3em] uppercase block opacity-85">Indicação Autorizada</span>
              <h4 className="text-xl font-serif font-black uppercase tracking-tight">{selectedProduct}</h4>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100 flex items-center justify-center my-6">
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-44 h-44 object-contain"
              />
            </div>

            <div className="space-y-4">
              <p className="text-xs italic leading-relaxed opacity-90 max-w-[260px] mx-auto">
                "{selectedVerse.split(' - ')[1]}"
              </p>
              <span className="text-[9px] font-bold uppercase tracking-widest block opacity-75">
                Escaneie para adquirir ou conhecer
              </span>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Imprimir Cartão
            </button>
            <a 
              href={qrCodeUrl}
              download={`${selectedProduct.toLowerCase().replace(/\s+/g, '-')}-qrcode.png`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0F3D2E] text-white hover:bg-[#0B2E23] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              Baixar PNG
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
