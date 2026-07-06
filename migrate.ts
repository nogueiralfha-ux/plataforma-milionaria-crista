import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import * as database from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'database.json');

async function runMigration() {
  console.log('[MIGRATION] Iniciando migração do JSON para PostgreSQL...');
  
  if (!database.isPostgresActive()) {
    console.error('[MIGRATION] DATABASE_URL não está configurada no arquivo .env. Não é possível migrar.');
    process.exit(1);
  }

  // 1. Initialise schemas
  await database.initDb();

  // 2. Read local JSON
  if (!fs.existsSync(DB_FILE)) {
    console.log('[MIGRATION] Arquivo database.json não encontrado. Nada para migrar.');
    process.exit(0);
  }

  let dbData: any = {};
  try {
    dbData = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  } catch (e) {
    console.error('[MIGRATION] Erro ao ler database.json:', e);
    process.exit(1);
  }

  // 3. Migrate Users
  if (dbData.users && Array.isArray(dbData.users)) {
    console.log(`[MIGRATION] Migrando ${dbData.users.length} usuários...`);
    for (const u of dbData.users) {
      await database.saveUser(u);
    }
  }

  // 4. Migrate Products
  if (dbData.produtos && Array.isArray(dbData.produtos)) {
    console.log(`[MIGRATION] Migrando ${dbData.produtos.length} produtos...`);
    for (const p of dbData.produtos) {
      await database.saveProduto(p);
    }
  }

  // 5. Migrate Orders (Pedidos)
  if (dbData.pedidos && Array.isArray(dbData.pedidos)) {
    console.log(`[MIGRATION] Migrando ${dbData.pedidos.length} pedidos...`);
    for (const o of dbData.pedidos) {
      await database.savePedido(o);
    }
  }

  // 6. Migrate Library (cliente_biblioteca)
  if (dbData.cliente_biblioteca && Array.isArray(dbData.cliente_biblioteca)) {
    console.log(`[MIGRATION] Migrando ${dbData.cliente_biblioteca.length} itens da biblioteca...`);
    for (const b of dbData.cliente_biblioteca) {
      // Ensure email structure compatibility
      const libItem = {
        id: b.id || Date.now(),
        comprador_email: b.comprador_email || b.email || 'comprador@gmail.com',
        nome: b.nome,
        preco: b.preco,
        video_aula_url: b.videoAulaUrl || b.video_aula_url,
        pdf_material_nome: b.pdfMaterialNome || b.pdf_material_nome,
        data_compra: b.dataCompra || b.data_compra || new Date().toLocaleDateString('pt-BR')
      };
      await database.addClienteBiblioteca(libItem);
    }
  }

  // 7. Migrate Saques
  if (dbData.saques && Array.isArray(dbData.saques)) {
    console.log(`[MIGRATION] Migrando ${dbData.saques.length} saques...`);
    for (const s of dbData.saques) {
      await database.saveSaque(s);
    }
  }

  // 8. Migrate Configurations
  if (dbData.configuracoes) {
    console.log('[MIGRATION] Migrando configurações do site...');
    await database.saveConfiguracoes(dbData.configuracoes);
  }

  console.log('[MIGRATION] Migração concluída com sucesso!');
  process.exit(0);
}

runMigration().catch(err => {
  console.error('[MIGRATION] Falha crítica na migração:', err);
  process.exit(1);
});
