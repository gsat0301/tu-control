import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const transactionSchema = z.object({
  amount: z.number().positive('El monto debe ser positivo'),
  description: z.string().min(1, 'La descripción es requerida'),
  date: z.string(),
  type: z.enum(['expense', 'income', 'saving']),
  category: z.string().min(1),
  portfolioId: z.string().min(1),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const portfolioId = searchParams.get('portfolioId');
  const type = searchParams.get('type');
  const limit = parseInt(searchParams.get('limit') ?? '50');

  // Verificar que los portafolios pertenecen al usuario
  const userPortfolios = await prisma.portfolio.findMany({
    where: { userId: session.user.id },
    select: { id: true },
  });
  const portfolioIds = userPortfolios.map((p) => p.id);

  const transactions = await prisma.transaction.findMany({
    where: {
      portfolioId: portfolioId
        ? { in: [portfolioId].filter((id) => portfolioIds.includes(id)) }
        : { in: portfolioIds },
      ...(type ? { type: type as 'expense' | 'income' | 'saving' } : {}),
    },
    orderBy: { date: 'desc' },
    take: limit,
    include: { portfolio: { select: { name: true, color: true } } },
  });

  return NextResponse.json(transactions);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    const data = transactionSchema.parse(body);

    // Verificar que el portafolio pertenece al usuario
    const portfolio = await prisma.portfolio.findFirst({
      where: { id: data.portfolioId, userId: session.user.id },
    });
    if (!portfolio) {
      return NextResponse.json({ error: 'Portafolio no encontrado' }, { status: 404 });
    }

    const transaction = await prisma.transaction.create({
      data: {
        ...data,
        date: new Date(data.date),
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
