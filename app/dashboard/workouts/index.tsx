import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, SafeAreaView, Alert } from 'react-native';
import { useState } from 'react';
import { Stack, router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type MuscleGroup = {
  id: string;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
};

type Exercise = {
  id: string;
  name: string;
  sets: ExerciseSet[];
};

type ExerciseSet = {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
};

const muscleGroups: MuscleGroup[] = [
  { id: '1', name: 'Chest', icon: 'human-male' },
  { id: '2', name: 'Back', icon: 'human' },
  { id: '3', name: 'Legs', icon: 'human-handsdown' },
  { id: '4', name: 'Shoulders', icon: 'human' },
  { id: '5', name: 'Arms', icon: 'arm-flex-outline' },
  { id: '6', name: 'Core', icon: 'human' },
];

export default function WorkoutsScreen() {
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<MuscleGroup | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddExercise = () => {
    if (!selectedMuscleGroup) return;
    
    const newExercise: Exercise = {
      id: Math.random().toString(),
      name: '',
      sets: [{
        id: Math.random().toString(),
        weight: 0,
        reps: 0,
        completed: false
      }]
    };

    setExercises([...exercises, newExercise]);
  };

  const handleAddSet = (exerciseId: string) => {
    setExercises(exercises.map(exercise => {
      if (exercise.id === exerciseId) {
        return {
          ...exercise,
          sets: [...exercise.sets, {
            id: Math.random().toString(),
            weight: 0,
            reps: 0,
            completed: false
          }]
        };
      }
      return exercise;
    }));
  };

  const handleFinishWorkout = async () => {
    if (exercises.length === 0) {
      Alert.alert('Error', 'Please add at least one exercise before finishing the workout.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exercises: exercises.map(exercise => ({
            name: exercise.name,
            sets: exercise.sets.map(set => ({
              weight: set.weight,
              reps: set.reps,
              completed: set.completed,
            }))
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save workout');
      }

      const data = await response.json();
      
      // Show success message
      Alert.alert(
        'Success',
        'Workout saved successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.push('../home')
          }
        ]
      );
    } catch (error) {
      console.error('Failed to save workout:', error);
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'New Workout',
          headerStyle: { backgroundColor: '#1a1b1e' },
          headerTintColor: '#fff',
        }} 
      />
      
      <View style={styles.content}>
        <ScrollView 
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {/* Muscle Group Selection */}
          <Text style={styles.sectionTitle}>Select Muscle Group</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.muscleGroupScroll}>
            {muscleGroups.map((group) => (
              <Pressable
                key={group.id}
                style={[
                  styles.muscleGroupButton,
                  selectedMuscleGroup?.id === group.id && styles.selectedMuscleGroup
                ]}
                onPress={() => setSelectedMuscleGroup(group)}
              >
                <MaterialCommunityIcons 
                  name={group.icon} 
                  size={24} 
                  color={selectedMuscleGroup?.id === group.id ? '#fff' : '#888'} 
                />
                <Text style={[
                  styles.muscleGroupText,
                  selectedMuscleGroup?.id === group.id && styles.selectedMuscleGroupText
                ]}>
                  {group.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Exercises Section */}
          {selectedMuscleGroup && (
            <View style={styles.exercisesSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Exercises</Text>
                <Pressable style={styles.addButton} onPress={handleAddExercise}>
                  <MaterialCommunityIcons name="plus" size={24} color="#fff" />
                  <Text style={styles.addButtonText}>Add Exercise</Text>
                </Pressable>
              </View>

              {exercises.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <TextInput
                    style={styles.exerciseInput}
                    placeholder="Exercise name"
                    placeholderTextColor="#666"
                    value={exercise.name}
                    onChangeText={(text) => {
                      setExercises(exercises.map(e => 
                        e.id === exercise.id ? { ...e, name: text } : e
                      ));
                    }}
                  />
                  
                  {exercise.sets.map((set, index) => (
                    <View key={set.id} style={styles.setRow}>
                      <Text style={styles.setNumber}>Set {index + 1}</Text>
                      <TextInput
                        style={styles.setInput}
                        placeholder="0"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={set.weight.toString()}
                        onChangeText={(text) => {
                          const weight = parseInt(text) || 0;
                          setExercises(exercises.map(e => 
                            e.id === exercise.id 
                              ? {
                                  ...e,
                                  sets: e.sets.map(s => 
                                    s.id === set.id ? { ...s, weight } : s
                                  )
                                }
                              : e
                          ));
                        }}
                      />
                      <Text style={styles.inputLabel}>kg</Text>
                      <TextInput
                        style={styles.setInput}
                        placeholder="0"
                        placeholderTextColor="#666"
                        keyboardType="numeric"
                        value={set.reps.toString()}
                        onChangeText={(text) => {
                          const reps = parseInt(text) || 0;
                          setExercises(exercises.map(e => 
                            e.id === exercise.id 
                              ? {
                                  ...e,
                                  sets: e.sets.map(s => 
                                    s.id === set.id ? { ...s, reps } : s
                                  )
                                }
                              : e
                          ));
                        }}
                      />
                      <Text style={styles.inputLabel}>reps</Text>
                      <Pressable
                        style={[styles.checkButton, set.completed && styles.checkButtonCompleted]}
                        onPress={() => {
                          setExercises(exercises.map(e => 
                            e.id === exercise.id 
                              ? {
                                  ...e,
                                  sets: e.sets.map(s => 
                                    s.id === set.id ? { ...s, completed: !s.completed } : s
                                  )
                                }
                              : e
                          ));
                        }}
                      >
                        <MaterialCommunityIcons 
                          name={set.completed ? "check" : "check-outline"} 
                          size={20} 
                          color={set.completed ? "#fff" : "#666"} 
                        />
                      </Pressable>
                    </View>
                  ))}
                  
                  <Pressable 
                    style={styles.addSetButton} 
                    onPress={() => handleAddSet(exercise.id)}
                  >
                    <Text style={styles.addSetText}>Add Set</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
          
          {exercises.length > 0 && (
            <Pressable 
              style={[styles.finishButton, isSubmitting && styles.finishButtonDisabled]}
              onPress={handleFinishWorkout}
              disabled={isSubmitting}
            >
              <MaterialCommunityIcons name="check-circle" size={24} color="#fff" style={styles.finishIcon} />
              <Text style={styles.finishButtonText}>
                {isSubmitting ? 'Saving...' : 'Finish Workout'}
              </Text>
            </Pressable>
          )}

          {/* Add padding for tab bar */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
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
    position: 'relative',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 85, // Match tab bar height
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  muscleGroupScroll: {
    flexGrow: 0,
    marginBottom: 24,
  },
  muscleGroupButton: {
    padding: 12,
    backgroundColor: '#1a1b1e',
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  selectedMuscleGroup: {
    backgroundColor: '#e11d48',
  },
  muscleGroupText: {
    color: '#888',
    marginTop: 4,
    fontSize: 12,
  },
  selectedMuscleGroupText: {
    color: '#fff',
  },
  exercisesSection: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e11d48',
    padding: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 4,
  },
  exerciseCard: {
    backgroundColor: '#1a1b1e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseInput: {
    fontSize: 16,
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 8,
    marginBottom: 16,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  setNumber: {
    color: '#666',
    width: 60,
  },
  setInput: {
    backgroundColor: '#2a2b2e',
    borderRadius: 8,
    padding: 8,
    width: 60,
    marginRight: 8,
    color: '#fff',
    textAlign: 'center',
  },
  inputLabel: {
    color: '#666',
    marginRight: 16,
  },
  checkButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2a2b2e',
  },
  checkButtonCompleted: {
    backgroundColor: '#16a34a',
  },
  addSetButton: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addSetText: {
    color: '#666',
  },
  bottomPadding: {
    height: 85, // Match tab bar height
  },
  finishButton: {
    backgroundColor: '#e11d48',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  finishButtonDisabled: {
    opacity: 0.7,
  },
  finishIcon: {
    marginRight: 8,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});