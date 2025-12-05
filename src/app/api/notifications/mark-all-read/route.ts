import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    }

    // Mark all notifications as read
    const result = await prisma.notification.updateMany({
      where: {
        userId: user.id,
        read: false
      },
      data: { read: true }
    });

    return new Response(
      JSON.stringify({ 
        message: 'All notifications marked as read',
        updated: result.count
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
