import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(20),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = contactSchema.parse(body);

    // Guardar en la DB
    await prisma.contactRequest.create({
      data: { name, email, message },
    });

    // Enviar email si están configuradas las variables
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"tuControl" <${process.env.GMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL ?? process.env.GMAIL_USER,
        subject: `[tuControl] Nueva solicitud de acceso — ${name}`,
        html: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; background: #0f1117; color: #f0f4ff; padding: 32px; border-radius: 16px;">
            <h1 style="color: #1daa52; font-size: 24px; margin-bottom: 8px;">Nueva solicitud de acceso</h1>
            <p style="color: #8b9abf; margin-bottom: 24px;">Alguien quiere acceso a tuControl</p>
            
            <div style="background: #161b27; border: 1px solid #1e2535; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
              <p><strong style="color: #8b9abf;">Nombre:</strong> <span style="color: #f0f4ff;">${name}</span></p>
              <p><strong style="color: #8b9abf;">Email:</strong> <span style="color: #1daa52;">${email}</span></p>
              <p style="margin-top: 12px;"><strong style="color: #8b9abf;">Mensaje:</strong></p>
              <p style="color: #f0f4ff; white-space: pre-wrap; margin-top: 4px;">${message}</p>
            </div>
            
            <p style="color: #515e7a; font-size: 12px;">Entra al panel admin para aprobar o rechazar: <a href="${process.env.NEXTAUTH_URL}/admin/approve" style="color: #1daa52;">Ver solicitudes</a></p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
    }
    console.error('Error en /api/contact:', err);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
