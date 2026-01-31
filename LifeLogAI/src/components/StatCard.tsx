import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native';
import { colors as defaultColors, AccentColor } from '../theme/colors';
import { useApp } from '../context/AppContext';
import ProgressRing from './ProgressRing';

interface StatCardProps {
    label: string;
    value: string;
    accentColor: AccentColor;
    onPress: () => void;
    progress?: number;
    active?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, accentColor, onPress, progress, active }) => {
    const { themeColors } = useApp();
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (active) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 0.6,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [active]);

    // Only use base dark colors for accents for now
    const accentStyles = {
        blue: {
            labelColor: defaultColors.blue.primary,
            bgColor: 'rgba(59, 130, 246, 0.12)',
            borderColor: defaultColors.blue.border,
        },
        green: {
            labelColor: defaultColors.green.primary,
            bgColor: 'rgba(16, 185, 129, 0.12)',
            borderColor: defaultColors.green.border,
        },
        orange: {
            labelColor: defaultColors.orange.primary,
            bgColor: 'rgba(249, 115, 22, 0.12)',
            borderColor: defaultColors.orange.border,
        },
        purple: {
            labelColor: defaultColors.purple.primary,
            bgColor: 'rgba(139, 92, 246, 0.12)',
            borderColor: defaultColors.purple.border,
        },
    };

    const accent = accentStyles[accentColor];

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[
                styles.card,
                {
                    backgroundColor: themeColors.card,
                    borderColor: active ? themeColors.text : themeColors.cardBorder,
                    borderWidth: active ? 2 : 1,
                    ...(active ? { backgroundColor: accent.bgColor, borderColor: accent.borderColor } : {})
                },
            ]}
        >
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <View style={styles.labelRow}>
                        <Text style={[styles.label, { color: active ? accent.labelColor : themeColors.textSubtle }]}>{label}</Text>
                        {active && (
                            <View style={[styles.activeIndicator, { backgroundColor: accent.labelColor }]} />
                        )}
                    </View>

                    {active ? (
                        <Animated.Text style={[styles.value, { color: themeColors.text, opacity: pulseAnim }]}>
                            {value}
                        </Animated.Text>
                    ) : (
                        <Text style={[styles.value, { color: themeColors.text }]}>{value}</Text>
                    )}
                </View>

                {progress !== undefined && !active && (
                    <ProgressRing
                        progress={progress}
                        color={active ? accent.labelColor : themeColors.textMuted}
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
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
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
});

export default StatCard;
