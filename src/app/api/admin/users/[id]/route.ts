import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        bio: true,
        isAdmin: true,
        dailyLimit: true,
        dailyGenerationCount: true,
        lastGenerationDate: true,
        youtubeGenerationCount: true,
        lastYoutubeGenerationDate: true,
        paddleCustomerId: true,
        subscriptionId: true,
        subscriptionStatus: true,
        subscriptionPlanId: true,
        subscriptionCurrentPeriodEnd: true,
        subscriptionCancelAt: true,
        students: {
          select: {
            id: true,
            name: true,
            level: true,
            targetLanguage: true,
            nativeLanguage: true,
            ageGroup: true,
            archived: true,
            createdAt: true,
            _count: {
              select: {
                lessons: true,
                learningPlans: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get recent lessons across all students
    const recentLessons = await prisma.lesson.findMany({
      where: {
        student: {
          tutorId: user.id,
        },
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        isRefined: true,
        studentId: true,
        student: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const totalLessons = await prisma.lesson.count({
      where: {
        student: {
          tutorId: user.id,
        },
      },
    });

    return NextResponse.json({
      user,
      recentLessons,
      totalLessons,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email || !session.user.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Whitelist of fields that can be updated
    const allowedFields: Record<string, boolean> = {
      name: true,
      username: true,
      bio: true,
      dailyLimit: true,
      isAdmin: true,
      subscriptionStatus: true,
      subscriptionPlanId: true,
      subscriptionCurrentPeriodEnd: true,
      subscriptionCancelAt: true,
    };

    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body)) {
      if (allowedFields[key]) {
        // Handle date fields
        if (
          (key === 'subscriptionCurrentPeriodEnd' || key === 'subscriptionCancelAt') &&
          value
        ) {
          updateData[key] = new Date(value as string);
        } else if (
          (key === 'subscriptionCurrentPeriodEnd' || key === 'subscriptionCancelAt') &&
          value === null
        ) {
          updateData[key] = null;
        } else {
          updateData[key] = value;
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        isAdmin: true,
        bio: true,
        dailyLimit: true,
        subscriptionStatus: true,
        subscriptionPlanId: true,
        subscriptionCurrentPeriodEnd: true,
        subscriptionCancelAt: true,
      },
      data: updateData,
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
