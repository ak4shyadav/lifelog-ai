import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

const Sleep: React.FC = () => {
    const navigation = useNavigation();
    const { state, startSleep, stopSleep } = useApp();
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: any;
        if (state.sleep.activeSession) {
            interval = setInterval(() => {
                setTimer(Date.now() - state.sleep.activeSession!.startTime);
            }, 1000);
        } else {
            setTimer(0);
        }
        return () => clearInterval(interval);
    }, [state.sleep.activeSession]);

    const formatTime = (ms: number) => {
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${h}h ${m}m ${s < 10 ? '0' + s : s}s`;
    };

    const lastSession = state.sleep.sessions[state.sleep.sessions.length - 1];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Rest Cycle</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.timerCircle}>
                    {state.sleep.activeSession ? (
                        <>
                            <Text style={styles.timerText}>{formatTime(timer)}</Text>
                            <Text style={styles.statusText}>Dreaming...</Text>
                        </>
                    ) : (
                        <Text style={styles.readyText}>Ready</Text>
                    )}
                </View>

                <TouchableOpacity
                    style={[styles.mainButton, state.sleep.activeSession ? styles.stopButton : styles.startButton]}
                    onPress={state.sleep.activeSession ? stopSleep : startSleep}
                >
                    <Text style={styles.buttonText}>
                        {state.sleep.activeSession ? 'Wake Up' : 'Start Sleep'}
                    </Text>
                </TouchableOpacity>

                {lastSession && !state.sleep.activeSession && (
                    <View style={styles.lastSessionCard}>
                        <Text style={styles.lastLabel}>Last sleep duration</Text>
                        <Text style={styles.lastValue}>
                            {Math.floor(lastSession.duration / 3600000)}h {Math.floor((lastSession.duration % 3600000) / 60000)}m
                        </Text>
                    </View>
                )}

                <View style={styles.historyContainer}>
                    <Text style={styles.historyTitle}>Rest History</Text>
                    {Object.entries(state.sleep.sessions.reduce((acc, session) => {
                        const date = session.date || new Date(session.startTime).toISOString().split('T')[0];
                        if (!acc[date]) acc[date] = [];
                        acc[date].push(session);
                        return acc;
                    }, {} as Record<string, typeof state.sleep.sessions>)).sort((a, b) => b[0].localeCompare(a[0])).map(([date, sessions]) => (
                        <View key={date} style={styles.dateGroup}>
                            <Text style={styles.dateHeader}>{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
                            {sessions.map((session, idx) => (
                                <View key={idx} style={styles.historyItem}>
                                    <Text style={styles.historyTime}>
                                        {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </Text>
                                    <Text style={styles.historyDuration}>
                                        {Math.floor(session.duration / 3600000)}h {Math.floor((session.duration % 3600000) / 60000)}m
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ))}
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
        color: colors.blue.primary,
        fontSize: 16,
        width: 60,
    },
    headerTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '700',
    },
    content: {
        alignItems: 'center',
        paddingTop: 40,
        paddingBottom: 40,
    },
    timerCircle: {
        width: 240,
        height: 240,
        borderRadius: 120,
        borderWidth: 2,
        borderColor: 'rgba(59, 130, 246, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(26, 26, 46, 0.5)',
        marginBottom: 50,
    },
    timerText: {
        color: colors.text,
        fontSize: 32,
        fontWeight: '700',
    },
    statusText: {
        color: colors.blue.primary,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginTop: 8,
    },
    readyText: {
        color: colors.textSubtle,
        fontSize: 24,
        fontWeight: '600',
    },
    mainButton: {
        width: '80%',
        paddingVertical: 20,
        borderRadius: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    startButton: {
        backgroundColor: colors.blue.muted,
    },
    stopButton: {
        backgroundColor: colors.text,
    },
    buttonText: {
        color: colors.background,
        fontSize: 18,
        fontWeight: '700',
    },
    lastSessionCard: {
        marginTop: 40,
        backgroundColor: colors.card,
        width: '80%',
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    lastLabel: {
        color: colors.textMuted,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 8,
    },
    lastValue: {
        color: colors.blue.primary,
        fontSize: 24,
        fontWeight: '700',
    },
    historyContainer: {
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 40,
    },
    historyTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
    },
    dateGroup: {
        marginBottom: 20,
    },
    dateHeader: {
        color: colors.textSubtle,
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 8,
    },
    historyTime: {
        color: colors.text,
        fontSize: 15,
    },
    historyDuration: {
        color: colors.blue.primary,
        fontWeight: '600',
    }
});

export default Sleep;
