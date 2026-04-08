import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // 1️⃣ Evita que Vercel colapse por importar auth() (que usa bcrypt)

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') return null;
  return session;
}

// 2️⃣ Agregamos "_req: NextRequest" para obligar a Next.js a tratarlo como dinámico
export async function GET(_req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const requests = await prisma.contactRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(requests);
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 403 });

  const { id, status } = await req.json();

  const updated = await prisma.contactRequest.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}