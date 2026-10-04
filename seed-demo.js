// ============================================
// SEED DE DATOS DEMO - CERDOS APP
// Todos los datos son FICTICIOS
// ============================================

function pad(n) { return n < 10 ? '0' + n : '' + n; }

function dateAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

function dateAgoWithTime(days, hour, min) {
  return dateAgo(days) + ' ' + pad(hour) + ':' + pad(min) + ':00';
}

function runSeed(db) {
  console.log('[SEED] Iniciando carga de datos demo...');

  const tables = [
    'daily_task_logs', 'feed_orders', 'task_templates', 'reproduction_records',
    'sales', 'expenses', 'weight_records', 'feeding_records', 'health_records',
    'daily_logs', 'inventory_movements', 'inventory_items', 'inventory_categories',
    'pigs', 'batches', 'partner_transactions', 'partners', 'farms'
  ];
  for (const t of tables) {
    try { db.exec('PRAGMA foreign_keys=OFF'); } catch (e) {}
    try { db.exec('DELETE FROM ' + t); } catch (e) {}
  }
  try { db.exec('DELETE FROM sqlite_sequence'); } catch (e) {}

  // ========== GRANJAS ==========
  const farms = [
    { name: 'Finca El Roble', location: 'Valle Central' },
    { name: 'Hacienda San Rafael', location: 'Cerro Alto' },
    { name: 'Granja La Esperanza', location: 'Llanura Sur' }
  ];
  const farmIds = [];
  for (const f of farms) {
    const r = db.prepare('INSERT INTO farms (name, location) VALUES (?, ?)').run(f.name, f.location);
    farmIds.push(Number(r.lastInsertRowid));
  }
  const F1 = farmIds[0], F2 = farmIds[1], F3 = farmIds[2];

  // ========== SOCIOS ==========
  const partners = [
    { name: 'Carlos Mendoza', phone: '555-0101', investment: 450, notes: 'Socio fundador', farm_id: F1 },
    { name: 'Ana Vera', phone: '555-0202', investment: 450, notes: 'Socia fundadora', farm_id: F1 }
  ];
  const partnerIds = [];
  for (const p of partners) {
    const r = db.prepare('INSERT INTO partners (name, phone, investment, notes, farm_id, status) VALUES (?, ?, ?, ?, ?, ?)')
      .run(p.name, p.phone, p.investment, p.notes, p.farm_id, 'active');
    partnerIds.push(Number(r.lastInsertRowid));
  }
  const P1 = partnerIds[0], P2 = partnerIds[1];

  db.prepare("INSERT INTO partner_transactions (partner_id, type, amount, description, date) VALUES (?, 'contribution', 150, 'Aporte adicional para comprar alimento', ?)")
    .run(P1, dateAgo(70));
  db.prepare("INSERT INTO partner_transactions (partner_id, type, amount, description, date) VALUES (?, 'contribution', 100, 'Aporte para medicina', ?)")
    .run(P2, dateAgo(50));
  db.prepare("INSERT INTO partner_transactions (partner_id, type, amount, description, date) VALUES (?, 'return', 100, 'Retiro parcial de utilidades', ?)")
    .run(P1, dateAgo(25));

  // ========== LOTES ==========
  const batches = [
    { name: 'Lote Destete A', farm_id: F1, notes: 'Destete marzo 2026' },
    { name: 'Lote Engorde B', farm_id: F1, notes: 'Engorde dic 2025 - mar 2026' },
    { name: 'Lote Engorde C', farm_id: F2, notes: 'Lote principal hacienda' },
    { name: 'Lote Cria D', farm_id: F2, notes: 'Hembras de reemplazo' },
    { name: 'Lote Destete E', farm_id: F3, notes: 'Destete enero 2026' }
  ];
  const batchIds = [];
  for (const b of batches) {
    const r = db.prepare('INSERT INTO batches (name, farm_id, notes) VALUES (?, ?, ?)').run(b.name, b.farm_id, b.notes);
    batchIds.push(Number(r.lastInsertRowid));
  }
  const B1 = batchIds[0], B2 = batchIds[1], B3 = batchIds[2], B4 = batchIds[3], B5 = batchIds[4];

  // ========== CERDOS (25) ==========
  const pigs = [
    { identifier: 'D-001', name: 'Pepito',   sex: 'macho',  breed: 'Yorkshire', batch_id: B1, farm_id: F1, birth: 75, purchase: 0, partner: P1 },
    { identifier: 'D-002', name: 'Negro',    sex: 'macho',  breed: 'Yorkshire', batch_id: B1, farm_id: F1, birth: 75, purchase: 0, partner: P1 },
    { identifier: 'D-003', name: 'Blanquita', sex: 'hembra', breed: 'Landrace',  batch_id: B1, farm_id: F1, birth: 75, purchase: 0, partner: null },
    { identifier: 'D-004', name: 'Chispa',   sex: 'hembra', breed: 'Landrace',  batch_id: B1, farm_id: F1, birth: 74, purchase: 0, partner: null },
    { identifier: 'D-005', name: 'Toro',     sex: 'macho',  breed: 'Duroc',     batch_id: B1, farm_id: F1, birth: 74, purchase: 0, partner: P2 },
    { identifier: 'D-006', name: 'Luna',     sex: 'hembra', breed: 'Duroc',     batch_id: B1, farm_id: F1, birth: 73, purchase: 0, partner: P2 },
    { identifier: 'D-007', name: 'Canela',   sex: 'hembra', breed: 'Yorkshire', batch_id: B1, farm_id: F1, birth: 73, purchase: 0, partner: null },
    { identifier: 'D-008', name: 'Trueno',   sex: 'macho',  breed: 'Duroc',     batch_id: B1, farm_id: F1, birth: 72, purchase: 0, partner: P1 },
    { identifier: 'E-101', name: 'Rayo',     sex: 'macho',  breed: 'Duroc',     batch_id: B2, farm_id: F1, birth: null, purchase: 850, partner: P1, purchaseAgo: 100, startWeight: 28 },
    { identifier: 'E-102', name: 'Oso',      sex: 'macho',  breed: 'Duroc',     batch_id: B2, farm_id: F1, birth: null, purchase: 850, partner: P1, purchaseAgo: 100, startWeight: 30 },
    { identifier: 'E-103', name: 'Maya',     sex: 'hembra', breed: 'Yorkshire', batch_id: B2, farm_id: F1, birth: null, purchase: 820, partner: P2, purchaseAgo: 98, startWeight: 26 },
    { identifier: 'E-104', name: 'Sol',      sex: 'hembra', breed: 'Yorkshire', batch_id: B2, farm_id: F1, birth: null, purchase: 820, partner: P2, purchaseAgo: 98, startWeight: 27 },
    { identifier: 'E-105', name: 'Puma',     sex: 'macho',  breed: 'Landrace',  batch_id: B2, farm_id: F1, birth: null, purchase: 780, partner: P1, purchaseAgo: 95, startWeight: 25 },
    { identifier: 'E-106', name: 'Nube',     sex: 'hembra', breed: 'Landrace',  batch_id: B2, farm_id: F1, birth: null, purchase: 780, partner: null, purchaseAgo: 95, startWeight: 24 },
    { identifier: 'C-201', name: 'Simon',    sex: 'macho',  breed: 'Yorkshire', batch_id: B3, farm_id: F2, birth: null, purchase: 920, partner: P1, purchaseAgo: 110, startWeight: 35 },
    { identifier: 'C-202', name: 'Alaska',   sex: 'hembra', breed: 'Yorkshire', batch_id: B3, farm_id: F2, birth: null, purchase: 900, partner: P2, purchaseAgo: 108, startWeight: 33 },
    { identifier: 'C-203', name: 'Tigre',    sex: 'macho',  breed: 'Duroc',     batch_id: B3, farm_id: F2, birth: null, purchase: 950, partner: P1, purchaseAgo: 105, startWeight: 38 },
    { identifier: 'C-204', name: 'Estrella', sex: 'hembra', breed: 'Landrace',  batch_id: B3, farm_id: F2, birth: null, purchase: 880, partner: P2, purchaseAgo: 102, startWeight: 30 },
    { identifier: 'C-205', name: 'Relampago', sex: 'macho', breed: 'Duroc',    batch_id: B3, farm_id: F2, birth: null, purchase: 940, partner: null, purchaseAgo: 100, startWeight: 36 },
    { identifier: 'R-301', name: 'Princesa', sex: 'hembra', breed: 'Yorkshire', batch_id: B4, farm_id: F2, birth: 180, purchase: 0, partner: null },
    { identifier: 'R-302', name: 'Reina',    sex: 'hembra', breed: 'Yorkshire', batch_id: B4, farm_id: F2, birth: 178, purchase: 0, partner: null },
    { identifier: 'R-303', name: 'Duquesa',  sex: 'hembra', breed: 'Landrace',  batch_id: B4, farm_id: F2, birth: 176, purchase: 0, partner: null },
    { identifier: 'X-401', name: 'Chiquito', sex: 'macho',  breed: 'Duroc',     batch_id: B5, farm_id: F3, birth: 55, purchase: 0, partner: null },
    { identifier: 'X-402', name: 'Bella',    sex: 'hembra', breed: 'Yorkshire', batch_id: B5, farm_id: F3, birth: 54, purchase: 0, partner: null },
    { identifier: 'X-403', name: 'Coco',     sex: 'macho',  breed: 'Landrace',  batch_id: B5, farm_id: F3, birth: 52, purchase: 0, partner: null }
  ];

  const pigIds = {};
  for (const p of pigs) {
    const notes = [];
    if (p.birth) notes.push('Nacimiento: ' + dateAgo(p.birth));
    else {
      notes.push('Compra: ' + dateAgo(p.purchaseAgo));
      notes.push('Peso inicial: ' + p.startWeight + ' kg');
    }
    let r;
    if (p.birth) {
      r = db.prepare("INSERT INTO pigs (identifier, name, sex, breed, birth_date, batch_id, farm_id, purchase_cost, partner_id, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')")
        .run(p.identifier, p.name, p.sex, p.breed, dateAgo(p.birth), p.batch_id, p.farm_id, p.purchase, p.partner, notes.join(' | '));
    } else {
      r = db.prepare("INSERT INTO pigs (identifier, name, sex, breed, batch_id, farm_id, purchase_cost, partner_id, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')")
        .run(p.identifier, p.name, p.sex, p.breed, p.batch_id, p.farm_id, p.purchase, p.partner, notes.join(' | '));
    }
    pigIds[p.identifier] = Number(r.lastInsertRowid);
  }

  // ========== PESOS ==========
  for (const p of pigs) {
    const pid = pigIds[p.identifier];
    if (p.birth) {
      const daysToWean = p.birth - 21;
      let w = 6.5 + Math.random() * 2.5;
      db.prepare('INSERT INTO weight_records (pig_id, date, weight_kg, notes, farm_id) VALUES (?, ?, ?, ?, ?)')
        .run(pid, dateAgo(daysToWean), Math.round(w * 10) / 10, 'Peso al destete', p.farm_id);
      let currentW = w;
      for (let d = daysToWean - 7; d >= 0; d -= 7) {
        currentW += 1.4 + Math.random() * 1.6;
        if (currentW > 42) currentW = 42;
        db.prepare('INSERT INTO weight_records (pig_id, date, weight_kg, notes, farm_id) VALUES (?, ?, ?, ?, ?)')
          .run(pid, dateAgo(d), Math.round(currentW * 10) / 10, '', p.farm_id);
      }
    } else {
      const dailyGain = 0.65 + Math.random() * 0.25;
      let currentW = p.startWeight;
      db.prepare('INSERT INTO weight_records (pig_id, date, weight_kg, notes, farm_id) VALUES (?, ?, ?, ?, ?)')
        .run(pid, dateAgo(p.purchaseAgo), p.startWeight, 'Peso de compra', p.farm_id);
      for (let d = p.purchaseAgo - 7; d >= 0; d -= 7) {
        currentW += dailyGain * 7;
        db.prepare('INSERT INTO weight_records (pig_id, date, weight_kg, notes, farm_id) VALUES (?, ?, ?, ?, ?)')
          .run(pid, dateAgo(d), Math.round(currentW * 10) / 10, '', p.farm_id);
      }
    }
  }

  // ========== ALIMENTACION ==========
  const feedCost = { 'Balanceado 18%': 0.42, 'Balanceado 16%': 0.40, 'Maiz molido': 0.28, 'Salvado': 0.22 };

  for (const p of pigs) {
    const pid = pigIds[p.identifier];
    const daysBack = p.birth ? Math.min(p.birth - 21, 90) : Math.min(p.purchaseAgo, 90);
    for (let d = daysBack; d >= 0; d -= 1) {
      if (Math.random() < 0.15) continue;
      const lastW = db.prepare('SELECT weight_kg FROM weight_records WHERE pig_id = ? AND date <= ? ORDER BY date DESC LIMIT 1').get(pid, dateAgo(d));
      const wKg = lastW ? lastW.weight_kg : 15;
      let qty = wKg * 0.045 + (Math.random() - 0.5) * 0.6;
      if (qty < 0.8) qty = 0.8;
      const r = Math.random();
      const ft = r < 0.55 ? 'Balanceado 18%' : (r < 0.8 ? 'Maiz molido' : 'Salvado');
      const cpk = feedCost[ft];
      const partner = Math.random() < 0.5 ? P1 : P2;
      db.prepare('INSERT INTO feeding_records (pig_id, date, food_type, quantity_kg, cost_per_kg, total_cost, notes, farm_id, partner_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(pid, dateAgoWithTime(d, 7 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60)), ft, Math.round(qty * 100) / 100, cpk, Math.round(qty * cpk * 100) / 100, '', p.farm_id, partner);
    }
  }

  // ========== SALUD ==========
  const healthEvents = [
    { id: 'D-002', type: 'vacuna', desc: 'Vacuna Aujesky (2da dosis)', med: 'Vacuna Aujesky', cost: 45, date: 40 },
    { id: 'E-101', type: 'desparasitante', desc: 'Desparasitacion externa', med: 'Ivermectina', cost: 35, date: 25 },
    { id: 'E-103', type: 'tratamiento', desc: 'Diarrea - tratamiento', med: 'Amoxicilina', cost: 60, date: 12 },
    { id: 'C-201', type: 'vacuna', desc: 'Desparasitacion interna', med: 'Fenbendazol', cost: 50, date: 18 },
    { id: 'C-204', type: 'tratamiento', desc: 'Cojera - revision', med: 'Antiinflamatorio', cost: 80, date: 8 },
    { id: 'X-401', type: 'vacuna', desc: 'Vacuna aftosa', med: 'Vacuna Aftosa', cost: 40, date: 30 },
    { id: 'R-301', type: 'chequeo', desc: 'Chequeo reproductivo', med: '', cost: 30, date: 15 },
    { id: 'D-005', type: 'tratamiento', desc: 'Herida en orejas', med: 'Antiseptico', cost: 25, date: 20 }
  ];
  for (const h of healthEvents) {
    const p = pigs.find(x => x.identifier === h.id);
    const pid = pigIds[p.identifier];
    const nextDue = h.date > 15 ? dateAgo(h.date - 15) : dateAgo(-(15 - h.date));
    db.prepare('INSERT INTO health_records (pig_id, date, record_type, description, medicine, cost, next_due_date, notes, farm_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(pid, dateAgo(h.date), h.type, h.desc, h.med, h.cost, nextDue, '', p.farm_id);
  }

  // ========== GASTOS ==========
  // NOTA: el costo del alimento NO se registra aqui porque ya se contabiliza
  // automaticamente en cada registro de alimentacion (feeding_records).
  const expenses = [
    { cat: 'Medicina', desc: 'Veterinario - visita mensual', amount: 60, days: 10, farm: F1 },
    { cat: 'Medicina', desc: 'Compra de vacunas', amount: 95, days: 45, farm: F1 },
    { cat: 'Medicina', desc: 'Desparasitacion (productos)', amount: 105, days: 30, farm: F2 },
    { cat: 'Medicina', desc: 'Vitaminas y minerales', amount: 55, days: 20, farm: F2 },
    { cat: 'Medicina', desc: 'Botiquin veterinario', amount: 45, days: 60, farm: F3 },
    { cat: 'Transporte', desc: 'Flete de alimento', amount: 45, days: 12, farm: F1 },
    { cat: 'Transporte', desc: 'Transporte de cerdos a mercado', amount: 85, days: 15, farm: F1 },
    { cat: 'Transporte', desc: 'Flete de insumos', amount: 35, days: 25, farm: F2 },
    { cat: 'Transporte', desc: 'Gasolina y mantenimiento', amount: 40, days: 6, farm: F3 },
    { cat: 'Mano de obra', desc: 'Ayuda temporal - EVENTO 1', amount: 160, days: 30, farm: F1 },
    { cat: 'Mano de obra', desc: 'Ayuda temporal - EVENTO 2', amount: 175, days: 10, farm: F2 },
    { cat: 'Infraestructura', desc: 'Reparacion de bebederos', amount: 85, days: 40, farm: F1 },
    { cat: 'Infraestructura', desc: 'Pintura y mantenimiento de galpon', amount: 110, days: 55, farm: F2 },
    { cat: 'Servicios', desc: 'Energia electrica', amount: 75, days: 9, farm: F2 },
    { cat: 'Servicios', desc: 'Agua', amount: 45, days: 9, farm: F1 }
  ];
  for (const e of expenses) {
    const partner = Math.random() < 0.5 ? P1 : P2;
    db.prepare('INSERT INTO expenses (date, category, description, amount, farm_id, partner_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(dateAgo(e.days), e.cat, e.desc, e.amount, e.farm, partner, '');
  }

  // ========== VENTAS ==========
  const sales = [
    { id: 'E-101', buyer: 'Carniceria Don Pepe', qty: 118, price: 2.25, days: 20, farm: F1 },
    { id: 'E-102', buyer: 'Supermercados del Centro', qty: 126, price: 2.30, days: 20, farm: F1 },
    { id: 'E-103', buyer: 'Restaurante La Parrilla', qty: 112, price: 2.20, days: 16, farm: F1 },
    { id: 'E-104', buyer: 'Mercado Municipal', qty: 115, price: 2.24, days: 16, farm: F1 },
    { id: 'E-105', buyer: 'Frigorifico del Valle', qty: 108, price: 2.22, days: 12, farm: F1 },
    { id: 'E-106', buyer: 'Carniceria Don Pepe', qty: 110, price: 2.18, days: 12, farm: F1 },
    { id: 'C-201', buyer: 'Supermercados del Sur', qty: 124, price: 2.28, days: 9, farm: F2 },
    { id: 'C-202', buyer: 'Exportadora Andina', qty: 118, price: 2.22, days: 9, farm: F2 },
    { id: 'C-203', buyer: 'Exportadora Andina', qty: 132, price: 2.32, days: 5, farm: F2 },
    { id: 'C-204', buyer: 'Restaurante La Parrilla', qty: 120, price: 2.26, days: 5, farm: F2 },
    { id: 'C-205', buyer: 'Frigorifico del Valle', qty: 130, price: 2.25, days: 2, farm: F2 }
  ];
  for (const s of sales) {
    const pid = pigIds[s.id];
    const total = Math.round(s.qty * s.price * 100) / 100;
    db.prepare('INSERT INTO sales (date, pig_id, buyer_name, quantity_kg, price_per_kg, total_amount, sale_type, farm_id, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(dateAgo(s.days), pid, s.buyer, s.qty, s.price, total, 'por peso', s.farm, 'Venta demo');
    db.prepare("UPDATE pigs SET status = 'sold' WHERE id = ?").run(pid);
  }

  // ========== INVENTARIO ==========
  const catIds = {};
  const invCats = ['Alimento', 'Medicina', 'Equipo', 'Otros'];
  for (let i = 0; i < invCats.length; i++) {
    const r = db.prepare('INSERT INTO inventory_categories (name, farm_id) VALUES (?, ?)').run(invCats[i], F1);
    catIds[invCats[i]] = Number(r.lastInsertRowid);
  }

  const items = [
    { name: 'Balanceado 18% Premium', cat: 'Alimento', qty: 850, unit: 'kg', min: 300, cost: 0.42, farm: F1 },
    { name: 'Balanceado 16% Crecimiento', cat: 'Alimento', qty: 400, unit: 'kg', min: 200, cost: 0.40, farm: F1 },
    { name: 'Maiz molido', cat: 'Alimento', qty: 1200, unit: 'kg', min: 400, cost: 0.28, farm: F1 },
    { name: 'Soja molida', cat: 'Alimento', qty: 150, unit: 'kg', min: 200, cost: 0.65, farm: F1 },
    { name: 'Salvado de trigo', cat: 'Alimento', qty: 300, unit: 'kg', min: 150, cost: 0.22, farm: F1 },
    { name: 'Ivermectina', cat: 'Medicina', qty: 3, unit: 'bot', min: 5, cost: 85, farm: F1 },
    { name: 'Amoxicilina 20%', cat: 'Medicina', qty: 2, unit: 'bot', min: 4, cost: 120, farm: F1 },
    { name: 'Vacuna Aujesky', cat: 'Medicina', qty: 1, unit: 'dosis', min: 3, cost: 45, farm: F1 },
    { name: 'Vitaminas AD3E', cat: 'Medicina', qty: 4, unit: 'bot', min: 2, cost: 65, farm: F2 },
    { name: 'Bebederos automaticos', cat: 'Equipo', qty: 8, unit: 'und', min: 2, cost: 45, farm: F1 },
    { name: 'Comederos lineales', cat: 'Equipo', qty: 12, unit: 'und', min: 4, cost: 28, farm: F2 },
    { name: 'Aspersores', cat: 'Equipo', qty: 3, unit: 'und', min: 2, cost: 95, farm: F2 },
    { name: 'Balanza digital', cat: 'Equipo', qty: 1, unit: 'und', min: 1, cost: 180, farm: F3 },
    { name: 'Guantes de manejo', cat: 'Otros', qty: 20, unit: 'und', min: 10, cost: 3, farm: F3 }
  ];
  for (const it of items) {
    db.prepare('INSERT INTO inventory_items (name, category_id, current_qty, unit, min_qty, unit_cost, notes, farm_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .run(it.name, catIds[it.cat], it.qty, it.unit, it.min, it.cost, '', it.farm);
  }

  // ========== TAREAS ==========
  const templates = [
    { name: 'Revisar bebederos', cat: 'Manejo' },
    { name: 'Revisar comederos', cat: 'Manejo' },
    { name: 'Limpiar galpon', cat: 'Limpieza' },
    { name: 'Aplicar medicina preventiva', cat: 'Salud' },
    { name: 'Registrar pesos', cat: 'Salud' },
    { name: 'Revisar estado de cerdos', cat: 'Manejo' },
    { name: 'Contar alimento en bodega', cat: 'Inventario' },
    { name: 'Desinfectar equipo', cat: 'Limpieza' }
  ];
  let sort = 0;
  for (const t of templates) {
    db.prepare('INSERT INTO task_templates (name, category, sort_order) VALUES (?, ?, ?)').run(t.name, t.cat, sort++);
  }
  const tplIds = db.prepare('SELECT id FROM task_templates ORDER BY sort_order').all().map(r => r.id);

  for (let d = 30; d >= 0; d--) {
    const nTasks = 3 + Math.floor(Math.random() * 3);
    const chosen = tplIds.slice().sort(() => Math.random() - 0.5).slice(0, nTasks);
    for (const t of chosen) {
      const done = Math.random() < 0.82 ? 1 : 0;
      db.prepare('INSERT INTO daily_task_logs (task_template_id, date, completed, notes) VALUES (?, ?, ?, ?)')
        .run(t, dateAgo(d), done, '');
    }
  }

  // ========== BITACORA ==========
  const logs = [
    { title: 'Recepcion de alimento', text: 'Se recibio lote de alimento nuevo. Almacenado en bodega principal.', farm: F1 },
    { title: 'Revision veterinaria', text: 'Revision veterinaria mensual completada. Todo en orden.', farm: F1 },
    { title: 'Mantenimiento', text: 'Se reparo el bebedero del corral 3. Funcionando bien.', farm: F1 },
    { title: 'Clima calido', text: 'Inicio de temporada de calor. Se intensificaron los riegos.', farm: F2 },
    { title: 'Pesaje semanal', text: 'Se pesan todos los cerdos del lote de engorde.', farm: F2 },
    { title: 'Venta de cerdos', text: 'Se llevaron cerdos vendidos a mercado. Excelente estado.', farm: F3 },
    { title: 'Desparasitacion', text: 'Control de desparasitacion trimestral.', farm: F2 },
    { title: 'Reparacion', text: 'Se reparo el techo del galpon de destete.', farm: F1 }
  ];
  for (let i = 0; i < logs.length; i++) {
    db.prepare('INSERT INTO daily_logs (date, title, content, farm_id) VALUES (?, ?, ?, ?)')
      .run(dateAgo(i * 7 + 3), logs[i].title, logs[i].text, logs[i].farm);
  }

  // ========== REPRODUCCION ==========
  const repro = [
    { sow: 'R-301', boar: 'E-101', mating: 95, farrowing: 19, alive: 9, dead: 1, result: 'exitoso', notes: 'Parto normal' },
    { sow: 'R-302', boar: 'E-101', mating: 85, farrowing: 9, alive: 7, dead: 0, result: 'exitoso', notes: '' },
    { sow: 'D-003', boar: 'C-203', mating: 65, farrowing: null, alive: null, dead: null, result: null, notes: 'Gestacion en curso' },
    { sow: 'D-004', boar: 'C-203', mating: 62, farrowing: null, alive: null, dead: null, result: null, notes: 'Gestacion en curso' }
  ];
  for (const r of repro) {
    const farm = pigs.find(p => p.identifier === r.sow).farm_id;
    db.prepare('INSERT INTO reproduction_records (sow_id, boar_id, mating_date, expected_farrowing_date, farrowing_date, piglets_alive, piglets_dead, result, notes, farm_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(pigIds[r.sow], pigIds[r.boar], dateAgo(r.mating), dateAgo(r.mating - 114), r.farrowing ? dateAgo(r.farrowing) : null, r.alive, r.dead, r.result, r.notes, farm);
  }

  // ========== PEDIDOS DE ALIMENTO ==========
  const orders = [
    { supplier: 'Distribuidora Agropecuaria del Norte', item: 'Balanceado 18%', qty: 1000, unit: 0.42, days: 45, status: 'received', farm: F1 },
    { supplier: 'Forrajera del Centro', item: 'Maiz molido', qty: 2000, unit: 0.28, days: 25, status: 'received', farm: F1 },
    { supplier: 'AgroInsumos del Sur', item: 'Racion crecimiento 16%', qty: 500, unit: 0.38, days: 10, status: 'pending', farm: F2 },
    { supplier: 'Distribuidora Agropecuaria del Norte', item: 'Balanceado 16%', qty: 800, unit: 0.40, days: 5, status: 'pending', farm: F3 }
  ];
  for (const o of orders) {
    const received = o.status === 'received' ? o.qty : 0;
    db.prepare('INSERT INTO feed_orders (supplier, order_date, delivery_date, item_name, quantity_ordered, quantity_received, unit_cost, total_cost, status, farm_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(o.supplier, dateAgo(o.days), o.status === 'received' ? dateAgo(o.days - 3) : null, o.item, o.qty, received, o.unit, Math.round(o.qty * o.unit * 100) / 100, o.status, o.farm);
  }

  console.log('[SEED] Datos demo cargados:');
  console.log('[SEED]   ' + farms.length + ' granjas, ' + partners.length + ' socios');
  console.log('[SEED]   ' + pigs.length + ' cerdos, ' + batches.length + ' lotes');
  console.log('[SEED]   ' + expenses.length + ' gastos, ' + sales.length + ' ventas');
}

module.exports = { runSeed };