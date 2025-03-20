import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - 48) / 2; // 48 = padding (16) * 2 + gap (16)

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
}

export default function StatsCard({ icon, title, value }: StatsCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.headerContainer}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#2a2b2e',
    borderRadius: 16,
    padding: 16,
    margin: 8,
    elevation: 5, // For Android
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 18,
    backgroundColor: '#1F1F2E', // Darker background for icons
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#DC2626', // Red border for icon container too
  },
  title: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});