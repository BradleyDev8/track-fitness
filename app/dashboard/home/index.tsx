import { View, StyleSheet, Text } from 'react-native';
import { QuickWorkoutSummary } from '../../../components/ui/QuickWorkoutSummary';
// import { mockWorkoutData } from '../../../mocks/workoutData';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mockWorkoutData } from '@/src/mocks/workoutData';

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [workout, setWorkout] = useState(mockWorkoutData);


  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleContinueWorkout = () => {
    // TODO: Implement navigation to continue workout
    console.log('Continue workout pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
      </View>
      <QuickWorkoutSummary
        workout={workout}
        isLoading={isLoading}
        onContinue={handleContinueWorkout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});