import { WorkoutSummary } from '@/components/ui/QuickWorkoutSummary';

export const mockWorkoutData: WorkoutSummary = {
  date: new Date(),
  muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
  totalVolume: 2500,
  isComplete: false,
};

export const mockCompletedWorkoutData: WorkoutSummary = {
  date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
  muscleGroups: ['Back', 'Biceps', 'Rear Delts'],
  totalVolume: 3200,
  isComplete: true,
};

export const mockWorkoutHistory: WorkoutSummary[] = [
  mockWorkoutData,
  mockCompletedWorkoutData,
  {
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    muscleGroups: ['Legs', 'Core'],
    totalVolume: 4500,
    isComplete: true,
  },
]; 