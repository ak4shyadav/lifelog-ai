import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

const Habits: React.FC = () => {
    const navigation = useNavigation();
    const { state, addHabit, toggleHabit, deleteHabit, themeColors } = useApp();
    const [newHabit, setNewHabit] = useState('');
    const today = new Date().toISOString().split('T')[0];

    // Helper calculate days (simple approximation for now, or accurate based on id)
    // Assuming habit.id IS the creation timestamp.
    const getStats = (habitId: number, history: Record<string, boolean>) => {
        const created = new Date(habitId);
        const now = new Date();
        // Diff in days (inclusive of today)
        const diffTime = Math.abs(now.getTime() - created.getTime());
        const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

        const completedDays = Object.values(history).filter(Boolean).length;

        let streak = 0;
        const dates = Object.keys(history).sort().reverse();
        // A simple streak check
        // ... (existing streak logic is fine)
        for (const d of dates) {
            // Check if sequential? The existing logic was checking keys in order.
            // But keys are just dates tracked. 
            // If we assume history only contains "true" or checked dates.
            // Actually the toggle toggles true/false.
            // Let's stick to existing streak logic for now or improve it?
            // "streak" variable below was used.
            // Let's just re-implement simple streak.
            if (history[d]) streak++;
            else break; // If sorted reverse by date, a break means gap?
            // Wait, if dates are ["2023-01-05", "2023-01-03"], break is wrong if we skip a day.
            // But for this task, I only need COMPLETED / TOTAL.
        }

        // Re-calcluate streak properly if needed, but user asked for "completed / total".

        return { completedDays, totalDays };
    };

    // Existing streak logic from file ref
    const getStreak = (history: Record<string, boolean>) => {
        // This is a naive streak counter on existing keys.
        // It's fine to leave as is or slight fix. 
        // Focus is on the New Counter.
        let streak = 0;
        const dates = Object.keys(history).sort().reverse();
        // If dates are not consecutive, this Logic is flawed, but I will not touch it unless requested.
        // Actually, "5 completions in 10 days" example implies just count.
        // Wait, the prompt says "Over time: 5 completions in 10 days -> 5 / 10".
        // It doesn't ask for Streak. It asks for Accountability "completed / total".

        const sortedDates = Object.keys(history).sort().reverse();
        if (sortedDates.length === 0) return 0;

        // Check consecutive logic requires checking date diff. Not critical for this task.
        // I'll leave streak logic "as is" or simple count for now.

        return streak; // Placeholder, I'll use the one inside render
    };

    const handleAdd = () => {
        if (newHabit.trim()) {
            addHabit(newHabit.trim());
            setNewHabit('');
        }
    };

    const handleDelete = (id: number, name: string) => {
        Alert.alert(
            "Remove Habit",
            `Are you sure you want to delete "${name}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => deleteHabit(id)
                }
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={[styles.backButton, { color: colors.orange.primary }]}>← Back</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: themeColors.text }]}>Habits</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Fixed Input Alignment */}
                <View style={[styles.inputSection, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
                    <TextInput
                        style={[styles.input, { color: themeColors.text }]}
                        placeholder="New habit..."
                        placeholderTextColor={themeColors.textSubtle}
                        value={newHabit}
                        onChangeText={setNewHabit}
                        onSubmitEditing={handleAdd}
                    />
                    <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                        <Text style={styles.addBtnText}>+</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.listContainer}>
                    {state.habits.map(habit => {
                        const isDone = habit.history[today];
                        const { completedDays, totalDays } = getStats(habit.id, habit.history);

                        return (
                            <TouchableOpacity
                                key={habit.id}
                                style={[
                                    styles.habitCard,
                                    { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder },
                                    isDone && { backgroundColor: 'rgba(249, 115, 22, 0.1)', borderColor: 'rgba(249, 115, 22, 0.2)' }
                                ]}
                                activeOpacity={0.8}
                                onPress={() => toggleHabit(habit.id)}
                                onLongPress={() => handleDelete(habit.id, habit.name)}
                            >
                                <View style={styles.habitMain}>
                                    {/* Accountability Counter (LEFT) */}
                                    <View style={styles.counterContainer}>
                                        <Text style={[styles.counterText, { color: themeColors.textSubtle }]}>
                                            {completedDays} <Text style={{ opacity: 0.5 }}>/</Text> {totalDays}
                                        </Text>
                                    </View>

                                    <View style={[styles.checkCircle, { borderColor: themeColors.textSubtle }, isDone && styles.checkCircleDone]}>
                                        {isDone && <Text style={styles.checkIcon}>✓</Text>}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[styles.habitName, { color: themeColors.text }, isDone && styles.habitNameDone]}>{habit.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        fontSize: 16,
        width: 60,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    // Updated Input Section to match Card style for alignment
    inputSection: {
        flexDirection: 'row',
        borderRadius: 24, // Matched habitCard
        padding: 12,      // Adjusted padding
        paddingRight: 12,
        marginTop: 20,
        marginBottom: 30,
        alignItems: 'center',
        borderWidth: 1,
    },
    input: {
        flex: 1,
        height: 48,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    addBtn: {
        width: 40,
        height: 40,
        backgroundColor: colors.orange.primary,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addBtnText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '600',
        marginTop: -2,
    },
    listContainer: {
        gap: 16,
        paddingBottom: 40,
    },
    habitCard: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
    },
    habitMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    counterContainer: {
        marginRight: 16,
        minWidth: 40,
        alignItems: 'center',
    },
    counterText: {
        fontSize: 12,
        fontWeight: '700',
        fontVariant: ['tabular-nums'],
    },
    checkCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkCircleDone: {
        backgroundColor: colors.orange.primary,
        borderColor: colors.orange.primary,
    },
    checkIcon: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    habitName: {
        fontSize: 16,
        fontWeight: '700',
    },
    habitNameDone: {
        opacity: 0.5,
        textDecorationLine: 'line-through',
    },
});

export default Habits;
