/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Cadastro from './pages/auth/Cadastro';
import RecuperarSenha from './pages/auth/RecuperarSenha';
import PainelPrincipal from './pages/dashboard/PainelPrincipal';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardContent from './pages/dashboard/DashboardContent';
import CriarProduto from './pages/produtor/CriarProduto';
import Checkout from './pages/produtor/Checkout';
import Produtos from './pages/produtor/Produtos';
import MeusLinks from './pages/afiliado/MeusLinks';
import QRCodeAfiliado from './pages/afiliado/QRCodeAfiliado';
import MateriaisDivulgacao from './pages/afiliado/MateriaisDivulgacao';
import HistoricoVendas from './pages/afiliado/HistoricoVendas';
import MetricasCliques from './pages/afiliado/MetricasCliques';
import SolicitarSaque from './pages/afiliado/SolicitarSaque';
import Cupons from './pages/produtor/Cupons';
import Assinaturas from './pages/produtor/Assinaturas';
import Clientes from './pages/produtor/Clientes';
import Pedidos from './pages/produtor/Pedidos';
import Relatorios from './pages/produtor/Relatorios';
import Biblioteca from './pages/cliente/Biblioteca';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminProdutos from './pages/admin/AdminProdutos';
import AdminFinanceiro from './pages/admin/AdminFinanceiro';
import AdminComissoes from './pages/admin/AdminComissoes';
import AdminConfiguracoes from './pages/admin/AdminConfiguracoes';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        
        {/* Public Checkout Link Routes */}
        <Route path="/inv/:slug" element={<Checkout />} />
        <Route path="/p/:slug" element={<Checkout />} />
        <Route path="/c/:slug" element={<Checkout />} />
        
        {/* Role Selector */}
        <Route path="/painel" element={<PainelPrincipal />} />
        
        {/* Produtor Routes */}
        <Route path="/produtor" element={<DashboardLayout><Outlet /></DashboardLayout>}>
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="produtos" element={<Produtos />} />
          <Route path="criar-produto" element={<CriarProduto />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="cupons" element={<Cupons />} />
          <Route path="assinaturas" element={<Assinaturas />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="pedidos" element={<Pedidos />} />
          <Route path="relatorios" element={<Relatorios />} />
        </Route>

        {/* Afiliado Routes */}
        <Route path="/afiliado" element={<DashboardLayout><Outlet /></DashboardLayout>}>
          <Route path="dashboard" element={<DashboardContent />} />
          <Route path="meus-links" element={<MeusLinks />} />
          <Route path="qr-code" element={<QRCodeAfiliado />} />
          <Route path="materiais" element={<MateriaisDivulgacao />} />
          <Route path="vendas" element={<HistoricoVendas />} />
          <Route path="cliques" element={<MetricasCliques />} />
          <Route path="conversao" element={<MetricasCliques />} />
          <Route path="saques" element={<SolicitarSaque />} />
        </Route>

        {/* Cliente Routes */}
        <Route path="/cliente" element={<DashboardLayout><Outlet /></DashboardLayout>}>
          <Route path="biblioteca" element={<Biblioteca />} />
          <Route path="downloads" element={<Biblioteca />} />
          <Route path="cursos" element={<Biblioteca />} />
          <Route path="aplicativos" element={<DashboardContent />} />
          <Route path="assinaturas" element={<DashboardContent />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<DashboardLayout><Outlet /></DashboardLayout>}>
          <Route path="dashboard" element={<AdminFinanceiro />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="produtos" element={<AdminProdutos />} />
          <Route path="financeiro" element={<AdminFinanceiro />} />
          <Route path="comissoes" element={<AdminComissoes />} />
          <Route path="configuracoes" element={<AdminConfiguracoes />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
