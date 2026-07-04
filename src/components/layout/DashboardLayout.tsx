import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  ShoppingCart, 
  Ticket, 
  Users, 
  FileText, 
  Link as LinkIcon, 
  QrCode, 
  FolderOpen, 
  DollarSign, 
  MousePointerClick, 
  TrendingUp, 
  Wallet, 
  BookOpen, 
  Download, 
  PlaySquare, 
  Smartphone, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

type NavItem = {
  label: string;
  path: string;
  icon: ReactNode;
};

type RoleNav = {
  [key: string]: {
    title: string;
    items: NavItem[];
  };
};

const navigation: RoleNav = {
  produtor: {
    title: 'Produtor',
    items: [
      { label: 'Dashboard', path: '/produtor/dashboard', icon: <LayoutDashboard size={20} /> },
      { label: 'Produtos', path: '/produtor/produtos', icon: <Package size={20} /> },
      { label: 'Criar Produto', path: '/produtor/criar-produto', icon: <PlusCircle size={20} /> },
      { label: 'Checkout', path: '/produtor/checkout', icon: <ShoppingCart size={20} /> },
      { label: 'Cupons', path: '/produtor/cupons', icon: <Ticket size={20} /> },
      { label: 'Assinaturas', path: '/produtor/assinaturas', icon: <PlaySquare size={20} /> },
      { label: 'Clientes', path: '/produtor/clientes', icon: <Users size={20} /> },
      { label: 'Pedidos', path: '/produtor/pedidos', icon: <FileText size={20} /> },
      { label: 'Relatórios', path: '/produtor/relatorios', icon: <TrendingUp size={20} /> },
    ]
  },
  afiliado: {
    title: 'Afiliado',
    items: [
      { label: 'Dashboard', path: '/afiliado/dashboard', icon: <LayoutDashboard size={20} /> },
      { label: 'Meus Links', path: '/afiliado/meus-links', icon: <LinkIcon size={20} /> },
      { label: 'QR Code', path: '/afiliado/qr-code', icon: <QrCode size={20} /> },
      { label: 'Materiais', path: '/afiliado/materiais', icon: <FolderOpen size={20} /> },
      { label: 'Vendas', path: '/afiliado/vendas', icon: <DollarSign size={20} /> },
      { label: 'Cliques', path: '/afiliado/cliques', icon: <MousePointerClick size={20} /> },
      { label: 'Conversão', path: '/afiliado/conversao', icon: <TrendingUp size={20} /> },
      { label: 'Saques', path: '/afiliado/saques', icon: <Wallet size={20} /> },
    ]
  },
  cliente: {
    title: 'Cliente',
    items: [
      { label: 'Minha Biblioteca', path: '/cliente/biblioteca', icon: <BookOpen size={20} /> },
      { label: 'Downloads', path: '/cliente/downloads', icon: <Download size={20} /> },
      { label: 'Cursos', path: '/cliente/cursos', icon: <PlaySquare size={20} /> },
      { label: 'Aplicativos', path: '/cliente/aplicativos', icon: <Smartphone size={20} /> },
      { label: 'Assinaturas', path: '/cliente/assinaturas', icon: <Ticket size={20} /> },
    ]
  },
  admin: {
    title: 'Administrador',
    items: [
      { label: 'Usuários', path: '/admin/usuarios', icon: <Users size={20} /> },
      { label: 'Produtos', path: '/admin/produtos', icon: <Package size={20} /> },
      { label: 'Financeiro', path: '/admin/financeiro', icon: <DollarSign size={20} /> },
      { label: 'Comissões', path: '/admin/comissoes', icon: <Wallet size={20} /> },
      { label: 'Configurações', path: '/admin/configuracoes', icon: <Settings size={20} /> },
    ]
  }
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  
  // Determine current role based on path
  const currentRole = location.pathname.split('/')[1];
  const navContent = navigation[currentRole] || navigation.produtor; // Default to produtor for now

  // Select first 4 items for bottom navigation
  const primaryNavItems = navContent.items.slice(0, 4);
  const secondaryNavItems = navContent.items.slice(4);

  // Available roles for switcher
  const availableRoles = [
    { name: 'Produtor', path: '/produtor/dashboard', roleId: 'produtor' },
    { name: 'Afiliado', path: '/afiliado/dashboard', roleId: 'afiliado' },
    { name: 'Cliente', path: '/cliente/biblioteca', roleId: 'cliente' },
    { name: 'Admin', path: '/admin/dashboard', roleId: 'admin' },
  ];

  return (
    <div className="flex w-full h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans overflow-hidden">
      {/* Mobile sidebar overlay (for side drawer if still accessed, or the bottom sheet) */}
      {(isMobileOpen || isMoreMenuOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
          onClick={() => {
            setIsMobileOpen(false);
            setIsMoreMenuOpen(false);
          }}
        ></div>
      )}

      {/* Sidebar for Desktop */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-[#0F3D2E] flex flex-col border-r border-[#E5E7EB] transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 border-b border-[#ffffff10] flex items-center justify-between">
          <Link to="/painel" className="flex flex-col">
            <h1 className="text-2xl font-serif font-bold text-[#E5C384] tracking-tight leading-tight uppercase">Plataforma<br/>Milionária</h1>
            <span className="text-[10px] text-[#A7C4BC] tracking-[0.2em] uppercase font-bold">Cristã</span>
          </Link>
          <button className="lg:hidden" onClick={() => setIsMobileOpen(false)}>
            <X size={24} className="text-[#A7C4BC]" />
          </button>
        </div>
        
        <div className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
          <div>
            <p className="text-[10px] text-[#A7C4BC] uppercase tracking-widest mb-4 opacity-50 px-4">
              {navContent.title}
            </p>
            <nav className="space-y-1">
              {navContent.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                      ${isActive 
                        ? 'bg-[#ffffff10] text-[#E5C384]' 
                        : 'text-[#E8F3F1] hover:bg-[#ffffff05] hover:text-[#E5C384]'
                      }
                    `}
                  >
                    <span className={`mr-3 ${isActive ? 'text-[#E5C384]' : 'text-[#E8F3F1] opacity-70'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="p-6 bg-[#0B2E23] text-xs text-[#A7C4BC] flex items-center justify-between">
          <Link to="/login" className="flex items-center hover:text-white transition-colors">
            <LogOut size={16} className="mr-2" />
            <span>Sair</span>
          </Link>
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16 lg:pb-0">
        
        {/* Mobile Header (Sleek and Premium) */}
        <header className="flex items-center justify-between h-16 px-5 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] sticky top-0 z-30 lg:hidden">
          <Link to="/painel" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0F3D2E] flex items-center justify-center font-bold text-[#E5C384] text-xs">
              MC
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-serif font-black text-[#0F3D2E] leading-none uppercase tracking-tight">Plataforma</span>
              <span className="text-[7px] text-[#B8860B] uppercase tracking-widest font-bold">Cristã</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-3 relative">
            {/* Quick Role Switcher Button */}
            <button 
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#0F3D2E]/5 rounded-full text-xs font-bold text-[#0F3D2E] hover:bg-[#0F3D2E]/10 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              {navContent.title}
            </button>

            {isRoleDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsRoleDropdownOpen(false)}></div>
                <div className="absolute right-0 top-10 w-48 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold px-4 py-1.5 border-b border-gray-100">Alternar Perfil</p>
                  {availableRoles.map((role) => (
                    <Link
                      key={role.roleId}
                      to={role.path}
                      onClick={() => setIsRoleDropdownOpen(false)}
                      className={`flex items-center px-4 py-2.5 text-xs font-semibold transition-colors ${
                        currentRole === role.roleId 
                          ? 'text-[#0F3D2E] bg-[#0F3D2E]/5' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {role.name}
                    </Link>
                  ))}
                </div>
              </>
            )}

            <div className="w-8 h-8 rounded-full bg-[#E5C384] border border-[#0F3D2E]/20 flex items-center justify-center font-black text-[10px] text-[#0F3D2E]">
              GS
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex h-20 bg-white border-b border-[#E5E7EB] items-center justify-between px-10">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-[#0F3D2E]">
            <span className="opacity-40">Home</span>
            <span className="opacity-40">/</span>
            <span>{navContent.title}</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button 
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-[#E5E7EB] rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors"
              >
                Perfil: <span className="text-[#0F3D2E]">{navContent.title}</span>
              </button>
              {isRoleDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsRoleDropdownOpen(false)}></div>
                  <div className="absolute right-0 top-10 w-48 bg-white border border-[#E5E7EB] rounded-lg shadow-lg py-1 z-50">
                    {availableRoles.map((role) => (
                      <Link
                        key={role.roleId}
                        to={role.path}
                        onClick={() => setIsRoleDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
                      >
                        {role.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">Pr. Gabriel Santos</p>
              <p className="text-[10px] text-gray-500 uppercase">Administrador Geral</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#E5C384] border-2 border-[#0F3D2E] flex items-center justify-center font-bold text-[#0F3D2E]">
              GS
            </div>
          </div>
        </header>
        
        {/* Main Content Area */}
        <section className="flex-1 overflow-x-hidden overflow-y-auto bg-[#FDFCFB] p-4 lg:p-10">
          {children}
        </section>
        
        {/* Desktop Footer */}
        <footer className="hidden lg:flex h-12 border-t border-[#E5E7EB] px-10 items-center justify-between text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400">
          <span>© 2024 Plataforma Milionária Cristã</span>
          <span>Firebase Active Nodes: 24</span>
          <span>Configurações do Sistema</span>
        </footer>

        {/* Mobile Bottom Navigation (Ultra Premium Glassmorphism) */}
        <nav className="fixed bottom-0 inset-x-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] flex items-center justify-around px-2 z-30 lg:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
          {primaryNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center group"
              >
                <div className={`p-1 rounded-xl transition-all duration-200 ${isActive ? 'text-[#0F3D2E] scale-110' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  {item.icon}
                </div>
                <span className={`text-[9px] font-bold tracking-tight transition-colors duration-200 mt-0.5 ${isActive ? 'text-[#0F3D2E]' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          {/* "Mais" Menu Button */}
          <button
            onClick={() => setIsMoreMenuOpen(true)}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 text-center group"
          >
            <div className="p-1 rounded-xl text-gray-400 group-hover:text-gray-600">
              <Menu size={20} />
            </div>
            <span className="text-[9px] font-bold tracking-tight text-gray-400 mt-0.5">
              Mais
            </span>
          </button>
        </nav>

        {/* Mobile Bottom Sheet (More Menu) */}
        <div className={`
          fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl border-t border-[#E5E7EB] shadow-2xl p-6 transition-transform duration-300 ease-out transform lg:hidden
          ${isMoreMenuOpen ? 'translate-y-0' : 'translate-y-full'}
        `}>
          {/* Notch indicator */}
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"></div>
          
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-serif font-black text-[#0F3D2E]">Menu Geral</h3>
            <button 
              onClick={() => setIsMoreMenuOpen(false)}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto pb-4 no-scrollbar">
            {secondaryNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMoreMenuOpen(false)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 ${
                    isActive 
                      ? 'border-[#0F3D2E] bg-[#0F3D2E]/5 text-[#0F3D2E]' 
                      : 'border-gray-100 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="mb-2 text-[#0F3D2E]/80">
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-center leading-tight">
                    {item.label}
                  </span>
                </Link>
              );
            })}
            
            {/* Direct access to Painel */}
            <Link
              to="/painel"
              onClick={() => setIsMoreMenuOpen(false)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl border border-gray-100 hover:bg-gray-50 text-gray-700"
            >
              <div className="mb-2 text-amber-600">
                <Settings size={20} />
              </div>
              <span className="text-[10px] font-bold text-center leading-tight">
                Trocar Perfil
              </span>
            </Link>

            {/* Logout Option */}
            <Link
              to="/login"
              onClick={() => setIsMoreMenuOpen(false)}
              className="flex flex-col items-center justify-center p-3 rounded-2xl border border-rose-50 bg-rose-50/20 text-rose-600"
            >
              <div className="mb-2">
                <LogOut size={20} />
              </div>
              <span className="text-[10px] font-bold text-center leading-tight">
                Sair da Conta
              </span>
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}
