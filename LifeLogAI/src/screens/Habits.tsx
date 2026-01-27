import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

const Habits: React.FC = () => {
    const navigation = useNavigation();
    const { state, addHabit, toggleHabit } = useApp();
    const [newHabit, setNewHabit] = useState('');
    const today = new Date().toISOString().split('T')[0];

    const handleAdd = () => {
        if (newHabit.trim()) {
            addHabit(newHabit.trim());
            setNewHabit('');
        }
    };

    const getStreak = (history: Record<string, boolean>) => {
        let streak = 0;
        const dates = Object.keys(history).sort().reverse();
        for (const d of dates) {
            if (history[d]) streak++;
            else break;
        }
        return streak;
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Habits</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.inputSection}>
                    <TextInput
                        style={styles.input}
                        placeholder="New habit..."
                        placeholderTextColor={colors.textSubtle}
                        value={newHabit}
                        onChangeText={setNewHabit}
                    />
                    <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                        <Text style={styles.addBtnText}>+</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.listContainer}>
                    {state.habits.map(habit => {
                        const isDone = habit.history[today];
                        const streak = getStreak(habit.history);

                        return (
                            <TouchableOpacity
                                key={habit.id}
                                style={[styles.habitCard, isDone && styles.habitCardDone]}
                                activeOpacity={0.8}
                                onPress={() => toggleHabit(habit.id)}
                            >
                                <View style={styles.habitMain}>
                                    <View style={[styles.checkCircle, isDone && styles.checkCircleDone]}>
                                        {isDone && <Text style={styles.checkIcon}>✓</Text>}
                                    </View>
                                    <View>
                                        <Text style={[styles.habitName, isDone && styles.habitNameDone]}>{habit.name}</Text>
                                        <Text style={styles.streakText}>{streak} Day Streak</Text>
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
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        color: colors.orange.primary,
        fontSize: 16,
        width: 60,
    },
    headerTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '700',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    inputSection: {
        flexDirection: 'row',
        backgroundColor: colors.card,
        borderRadius: 20,
        padding: 8,
        marginTop: 20,
        marginBottom: 30,
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
        color: colors.text,
        fontSize: 16,
    },
    addBtn: {
        width: 44,
        height: 44,
        backgroundColor: colors.orange.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addBtnText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
        marginTop: -2,
    },
    listContainer: {
        gap: 16,
        paddingBottom: 40,
    },
    habitCard: {
        backgroundColor: colors.card,
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    habitCardDone: {
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        borderColor: 'rgba(249, 115, 22, 0.2)',
    },
    habitMain: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.2)',
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
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    habitNameDone: {
        color: 'rgba(255, 255, 255, 0.6)',
        textDecorationLine: 'line-through',
    },
    streakText: {
        color: colors.textSubtle,
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginTop: 2,
        letterSpacing: 0.5,
    },
});

export default Habits;
