import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StatCard, AICoach, ConsistencyGraph } from '../components';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Dashboard: React.FC = () => {
    const navigation = useNavigation<any>();
    const { state, refreshCoach, toggleTheme, themeColors, addTask, toggleTask, deleteTask } = useApp();
    const today = new Date().toISOString().split('T')[0];
    const [newTask, setNewTask] = useState("");

    // --- Stats Calculations ---
    const totalFocusMin = Math.round((state.focus.sessions.reduce((acc, s) => acc + s.duration, 0) +
        (state.focus.activeSession ? (Date.now() - state.focus.activeSession.startTime) : 0)) / 60000);

    const lastSleep = state.sleep.sessions[state.sleep.sessions.length - 1];
    let sleepVal = "Ready";
    if (state.sleep.activeSession) {
        sleepVal = "Zzz";
    } else if (lastSleep && lastSleep.date === today) {
        const h = Math.floor(lastSleep.duration / 3600000);
        const m = Math.floor((lastSleep.duration % 3600000) / 60000);
        sleepVal = `${h}h ${m}m`;
    } else if (lastSleep) {
        sleepVal = "Not logged";
    }

    const habitCount = `${state.habits.filter(h => h.history[today]).length}/${state.habits.length}`;
    const journalStatus = state.journal.some(j => j.date === today) ? "Done" : "Empty";

    const todaysTasks = state.tasks?.filter(t => t.date === today) || [];

    const handleAddTask = () => {
        if (!newTask.trim()) return;
        addTask(newTask);
        setNewTask("");
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const renderRightActions = (id: number) => {
        return (
            <TouchableOpacity
                style={styles.deleteAction}
                onPress={() => deleteTask(id)}
            >
                <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
        );
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={{ flex: 1, backgroundColor: themeColors.background }}>
                <StatusBar barStyle={state.theme === 'dark' ? "light-content" : "dark-content"} />
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                        {/* Header */}
                        <View style={styles.header}>
                            <View>
                                <Text style={[styles.greeting, { color: themeColors.text }]}>{getGreeting()}</Text>
                                <Text style={[styles.date, { color: themeColors.textMuted }]}>
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={toggleTheme}
                                style={[styles.themeBtn, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}
                            >
                                <Text style={{ fontSize: 18 }}>{state.theme === 'dark' ? '☀️' : '🌙'}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Consistency Graph */}
                        <ConsistencyGraph />

                        {/* Today Overview */}
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Today</Text>
                        </View>
                        <View style={[styles.overviewCard, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
                            {/* Sleep Row */}
                            <TouchableOpacity onPress={() => navigation.navigate('Sleep')} style={styles.overviewRow}>
                                <View style={styles.rowLeft}>
                                    <View style={[styles.dot, { backgroundColor: state.sleep.sessions.some(s => s.date === today) ? colors.blue.primary : themeColors.textMuted }]} />
                                    <Text style={[styles.rowLabel, { color: themeColors.textSubtle }]}>Sleep</Text>
                                </View>
                                <Text style={[styles.rowValue, { color: themeColors.text }]}>{sleepVal}</Text>
                            </TouchableOpacity>

                            {/* Focus Row */}
                            <TouchableOpacity onPress={() => navigation.navigate('Focus')} style={styles.overviewRow}>
                                <View style={styles.rowLeft}>
                                    <View style={[styles.dot, { backgroundColor: totalFocusMin > 0 ? colors.green.primary : themeColors.textMuted }]} />
                                    <Text style={[styles.rowLabel, { color: themeColors.textSubtle }]}>Focus</Text>
                                </View>
                                <Text style={[styles.rowValue, { color: themeColors.text }]}>{totalFocusMin}m logged</Text>
                            </TouchableOpacity>

                            {/* Habits Row */}
                            <TouchableOpacity onPress={() => navigation.navigate('Habits')} style={styles.overviewRow}>
                                <View style={styles.rowLeft}>
                                    <View style={[styles.dot, { backgroundColor: state.habits.some(h => h.history[today]) ? colors.orange.primary : themeColors.textMuted }]} />
                                    <Text style={[styles.rowLabel, { color: themeColors.textSubtle }]}>Habits</Text>
                                </View>
                                <Text style={[styles.rowValue, { color: themeColors.text }]}>{habitCount} done</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Tasks Checklist */}
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Checklist</Text>
                        </View>
                        <View style={[styles.taskContainer, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
                            {/* Input */}
                            <View style={[styles.taskInputRow, { borderBottomColor: themeColors.cardBorder }]}>
                                <Text style={{ fontSize: 18, marginRight: 10, color: themeColors.textMuted }}>+</Text>
                                <TextInput
                                    style={[styles.input, { color: themeColors.text }]}
                                    placeholder="Add a task..."
                                    placeholderTextColor={themeColors.textMuted}
                                    value={newTask}
                                    onChangeText={setNewTask}
                                    onSubmitEditing={handleAddTask}
                                />
                            </View>

                            {/* List */}
                            {todaysTasks.map(task => (
                                <Swipeable key={task.id} renderRightActions={() => renderRightActions(task.id)}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => toggleTask(task.id)}
                                        style={[styles.taskRow, { backgroundColor: themeColors.card }]} // Ensure bg color for swipe
                                    >
                                        <View style={[styles.checkbox, {
                                            borderColor: task.completed ? colors.green.primary : themeColors.textMuted,
                                            backgroundColor: task.completed ? colors.green.primary : 'transparent'
                                        }]}>
                                            {task.completed && <Text style={{ color: 'white', fontSize: 10 }}>✓</Text>}
                                        </View>
                                        <Text style={[styles.taskText, {
                                            color: task.completed ? themeColors.textMuted : themeColors.text,
                                            textDecorationLine: task.completed ? 'line-through' : 'none'
                                        }]}>{task.text}</Text>
                                    </TouchableOpacity>
                                </Swipeable>
                            ))}
                            {todaysTasks.length === 0 && (
                                <Text style={[styles.emptyText, { color: themeColors.textMuted }]}>No tasks yet.</Text>
                            )}
                        </View>

                        {/* Feature Cards Grid (Details) */}
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Details</Text>
                        </View>
                        <View style={styles.cardsGrid}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <StatCard
                                    label="Sleep"
                                    value={sleepVal === "Zzz" ? "Zzz" : sleepVal.split(' ')[0]}
                                    accentColor="blue"
                                    active={!!state.sleep.activeSession}
                                    onPress={() => navigation.navigate('Sleep')}
                                    progress={state.sleep.activeSession ? 1 : 0}
                                />
                                <StatCard
                                    label="Habits"
                                    value={habitCount}
                                    accentColor="orange"
                                    onPress={() => navigation.navigate('Habits')}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <StatCard
                                    label="Focus"
                                    value={`${totalFocusMin}m`}
                                    accentColor="green"
                                    active={!!state.focus.activeSession}
                                    onPress={() => navigation.navigate('Focus')}
                                />
                                <StatCard
                                    label="Journal"
                                    value={journalStatus}
                                    accentColor="purple"
                                    onPress={() => navigation.navigate('Journal')}
                                />
                            </View>
                        </View>

                        <AICoach message={state.coachMessage} onRefresh={refreshCoach} />

                        <View style={{ height: 40 }} />
                    </ScrollView>
                </SafeAreaView>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    scrollView: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, marginTop: 10 },
    greeting: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
    date: { fontSize: 13, fontWeight: '600', marginTop: 4 },
    themeBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },

    sectionHeader: { marginBottom: 12, marginTop: 10 },
    sectionTitle: { fontSize: 18, fontWeight: '700' },

    overviewCard: { borderRadius: 24, padding: 20, marginBottom: 24, borderWidth: 1 },
    overviewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    rowLeft: { flexDirection: 'row', alignItems: 'center' },
    dot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
    rowLabel: { fontSize: 14, fontWeight: '600' },
    rowValue: { fontSize: 14, fontWeight: '600' },

    taskContainer: { borderRadius: 24, padding: 20, marginBottom: 24, borderWidth: 1, overflow: 'hidden' }, // overflow hidden for swipe
    taskInputRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, paddingBottom: 12, marginBottom: 12 },
    input: { flex: 1, fontSize: 16, padding: 0 },
    taskRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
    checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
    taskText: { fontSize: 15, fontWeight: '500' },
    emptyText: { fontStyle: 'italic', textAlign: 'center', marginTop: 8 },

    deleteAction: { backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center', width: 80, height: '100%', borderRadius: 0 },
    deleteText: { color: 'white', fontWeight: '600' },

    cardsGrid: { flexDirection: 'row', marginBottom: 16 },
});

export default Dashboard;
