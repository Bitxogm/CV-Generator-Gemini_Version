import sgMail from '@sendgrid/mail';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY no está configurada');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
    try {
      const msg = {
        to,
        from: {
          email: process.env.EMAIL_FROM || 'talenthub@bitxodev.com',
          name: process.env.EMAIL_FROM_NAME || 'TalentHub',
        },
        subject,
        html,
      };

      await sgMail.send(msg);
      console.log(`✅ Email enviado a: ${to}`);
    } catch (error: any) {
      console.error('❌ Error enviando email:', error.response?.body || error);
      throw error;
    }
  }

  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ¡Bienvenido a TalentHub!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${username}</strong>,</p>
              <p>¡Gracias por registrarte en TalentHub!</p>
              <p>Con TalentHub podrás:</p>
              <ul>
                <li>✅ Crear CVs profesionales con IA</li>
                <li>✅ Guardar múltiples versiones</li>
                <li>✅ Generar PDFs optimizados</li>
              </ul>
            </div>
            <div class="footer">
              <p>Made with 🔥 and 💪 by Otaku&Obama Development</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to,
      subject: '🎉 ¡Bienvenido a TalentHub!',
      html,
    });
  }

  async sendCVCreatedEmail(to: string, username: string, cvTitle: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .cv-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ CV Guardado Correctamente</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${username}</strong>,</p>
              <p>Tu CV ha sido guardado exitosamente en TalentHub.</p>
              <div class="cv-box">
                <h3>📄 ${cvTitle}</h3>
                <p>Guardado: ${new Date().toLocaleDateString('es-ES', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
            <div class="footer">
              <p>Made with 🔥 and 💪 by Otaku&Obama Development</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to,
      subject: `✅ CV "${cvTitle}" guardado correctamente`,
      html,
    });
  }

  async sendAccountDeletedEmail(to: string, username: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>👋 Cuenta Eliminada</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${username}</strong>,</p>
              <p>Tu cuenta de TalentHub ha sido eliminada correctamente.</p>
              <p>Todos tus datos han sido borrados de manera permanente.</p>
              <p>Lamentamos verte partir. Si cambias de opinión, siempre serás bienvenido de nuevo.</p>
            </div>
            <div class="footer">
              <p>Made with 🔥 and 💪 by Otaku&Obama Development</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail({
      to,
      subject: '👋 Tu cuenta de TalentHub ha sido eliminada',
      html,
    });
  }
}