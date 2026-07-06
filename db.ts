import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'database.json');
const DATABASE_URL = process.env.DATABASE_URL;

let pool: pg.Pool | null = null;

if (DATABASE_URL) {
  pool = new pg.Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}

// Check if using PostgreSQL
export const isPostgresActive = (): boolean => pool !== null;

// Initialize schemas in PostgreSQL
export async function initDb() {
  if (!pool) return;
  
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255),
        role VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS produtos (
        id BIGINT PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        preco VARCHAR(100) NOT NULL,
        vendas INT DEFAULT 0,
        comissao VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        link_afiliado VARCHAR(255),
        video_aula_url VARCHAR(255),
        pdf_material_nome VARCHAR(255),
        tipo VARCHAR(50) DEFAULT 'Curso'
      );
      
      CREATE TABLE IF NOT EXISTS pedidos (
        id VARCHAR(100) PRIMARY KEY,
        data VARCHAR(50) NOT NULL,
        cliente VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        whatsapp VARCHAR(50),
        produto VARCHAR(255) NOT NULL,
        valor VARCHAR(100) NOT NULL,
        metodo VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL,
        asaas_payment_id VARCHAR(255)
      );
      
      CREATE TABLE IF NOT EXISTS cliente_biblioteca (
        id BIGINT PRIMARY KEY,
        comprador_email VARCHAR(255) NOT NULL,
        nome VARCHAR(255) NOT NULL,
        preco VARCHAR(100) NOT NULL,
        video_aula_url VARCHAR(255),
        pdf_material_nome VARCHAR(255),
        data_compra VARCHAR(50) NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS saques (
        id VARCHAR(100) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        chave VARCHAR(255) NOT NULL,
        valor DECIMAL(10, 2) NOT NULL,
        data VARCHAR(50) NOT NULL,
        banco VARCHAR(255),
        status VARCHAR(50) NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS configuracoes (
        key VARCHAR(100) PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
    console.log('[DB] Tabelas do PostgreSQL inicializadas com sucesso.');
  } catch (err) {
    console.error('[DB] Erro ao inicializar tabelas do PostgreSQL:', err);
  }
}

// -------------------------------------------------------------
// REUSABLE SQL HELPER METHODS
// -------------------------------------------------------------

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  if (!pool) {
    throw new Error('Database pool not initialized.');
  }
  const result = await pool.query(text, params);
  return result.rows;
}

// Fallback JSON functions (backward compatibility)
const readJSON = () => {
  if (!fs.existsSync(DB_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8') || '{}');
  } catch {
    return {};
  }
};

const writeJSON = (data: any) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// -------------------------------------------------------------
// COMPATIBLE GETTER/SETTER MODULE FUNCTIONS
// -------------------------------------------------------------

export async function getUsers(): Promise<any[]> {
  if (pool) {
    return await query('SELECT * FROM users ORDER BY nome ASC');
  }
  return readJSON().users || [];
}

export async function saveUser(user: any): Promise<void> {
  if (pool) {
    await pool.query(
      `INSERT INTO users (id, nome, email, password, role, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       ON CONFLICT (id) DO UPDATE 
       SET nome = $2, email = $3, password = $4, role = $5, status = $6`,
      [user.id, user.nome, user.email, user.password, user.role, user.status]
    );
  } else {
    const data = readJSON();
    if (!data.users) data.users = [];
    const index = data.users.findIndex((u: any) => u.id === user.id);
    if (index >= 0) {
      data.users[index] = user;
    } else {
      data.users.push(user);
    }
    writeJSON(data);
  }
}

export async function updateUserStatus(id: number, status: string): Promise<void> {
  if (pool) {
    await pool.query('UPDATE users SET status = $1 WHERE id = $2', [status, id]);
  } else {
    const data = readJSON();
    data.users = (data.users || []).map((u: any) => u.id === id ? { ...u, status } : u);
    writeJSON(data);
  }
}

export async function getProdutos(): Promise<any[]> {
  if (pool) {
    return await query('SELECT * FROM produtos ORDER BY id DESC');
  }
  return readJSON().produtos || [];
}

export async function saveProduto(prod: any): Promise<void> {
  if (pool) {
    await pool.query(
      `INSERT INTO produtos (id, nome, preco, vendas, comissao, status, link_afiliado, video_aula_url, pdf_material_nome, tipo) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       ON CONFLICT (id) DO UPDATE 
       SET nome = $2, preco = $3, vendas = $4, comissao = $5, status = $6, link_afiliado = $7, video_aula_url = $8, pdf_material_nome = $9, tipo = $10`,
      [prod.id, prod.nome, prod.preco, prod.vendas || 0, prod.comissao, prod.status, prod.linkAfiliado, prod.videoAulaUrl, prod.pdfMaterialNome, prod.tipo]
    );
  } else {
    const data = readJSON();
    if (!data.produtos) data.produtos = [];
    const index = data.produtos.findIndex((p: any) => p.id === prod.id);
    if (index >= 0) {
      data.produtos[index] = prod;
    } else {
      data.produtos.unshift(prod);
    }
    writeJSON(data);
  }
}

export async function getPedidos(): Promise<any[]> {
  if (pool) {
    const rows = await query('SELECT * FROM pedidos ORDER BY data DESC');
    return rows.map(r => ({
      id: r.id,
      data: r.data,
      cliente: r.cliente,
      email: r.email,
      whatsapp: r.whatsapp,
      produto: r.produto,
      valor: r.valor,
      metodo: r.metodo,
      status: r.status,
      asaasPaymentId: r.asaas_payment_id
    }));
  }
  return readJSON().pedidos || [];
}

export async function savePedido(p: any): Promise<void> {
  if (pool) {
    await pool.query(
      `INSERT INTO pedidos (id, data, cliente, email, whatsapp, produto, valor, metodo, status, asaas_payment_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       ON CONFLICT (id) DO UPDATE 
       SET status = $9, asaas_payment_id = $10`,
      [p.id, p.data, p.cliente, p.email, p.whatsapp, p.produto, p.valor, p.metodo, p.status, p.asaasPaymentId]
    );
  } else {
    const data = readJSON();
    if (!data.pedidos) data.pedidos = [];
    const index = data.pedidos.findIndex((x: any) => x.id === p.id);
    if (index >= 0) {
      data.pedidos[index] = p;
    } else {
      data.pedidos.unshift(p);
    }
    writeJSON(data);
  }
}

export async function getClienteBiblioteca(email: string): Promise<any[]> {
  if (pool) {
    return await query('SELECT * FROM cliente_biblioteca WHERE comprador_email = $1 ORDER BY data_compra DESC', [email]);
  }
  return readJSON().cliente_biblioteca || [];
}

export async function getClienteBibliotecaAll(): Promise<any[]> {
  if (pool) {
    return await query('SELECT * FROM cliente_biblioteca ORDER BY id DESC');
  }
  return readJSON().cliente_biblioteca || [];
}

export async function addClienteBiblioteca(b: any): Promise<void> {
  if (pool) {
    await pool.query(
      `INSERT INTO cliente_biblioteca (id, comprador_email, nome, preco, video_aula_url, pdf_material_nome, data_compra) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [b.id, b.comprador_email, b.nome, b.preco, b.video_aula_url, b.pdf_material_nome, b.data_compra]
    );
  } else {
    const data = readJSON();
    if (!data.cliente_biblioteca) data.cliente_biblioteca = [];
    data.cliente_biblioteca.unshift(b);
    writeJSON(data);
  }
}

export async function getSaques(): Promise<any[]> {
  if (pool) {
    return await query('SELECT * FROM saques ORDER BY data DESC');
  }
  return readJSON().saques || [];
}

export async function saveSaque(s: any): Promise<void> {
  if (pool) {
    await pool.query(
      `INSERT INTO saques (id, nome, chave, valor, data, banco, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       ON CONFLICT (id) DO UPDATE 
       SET status = $7`,
      [s.id, s.nome, s.chave, s.valor, s.data, s.banco, s.status]
    );
  } else {
    const data = readJSON();
    if (!data.saques) data.saques = [];
    const index = data.saques.findIndex((x: any) => x.id === s.id);
    if (index >= 0) {
      data.saques[index] = s;
    } else {
      data.saques.unshift(s);
    }
    writeJSON(data);
  }
}

export async function getConfiguracoes(): Promise<any> {
  if (pool) {
    const rows = await query('SELECT * FROM configuracoes');
    const configs: any = {};
    rows.forEach(r => {
      configs[r.key] = r.value;
    });
    return {
      siteName: configs.siteName || 'Plataforma Milionária Cristã',
      fee: configs.fee || '10',
      supportEmail: configs.supportEmail || 'suporte@plataformamilionariacrista.com'
    };
  }
  return readJSON().configuracoes || {
    siteName: 'Plataforma Milionária Cristã',
    fee: '10',
    supportEmail: 'suporte@plataformamilionariacrista.com'
  };
}

export async function saveConfiguracoes(c: any): Promise<void> {
  if (pool) {
    const queries = [
      pool.query('INSERT INTO configuracoes (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2', ['siteName', c.siteName]),
      pool.query('INSERT INTO configuracoes (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2', ['fee', c.fee]),
      pool.query('INSERT INTO configuracoes (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2', ['supportEmail', c.supportEmail])
    ];
    await Promise.all(queries);
  } else {
    const data = readJSON();
    data.configuracoes = { siteName: c.siteName, fee: c.fee, supportEmail: c.supportEmail };
    writeJSON(data);
  }
}
