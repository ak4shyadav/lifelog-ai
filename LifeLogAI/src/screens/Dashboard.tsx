import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StatCard, AICoach } from '../components';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

const Dashboard: React.FC = () => {
    const navigation = useNavigation<any>();
    const { state, refreshCoach } = useApp();
    const today = new Date().toISOString().split('T')[0];

    const totalFocusMin = Math.round((state.focus.sessions.reduce((acc, s) => acc + s.duration, 0) +
        (state.focus.activeSession ? (Date.now() - state.focus.activeSession.startTime) : 0)) / 60000);

    const lastSleep = state.sleep.sessions[state.sleep.sessions.length - 1];
    const sleepVal = state.sleep.activeSession
        ? "Logging..."
        : (lastSleep ? `${Math.floor(lastSleep.duration / 3600000)}h ${Math.floor((lastSleep.duration % 3600000) / 60000)}m` : "Ready");

    const habitCount = `${state.habits.filter(h => h.history[today]).length} / ${state.habits.length}`;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <LinearGradient colors={[colors.backgroundGradientStart, colors.backgroundGradientEnd]} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" />
                <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <View style={styles.header}>
                        <View style={styles.logoRow}>
                            <LinearGradient colors={[colors.gradientStart, colors.gradientMiddle]} style={styles.logoIcon}>
                                <Text style={styles.logoEmoji}>✨</Text>
                            </LinearGradient>
                            <Text style={styles.title}>LifeLog AI</Text>
                        </View>
                        <View style={styles.userCircle}>
                            <View style={styles.onlineDot} />
                        </View>
                    </View>

                    <View style={styles.greetingSection}>
                        <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
                        <Text style={styles.greeting}>{getGreeting()}, User</Text>
                    </View>

                    <View style={styles.cardsContainer}>
                        <StatCard
                            label="Sleep"
                            value={sleepVal}
                            accentColor="blue"
                            active={!!state.sleep.activeSession}
                            onPress={() => navigation.navigate('Sleep')}
                            progress={state.sleep.activeSession ? 1 : (lastSleep ? Math.min(lastSleep.duration / 28800000, 1) : 0)}
                        />
                        <StatCard
                            label="Focus"
                            value={`${totalFocusMin}m`}
                            accentColor="green"
                            active={!!state.focus.activeSession}
                            onPress={() => navigation.navigate('Focus')}
                            progress={Math.min(totalFocusMin / 240, 1)}
                        />
                        <StatCard
                            label="Habits"
                            value={habitCount}
                            accentColor="orange"
                            onPress={() => navigation.navigate('Habits')}
                            progress={state.habits.filter(h => h.history[today]).length / state.habits.length}
                        />
                        <StatCard
                            label="Journal"
                            value={state.journal.some(j => j.date === today) ? "Reflected" : "Unwritten"}
                            accentColor="purple"
                            onPress={() => navigation.navigate('Journal')}
                            progress={state.journal.some(j => j.date === today) ? 1 : 0}
                        />
                    </View>

                    <AICoach message={state.coachMessage} onRefresh={refreshCoach} />

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 },
    logoRow: { flexDirection: 'row', alignItems: 'center' },
    logoIcon: { width: 34, height: 34, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    logoEmoji: { fontSize: 16 },
    title: { fontSize: 22, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
    userCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center' },
    onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#10b981' },
    greetingSection: { marginBottom: 30 },
    date: { fontSize: 11, fontWeight: '700', color: colors.textSubtle, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 },
    greeting: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -1 },
    cardsContainer: { marginBottom: 30 },
});

export default Dashboard;
