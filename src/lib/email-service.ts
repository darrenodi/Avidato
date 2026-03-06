import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Helper to ensure NEXTAUTH_URL has proper formatting
const getBaseUrl = () => {
  const url = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return url.endsWith('/') ? url.slice(0, -1) : url
}

export async function sendVerificationEmail(
  email: string,
  verificationToken: string,
  userName?: string
) {
  try {
    const verificationUrl = `${getBaseUrl()}/api/auth/verify-email?token=${verificationToken}`
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3d74b5 0%, #467bab 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
            .content { background: #f9fafb; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .greeting { font-size: 16px; margin-bottom: 20px; }
            .message { font-size: 14px; color: #666; margin-bottom: 30px; line-height: 1.8; }
            .button-wrapper { text-align: center; margin: 30px 0; }
            .verify-button { display: inline-block; background: #3d74b5 !important; color: white !important; padding: 15px 40px !important; text-decoration: none !important; border-radius: 6px; font-weight: 600 !important; font-size: 15px !important; }
            .verify-button:hover { background: #2d5a8f !important; }
            .divider { text-align: center; color: #999; margin: 20px 0; font-size: 12px; }
            .link-text { font-size: 12px; word-break: break-all; color: #3d74b5; }
            .footer { font-size: 12px; color: #999; margin-top: 20px; text-align: center; }
            .footer a { color: #3d74b5; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email</h1>
            </div>
            <div class="content">
              <div class="greeting">
                Hi ${userName || 'there'},
              </div>
              <div class="message">
                Thank you for signing up with Avidato! To get started with creating AI-powered lesson plans, please verify your email address by clicking the button below.
              </div>
              <div class="button-wrapper">
                <a href="${verificationUrl}" class="verify-button">Verify Email Address</a>
              </div>
              <div class="divider">
                or copy and paste this link in your browser:
              </div>
              <div class="link-text">
                ${verificationUrl}
              </div>
              <div class="message" style="margin-top: 30px; font-size: 12px; color: #999;">
                This link will expire in 24 hours. If you didn't create this account, you can safely ignore this email.
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Avidato. All rights reserved.</p>
                <p><a href="${getBaseUrl()}/privacy">Privacy Policy</a> | <a href="${getBaseUrl()}/terms">Terms of Service</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const response = await resend.emails.send({
      from: 'support@avidato.com',
      to: email,
      subject: 'Verify Your Avidato Email Address',
      html: htmlContent,
    })

    if (response.error) {
      console.error('Resend error:', response.error)
      throw new Error(`Failed to send verification email: ${response.error.message}`)
    }

    return response
  } catch (error) {
    console.error('Email service error:', error)
    throw error
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  userName?: string
) {
  try {
    const resetUrl = `${getBaseUrl()}/api/auth/reset-password?token=${resetToken}`
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3d74b5 0%, #467bab 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
            .content { background: #f9fafb; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .greeting { font-size: 16px; margin-bottom: 20px; }
            .message { font-size: 14px; color: #666; margin-bottom: 30px; line-height: 1.8; }
            .button-wrapper { text-align: center; margin: 30px 0; }
            .reset-button { display: inline-block; background: #3d74b5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
            .reset-button:hover { background: #2d5a8f; }
            .divider { text-align: center; color: #999; margin: 20px 0; font-size: 12px; }
            .link-text { font-size: 12px; word-break: break-all; color: #3d74b5; }
            .footer { font-size: 12px; color: #999; margin-top: 20px; text-align: center; }
            .footer a { color: #3d74b5; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <div class="greeting">
                Hi ${userName || 'there'},
              </div>
              <div class="message">
                We received a request to reset your password. Click the button below to create a new password.
              </div>
              <div class="button-wrapper">
                <a href="${resetUrl}" class="reset-button">Reset Password</a>
              </div>
              <div class="divider">
                or copy and paste this link in your browser:
              </div>
              <div class="link-text">
                ${resetUrl}
              </div>
              <div class="message" style="margin-top: 30px; font-size: 12px; color: #999;">
                This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} Avidato. All rights reserved.</p>
                <p><a href="${getBaseUrl()}/privacy">Privacy Policy</a> | <a href="${getBaseUrl()}/terms">Terms of Service</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const response = await resend.emails.send({
      from: 'support@avidato.com',
      to: email,
      subject: 'Reset Your Avidato Password',
      html: htmlContent,
    })

    if (response.error) {
      console.error('Resend error:', response.error)
      throw new Error(`Failed to send password reset email: ${response.error.message}`)
    }

    return response
  } catch (error) {
    console.error('Email service error:', error)
    throw error
  }
}

export async function sendWelcomeEmail(
  email: string,
  userName?: string
) {
  try {
    const dashboardUrl = `${getBaseUrl()}/dashboard`
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3d74b5 0%, #467bab 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
            .content { background: #f9fafb; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .greeting { font-size: 16px; margin-bottom: 20px; font-weight: 600; }
            .message { font-size: 14px; color: #666; margin-bottom: 20px; line-height: 1.8; }
            .features { margin: 25px 0; }
            .feature { display: flex; margin-bottom: 15px; }
            .feature-icon { font-size: 20px; margin-right: 12px; min-width: 24px; }
            .feature-text { font-size: 14px; color: #666; }
            .feature-title { font-weight: 600; color: #333; }
            .button-wrapper { text-align: center; margin: 30px 0; }
            .cta-button { display: inline-block; background: #3d74b5 !important; color: white !important; padding: 15px 40px !important; text-decoration: none !important; border-radius: 6px; font-weight: 600 !important; font-size: 15px !important; }
            .cta-button:hover { background: #2d5a8f !important; }
            .support-section { background: #e8f0f7; padding: 15px; border-left: 4px solid #3d74b5; margin: 20px 0; border-radius: 4px; }
            .support-section p { margin: 0; font-size: 13px; color: #555; }
            .footer { font-size: 12px; color: #999; margin-top: 20px; text-align: center; }
            .footer a { color: #3d74b5; text-decoration: none; }
            .divider { border-top: 1px solid #ddd; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Avidato! 🎓</h1>
            </div>
            <div class="content">
              <div class="greeting">
                Hi ${userName || 'there'},
              </div>
              <div class="message">
                Welcome to Avidato! We're thrilled to have you on board. You're now part of a community of educators using AI to create engaging, personalized lesson plans.
              </div>
              
              <div class="features">
                <div class="feature">
                  <div class="feature-icon">✨</div>
                  <div class="feature-text">
                    <div class="feature-title">AI-Powered Lesson Generation</div>
                    <div>Create customized lesson plans in minutes with our advanced AI engine</div>
                  </div>
                </div>
                
                <div class="feature">
                  <div class="feature-icon">👥</div>
                  <div class="feature-text">
                    <div class="feature-title">Manage Multiple Students</div>
                    <div>Track different students' progress and create personalized lessons for each</div>
                  </div>
                </div>
                
                <div class="feature">
                  <div class="feature-icon">📚</div>
                  <div class="feature-text">
                    <div class="feature-title">Multiple Lesson Types</div>
                    <div>Choose from conversation, roleplay, discussion, and many more interactive formats</div>
                  </div>
                </div>
                
                <div class="feature">
                  <div class="feature-icon">🎯</div>
                  <div class="feature-text">
                    <div class="feature-title">Language Proficiency Levels</div>
                    <div>Support learners from A1 to C2 with content matched to their level</div>
                  </div>
                </div>
              </div>

              <div class="button-wrapper">
                <a href="${dashboardUrl}" class="cta-button">Get Started on Your Dashboard</a>
              </div>

              <div class="support-section">
                <p><strong>⚠️ Didn't sign up for Avidato?</strong> If you didn't create this account or believe this was a mistake, you can safely disregard this message. If you're concerned about unauthorized account creation, please contact us at support@avidato.com immediately.</p>
              </div>

              <div class="support-section">
                <p><strong>Need help?</strong> Check out our documentation or reach out to support at support@avidato.com. We're here to help!</p>
              </div>

              <div class="divider"></div>
              
              <div class="message" style="font-size: 12px; color: #999;">
                Quick tip: Start by adding your first student, then create an AI-generated lesson to see the magic happen!
              </div>

              <div class="footer">
                <p>© ${new Date().getFullYear()} Avidato. All rights reserved.</p>
                <p><a href="${getBaseUrl()}/privacy">Privacy Policy</a> | <a href="${getBaseUrl()}/terms">Terms of Service</a></p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const response = await resend.emails.send({
      from: 'support@avidato.com',
      to: email,
      subject: 'Welcome to Avidato! 🎓 Get Started Creating AI-Powered Lessons',
      html: htmlContent,
    })

    if (response.error) {
      console.error('Resend error:', response.error)
      throw new Error(`Failed to send welcome email: ${response.error.message}`)
    }

    return response
  } catch (error) {
    console.error('Email service error:', error)
    throw error
  }
}

// ─── Placement Test Complete Email ───────────────────────────────────

export async function sendPlacementTestCompleteEmail(
  teacherEmail: string,
  teacherName: string | null,
  studentName: string,
  overallLevel: string,
  grammarLevel: string | null,
  readingLevel: string | null,
  resultsUrl: string
) {
  try {
    const levelLabels: Record<string, string> = {
      A1: 'Beginner', A2: 'Elementary', B1: 'Intermediate',
      B2: 'Upper Intermediate', C1: 'Advanced', C2: 'Proficiency',
    }
    const levelColors: Record<string, string> = {
      A1: '#22c55e', A2: '#84cc16', B1: '#eab308',
      B2: '#f97316', C1: '#ef4444', C2: '#a855f7',
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3d74b5 0%, #467bab 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
            .content { background: #f9fafb; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .greeting { font-size: 18px; color: #252e48; margin-bottom: 16px; }
            .level-badge { display: inline-block; font-size: 32px; font-weight: 800; padding: 12px 24px; border-radius: 12px; margin: 16px 0; }
            .level-label { font-size: 14px; font-weight: 600; margin-top: 4px; }
            .score-card { background: white; border-radius: 8px; padding: 12px 20px; text-align: center; flex: 1; border: 1px solid #e5e7eb; }
            .score-title { font-size: 11px; text-transform: uppercase; color: #9ca3af; letter-spacing: 1px; }
            .score-value { font-size: 24px; font-weight: 700; margin-top: 4px; }
            .btn { display: inline-block; background: #3d74b5; color: white; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Placement Test Complete</h1>
            </div>
            <div class="content" style="text-align: center;">
              <p class="greeting">Hi ${teacherName || 'there'},</p>
              <p style="color: #6b7280; margin-bottom: 20px;">
                <strong>${studentName}</strong> has completed their placement test. Here are the results:
              </p>
              <div>
                <div class="level-badge" style="background: ${levelColors[overallLevel] || '#3d74b5'}15; color: ${levelColors[overallLevel] || '#3d74b5'};">
                  ${overallLevel}
                </div>
                <div class="level-label" style="color: ${levelColors[overallLevel] || '#3d74b5'};">
                  ${levelLabels[overallLevel] || overallLevel}
                </div>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 20px 0;">
                <tr>
                  ${grammarLevel ? `
                  <td align="center" style="padding: 0 8px;">
                    <div class="score-card">
                      <div class="score-title">Grammar</div>
                      <div class="score-value" style="color: ${levelColors[grammarLevel] || '#3d74b5'};">${grammarLevel}</div>
                    </div>
                  </td>
                  ` : ''}
                  ${readingLevel ? `
                  <td align="center" style="padding: 0 8px;">
                    <div class="score-card">
                      <div class="score-title">Reading</div>
                      <div class="score-value" style="color: ${levelColors[readingLevel] || '#3d74b5'};">${readingLevel}</div>
                    </div>
                  </td>
                  ` : ''}
                </tr>
              </table>
              <a href="${resultsUrl}" class="btn">View Full Results</a>
              <p style="color: #9ca3af; font-size: 13px; margin-top: 12px;">
                View detailed question breakdown, strengths, weaknesses and recommended focus areas.
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Avidato. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const response = await resend.emails.send({
      from: 'support@avidato.com',
      to: teacherEmail,
      subject: `Placement Test Complete: ${studentName} - Level ${overallLevel}`,
      html: htmlContent,
    })

    if (response.error) {
      console.error('Resend error:', response.error)
      throw new Error(`Failed to send placement test email: ${response.error.message}`)
    }

    return response
  } catch (error) {
    console.error('Email service error (placement test):', error)
    // Don't throw - email failure shouldn't break test completion
  }
}

// ─── Admin Notification Email ────────────────────────────────────────

export async function sendNotificationEmail(
  recipientEmail: string,
  recipientName: string | null,
  notificationType: string,
  notificationTitle: string,
  notificationMessage: string,
  notificationLink?: string | null
) {
  try {
    const typeEmoji: Record<string, string> = {
      announcement: '📢',
      feature: '✨',
      update: '🔄',
      maintenance: '🔧',
      alert: '⚠️',
    }

    const typeLabel: Record<string, string> = {
      announcement: 'Announcement',
      feature: 'New Feature',
      update: 'System Update',
      maintenance: 'Maintenance Notice',
      alert: 'Important Alert',
    }

    const emoji = typeEmoji[notificationType] || '📢'
    const label = typeLabel[notificationType] || 'Notification'
    const baseUrl = getBaseUrl()
    const ctaUrl = notificationLink
      ? (notificationLink.startsWith('http') ? notificationLink : `${baseUrl}${notificationLink}`)
      : `${baseUrl}/dashboard`

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3d74b5 0%, #467bab 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .header h1 { margin: 0; font-size: 24px; font-weight: bold; }
            .header .type-badge { display: inline-block; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-top: 8px; }
            .content { background: #f9fafb; padding: 30px 20px; border-radius: 0 0 8px 8px; }
            .greeting { font-size: 16px; margin-bottom: 16px; color: #252e48; }
            .message-box { background: white; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb; margin: 20px 0; font-size: 14px; color: #4b5563; line-height: 1.8; white-space: pre-line; }
            .button-wrapper { text-align: center; margin: 24px 0; }
            .cta-button { display: inline-block; background: #3d74b5 !important; color: white !important; padding: 12px 32px !important; text-decoration: none !important; border-radius: 6px; font-weight: 600 !important; font-size: 14px !important; }
            .footer { font-size: 12px; color: #999; margin-top: 20px; text-align: center; }
            .footer a { color: #3d74b5; text-decoration: none; }
            .unsubscribe { font-size: 11px; color: #bbb; text-align: center; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${emoji} ${notificationTitle}</h1>
              <div class="type-badge">${label}</div>
            </div>
            <div class="content">
              <div class="greeting">
                Hi ${recipientName || 'there'},
              </div>
              <div class="message-box">
                ${notificationMessage.replace(/\n/g, '<br>')}
              </div>
              ${notificationLink ? `
              <div class="button-wrapper">
                <a href="${ctaUrl}" class="cta-button">View Details</a>
              </div>
              ` : ''}
              <div class="footer">
                <p>© ${new Date().getFullYear()} Avidato. All rights reserved.</p>
                <p><a href="${baseUrl}/privacy">Privacy Policy</a> | <a href="${baseUrl}/terms">Terms of Service</a></p>
              </div>
              <div class="unsubscribe">
                You're receiving this because you have an Avidato account.
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const response = await resend.emails.send({
      from: 'support@avidato.com',
      to: recipientEmail,
      subject: `${emoji} ${notificationTitle}`,
      html: htmlContent,
    })

    if (response.error) {
      console.error('Resend error (notification):', response.error)
      return { success: false, error: response.error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Email service error (notification):', error)
    return { success: false, error: String(error) }
  }
}