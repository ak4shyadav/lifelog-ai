import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

interface AICoachProps {
    message: string;
    onRefresh: () => void;
}

const AICoach: React.FC<AICoachProps> = ({ message, onRefresh }) => {
    return (
        <LinearGradient
            colors={['rgba(79, 70, 229, 0.25)', 'rgba(124, 58, 237, 0.15)', 'rgba(219, 39, 119, 0.1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <LinearGradient
                        colors={[colors.gradientStart, colors.gradientMiddle]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.avatar}
                    >
                        <Text style={styles.avatarIcon}>✨</Text>
                    </LinearGradient>
                    <View style={styles.headerText}>
                        <Text style={styles.title}>AI Coach</Text>
                        <Text style={styles.subtitle}>Companion</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
                    <Text style={styles.refreshIcon}>🔄</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.messageContainer}>
                <Text style={styles.message}>"{message}"</Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 38,
        height: 38,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarIcon: {
        fontSize: 16,
    },
    headerText: {
        marginLeft: 12,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.text,
    },
    subtitle: {
        fontSize: 10,
        color: colors.textSubtle,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 2,
    },
    refreshBtn: {
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 10,
    },
    refreshIcon: {
        fontSize: 14,
    },
    messageContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    message: {
        fontSize: 14,
        lineHeight: 22,
        color: 'rgba(255, 255, 255, 0.8)',
        fontStyle: 'italic',
    },
});

export default AICoach;
