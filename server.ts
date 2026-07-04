import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';

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
  ]
};

// Helper function to read DB
const readDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2));
    return initialDB;
  }
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return initialDB;
  }
};

// Helper function to write DB
const writeDB = (data: any) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// 1. Auth API
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'nogueiralfha@gmail.com' && password === 'missionario405') {
    return res.json({
      success: true,
      user: {
        email: 'nogueiralfha@gmail.com',
        nome: 'Pr. Nogueira',
        superAdmin: true,
        role: 'admin'
      }
    });
  }
  return res.status(401).json({ success: false, error: 'Credenciais inválidas.' });
});

// 2. Products API
app.get('/api/produtos', (req, res) => {
  const db = readDB();
  res.json(db.produtos);
});

app.post('/api/produtos', (req, res) => {
  const { nome, preco, comissao, videoAulaUrl, pdfMaterialNome } = req.body;
  const db = readDB();
  const newProduct = {
    id: Date.now(),
    nome,
    preco: `R$ ${parseFloat(preco).toFixed(2).replace('.', ',')}`,
    vendas: 0,
    comissao: comissao ? `${comissao}%` : '50%',
    status: 'Ativo',
    linkAfiliado: `https://plataforma.com/inv/${nome.toLowerCase().replace(/\s+/g, '-').substring(0, 10)}-${Math.floor(Math.random() * 10000)}`,
    videoAulaUrl: videoAulaUrl || 'https://vimeo.com/83918239',
    pdfMaterialNome: pdfMaterialNome || `${nome.toLowerCase().replace(/\s+/g, '-')}-ebook.pdf`
  };
  db.produtos.unshift(newProduct);
  writeDB(db);
  res.json({ success: true, produto: newProduct });
});

app.put('/api/produtos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nome, preco, comissao, videoAulaUrl, pdfMaterialNome, status } = req.body;
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
          pdfMaterialNome
        } 
      : p
  );
  writeDB(db);
  res.json({ success: true });
});

// 3. Checkout & Asaas API Integration Simulator
app.post('/api/checkout/pay', (req, res) => {
  const { compradorNome, compradorEmail, compradorTel, produtoNome, valor } = req.body;
  
  // 1. Simulate call to Asaas API to create PIX charge
  // In production, you would call: axios.post('https://api.asaas.com/v3/payments', { ... })
  const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
  const asaasPixQrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=asaas-payload-${orderId}`;

  // Store transaction in Pending state
  const db = readDB();
  const newOrder = {
    id: orderId,
    data: new Date().toLocaleDateString('pt-BR'),
    cliente: compradorNome,
    email: compradorEmail,
    whatsapp: compradorTel,
    produto: produtoNome || 'Método Milionário Cristão',
    valor: valor || 'R$ 97,00',
    metodo: 'PIX',
    status: 'Pendente'
  };
  db.pedidos.unshift(newOrder);
  writeDB(db);

  res.json({
    success: true,
    orderId,
    qrCodeUrl: asaasPixQrCode,
    pixKey: `00020126580014br.gov.bcb.pix0136asaas-key-${orderId}520400005303986540497.005802BR5915PlataformaMC6009SAOPAULO62070503***`
  });
});

// 4. Asaas Webhook API Simulator
app.post('/api/checkout/webhook', (req, res) => {
  const { orderId } = req.body;
  const db = readDB();

  // Find order and mark as Approved
  let foundOrder: any = null;
  db.pedidos = db.pedidos.map((p: any) => {
    if (p.id === orderId) {
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
    p.nome === foundOrder.produto ? { ...p, vendas: p.vendas + 1 } : p
  );

  // Add product to client library
  const targetProduct = db.produtos.find((p: any) => p.nome === foundOrder.produto) || db.produtos[0];
  const unlockedProduct = {
    id: Date.now(),
    nome: targetProduct.nome,
    preco: targetProduct.preco,
    videoAulaUrl: targetProduct.videoAulaUrl,
    pdfMaterialNome: targetProduct.pdfMaterialNome,
    dataCompra: new Date().toLocaleDateString('pt-BR')
  };
  db.cliente_biblioteca.unshift(unlockedProduct);

  writeDB(db);

  // Simulate Instant Email and WhatsApp Delivery trigger
  console.log(`[DELIVERY] E-book ${targetProduct.pdfMaterialNome} enviado para ${foundOrder.email}`);
  console.log(`[DELIVERY] Vídeo Aula link enviado para WhatsApp: ${foundOrder.whatsapp}`);

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

// Serve frontend build static files in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
