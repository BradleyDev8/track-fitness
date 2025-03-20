import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, useColorScheme } from 'react-native';

export default function Layout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Tabs screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#FF375F',
                tabBarInactiveTintColor: isDark ? '#9CA3AF' : '#6B7280',
                tabBarStyle: {
                    backgroundColor: isDark ? '#000000' : '#FFFFFF',
                    borderTopWidth: 0,
                    elevation: 0,
                    shadowOpacity: 0,
                    height: 85,
                    paddingBottom: 30,
                    paddingTop: 5,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                },
            }}>
                <Tabs.Screen 
                    name="home/index"
                    options={{
                        title: "Home",
                        tabBarLabel: "Home",
                        tabBarIcon: ({ size, color }) => (
                            <Ionicons name="home-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen 
                    name="stats/index"
                    options={{
                        title: "Stats",
                        tabBarLabel: "Stats",
                        tabBarIcon: ({ size, color }) => (
                            <Ionicons name="stats-chart-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen 
                    name="workouts/index"
                    options={{
                        title: "Workouts",
                        tabBarLabel: "Workouts",
                        tabBarIcon: ({ size, color }) => (
                            <Ionicons name="barbell-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen 
                    name="settings/index"
                    options={{
                        title: "Settings",
                        tabBarLabel: "Settings",
                        tabBarIcon: ({ size, color }) => (
                            <Ionicons name="settings-outline" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});