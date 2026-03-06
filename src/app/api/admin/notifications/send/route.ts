import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendNotificationEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    // IP whitelist check
    const adminIPs = (process.env.ADMIN_IPS || '').split(',').filter(ip => ip.trim());
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
                     request.headers.get('x-real-ip') ||
                     'unknown';

    // Check IP whitelist - same logic as middleware
    const localhostIPs = ['127.0.0.1', '::1', 'localhost'];
    const isWhitelisted = !adminIPs.length || adminIPs.includes(clientIP) || adminIPs.some(ip => localhostIPs.includes(ip));
    
    if (!isWhitelisted) {
      return NextResponse.json(
        { error: 'IP not whitelisted' },
        { status: 403 }
      );
    }

    // Authentication check
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, isAdmin: true }
    });

    if (!user || !user.isAdmin) {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { type, title, message, link, sendToAll, recipientIds, sendEmail = true } = body;

    // Validation
    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: type, title, message' },
        { status: 400 }
      );
    }

    let targetUserIds: string[] = [];

    if (sendToAll) {
      // Get all user IDs
      const allUsers = await prisma.user.findMany({
        select: { id: true }
      });
      targetUserIds = allUsers.map(u => u.id);
    } else if (recipientIds && Array.isArray(recipientIds) && recipientIds.length > 0) {
      targetUserIds = recipientIds;
    } else {
      return NextResponse.json(
        { error: 'Either recipientIds or sendToAll must be provided' },
        { status: 400 }
      );
    }

    if (targetUserIds.length === 0) {
      return NextResponse.json(
        { error: 'No recipients specified' },
        { status: 400 }
      );
    }

    // Create in-app notifications for each user
    const notifications = await prisma.notification.createMany({
      data: targetUserIds.map(userId => ({
        userId,
        type,
        title,
        message,
        link: link || null,
      }))
    });

    // Send emails to recipients (non-blocking — don't fail the request if emails fail)
    let emailsSent = 0;
    let emailsFailed = 0;

    if (sendEmail) {
      // Fetch recipient emails
      const recipients = await prisma.user.findMany({
        where: { id: { in: targetUserIds } },
        select: { email: true, name: true },
      });

      // Send emails in batches of 10 to avoid rate limits
      const batchSize = 10;
      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        const results = await Promise.allSettled(
          batch.map(r =>
            sendNotificationEmail(r.email, r.name, type, title, message, link)
          )
        );
        results.forEach(result => {
          if (result.status === 'fulfilled' && result.value.success) {
            emailsSent++;
          } else {
            emailsFailed++;
          }
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Notification sent to ${notifications.count} users`,
        count: notifications.count,
        emailsSent,
        emailsFailed,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
