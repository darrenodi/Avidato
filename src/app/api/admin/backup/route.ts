import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin status
    if (!session.user.isAdmin) {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    // Get the action from request body
    const body = await request.json();
    const { action } = body;

    if (action === 'backup') {
      try {
        // Export all users
        const users = await prisma.user.findMany({
          select: {
            id: true,
            username: true,
            name: true,
            email: true,
            emailVerified: true,
            image: true,
            bio: true,
            isAdmin: true,
            dailyGenerationCount: true,
            lastGenerationDate: true,
            dailyLimit: true,
          },
        });

        // Export all students
        const students = await prisma.student.findMany({
          include: {
            learningPlans: true,
            lessons: true,
          },
        });

        // Export all lessons
        const lessons = await prisma.lesson.findMany({
          select: {
            id: true,
            title: true,
            overview: true,
            isRefined: true,
            createdAt: true,
            updatedAt: true,
            sharedAt: true,
            studentId: true,
            isPublic: true,
          },
        });

        // Export learning plans
        const learningPlans = await prisma.learningPlan.findMany({
          select: {
            id: true,
            selectedMethodology: true,
            methodologyReasoning: true,
            createdAt: true,
            updatedAt: true,
            studentId: true,
          },
        });

        // Create backup data
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupData = {
          exportDate: new Date().toISOString(),
          database: 'Avidato PostgreSQL',
          tables: {
            users: users.length,
            students: students.length,
            lessons: lessons.length,
            learningPlans: learningPlans.length,
          },
          data: {
            users,
            students,
            lessons,
            learningPlans,
          },
        };

        // Convert to JSON for download
        const jsonContent = JSON.stringify(backupData, null, 2);

        // Create response with file download headers
        return new NextResponse(jsonContent, {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="avidato-backup-${timestamp}.json"`,
          },
        });
      } catch (dbError) {
        console.error('Database export error:', dbError);
        return NextResponse.json(
          { error: 'Failed to export database' },
          { status: 500 }
        );
      }
    }

    if (action === 'status') {
      const userCount = await prisma.user.count();
      const studentCount = await prisma.student.count();
      const lessonCount = await prisma.lesson.count();

      return NextResponse.json({
        status: 'ready',
        lastBackup: new Date().toISOString(),
        statistics: {
          users: userCount,
          students: studentCount,
          lessons: lessonCount,
        },
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Backup error:', err);
    return NextResponse.json(
      { error: 'Backup failed' },
      { status: 500 }
    );
  }
}
