import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'plataforma-milionaria-crista-secret-key';


const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

// Initial database structure
const initialDB = {
  users: [
    { id: 1, nome: 'Pr. Gabriel Santos', email: 'gabriel.santos@gmail.com', role: 'Produtor', status: 'Ativo' },
    { id: 2, nome: 'Ana Paula Vasconcelos', email: 'anapaula@gmail.com', role: 'Afiliado', status: 'Ativo' },
    { id: 3, nome: 'João Lucas Teixeira', email: 'joao.lucas@gmail.com', role: 'Afiliado', status: 'Pendente' },
    { id: 4, nome: 'Ruth Fonseca', email: 'ruth.fonseca@gmail.com', role: 'Cliente', status: 'Ativo' }
  ],
  produtos: [
    {
      id: 1,
      nome: 'Método Milionário Cristão',
      preco: 'R$ 997,00',
      vendas: 142,
      comissao: '50%',
      status: 'Ativo',
      linkAfiliado: 'https://plataforma.com/inv/mmc-88291',
      videoAulaUrl: 'https://vimeo.com/83918239',
      pdfMaterialNome: 'metodo-milionario-cristao-ebook.pdf'
    },
    {
      id: 2,
      nome: 'Jornada da Prosperidade',
      preco: 'R$ 497,00',
      vendas: 89,
      comissao: '40%',
      status: 'Ativo',
      linkAfiliado: 'https://plataforma.com/inv/jdp-44122',
      videoAulaUrl: 'https://vimeo.com/83918240',
      pdfMaterialNome: 'jornada-da-prosperidade-ebook.pdf'
    }
  ],
  pedidos: [
    { id: 'ORD-98218', data: '03/07/2026', cliente: 'Roberto Firmino', email: 'roberto@gmail.com', whatsapp: '11999998888', produto: 'Método Milionário Cristão', valor: 'R$ 997,00', metodo: 'PIX', status: 'Aprovado' },
    { id: 'ORD-98102', data: '02/07/2026', cliente: 'Beatriz Azevedo', email: 'beatriz@gmail.com', whatsapp: '21988887777', produto: 'Jornada da Prosperidade', valor: 'R$ 497,00', metodo: 'Cartão de Crédito', status: 'Aprovado' }
  ],
  cliente_biblioteca: [
    {
      id: 1,
      nome: 'Método Milionário Cristão',
      preco: 'R$ 997,00',
      videoAulaUrl: 'https://vimeo.com/83918239',
      pdfMaterialNome: 'metodo-milionario-cristao-ebook.pdf',
      dataCompra: '25/06/2026'
    }
  ],
  saques: [
    { id: 'SQ-9932', nome: 'Ana Paula Vasconcelos', chave: 'anapaula@gmail.com', valor: 450.00, data: '03/07/2026', status: 'Pendente' },
    { id: 'SQ-9931', nome: 'João Lucas Teixeira', chave: '000.111.222-33', valor: 1250.00, data: '02/07/2026', status: 'Pendente' }
  ],
  configuracoes: {
    siteName: 'Plataforma Milionária Cristã',
    fee: '10',
    supportEmail: 'suporte@plataformamilionariacrista.com'
  }
};

// Helper function to read DB
const readDB = () => {
  let db: any = {};
  if (!fs.existsSync(DB_FILE)) {
    db = initialDB;
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } else {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(data || '{}');
    } catch (e) {
      db = initialDB;
    }
  }
  // Ensure basic arrays exist to prevent TypeErrors
  if (!db.users) db.users = [];
  if (!db.produtos) db.produtos = [];
  if (!db.pedidos) db.pedidos = [];
  if (!db.cliente_biblioteca) db.cliente_biblioteca = [];
  if (!db.saques) db.saques = [];
  if (!db.configuracoes) {
    db.configuracoes = {
      siteName: 'Plataforma Milionária Cristã',
      fee: '10',
      supportEmail: 'suporte@plataformamilionariacrista.com'
    };
  }
  return db;
};

// Helper function to write DB
const writeDB = (data: any) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// 1. Auth API
app.post('/api/auth/register', (req, res) => {
  const { nome, email, password, role } = req.body;
  if (!nome || !email || !password || !role) {
    return res.status(400).json({ success: false, error: 'Todos os campos são obrigatórios.' });
  }

  const db = readDB();
  const userExists = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
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

  db.users.push(newUser);
  writeDB(db);

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

app.post('/api/auth/login', (req, res) => {
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

  const db = readDB();
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  
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
app.get('/api/produtos', (req, res) => {
  const db = readDB();
  res.json(db.produtos);
});

app.post('/api/produtos', (req, res) => {
  try {
    const { nome, preco, comissao, videoAulaUrl, pdfMaterialNome, tipo } = req.body;
    if (!nome) {
      return res.status(400).json({ success: false, error: 'Nome do produto é obrigatório.' });
    }
    const db = readDB();
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
    db.produtos.unshift(newProduct);
    writeDB(db);
    res.json({ success: true, produto: newProduct });
  } catch (error: any) {
    console.error('Erro ao cadastrar produto:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro interno do servidor.' });
  }
});

app.put('/api/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, preco, comissao, videoAulaUrl, pdfMaterialNome, status, tipo } = req.body;
  const db = readDB();
  db.produtos = db.produtos.map((p: any) => 
    p.id === id 
      ? { 
          ...p, 
          nome, 
          preco: preco.includes('R$') ? preco : `R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}`, 
          comissao: comissao.includes('%') ? comissao : `${comissao}%`, 
          status,
          videoAulaUrl,
          pdfMaterialNome,
          tipo: tipo || p.tipo || 'Curso'
        } 
      : p
  );
  writeDB(db);
  res.json({ success: true });
});

app.post('/api/checkout/pay', async (req, res) => {
  const { compradorNome, compradorEmail, compradorTel, produtoNome, valor, metodo } = req.body;
  
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
      const db = readDB();
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
      db.pedidos.unshift(newOrder);
      writeDB(db);

      return res.json({
        success: true,
        orderId,
        asaasPaymentId: paymentId,
        qrCodeUrl: qrCodeUrl || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=asaas-payload-${orderId}`,
        pixKey: pixKey || `00020126580014br.gov.bcb.pix0136asaas-key-${orderId}`,
        invoiceUrl: paymentData.invoiceUrl
      });

    } catch (error: any) {
      console.error('[ASAAS ERROR]', error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  // Fallback to simulator
  const orderIdSimulated = orderId;
  const asaasPixQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=asaas-payload-${orderIdSimulated}`;

  const db = readDB();
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
  db.pedidos.unshift(newOrder);
  writeDB(db);

  res.json({
    success: true,
    orderId: orderIdSimulated,
    qrCodeUrl: asaasPixQrCode,
    pixKey: `00020126580014br.gov.bcb.pix0136asaas-key-${orderIdSimulated}520400005303986540497.005802BR5915PlataformaMC6009SAOPAULO62070503***`
  });
});

// 4. Asaas Webhook API (Simulator or Real production webhook)
app.post('/api/checkout/webhook', (req, res) => {
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

  const db = readDB();

  // Find order and mark as Approved
  let foundOrder: any = null;
  db.pedidos = db.pedidos.map((p: any) => {
    if (p.id === orderId || (p.asaasPaymentId && p.asaasPaymentId === asaasPaymentId)) {
      foundOrder = { ...p, status: 'Aprovado' };
      return foundOrder;
    }
    return p;
  });

  if (!foundOrder) {
    return res.status(404).json({ success: false, error: 'Pedido não encontrado.' });
  }

  // Increment product sales count
  db.produtos = db.produtos.map((p: any) => 
    p.nome === foundOrder.produto ? { ...p, vendas: (p.vendas || 0) + 1 } : p
  );

  // Add product to client library
  const targetProduct = db.produtos.find((p: any) => p.nome === foundOrder.produto) || db.produtos[0];
  
  // Check if client library already has this product
  const alreadyUnlocked = db.cliente_biblioteca.find((p: any) => p.nome === targetProduct.nome);
  if (!alreadyUnlocked) {
    const unlockedProduct = {
      id: Date.now(),
      nome: targetProduct.nome,
      preco: targetProduct.preco,
      videoAulaUrl: targetProduct.videoAulaUrl,
      pdfMaterialNome: targetProduct.pdfMaterialNome,
      dataCompra: new Date().toLocaleDateString('pt-BR')
    };
    db.cliente_biblioteca.unshift(unlockedProduct);
  }

  writeDB(db);

  console.log(`[DELIVERY] Acesso liberado para ${foundOrder.email} - Produto: ${targetProduct.nome}`);

  res.json({
    success: true,
    message: 'Pagamento processado com sucesso. Acesso liberado!',
    delivery: {
      email: foundOrder.email,
      whatsapp: foundOrder.whatsapp,
      pdf: targetProduct.pdfMaterialNome
    }
  });
});

// 5. Library API
app.get('/api/cliente/biblioteca', (req, res) => {
  const db = readDB();
  res.json(db.cliente_biblioteca);
});

// 6. Orders and Finance
app.get('/api/pedidos', (req, res) => {
  const db = readDB();
  res.json(db.pedidos);
});

// 7. Users
app.get('/api/usuarios', (req, res) => {
  const db = readDB();
  res.json(db.users);
});

app.put('/api/usuarios/:id/status', (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.body;
  const db = readDB();
  db.users = db.users.map((u: any) => u.id === id ? { ...u, status } : u);
  writeDB(db);
  res.json({ success: true });
});

// 8. Withdraw requests (Saques)
app.get('/api/saques', (req, res) => {
  const db = readDB();
  res.json(db.saques);
});

app.post('/api/saques', (req, res) => {
  const { valor, chave, banco, nome } = req.body;
  const db = readDB();
  const newSaque = {
    id: `SQ-${Math.floor(Math.random() * 9000) + 1000}`,
    nome: nome || 'Usuário Afiliado',
    chave,
    valor: parseFloat(valor),
    data: new Date().toLocaleDateString('pt-BR'),
    banco: banco || 'Conta Bancária (PIX)',
    status: 'Pendente'
  };
  db.saques.unshift(newSaque);
  writeDB(db);
  res.json({ success: true, saque: newSaque });
});

app.put('/api/saques/:id/status', (req, res) => {
  const id = req.params.id;
  const { status } = req.body;
  const db = readDB();
  db.saques = db.saques.map((s: any) => s.id === id ? { ...s, status } : s);
  writeDB(db);
  res.json({ success: true });
});

// 9. Configurações API
app.get('/api/configuracoes', (req, res) => {
  const db = readDB();
  res.json(db.configuracoes);
});

app.put('/api/configuracoes', (req, res) => {
  const { siteName, fee, supportEmail } = req.body;
  const db = readDB();
  db.configuracoes = { siteName, fee, supportEmail };
  writeDB(db);
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
