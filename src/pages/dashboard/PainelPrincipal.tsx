import { Link } from 'react-router-dom';
import { Package, MousePointerClick, BookOpen, ShieldAlert } from 'lucide-react';

export default function PainelPrincipal() {
  const roles = [
    {
      id: 'produtor',
      title: 'Produtor',
      description: 'Gerencie seus produtos, vendas e alunos.',
      icon: <Package className="h-8 w-8 text-[#0F3D2E]" />,
      path: '/produtor/dashboard',
      color: 'bg-white border-[#E5E7EB] hover:border-[#0F3D2E] hover:shadow-lg'
    },
    {
      id: 'afiliado',
      title: 'Afiliado',
      description: 'Acesse seus links, materiais e comissões.',
      icon: <MousePointerClick className="h-8 w-8 text-[#0F3D2E]" />,
      path: '/afiliado/dashboard',
      color: 'bg-white border-[#E5E7EB] hover:border-[#0F3D2E] hover:shadow-lg'
    },
    {
      id: 'cliente',
      title: 'Cliente',
      description: 'Acesse sua biblioteca, cursos e downloads.',
      icon: <BookOpen className="h-8 w-8 text-[#0F3D2E]" />,
      path: '/cliente/biblioteca',
      color: 'bg-white border-[#E5E7EB] hover:border-[#0F3D2E] hover:shadow-lg'
    },
    {
      id: 'admin',
      title: 'Administrador',
      description: 'Gestão geral da plataforma e finanças.',
      icon: <ShieldAlert className="h-8 w-8 text-[#E5C384]" />,
      path: '/admin/dashboard',
      color: 'bg-[#0F3D2E] text-white border-[#0F3D2E] hover:bg-[#0B2E23] hover:shadow-lg'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans text-[#1A1A1A] py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-5xl md:text-7xl font-serif font-black italic tracking-tighter text-[#0F3D2E] leading-none">
            Bem-vindo
          </h2>
          <p className="text-sm uppercase tracking-widest text-gray-500 font-bold">
            Selecione seu perfil de acesso
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {roles.map((role) => (
            <Link
              key={role.id}
              to={role.path}
              className={`block p-8 border rounded-2xl transition-all duration-300 transform hover:-translate-y-2 ${role.color} group`}
            >
              <div className="flex items-start space-x-6">
                <div className={`flex-shrink-0 p-4 rounded-xl transition-colors ${role.id === 'admin' ? 'bg-[#ffffff10]' : 'bg-[#FDFCFB] border border-[#E5E7EB] group-hover:bg-[#E5C384]/10 group-hover:border-[#E5C384]'}`}>
                  {role.icon}
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${role.id === 'admin' ? 'text-white' : 'text-[#0F3D2E]'}`}>{role.title}</h3>
                  <p className={`mt-2 text-sm leading-relaxed ${role.id === 'admin' ? 'text-[#A7C4BC]' : 'text-gray-500'}`}>{role.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
