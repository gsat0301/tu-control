import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const portfolioSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  label: z.string().default('Personal'),
  color: z.string().default('#1daa52'),
  icon: z.string().default('💼'),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const portfolios = await prisma.portfolio.findMany({
    where: { userId: session.user.id },
    include: {
      transactions: {
        select: { amount: true, type: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(portfolios);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = portfolioSchema.parse(body);

    const portfolio = await prisma.portfolio.create({
      data: { ...data, userId: session.user.id },
    });

    return NextResponse.json(portfolio, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
