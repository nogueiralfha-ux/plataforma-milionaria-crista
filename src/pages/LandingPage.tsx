import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-[#1A1A1A]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center flex-col items-start">
              <span className="text-2xl font-serif font-bold text-[#0F3D2E] tracking-tight leading-tight uppercase">Plataforma Milionária</span>
              <span className="text-[10px] text-gray-500 tracking-[0.2em] uppercase font-bold">Cristã</span>
            </div>
            <div className="flex space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-[#0F3D2E] px-3 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-colors">
                Login
              </Link>
              <Link to="/cadastro" className="bg-[#0F3D2E] text-white hover:bg-[#0B2E23] px-6 py-2 rounded-md text-sm font-bold uppercase tracking-widest transition-colors shadow-lg">
                Cadastre-se
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl tracking-tighter font-serif font-black italic text-[#0F3D2E] sm:text-6xl md:text-8xl leading-none">
              <span className="block">Transforme seu</span>
              <span className="block text-[#B8860B]">conhecimento</span>
            </h1>
            <p className="mt-8 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:text-xl md:max-w-3xl">
              A plataforma definitiva para produtores, afiliados e clientes. Crie, venda e consuma conteúdos com valores que importam.
            </p>
            <div className="mt-10 max-w-md mx-auto sm:flex sm:justify-center">
              <div className="rounded-md">
                <Link to="/cadastro" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold uppercase tracking-widest rounded-md text-[#0F3D2E] bg-[#E5C384] hover:bg-[#D4B373] md:py-4 md:text-lg px-10 shadow-lg">
                  Começar Agora
                </Link>
              </div>
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3">
                <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-[#E5E7EB] text-base font-bold uppercase tracking-widest rounded-md text-[#0F3D2E] bg-white hover:bg-gray-50 md:py-4 md:text-lg px-10 shadow-sm">
                  Já tenho conta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
