import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import * as database from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'plataforma-milionaria-crista-secret-key';

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Database connection and schema
database.initDb().catch(err => {
  console.error('[DB] Falha crítica ao inicializar PostgreSQL:', err);
});

app.use(cors());
app.use(express.json());

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// 1. Auth API
app.post('/api/auth/register', async (req, res) => {
  const { nome, email, password, role } = req.body;
  if (!nome || !email || !password || !role) {
    return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios.' });
  }

  const users = await database.getUsers();
  const userExists = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (userExists) {
    return res.status(400).json({ success: false, error: 'Este e-mail já está cadastrado.' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: Date.now(),
    nome,
    email: email.toLowerCase(),
    password: hashedPassword,
    role, // 'Cliente' | 'Afiliado' | 'Produtor'
    status: 'Ativo'
  };

  await database.saveUser(newUser);

  const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    success: true,
    token,
    user: {
      id: newUser.id,
      nome: newUser.nome,
      email: newUser.email,
      role: newUser.role,
      superAdmin: newUser.email === 'nogueiralfha@gmail.com'
    }
  });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'E-mail e senha são obrigatórios.' });
  }

  // Super Admin absolute fallback (backward compatibility)
  if (email.toLowerCase() === 'nogueiralfha@gmail.com' && password === 'missionario405') {
    const adminUser = {
      email: 'nogueiralfha@gmail.com',
      nome: 'antonio luiz socorro nogueira',
      superAdmin: true,
      role: 'admin'
    };
    const token = jwt.sign({ email: adminUser.email, role: adminUser.role, superAdmin: true }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ success: true, token, user: adminUser });
  }

  const users = await database.getUsers();
  const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user) {
    return res.status(401).json({ success: false, error: 'Usuário não encontrado.' });
  }

  const isValidPassword = user.password 
    ? bcrypt.compareSync(password, user.password)
    : password === '123456'; // Default password for initial seeds

  if (!isValidPassword) {
    return res.status(401).json({ success: false, error: 'Senha incorreta.' });
  }

  if (user.status === 'Pendente') {
    return res.status(403).json({ success: false, error: 'Sua conta está pendente de aprovação.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.role,
      superAdmin: user.email === 'nogueiralfha@gmail.com'
    }
  });
});

// 2. Products API
app.get('/api/produtos', async (req, res) => {
  const produtos = await database.getProdutos();
  res.json(produtos);
});

app.post('/api/produtos', async (req, res) => {
  try {
    const { nome, preco, comissao, videoAulaUrl, pdfMaterialNome, tipo } = req.body;
    if (!nome) {
      return res.status(400).json({ success: false, error: 'Nome do produto é obrigatório.' });
    }
    const cleanPreco = parseFloat(String(preco || '0')) || 0;
    const newProduct = {
      id: Date.now(),
      nome,
      preco: `R$ ${cleanPreco.toFixed(2).replace('.', ',')}`,
      vendas: 0,
      comissao: comissao ? `${comissao}%` : '50%',
      status: 'Ativo',
      linkAfiliado: `https://plataforma.com/inv/${nome.toLowerCase().replace(/\s+/g, '-').substring(0, 10)}-${Math.floor(Math.random() * 10000)}`,
      videoAulaUrl: videoAulaUrl || 'https://vimeo.com/83918239',
      pdfMaterialNome: pdfMaterialNome || `${nome.toLowerCase().replace(/\s+/g, '-')}-ebook.pdf`,
      tipo: tipo || 'Curso'
    };
    await database.saveProduto(newProduct);
    res.json({ success: true, produto: newProduct });
  } catch (error: any) {
    console.error('Erro ao cadastrar produto:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro interno do servidor.' });
  }
});

app.put('/api/produtos/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, preco, comissao, videoAulaUrl, pdfMaterialNome, status, tipo } = req.body;
  const produtos = await database.getProdutos();
  const p = produtos.find((x: any) => x.id === id);
  if (!p) {
    return res.status(404).json({ success: false, error: 'Produto não encontrado.' });
  }
  
  const updatedProduct = {
    ...p,
    nome,
    preco: preco.includes('R$') ? preco : `R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}`,
    comissao: comissao.includes('%') ? comissao : `${comissao}%`,
    status,
    videoAulaUrl,
    pdfMaterialNome,
    tipo: tipo || p.tipo || 'Curso'
  };
  
  await database.saveProduto(updatedProduct);
  res.json({ success: true });
});

app.post('/api/checkout/pay', async (req, res) => {
  const { compradorNome, compradorEmail, compradorTel, compradorCpf, produtoNome, valor, metodo } = req.body;
  
  const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
  const cleanValor = parseFloat(
    String(valor)
      .replace('R$', '')
      .replace(/\./g, '')
      .replace(',', '.')
      .trim()
  ) || 97.00;

  const ASAAS_KEY = process.env.ASAAS_API_KEY;
  let ASAAS_URL = 'https://sandbox.asaas.com/v3';
  if (ASAAS_KEY && (ASAAS_KEY.startsWith('$aact_prod_') || ASAAS_KEY.includes('prod'))) {
    ASAAS_URL = 'https://api.asaas.com/v3';
  }
  if (process.env.ASAAS_API_URL) {
    ASAAS_URL = process.env.ASAAS_API_URL;
  }

  if (ASAAS_KEY) {
    try {
      // 1. Register or get customer
      const customerRes = await fetch(`${ASAAS_URL}/customers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_KEY
        },
        body: JSON.stringify({
          name: compradorNome,
          email: compradorEmail,
          phone: compradorTel,
          cpfCnpj: compradorCpf,
          notificationDisabled: true
        })
      });

      const customerData = await customerRes.json();
      if (!customerRes.ok) {
        throw new Error(customerData.errors?.[0]?.description || 'Erro ao criar cliente no Asaas.');
      }

      const customerId = customerData.id;

      // 2. Create dynamic PIX charge
      const paymentRes = await fetch(`${ASAAS_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': ASAAS_KEY
        },
        body: JSON.stringify({
          customer: customerId,
          billingType: metodo === 'Cartão de Crédito' ? 'CREDIT_CARD' : 'PIX',
          value: cleanValor,
          dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 dias de vencimento
          description: produtoNome,
          externalReference: orderId
        })
      });

      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) {
        throw new Error(paymentData.errors?.[0]?.description || 'Erro ao criar cobrança no Asaas.');
      }

      const paymentId = paymentData.id;

      // 3. Get Pix QR Code or checkout link
      let qrCodeUrl = '';
      let pixKey = '';

      if (metodo !== 'Cartão de Crédito') {
        const pixRes = await fetch(`${ASAAS_URL}/payments/${paymentId}/pixQrCode`, {
          method: 'GET',
          headers: {
            'access_token': ASAAS_KEY
          }
        });

        const pixData = await pixRes.json();
        if (pixRes.ok) {
          qrCodeUrl = pixData.encodedImage ? `data:image/png;base64,${pixData.encodedImage}` : '';
          pixKey = pixData.payload || '';
        }
      } else {
        qrCodeUrl = paymentData.invoiceUrl || ''; // Link da fatura do Asaas para cartão
      }

      // Store transaction in Pending state
      const newOrder = {
        id: orderId,
        asaasPaymentId: paymentId,
        data: new Date().toLocaleDateString('pt-BR'),
        cliente: compradorNome,
        email: compradorEmail,
        whatsapp: compradorTel,
        produto: produtoNome || 'Método Milionário Cristão',
        valor: `R$ ${cleanValor.toFixed(2).replace('.', ',')}`,
        metodo: metodo || 'PIX',
        status: 'Pendente'
      };
      await database.savePedido(newOrder);

      return res.json({
        success: true,
        orderId,
        asaasPaymentId: paymentId,
        qrCodeUrl: qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=asaas-payload-${orderId}`,
        pixKey: pixKey || `00020126580014br.gov.bcb.pix0136asaas-key-${orderId}`,
        invoiceUrl: paymentData.invoiceUrl,
        isRealAsaas: true
      });

    } catch (error: any) {
      console.error('[ASAAS ERROR]', error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // Fallback to simulator
  const orderIdSimulated = orderId;
  const asaasPixQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=asaas-payload-${orderIdSimulated}`;

  const newOrder = {
    id: orderIdSimulated,
    asaasPaymentId: `sim-${orderIdSimulated}`,
    data: new Date().toLocaleDateString('pt-BR'),
    cliente: compradorNome,
    email: compradorEmail,
    whatsapp: compradorTel,
    produto: produtoNome || 'Método Milionário Cristão',
    valor: `R$ ${cleanValor.toFixed(2).replace('.', ',')}`,
    metodo: metodo || 'PIX',
    status: 'Pendente'
  };
  await database.savePedido(newOrder);

  res.json({
    success: true,
    orderId: orderIdSimulated,
    qrCodeUrl: asaasPixQrCode,
    pixKey: `00020126580014br.gov.bcb.pix0136asaas-key-${orderIdSimulated}520400005303986540497.005802BR5915PlataformaMC6009SAOPAULO62070503***`,
    isRealAsaas: false
  });
});

app.get('/api/checkout/status/:orderId', async (req, res) => {
  const orderId = req.params.orderId;
  const orders = await database.getPedidos();
  const order = orders.find((p: any) => p.id === orderId);
  if (order) {
    res.json({ success: true, status: order.status });
  } else {
    res.status(404).json({ success: false, error: 'Pedido não encontrado.' });
  }
});

// 4. Asaas Webhook API (Simulator or Real production webhook)
app.post('/api/checkout/webhook', async (req, res) => {
  const body = req.body;
  
  // Real Asaas Webhook payload check or manual simulated webhook check
  const orderId = body.orderId || body.payment?.externalReference;
  const asaasPaymentId = body.payment?.id || body.orderId; // fallback to orderId for simulation

  if (!orderId) {
    return res.status(400).json({ success: false, error: 'Identificador do pedido inválido.' });
  }

  // Se for webhook real do Asaas, verificar se o evento é PAYMENT_RECEIVED ou PAYMENT_CONFIRMED
  if (body.event && body.event !== 'PAYMENT_RECEIVED' && body.event !== 'PAYMENT_CONFIRMED') {
    return res.json({ success: true, message: 'Evento ignorado.' });
  }

  const pedidos = await database.getPedidos();
  const foundOrder = pedidos.find((p: any) => p.id === orderId || (p.asaasPaymentId && p.asaasPaymentId === asaasPaymentId));

  if (!foundOrder) {
    return res.status(404).json({ success: false, error: 'Pedido não encontrado.' });
  }

  foundOrder.status = 'Aprovado';
  await database.savePedido(foundOrder);

  // Increment product sales count
  const produtos = await database.getProdutos();
  const targetProduct = produtos.find((p: any) => p.nome === foundOrder.produto) || produtos[0];
  if (targetProduct) {
    targetProduct.vendas = (targetProduct.vendas || 0) + 1;
    await database.saveProduto(targetProduct);
  }

  // Add product to client library
  const lib = await database.getClienteBibliotecaAll();
  const alreadyUnlocked = lib.find((p: any) => p.comprador_email === foundOrder.email && p.nome === targetProduct.nome);
  if (!alreadyUnlocked) {
    const unlockedProduct = {
      id: Date.now(),
      comprador_email: foundOrder.email,
      nome: targetProduct.nome,
      preco: targetProduct.preco,
      video_aula_url: targetProduct.videoAulaUrl || targetProduct.video_aula_url,
      pdf_material_nome: targetProduct.pdfMaterialNome || targetProduct.pdf_material_nome,
      data_compra: new Date().toLocaleDateString('pt-BR')
    };
    await database.addClienteBiblioteca(unlockedProduct);
  }

  console.log(`[DELIVERY] Acesso liberado para ${foundOrder.email} - Produto: ${targetProduct.nome}`);

  res.json({
    success: true,
    message: 'Pagamento processado com sucesso. Acesso liberado!',
    delivery: {
      email: foundOrder.email,
      whatsapp: foundOrder.whatsapp,
      pdf: targetProduct.pdfMaterialNome || targetProduct.pdf_material_nome
    }
  });
});

// 5. Library API
app.get('/api/cliente/biblioteca', async (req, res) => {
  const email = req.query.email as string;
  if (email) {
    const data = await database.getClienteBiblioteca(email);
    return res.json(data);
  }
  const data = await database.getClienteBibliotecaAll();
  res.json(data);
});

// 6. Orders and Finance
app.get('/api/pedidos', async (req, res) => {
  const data = await database.getPedidos();
  res.json(data);
});

// 7. Users
app.get('/api/usuarios', async (req, res) => {
  const data = await database.getUsers();
  res.json(data);
});

app.put('/api/usuarios/:id/status', async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  await database.updateUserStatus(id, status);
  res.json({ success: true });
});

// 8. Withdraw requests (Saques)
app.get('/api/saques', async (req, res) => {
  const data = await database.getSaques();
  res.json(data);
});

app.post('/api/saques', async (req, res) => {
  const { valor, chave, banco, nome } = req.body;
  const newSaque = {
    id: `SQ-${Math.floor(Math.random() * 9000) + 1000}`,
    nome: nome || 'Usuário Afiliado',
    chave,
    valor: parseFloat(valor),
    data: new Date().toLocaleDateString('pt-BR'),
    banco: banco || 'Conta Bancária (PIX)',
    status: 'Pendente'
  };
  await database.saveSaque(newSaque);
  res.json({ success: true, saque: newSaque });
});

app.put('/api/saques/:id/status', async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const saques = await database.getSaques();
  const s = saques.find((x: any) => x.id === id);
  if (!s) {
    return res.status(404).json({ success: false, error: 'Saque não encontrado.' });
  }
  s.status = status;
  await database.saveSaque(s);
  res.json({ success: true });
});

// 9. Configurações API
app.get('/api/configuracoes', async (req, res) => {
  const data = await database.getConfiguracoes();
  res.json(data);
});

app.put('/api/configuracoes', async (req, res) => {
  const { siteName, fee, supportEmail } = req.body;
  await database.saveConfiguracoes({ siteName, fee, supportEmail });
  res.json({ success: true });
});

// Serve frontend build static files in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
