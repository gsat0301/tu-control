import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') return null;
  return session;
}

export async function GET() {
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
