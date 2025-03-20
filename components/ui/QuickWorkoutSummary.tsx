import React from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { format } from 'date-fns';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface WorkoutSummary {
  date: Date;
  muscleGroups: string[];
  totalVolume: number;
  isComplete: boolean;
}

interface QuickWorkoutSummaryProps {
  workout?: WorkoutSummary;
  isLoading?: boolean;
  onContinue?: () => void;
}

export function QuickWorkoutSummary({
  workout,
  isLoading = false,
  onContinue,
}: QuickWorkoutSummaryProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (isLoading) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <View style={styles.skeletonHeader} />
        <View style={styles.skeletonContent} />
        <View style={styles.skeletonFooter} />
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <Text style={[styles.noWorkoutText, isDark && styles.textDark]}>
          No recent workouts
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.date, isDark && styles.textDark]}>
          {format(workout.date, 'MMM d, yyyy')}
        </Text>
        <View style={[
          styles.statusIndicator,
          workout.isComplete ? styles.complete : styles.incomplete
        ]}>
          <Ionicons
            name={workout.isComplete ? 'checkmark-circle' : 'time'}
            size={16}
            color={workout.isComplete ? '#34C759' : '#FF9500'}
          />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.muscleGroups}>
          {workout.muscleGroups.map((group, index) => (
            <View key={index} style={styles.muscleGroupTag}>
              <Text style={[styles.muscleGroupText, isDark && styles.textDark]}>
                {group}
              </Text>
            </View>
          ))}
        </View>

        <Text style={[styles.volume, isDark && styles.textDark]}>
          {workout.totalVolume.toLocaleString()} kg total volume
        </Text>
      </View>

      {!workout.isComplete && (
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continueButtonPressed
          ]}
          onPress={onContinue}
        >
          <Text style={styles.continueButtonText}>Continue Workout</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  textDark: {
    color: '#FFFFFF',
  },
  statusIndicator: {
    padding: 4,
    borderRadius: 12,
  },
  complete: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
  },
  incomplete: {
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
  },
  content: {
    gap: 8,
  },
  muscleGroups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleGroupTag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  muscleGroupText: {
    fontSize: 13,
    color: '#000000',
  },
  volume: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#FF375F',
    borderWidth: 1,
    borderColor: '#FF375F',
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  continueButtonPressed: {
    opacity: 0.8,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  noWorkoutText: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    padding: 16,
  },
  // Skeleton loading styles
  skeletonHeader: {
    height: 20,
    width: '40%',
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonContent: {
    height: 60,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginBottom: 12,
  },
  skeletonFooter: {
    height: 44,
    backgroundColor: '#E5E5EA',
    borderRadius: 12,
  },
}); 