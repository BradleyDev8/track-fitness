import { db } from '@/db';
import { workouts, exerciseSessions, users } from '@/db/schema';
import { sql } from 'drizzle-orm';

type ExerciseSet = {
  weight: number;
  reps: number;
};

type Exercise = {
  name: string;
  sets: ExerciseSet[];
};

export async function POST(req: Request) {
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

    const body = await req.json();
    const { exercises } = body as { exercises: Exercise[] };

    if (!exercises || !Array.isArray(exercises)) {
      return new Response('Invalid workout data', { status: 400 });
    }

    // Calculate total duration (for now just use a timestamp diff)
    const now = new Date();
    const duration = 0; // We'll calculate this properly later

    // Format dates for Postgres
    const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const timestampStr = now.toISOString(); // Full ISO timestamp

    try {
      // Use SQL template literals to work around the TypeScript issues
      const result = await db.execute(sql`
        INSERT INTO workouts (user_id, date, start_time, end_time, duration, calories_burned)
        VALUES (${userId}, ${dateStr}, ${timestampStr}, ${timestampStr}, ${duration}, 0)
        RETURNING *
      `);
      
      // Get the inserted workout ID
      const workout = result[0];
      
      if (workout && workout.id) {
        // Insert exercise sessions
        for (const exercise of exercises) {
          const sets = exercise.sets.length;
          const reps = exercise.sets.reduce((total, set) => total + set.reps, 0);
          const weight = exercise.sets.reduce((max, set) => Math.max(max, set.weight), 0);
          
          await db.execute(sql`
            INSERT INTO exercise_sessions (workout_id, exercise_name, sets, reps, weight)
            VALUES (${workout.id}, ${exercise.name}, ${sets}, ${reps}, ${weight})
          `);
        }
        
        return new Response(JSON.stringify({ success: true, workoutId: workout.id }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } else {
        throw new Error('Failed to retrieve workout ID');
      }
    } catch (insertError: any) {
      console.error('Database insertion error:', insertError);
      return new Response(JSON.stringify({ 
        error: 'Database insertion failed', 
        details: insertError?.message || 'Unknown error' 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error: any) {
    console.error('Failed to save workout:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to save workout', 
      details: error?.message || 'Unknown error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 