import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  label: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

async function verifyOwnership(portfolioId: string, userId: string) {
  const portfolio = await prisma.portfolio.findFirst({
    where: { id: portfolioId, userId },
  });
  return portfolio;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const portfolio = await verifyOwnership(params.id, session.user.id);
  if (!portfolio) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  const full = await prisma.portfolio.findUnique({
    where: { id: params.id },
    include: {
      transactions: {
        orderBy: { date: 'desc' },
      },
    },
  });

  return NextResponse.json(full);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const portfolio = await verifyOwnership(params.id, session.user.id);
  if (!portfolio) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    const updated = await prisma.portfolio.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const portfolio = await verifyOwnership(params.id, session.user.id);
  if (!portfolio) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  await prisma.portfolio.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
