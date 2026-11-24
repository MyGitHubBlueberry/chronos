import nodemailer from 'nodemailer';
import { AppError } from '../utils/error.js';

export async function sendAuthMail(to, token) {
    const { ETHEREAL_USER, ETHEREAL_PASS } = process.env;
    if (!ETHEREAL_USER || !ETHEREAL_PASS) {
        throw new AppError('Email delivery is unavailable.', 503);
    }

    const subject = 'Confirm your Chronos email';
    const baseUrl = process.env.FRONTEND_PUBLIC_URL?.trim() || 'http://localhost:5173';
    const link = new URL('/confirm-email', baseUrl);
    link.hash = new URLSearchParams({ token }).toString();
    const htmlLink = link.href.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
    const transport = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: { user: ETHEREAL_USER, pass: ETHEREAL_PASS },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 8000,
    });

    try {
        await transport.sendMail({
            from: { name: 'Chronos', address: ETHEREAL_USER },
            to,
            subject,
            text: `${subject}: ${link.href}\n\nIf you did not request this, you can ignore this email.`,
            html: `<p><a href="${htmlLink}">${subject}</a></p><p>If you did not request this, you can ignore this email.</p>`,
        });
    } catch {
        throw new AppError('Email delivery is temporarily unavailable.', 503);
    }
}
