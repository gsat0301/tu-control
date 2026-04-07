import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuario administrador
  const adminPassword = await bcrypt.hash('Admin123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@tucontrol.app' },
    update: {},
    create: {
      email: 'admin@tucontrol.app',
      passwordHash: adminPassword,
      name: 'Administrador',
      role: 'admin',
      isPremium: true,
      isActive: true,
    },
  });

  console.log('✅ Usuario admin creado:', admin.email);

  // Crear usuario de prueba
  const userPassword = await bcrypt.hash('Test123!', 12);

  const testUser = await prisma.user.upsert({
    where: { email: 'demo@tucontrol.app' },
    update: {},
    create: {
      email: 'demo@tucontrol.app',
      passwordHash: userPassword,
      name: 'Usuario Demo',
      role: 'user',
      isPremium: false,
      isActive: true,
    },
  });

  console.log('✅ Usuario demo creado:', testUser.email);

  // Crear categorías por defecto para el usuario demo
  const categorias = [
    { name: 'Alimentación', icon: '🍔', color: '#ef4444' },
    { name: 'Transporte', icon: '🚗', color: '#f97316' },
    { name: 'Vivienda', icon: '🏠', color: '#eab308' },
    { name: 'Salud', icon: '💊', color: '#22c55e' },
    { name: 'Entretenimiento', icon: '🎬', color: '#3b82f6' },
    { name: 'Ropa', icon: '👕', color: '#8b5cf6' },
    { name: 'Educación', icon: '📚', color: '#06b6d4' },
    { name: 'Trabajo', icon: '💼', color: '#1daa52' },
    { name: 'Ahorro', icon: '💰', color: '#f59e0b' },
    { name: 'Otros', icon: '📦', color: '#6b7280' },
  ];

  for (const cat of categorias) {
    await prisma.category.upsert({
      where: { name_userId: { name: cat.name, userId: testUser.id } },
      update: {},
      create: { ...cat, userId: testUser.id },
    });
  }

  console.log('✅ Categorías por defecto creadas');

  // Crear portafolio de ejemplo
  const portfolio = await prisma.portfolio.upsert({
    where: { id: 'portfolio-demo-personal' },
    update: {},
    create: {
      id: 'portfolio-demo-personal',
      name: 'Gastos Personales',
      label: 'Personal',
      color: '#1daa52',
      icon: '💼',
      userId: testUser.id,
    },
  });

  console.log('✅ Portafolio de ejemplo creado');

  // Crear transacciones de ejemplo
  const hoy = new Date();
  const transacciones = [
    { amount: 2500, description: 'Salario mensual', type: 'income' as const, category: 'Trabajo', date: new Date(hoy.getFullYear(), hoy.getMonth(), 1) },
    { amount: 450, description: 'Supermercado semanal', type: 'expense' as const, category: 'Alimentación', date: new Date(hoy.getFullYear(), hoy.getMonth(), 3) },
    { amount: 80, description: 'Gasolina', type: 'expense' as const, category: 'Transporte', date: new Date(hoy.getFullYear(), hoy.getMonth(), 5) },
    { amount: 500, description: 'Ahorro del mes', type: 'saving' as const, category: 'Ahorro', date: new Date(hoy.getFullYear(), hoy.getMonth(), 5) },
    { amount: 120, description: 'Cena restaurante', type: 'expense' as const, category: 'Alimentación', date: new Date(hoy.getFullYear(), hoy.getMonth(), 8) },
    { amount: 200, description: 'Factura del teléfono', type: 'expense' as const, category: 'Otros', date: new Date(hoy.getFullYear(), hoy.getMonth(), 10) },
    { amount: 60, description: 'Streaming + servicios', type: 'expense' as const, category: 'Entretenimiento', date: new Date(hoy.getFullYear(), hoy.getMonth(), 12) },
  ];

  for (const tx of transacciones) {
    await prisma.transaction.create({
      data: { ...tx, portfolioId: portfolio.id },
    });
  }

  console.log('✅ Transacciones de ejemplo creadas');
  console.log('\n🎉 Seed completado exitosamente!');
  console.log('\n📋 Credenciales de acceso:');
  console.log('   Admin → admin@tucontrol.app / Admin123!');
  console.log('   Demo  → demo@tucontrol.app  / Test123!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
