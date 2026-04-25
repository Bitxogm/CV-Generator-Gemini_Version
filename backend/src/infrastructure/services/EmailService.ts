import sgMail from "@sendgrid/mail";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error("SENDGRID_API_KEY no está configurada");
    }
    sgMail.setApiKey(apiKey);
  }

  async sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
    try {
      await sgMail.send({
        to,
        from: {
          email: process.env.EMAIL_FROM || "talenthub@bitxodev.com",
          name: process.env.EMAIL_FROM_NAME || "TalentHub",
        },
        subject,
        html,
      });
      console.log(`✅ Email enviado a: ${to}`);
    } catch (error: any) {
      console.error("❌ Error enviando email:", error.response?.body || error);
      throw error;
    }
  }

  private buildEmailLayout(
    title: string,
    bodyHtml: string,
    headerColor: string = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  ): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${headerColor}; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .cv-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
          .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
          </div>
          <div class="content">
            ${bodyHtml}
          </div>
          <div class="footer">
            <p>TalentHub - Generador de CVs con IA</p>
            <p>&copy; ${new Date().getFullYear()} Todos los derechos reservados</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    const bodyHtml = `
      <p>Hola <strong>${username}</strong>,</p>
      <p>¡Gracias por registrarte en TalentHub!</p>
      <p>Con TalentHub podrás:</p>
      <ul>
        <li>✅ Crear CVs profesionales con IA</li>
        <li>✅ Guardar múltiples versiones</li>
        <li>✅ Generar PDFs optimizados</li>
      </ul>
    `;

    await this.sendEmail({
      to,
      subject: "🎉 ¡Bienvenido a TalentHub!",
      html: this.buildEmailLayout("🎉 ¡Bienvenido a TalentHub!", bodyHtml),
    });
  }

  async sendCVCreatedEmail(to: string, username: string, cvTitle: string): Promise<void> {
    const bodyHtml = `
      <p>Hola <strong>${username}</strong>,</p>
      <p>Tu CV ha sido guardado exitosamente en TalentHub.</p>
      <div class="cv-box">
        <h3>📄 ${cvTitle}</h3>
        <p>Guardado: ${new Date().toLocaleDateString("es-ES", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}</p>
      </div>
    `;

    await this.sendEmail({
      to,
      subject: `✅ CV "${cvTitle}" guardado correctamente`,
      html: this.buildEmailLayout("✅ CV Guardado Correctamente", bodyHtml),
    });
  }

  async sendAccountDeletedEmail(to: string, username: string): Promise<void> {
    const bodyHtml = `
      <p>Hola <strong>${username}</strong>,</p>
      <p>Tu cuenta de TalentHub ha sido eliminada correctamente.</p>
      <p>Todos tus datos han sido borrados de manera permanente.</p>
      <p>Lamentamos verte partir. Si cambias de opinión, siempre serás bienvenido de nuevo.</p>
    `;

    await this.sendEmail({
      to,
      subject: "👋 Tu cuenta de TalentHub ha sido eliminada",
      html: this.buildEmailLayout("👋 Cuenta Eliminada", bodyHtml, "#dc2626"),
    });
  }

  async sendCVUpdateReminder(to: string, userName: string, cvTitle: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || "https://talent.bitxodev.com";

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">⏰ ¡Actualiza tu CV!</h1>
        </div>

        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px;">Hola <strong>${userName}</strong>,</p>

          <p>Han pasado 90 días desde la última actualización de tu CV <strong>"${cvTitle}"</strong>.</p>

          <p>💡 <strong>¿Por qué es importante actualizarlo?</strong></p>
          <ul style="line-height: 1.8;">
            <li>Nuevas habilidades adquiridas</li>
            <li>Proyectos recientes completados</li>
            <li>Certificaciones obtenidas</li>
            <li>Mantener tu perfil competitivo</li>
          </ul>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${frontendUrl}"
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                      color: white;
                      padding: 15px 40px;
                      text-decoration: none;
                      border-radius: 5px;
                      font-weight: bold;
                      display: inline-block;">
              Actualizar mi CV
            </a>
          </div>

          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            Este es un recordatorio automático de TalentHub. Si ya actualizaste tu CV, puedes ignorar este mensaje.
          </p>
        </div>

        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>TalentHub - Tu CV profesional, siempre actualizado</p>
        </div>
      </body>
      </html>
    `;

    await this.sendEmail({
      to,
      subject: "⏰ Es momento de actualizar tu CV - TalentHub",
      html,
    });
  }
}
