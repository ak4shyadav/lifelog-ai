import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, AccentColor } from '../theme/colors';
import ProgressRing from './ProgressRing';

interface StatCardProps {
    label: string;
    value: string;
    accentColor: AccentColor;
    onPress: () => void;
    progress?: number;
    active?: boolean;
}

const accentStyles = {
    blue: {
        labelColor: colors.blue.primary,
        bgColor: 'rgba(59, 130, 246, 0.12)',
        borderColor: colors.blue.border,
    },
    green: {
        labelColor: colors.green.primary,
        bgColor: 'rgba(16, 185, 129, 0.12)',
        borderColor: colors.green.border,
    },
    orange: {
        labelColor: colors.orange.primary,
        bgColor: 'rgba(249, 115, 22, 0.12)',
        borderColor: colors.orange.border,
    },
    purple: {
        labelColor: colors.purple.primary,
        bgColor: 'rgba(139, 92, 246, 0.12)',
        borderColor: colors.purple.border,
    },
};

const StatCard: React.FC<StatCardProps> = ({ label, value, accentColor, onPress, progress, active }) => {
    const accent = accentStyles[accentColor];

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[
                styles.card,
                {
                    backgroundColor: accent.bgColor,
                    borderColor: active ? colors.text : accent.borderColor,
                    borderWidth: active ? 2 : 1.5,
                },
            ]}
        >
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <View style={styles.labelRow}>
                        <Text style={[styles.label, { color: accent.labelColor }]}>{label}</Text>
                        {active && (
                            <View style={[styles.activeIndicator, { backgroundColor: accent.labelColor }]} />
                        )}
                    </View>
                    <Text style={styles.value}>{value}</Text>
                </View>

                {progress !== undefined && (
                    <ProgressRing
                        progress={progress}
                        color={accent.labelColor}
                        size={48}
                        strokeWidth={5}
                    />
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    textContainer: {
        flex: 1,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    activeIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginLeft: 8,
    },
    value: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.text,
        letterSpacing: -0.5,
    },
});

export default StatCard;
