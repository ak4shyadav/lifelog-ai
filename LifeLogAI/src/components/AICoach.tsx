import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

interface AICoachProps {
    message: string;
    onRefresh: () => void;
}

const AICoach: React.FC<AICoachProps> = ({ message, onRefresh }) => {
    const { themeColors } = useApp();

    return (
        <LinearGradient
            colors={['rgba(79, 70, 229, 0.15)', 'rgba(124, 58, 237, 0.1)', 'rgba(219, 39, 119, 0.05)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.container, { borderColor: themeColors.cardBorder, backgroundColor: themeColors.card }]}
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
                        <Text style={[styles.title, { color: themeColors.text }]}>AI Coach</Text>
                        <Text style={[styles.subtitle, { color: themeColors.textSubtle }]}>Narrative</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={onRefresh} style={[styles.refreshBtn, { backgroundColor: themeColors.background }]}>
                    <Text style={[styles.refreshIcon, { color: themeColors.textMuted }]}>🔄</Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.messageContainer, { backgroundColor: themeColors.background, borderColor: themeColors.cardBorder }]}>
                <Text style={[styles.message, { color: themeColors.text }]}>"{message}"</Text>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        marginBottom: 20,
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
    },
    subtitle: {
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginTop: 2,
    },
    refreshBtn: {
        padding: 8,
        borderRadius: 10,
    },
    refreshIcon: {
        fontSize: 14,
    },
    messageContainer: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
    },
    message: {
        fontSize: 14,
        lineHeight: 22,
        fontStyle: 'italic',
    },
});

export default AICoach;
