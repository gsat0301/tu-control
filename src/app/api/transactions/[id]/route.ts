import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateSchema = z.object({
  amount: z.number().positive().optional(),
  description: z.string().min(1).optional(),
  date: z.string().optional(),
  type: z.enum(['expense', 'income', 'saving']).optional(),
  category: z.string().min(1).optional(),
});

async function verifyTransactionOwnership(txId: string, userId: string) {
  const tx = await prisma.transaction.findFirst({
    where: {
      id: txId,
      portfolio: { userId },
    },
  });
  return tx;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const tx = await verifyTransactionOwnership(params.id, session.user.id);
  if (!tx) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    const updated = await prisma.transaction.update({
      where: { id: params.id },
      data: {
        ...data,
        ...(data.date ? { date: new Date(data.date) } : {}),
      },
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

  const tx = await verifyTransactionOwnership(params.id, session.user.id);
  if (!tx) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  await prisma.transaction.delete({ where: { id: params.id } });

  return NextResponse.json({ success: true });
}
