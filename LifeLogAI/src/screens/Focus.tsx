import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

const Focus: React.FC = () => {
    const navigation = useNavigation();
    const { state, startFocus, stopFocus } = useApp();
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        let interval: any;
        if (state.focus.activeSession) {
            interval = setInterval(() => {
                setTimer(Date.now() - state.focus.activeSession!.startTime);
            }, 1000);
        } else {
            setTimer(0);
        }
        return () => clearInterval(interval);
    }, [state.focus.activeSession]);

    const formatTime = (ms: number) => {
        const m = Math.floor(ms / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        return `${m}:${s < 10 ? '0' + s : s}`;
    };

    const totalTodayMs = state.focus.sessions.reduce((acc, s) => acc + s.duration, 0) +
        (state.focus.activeSession ? timer : 0);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Focus Chamber</Text>
                <View style={{ width: 60 }} />
            </View>

            <View style={styles.content}>
                <View style={styles.timerCircle}>
                    <Text style={styles.timerText}>{formatTime(timer)}</Text>
                    <Text style={styles.statusText}>{state.focus.activeSession ? 'Deep Work' : 'Ready'}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.mainButton, state.focus.activeSession ? styles.stopButton : styles.startButton]}
                    onPress={state.focus.activeSession ? stopFocus : startFocus}
                >
                    <Text style={styles.buttonText}>
                        {state.focus.activeSession ? 'End Session' : 'Start Focus'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.statsGrid}>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Total Today</Text>
                        <Text style={styles.statValue}>{Math.round(totalTodayMs / 60000)}m</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statLabel}>Sessions</Text>
                        <Text style={styles.statValue}>{state.focus.sessions.length}</Text>
                    </View>
                </View>
            </View>
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
        color: colors.green.primary,
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
        alignItems: 'center',
        paddingTop: 60,
    },
    timerCircle: {
        width: 220,
        height: 220,
        borderRadius: 110,
        borderWidth: 2,
        borderColor: 'rgba(16, 185, 129, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(26, 46, 36, 0.5)',
        marginBottom: 60,
    },
    timerText: {
        color: colors.text,
        fontSize: 48,
        fontWeight: '700',
        letterSpacing: -2,
    },
    statusText: {
        color: colors.green.primary,
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginTop: 4,
    },
    mainButton: {
        width: '80%',
        paddingVertical: 20,
        borderRadius: 30,
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: colors.green.muted,
    },
    stopButton: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 1,
        borderColor: colors.green.border,
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 60,
        width: '80%',
    },
    statBox: {
        flex: 1,
        backgroundColor: colors.card,
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    statLabel: {
        color: colors.textMuted,
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    statValue: {
        color: colors.text,
        fontSize: 20,
        fontWeight: '700',
    },
});

export default Focus;
