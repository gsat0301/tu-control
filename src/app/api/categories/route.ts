import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const categorySchema = z.object({
  name: z.string().min(1),
  icon: z.string().default('📁'),
  color: z.string().default('#1daa52'),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const categories = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  try {
    const body = await req.json();
    const data = categorySchema.parse(body);

    const category = await prisma.category.create({
      data: { ...data, userId: session.user.id },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

  const category = await prisma.category.findFirst({
    where: { id, userId: session.user.id },
  });
  if (!category) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  await prisma.category.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
