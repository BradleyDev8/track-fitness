import { db } from '@/db';
import { workouts, exerciseSessions, users } from '@/db/schema';
import { sql } from 'drizzle-orm';

export async function GET(req: Request) {
  try {
    // Get a valid user ID from the database
    let userId: string;
    
    // First try to get any existing user
    const existingUsers = await db.select({ id: users.id }).from(users).limit(1);
    
    if (existingUsers.length > 0 && existingUsers[0].id) {
      // Use the first user we find
      userId = existingUsers[0].id as string;
    } else {
      // No users exist, create a dummy user for development
      const newUserResult = await db.execute(sql`
        INSERT INTO users (email, password, first_name, last_name)
        VALUES ('test@example.com', 'password', 'Test', 'User')
        RETURNING id
      `);
      
      if (!newUserResult[0]?.id) {
        throw new Error('Failed to create dummy user');
      }
      
      userId = newUserResult[0].id as string;
    }

    // Get the date range from query params (default to last 30 days)
    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0]; // YYYY-MM-DD

    // Get workout statistics
    const stats = await db.select({
      totalWorkouts: sql<number>`count(distinct ${workouts.id})`,
      totalExercises: sql<number>`count(distinct ${exerciseSessions.id})`,
      totalSets: sql<number>`sum(${exerciseSessions.sets})`,
      totalWeight: sql<number>`sum(${exerciseSessions.weight} * ${exerciseSessions.reps})`,
      averageWorkoutDuration: sql<number>`avg(${workouts.duration})`,
    })
    .from(workouts)
    .leftJoin(exerciseSessions, sql`${exerciseSessions.workoutId} = ${workouts.id}`)
    .where(sql`${workouts.userId} = ${userId} and ${workouts.date} >= ${startDateStr}`);

    // Get workout frequency by day
    const frequency = await db.select({
      date: workouts.date,
      count: sql<number>`count(*)`,
    })
    .from(workouts)
    .where(sql`${workouts.userId} = ${userId} and ${workouts.date} >= ${startDateStr}`)
    .groupBy(workouts.date)
    .orderBy(workouts.date);

    return new Response(JSON.stringify({
      stats: stats[0] || {
        totalWorkouts: 0,
        totalExercises: 0,
        totalSets: 0,
        totalWeight: 0,
        averageWorkoutDuration: 0
      },
      frequency: frequency || [],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Failed to fetch workout stats:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch workout stats', 
      details: error?.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 