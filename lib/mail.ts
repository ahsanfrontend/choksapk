import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, text, html }: { to: string; subject: string; text: string; html?: string }) {
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587');
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;

    // Mailtrap API Support
    if (host.includes('mailtrap.io') && pass && !user) {
        try {
            const response = await fetch('https://send.api.mailtrap.io/api/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${pass}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: { email: process.env.MAIL_FROM || 'hello@demomailtrap.co', name: process.env.SITE_NAME || 'Casino Matrix' },
                    to: [{ email: to }],
                    subject,
                    text,
                    html,
                }),
            });
            const data = await response.json();
            if (response.ok) return { success: true };
            return { success: false, error: data.errors?.join(', ') || 'Mailtrap API Error' };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }

    if (!user || !pass) {
        console.log('--- MAIL SIMULATION MODE ---');
        console.log(`To: ${to}`);
        console.log(`Code: ${text.match(/\d{6}/)?.[0] || 'N/A'}`);
        console.log('----------------------------');
        return { success: true, simulated: true };
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
    });

    try {
        await transporter.verify();
        await transporter.sendMail({
            from: `"${process.env.SITE_NAME || 'Casino Matrix'}" <${user}>`,
            to,
            subject,
            text,
            html,
        });
        return { success: true };
    } catch (error: any) {
        console.error('CRITICAL: Email send failure:', error.message);
        return { success: false, error: error.message };
    }
}
