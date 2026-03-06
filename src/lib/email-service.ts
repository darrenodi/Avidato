import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Helper to ensure NEXTAUTH_URL has proper formatting
const getBaseUrl = () => {
  const url = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return url.endsWith('/') ? url.slice(0, -1) : url
}

// ─── Shared Email Shell ──────────────────────────────────────────────
// Table-based layout for maximum email client compatibility (Outlook, Gmail, Yahoo, Apple Mail).
// All styles are inline for safety since many clients strip <style> blocks.

const BRAND = {
  primary: '#3d74b5',
  primaryDark: '#2f5f9a',
  accent: '#5ebbc8',
  textDark: '#1e293b',
  textMid: '#475569',
  textLight: '#94a3b8',
  bg: '#f1f5f9',
  cardBg: '#ffffff',
  border: '#e2e8f0',
}

function emailShell(content: string) {
  const year = new Date().getFullYear()
  const base = getBaseUrl()
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>Avidato</title>
  <!--[if mso]>
  <style>table,td{font-family:Arial,Helvetica,sans-serif!important}</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <!-- Inner card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <!-- Logo bar -->
          <tr>
            <td align="center" style="background-color:${BRAND.cardBg};padding:28px 40px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:22px;font-weight:800;color:${BRAND.primary};letter-spacing:-0.5px;">
                    Avidato
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          ${content}
          <!-- Footer -->
          <tr>
            <td style="background-color:${BRAND.cardBg};padding:0 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="border-top:1px solid ${BRAND.border};padding-top:24px;"></td></tr>
                <tr>
                  <td align="center" style="font-size:12px;color:${BRAND.textLight};line-height:20px;">
                    <a href="${base}/privacy" style="color:${BRAND.primary};text-decoration:none;">Privacy Policy</a>
                    &nbsp;&middot;&nbsp;
                    <a href="${base}/terms" style="color:${BRAND.primary};text-decoration:none;">Terms of Service</a>
                    &nbsp;&middot;&nbsp;
                    <a href="mailto:support@avidato.com" style="color:${BRAND.primary};text-decoration:none;">Support</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size:11px;color:${BRAND.textLight};padding-top:12px;">
                    &copy; ${year} Avidato. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function ctaButton(href: string, label: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
  <tr>
    <td align="center" style="background-color:${BRAND.primary};border-radius:10px;">
      <!--[if mso]>
      <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="${href}" style="height:48px;v-text-anchor:middle;width:220px;" arcsize="21%" fillcolor="${BRAND.primary}" stroke="f">
      <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">
        ${label}
      </center>
      </v:roundrect>
      <![endif]-->
      <!--[if !mso]><!-->
      <a href="${href}" target="_blank" style="display:inline-block;background-color:${BRAND.primary};color:#ffffff!important;font-size:15px;font-weight:600;text-decoration:none;padding:14px 36px;border-radius:10px;line-height:1;">
        ${label}
      </a>
      <!--<![endif]-->
    </td>
  </tr>
</table>`
}

// ─── 1. Verification Email ───────────────────────────────────────────

export async function sendVerificationEmail(
  email: string,
  verificationToken: string,
  userName?: string
) {
  try {
    const verificationUrl = `${getBaseUrl()}/api/auth/verify-email?token=${verificationToken}`

    const htmlContent = emailShell(`
          <!-- Hero banner -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND.primary} 0%,${BRAND.accent} 100%);padding:40px 40px 36px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size:48px;line-height:1;">&#9993;</td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:16px;font-size:26px;font-weight:700;color:#ffffff;">
                    Confirm Your Email
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:8px;font-size:14px;color:rgba(255,255,255,0.75);">
                    One quick step to get started
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:${BRAND.cardBg};padding:36px 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:16px;font-weight:600;color:${BRAND.textDark};padding-bottom:16px;">
                    Hi ${userName || 'there'},
                  </td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:${BRAND.textMid};line-height:24px;padding-bottom:28px;">
                    Thanks for signing up for Avidato! Please verify your email address so you can start creating AI-powered lesson plans for your students.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    ${ctaButton(verificationUrl, 'Verify Email Address')}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size:12px;color:${BRAND.textLight};padding-bottom:8px;">
                    Or copy and paste this link into your browser:
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size:12px;color:${BRAND.primary};word-break:break-all;padding-bottom:28px;">
                    <a href="${verificationUrl}" style="color:${BRAND.primary};text-decoration:underline;">${verificationUrl}</a>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:${BRAND.bg};border-radius:10px;padding:16px 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:${BRAND.textLight};line-height:20px;">
                          &#128274;&nbsp; This link expires in <strong style="color:${BRAND.textMid};">24 hours</strong>. If you didn't create this account, you can safely ignore this email.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
    `)

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

// ─── 2. Password Reset Email ─────────────────────────────────────────

export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  userName?: string
) {
  try {
    const resetUrl = `${getBaseUrl()}/api/auth/reset-password?token=${resetToken}`

    const htmlContent = emailShell(`
          <!-- Hero banner -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND.primary} 0%,${BRAND.accent} 100%);padding:40px 40px 36px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size:48px;line-height:1;">&#128272;</td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:16px;font-size:26px;font-weight:700;color:#ffffff;">
                    Reset Your Password
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:8px;font-size:14px;color:rgba(255,255,255,0.75);">
                    No problem, it happens to the best of us
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:${BRAND.cardBg};padding:36px 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:16px;font-weight:600;color:${BRAND.textDark};padding-bottom:16px;">
                    Hi ${userName || 'there'},
                  </td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:${BRAND.textMid};line-height:24px;padding-bottom:28px;">
                    We received a request to reset your password. Click the button below to choose a new one.
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:28px;">
                    ${ctaButton(resetUrl, 'Reset Password')}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size:12px;color:${BRAND.textLight};padding-bottom:8px;">
                    Or copy and paste this link into your browser:
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size:12px;color:${BRAND.primary};word-break:break-all;padding-bottom:28px;">
                    <a href="${resetUrl}" style="color:${BRAND.primary};text-decoration:underline;">${resetUrl}</a>
                  </td>
                </tr>
                <tr>
                  <td style="background-color:${BRAND.bg};border-radius:10px;padding:16px 20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:${BRAND.textLight};line-height:20px;">
                          &#9200;&nbsp; This link expires in <strong style="color:${BRAND.textMid};">1 hour</strong>. If you didn't request this, you can safely ignore this email and your password will remain unchanged.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
    `)

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

// ─── 3. Welcome Email ────────────────────────────────────────────────

export async function sendWelcomeEmail(
  email: string,
  userName?: string
) {
  try {
    const dashboardUrl = `${getBaseUrl()}/dashboard`

    const features = [
      { icon: '&#10024;', title: 'AI-Powered Lessons', desc: 'Generate customised lesson plans in minutes with our advanced AI engine' },
      { icon: '&#128101;', title: 'Manage Students', desc: 'Track progress and create personalised lessons for every student' },
      { icon: '&#128218;', title: 'Multiple Formats', desc: 'Conversation, roleplay, discussion, grammar, and many more interactive types' },
      { icon: '&#127919;', title: 'All CEFR Levels', desc: 'Support learners from A1 beginner to C2 proficiency with level-matched content' },
    ]

    const featureRows = features.map(f => `
                <tr>
                  <td style="padding-bottom:20px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="48" valign="top" style="padding-right:16px;">
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="width:44px;height:44px;background-color:${BRAND.bg};border-radius:10px;text-align:center;font-size:20px;line-height:44px;">
                                ${f.icon}
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td valign="top">
                          <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:${BRAND.textDark};">${f.title}</p>
                          <p style="margin:0;font-size:13px;color:${BRAND.textMid};line-height:20px;">${f.desc}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
    `).join('')

    const htmlContent = emailShell(`
          <!-- Hero banner -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND.primary} 0%,${BRAND.accent} 100%);padding:44px 40px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size:40px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                    Welcome!
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:10px;font-size:15px;color:rgba(255,255,255,0.8);line-height:22px;">
                    You're all set to create amazing lessons
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:${BRAND.cardBg};padding:36px 40px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:16px;font-weight:600;color:${BRAND.textDark};padding-bottom:12px;">
                    Hi ${userName || 'there'},
                  </td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:${BRAND.textMid};line-height:24px;padding-bottom:28px;">
                    Welcome to Avidato! We're thrilled to have you. You've joined a community of educators using AI to create engaging, personalised lesson plans. Here's what you can do:
                  </td>
                </tr>
                ${featureRows}
                <tr>
                  <td align="center" style="padding:12px 0 32px;">
                    ${ctaButton(dashboardUrl, 'Go to Your Dashboard')}
                  </td>
                </tr>
                <!-- Tip box -->
                <tr>
                  <td style="background-color:${BRAND.bg};border-radius:10px;padding:16px 20px;margin-bottom:24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:${BRAND.textMid};line-height:20px;">
                          &#128161; <strong>Quick tip:</strong> Start by adding your first student, then generate an AI lesson to see the magic happen!
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- Help -->
                <tr>
                  <td align="center" style="padding-top:24px;font-size:13px;color:${BRAND.textLight};line-height:20px;">
                    Need help? Reach out anytime at
                    <a href="mailto:support@avidato.com" style="color:${BRAND.primary};text-decoration:none;">support@avidato.com</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
    `)

    const response = await resend.emails.send({
      from: 'support@avidato.com',
      to: email,
      subject: 'Welcome to Avidato! Get Started Creating AI-Powered Lessons',
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

// ─── 4. Placement Test Complete Email ────────────────────────────────

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

    const color = levelColors[overallLevel] || BRAND.primary
    const label = levelLabels[overallLevel] || overallLevel

    const scoreCards = [
      grammarLevel ? { title: 'Grammar', level: grammarLevel, color: levelColors[grammarLevel] || BRAND.primary } : null,
      readingLevel ? { title: 'Reading', level: readingLevel, color: levelColors[readingLevel] || BRAND.primary } : null,
    ].filter(Boolean) as { title: string; level: string; color: string }[]

    const scoreCardCells = scoreCards.map(s => `
                    <td align="center" width="${Math.floor(100 / scoreCards.length)}%" style="padding:0 6px;">
                      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background-color:${BRAND.bg};border-radius:12px;">
                        <tr>
                          <td align="center" style="padding:20px 12px;">
                            <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;color:${BRAND.textLight};font-weight:600;">${s.title}</p>
                            <p style="margin:6px 0 2px;font-size:28px;font-weight:800;color:${s.color};">${s.level}</p>
                            <p style="margin:0;font-size:12px;color:${BRAND.textMid};">${levelLabels[s.level] || s.level}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
    `).join('')

    const htmlContent = emailShell(`
          <!-- Hero banner -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND.primary} 0%,${BRAND.accent} 100%);padding:40px 40px 36px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size:48px;line-height:1;">&#127891;</td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:14px;font-size:26px;font-weight:700;color:#ffffff;">
                    Placement Test Complete
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:8px;font-size:14px;color:rgba(255,255,255,0.75);">
                    ${studentName} has finished their test
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:${BRAND.cardBg};padding:36px 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:16px;font-weight:600;color:${BRAND.textDark};padding-bottom:16px;">
                    Hi ${teacherName || 'there'},
                  </td>
                </tr>
                <tr>
                  <td style="font-size:14px;color:${BRAND.textMid};line-height:24px;padding-bottom:24px;">
                    Great news! <strong style="color:${BRAND.textDark};">${studentName}</strong> has completed their placement test. Here's a summary of their results:
                  </td>
                </tr>
                <!-- Overall level -->
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" style="background-color:${color}10;border:2px solid ${color}30;border-radius:16px;">
                      <tr>
                        <td align="center" style="padding:24px 48px;">
                          <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:2px;color:${BRAND.textLight};font-weight:600;">Overall Level</p>
                          <p style="margin:8px 0 4px;font-size:42px;font-weight:800;color:${color};line-height:1;">${overallLevel}</p>
                          <p style="margin:0;font-size:14px;font-weight:600;color:${color};">${label}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${scoreCards.length > 0 ? `
                <!-- Score cards -->
                <tr>
                  <td style="padding-bottom:28px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        ${scoreCardCells}
                      </tr>
                    </table>
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    ${ctaButton(resultsUrl, 'View Full Results')}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size:13px;color:${BRAND.textLight};line-height:20px;">
                    View the detailed question breakdown, strengths,<br>weaknesses, and recommended focus areas.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
    `)

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

// ─── 5. Admin Notification Email ─────────────────────────────────────

export async function sendNotificationEmail(
  recipientEmail: string,
  recipientName: string | null,
  notificationType: string,
  notificationTitle: string,
  notificationMessage: string,
  notificationLink?: string | null
) {
  try {
    const typeConfig: Record<string, { emoji: string; label: string; color: string }> = {
      announcement: { emoji: '&#128226;', label: 'Announcement', color: '#3b82f6' },
      feature:      { emoji: '&#10024;',  label: 'New Feature',  color: '#8b5cf6' },
      update:       { emoji: '&#128260;', label: 'System Update', color: '#06b6d4' },
      maintenance:  { emoji: '&#128295;', label: 'Maintenance',   color: '#f59e0b' },
      alert:        { emoji: '&#9888;&#65039;', label: 'Important Alert', color: '#ef4444' },
    }

    const cfg = typeConfig[notificationType] || typeConfig.announcement
    const baseUrl = getBaseUrl()
    const ctaUrl = notificationLink
      ? (notificationLink.startsWith('http') ? notificationLink : `${baseUrl}${notificationLink}`)
      : null

    const htmlContent = emailShell(`
          <!-- Hero banner -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND.primary} 0%,${BRAND.accent} 100%);padding:40px 40px 36px;text-align:center;">
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" style="font-size:40px;line-height:1;">${cfg.emoji}</td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:16px;font-size:24px;font-weight:700;color:#ffffff;">
                    ${notificationTitle}
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:10px;">
                    <table role="presentation" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color:rgba(255,255,255,0.2);border-radius:20px;padding:4px 16px;font-size:11px;color:#ffffff;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
                          ${cfg.label}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:${BRAND.cardBg};padding:36px 40px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:16px;font-weight:600;color:${BRAND.textDark};padding-bottom:20px;">
                    Hi ${recipientName || 'there'},
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:28px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};border-radius:12px;border-left:4px solid ${cfg.color};">
                      <tr>
                        <td style="padding:20px 24px;font-size:14px;color:${BRAND.textMid};line-height:24px;">
                          ${notificationMessage.replace(/\n/g, '<br>')}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                ${ctaUrl ? `
                <tr>
                  <td align="center" style="padding-bottom:24px;">
                    ${ctaButton(ctaUrl, 'View Details')}
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td align="center" style="font-size:11px;color:${BRAND.textLight};">
                    You're receiving this because you have an Avidato account.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
    `)

    const response = await resend.emails.send({
      from: 'support@avidato.com',
      to: recipientEmail,
      subject: `${notificationTitle}`,
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