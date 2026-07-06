// API client with automatic LocalStorage fallback for offline/static hosting deployments (e.g. Render Static Sites)

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

// Initialize LocalStorage DB if empty
const getLocalDB = (): typeof initialDB => {
  const localData = localStorage.getItem('plataforma_db');
  if (!localData) {
    localStorage.setItem('plataforma_db', JSON.stringify(initialDB));
    return initialDB;
  }
  try {
    const parsed = JSON.parse(localData);
    // Ensure all sections exist
    const db = { ...initialDB, ...parsed };
    return db;
  } catch (e) {
    return initialDB;
  }
};

const saveLocalDB = (db: typeof initialDB) => {
  localStorage.setItem('plataforma_db', JSON.stringify(db));
};

export async function fetchApi<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Server returned ${response.status}`);
  } catch (err) {
    console.warn(`Fetch error for ${url}, falling back to localStorage:`, err);
    const db = getLocalDB();
    if (url.includes('/api/produtos')) {
      return db.produtos as unknown as T;
    }
    if (url.includes('/api/configuracoes')) {
      return db.configuracoes as unknown as T;
    }
    if (url.includes('/api/usuarios')) {
      return db.users as unknown as T;
    }
    if (url.includes('/api/saques')) {
      return db.saques as unknown as T;
    }
    if (url.includes('/api/cliente/biblioteca')) {
      return db.cliente_biblioteca as unknown as T;
    }
    if (url.includes('/api/pedidos')) {
      return db.pedidos as unknown as T;
    }
    if (url.includes('/api/checkout/status/')) {
      const parts = url.split('/');
      const orderId = parts[parts.length - 1];
      const order = db.pedidos.find((p: any) => p.id === orderId);
      return { success: true, status: order ? order.status : 'Pendente' } as unknown as T;
    }
    throw err;
  }
}

export async function postApi<T>(url: string, body: any): Promise<{ success: boolean; [key: string]: any }> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Server returned ${response.status}`);
  } catch (err) {
    console.warn(`Post error for ${url}, falling back to localStorage:`, err);
    const db = getLocalDB();
    
    if (url.includes('/api/produtos')) {
      const cleanPreco = parseFloat(String(body.preco || '0')) || 0;
      const newProduct = {
        id: Date.now(),
        nome: body.nome,
        preco: `R$ ${cleanPreco.toFixed(2).replace('.', ',')}`,
        vendas: 0,
        comissao: body.comissao ? `${body.comissao}%` : '50%',
        status: 'Ativo',
        linkAfiliado: `https://plataforma.com/inv/${body.nome.toLowerCase().replace(/\s+/g, '-').substring(0, 10)}-${Math.floor(Math.random() * 10000)}`,
        videoAulaUrl: body.videoAulaUrl || 'https://vimeo.com/83918239',
        pdfMaterialNome: body.pdfMaterialNome || `${body.nome.toLowerCase().replace(/\s+/g, '-')}-ebook.pdf`,
        tipo: body.tipo || 'Curso'
      };
      db.produtos.unshift(newProduct);
      saveLocalDB(db);
      return { success: true, produto: newProduct };
    }
    
    if (url.includes('/api/saques')) {
      const newSaque = {
        id: `SQ-${Math.floor(Math.random() * 9000) + 1000}`,
        nome: body.nome || 'Usuário Afiliado',
        chave: body.chave,
        valor: parseFloat(body.valor),
        data: new Date().toLocaleDateString('pt-BR'),
        banco: body.banco || 'Conta Bancária (PIX)',
        status: 'Pendente'
      };
      db.saques.unshift(newSaque);
      saveLocalDB(db);
      return { success: true, saque: newSaque };
    }
    
    if (url.includes('/api/checkout/pay')) {
      const orderId = `ORD-${Math.floor(Math.random() * 90000) + 10000}`;
      const newOrder = {
        id: orderId,
        asaasPaymentId: `sim-${orderId}`,
        data: new Date().toLocaleDateString('pt-BR'),
        cliente: body.compradorNome,
        email: body.compradorEmail,
        whatsapp: body.compradorTel,
        produto: body.produtoNome || 'Método Milionário Cristão',
        valor: body.valor || 'R$ 97,00',
        metodo: body.metodo || 'PIX',
        status: 'Pendente'
      };
      db.pedidos.unshift(newOrder);
      saveLocalDB(db);
      return {
        success: true,
        orderId,
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=asaas-payload-${orderId}`,
        pixKey: `00020126580014br.gov.bcb.pix0136asaas-key-${orderId}`
      };
    }
    
    if (url.includes('/api/checkout/webhook')) {
      const orderId = body.orderId;
      let foundOrder: any = null;
      db.pedidos = db.pedidos.map((p: any) => {
        if (p.id === orderId) {
          foundOrder = { ...p, status: 'Aprovado' };
          return foundOrder;
        }
        return p;
      });
      
      if (!foundOrder) {
        return { success: false, error: 'Pedido não encontrado.' };
      }
      
      db.produtos = db.produtos.map((p: any) => 
        p.nome === foundOrder.produto ? { ...p, vendas: (p.vendas || 0) + 1 } : p
      );
      
      const targetProduct = db.produtos.find((p: any) => p.nome === foundOrder.produto) || db.produtos[0];
      const alreadyUnlocked = db.cliente_biblioteca.find((p: any) => p.nome === targetProduct.nome);
      if (!alreadyUnlocked) {
        db.cliente_biblioteca.unshift({
          id: Date.now(),
          nome: targetProduct.nome,
          preco: targetProduct.preco,
          videoAulaUrl: targetProduct.videoAulaUrl,
          pdfMaterialNome: targetProduct.pdfMaterialNome,
          dataCompra: new Date().toLocaleDateString('pt-BR')
        });
      }
      
      saveLocalDB(db);
      return {
        success: true,
        delivery: {
          email: foundOrder.email,
          whatsapp: foundOrder.whatsapp,
          pdf: targetProduct.pdfMaterialNome
        }
      };
    }
    
    return { success: false, error: 'Método não suportado offline.' };
  }
}

export async function putApi(url: string, body: any): Promise<{ success: boolean }> {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`Server returned ${response.status}`);
  } catch (err) {
    console.warn(`Put error for ${url}, falling back to localStorage:`, err);
    const db = getLocalDB();
    
    if (url.includes('/api/produtos/')) {
      const parts = url.split('/');
      const id = parseInt(parts[parts.length - 1]);
      db.produtos = db.produtos.map((p: any) => 
        p.id === id 
          ? { 
              ...p, 
              nome: body.nome, 
              preco: String(body.preco).includes('R$') ? body.preco : `R$ ${parseFloat(body.preco).toFixed(2).replace('.', ',')}`, 
              comissao: String(body.comissao).includes('%') ? body.comissao : `${body.comissao}%`, 
              status: body.status,
              videoAulaUrl: body.videoAulaUrl,
              pdfMaterialNome: body.pdfMaterialNome,
              tipo: body.tipo || p.tipo || 'Curso'
            } 
          : p
      );
      saveLocalDB(db);
      return { success: true };
    }
    
    if (url.includes('/api/usuarios/')) {
      const parts = url.split('/');
      const id = parseInt(parts[parts.length - 2]); // .../usuarios/:id/status
      db.users = db.users.map((u: any) => u.id === id ? { ...u, status: body.status } : u);
      saveLocalDB(db);
      return { success: true };
    }
    
    if (url.includes('/api/saques/')) {
      const parts = url.split('/');
      const id = parts[parts.length - 2]; // .../saques/:id/status
      db.saques = db.saques.map((s: any) => s.id === id ? { ...s, status: body.status } : s);
      saveLocalDB(db);
      return { success: true };
    }
    
    if (url.includes('/api/configuracoes')) {
      db.configuracoes = { siteName: body.siteName, fee: body.fee, supportEmail: body.supportEmail };
      saveLocalDB(db);
      return { success: true };
    }
    
    return { success: false };
  }
}
