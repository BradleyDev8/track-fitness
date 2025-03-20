import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import StatsCard from '../../../components/ui/StatsCard'
import MonthlyTraining from '../../../components/ui/MonthlyTraining';
import { Dumbbell, Clock, BarChart, Weight } from 'lucide-react-native';

type WorkoutStats = {
  totalWorkouts: number;
  totalExercises: number;
  totalSets: number;
  totalWeight: number;
  averageWorkoutDuration: number;
};

type FrequencyData = {
  date: string;
  count: number;
}[];

export default function StatsScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [frequency, setFrequency] = useState<FrequencyData>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/stats');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data.stats);
      setFrequency(data.frequency);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load workout statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Statistics',
          headerStyle: { backgroundColor: '#1a1b1e' },
          headerTintColor: '#fff',
        }} 
      />

      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#e11d48" />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
            <Text style={styles.retryText} onPress={fetchStats}>Tap to retry</Text>
          </View>
        ) : (
          <>
            <View style={styles.monthlyTrainingContainer}>
              <Text style={styles.sectionTitle}>Monthly Training</Text>
              <MonthlyTraining data={frequency} />
            </View>

            <Text style={styles.sectionTitle}>Workout Summary</Text>
            <View style={styles.statsGrid}>
              <StatsCard 
                title="Workouts" 
                value={stats?.totalWorkouts.toString() || "0"} 
                icon={<Dumbbell size={24} color="#e11d48" />} 
              />
              <StatsCard 
                title="Exercises" 
                value={stats?.totalExercises.toString() || "0"} 
                icon={<BarChart size={24} color="#e11d48" />} 
              />
              <StatsCard 
                title="Sets" 
                value={stats?.totalSets.toString() || "0"} 
                icon={<Weight size={24} color="#e11d48" />} 
              />
              <StatsCard 
                title="Total Weight (kg)" 
                value={Math.floor((stats?.totalWeight || 0) / 1000) + "k"} 
                icon={<Weight size={24} color="#e11d48" />} 
              />
              <StatsCard 
                title="Avg. Duration" 
                value={stats?.averageWorkoutDuration ? formatDuration(stats.averageWorkoutDuration) : '0 min'} 
                icon={<Clock size={24} color="#e11d48" />} 
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 32,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    marginBottom: 8,
  },
  retryText: {
    color: '#e11d48',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  monthlyTrainingContainer: {
    marginVertical: 8,
  },
});