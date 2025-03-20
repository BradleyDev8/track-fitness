import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addDays, isSameDay } from 'date-fns';

interface DayProps {
  date: Date;
  intensity: number;
}

interface FrequencyData {
  date: string;
  count: number;
}

interface MonthlyTrainingProps {
  data: FrequencyData[];
}

const Day = ({ date, intensity }: DayProps) => {
  const intensityBackgrounds = {
    0: '#1A1F2E', // Darker background for empty days
    1: 'rgba(220, 38, 38, 0.2)', // red-600 with opacity
    2: 'rgba(220, 38, 38, 0.4)',
    3: 'rgba(220, 38, 38, 0.7)',
    4: '#DC2626' // red-600
  };

  return (
    <View style={[styles.day, { backgroundColor: intensityBackgrounds[intensity as keyof typeof intensityBackgrounds] }]}>
      <Text style={styles.dayText}>{format(date, 'd')}</Text>
    </View>
  );
};

export default function MonthlyTraining({ data }: MonthlyTrainingProps) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate empty days at the start of the month
  const firstDayOfMonth = getDay(monthStart);
  const emptyDays = Array(firstDayOfMonth).fill(null);

  // Group days into weeks
  const weeks: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [...emptyDays];

  days.forEach((day) => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });

  // Fill the last week with null values if needed
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Function to determine workout intensity based on frequency data
  const getDayIntensity = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const entry = data.find(item => item.date === dateStr);
    
    if (!entry) return 0;
    
    // Scale intensity based on count
    if (entry.count >= 3) return 4;
    if (entry.count === 2) return 3;
    if (entry.count === 1) return 2;
    return 1;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthYear}>{format(now, 'MMMM yyyy')}</Text>
      </View>
      
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day, index) => (
          <View key={index} style={styles.weekDay}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.daysContainer}>
        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} style={styles.week}>
            {week.map((date, dayIndex) => (
              date ? (
                <Day 
                  key={date.toString()} 
                  date={date} 
                  intensity={getDayIntensity(date)}
                />
              ) : (
                <View key={`empty-${weekIndex}-${dayIndex}`} style={[styles.day, { backgroundColor: '#1A1F2E' }]} />
              )
            ))}
          </View>
        ))}
      </View>

      <View style={styles.intensityLegend}>
        <Text style={styles.legendText}>Less</Text>
        <View style={styles.legendBoxes}>
          {[0, 1, 2, 3, 4].map((level) => (
            <View 
              key={level}
              style={[
                styles.legendBox,
                {
                  backgroundColor: level === 0 ? '#1A1F2E' :
                    level === 1 ? 'rgba(220, 38, 38, 0.2)' :
                    level === 2 ? 'rgba(220, 38, 38, 0.4)' :
                    level === 3 ? 'rgba(220, 38, 38, 0.7)' :
                    '#DC2626'
                }
              ]}
            />
          ))}
        </View>
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2b2e',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthYear: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  weekDay: {
    width: 32,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  weekDayText: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  week: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 6,
  },
  day: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  dayText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  intensityLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingRight: 4,
  },
  legendText: {
    color: 'white',
    fontSize: 12,
    marginHorizontal: 8,
  },
  legendBoxes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendBox: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginHorizontal: 3,
  },
}); 