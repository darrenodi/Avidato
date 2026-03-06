import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
            { username: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          username: true,
          name: true,
          email: true,
          emailVerified: true,
          isAdmin: true,
          subscriptionStatus: true,
          subscriptionPlanId: true,
          subscriptionCurrentPeriodEnd: true,
          _count: {
            select: {
              students: true,
            },
          },
        },
        orderBy: { email: 'asc' },
        skip,
        take: limit,
      }),
      prisma.user.count({ where }),
    ]);

    // Get lesson counts for each user via their students
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const lessonCount = await prisma.lesson.count({
          where: {
            student: {
              tutorId: user.id,
            },
          },
        });
        return {
          ...user,
          studentCount: user._count.students,
          lessonCount,
        };
      })
    );

    return NextResponse.json({
      users: usersWithCounts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
