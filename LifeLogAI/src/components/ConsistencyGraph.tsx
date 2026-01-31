import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Svg, Polyline, Defs, LinearGradient, Stop, Path, Circle, Line } from 'react-native-svg';

const ConsistencyGraph: React.FC = () => {
    const { getConsistencyData, themeColors } = useApp();
    const data = getConsistencyData();
    const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);

    const maxScore = 10;
    const chartHeight = 120;
    const chartWidth = 320; // Approx width of card with padding
    const stepX = chartWidth / (data.length - 1);

    const selectedData = data.find(d => d.date === selectedDate) || data[data.length - 1];

    // Calculate points for line
    const points = data.map((d, index) => {
        const x = index * stepX;
        const y = chartHeight - (d.score / maxScore) * chartHeight;
        return `${x},${y}`;
    }).join(' ');

    // Calculate path for gradient fill
    const fillPath = `M 0,${chartHeight} ${data.map((d, i) => `L ${i * stepX},${chartHeight - (d.score / maxScore) * chartHeight}`).join(' ')} L ${chartWidth},${chartHeight} Z`;

    return (
        <View style={[styles.container, { backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: themeColors.textSubtle }]}>CONSISTENCY FLOW</Text>
                <Text style={[styles.scoreBadge, { color: colors.orange.muted, backgroundColor: colors.orange.bg }]}>
                    {selectedData.score}/10
                </Text>
            </View>

            <View style={styles.chartContainer}>
                <Svg height={chartHeight + 10} width="100%" viewBox={`0 -10 ${chartWidth} ${chartHeight + 20}`}>
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <Stop offset="0" stopColor={colors.orange.primary} stopOpacity="0.3" />
                            <Stop offset="1" stopColor={colors.orange.primary} stopOpacity="0" />
                        </LinearGradient>
                    </Defs>

                    {/* Gradient Fill */}
                    <Path d={fillPath} fill="url(#grad)" />

                    {/* Grid Lines */}
                    <Line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke={themeColors.cardBorder} strokeDasharray="5,5" />
                    <Line x1="0" y1={0} x2={chartWidth} y2={0} stroke={themeColors.cardBorder} strokeDasharray="5,5" />

                    {/* Line */}
                    <Polyline
                        points={points}
                        fill="none"
                        stroke={colors.orange.primary}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Interactive Points */}
                    {data.map((d, i) => (
                        <Circle
                            key={i}
                            cx={i * stepX}
                            cy={chartHeight - (d.score / maxScore) * chartHeight}
                            r={selectedDate === d.date ? 6 : 4}
                            fill={themeColors.card}
                            stroke={colors.orange.primary}
                            strokeWidth={selectedDate === d.date ? 3 : 2}
                            onPress={() => setSelectedDate(d.date)}
                        />
                    ))}
                </Svg>

                <View style={styles.labels}>
                    {data.map((d, i) => {
                        const date = new Date(d.date);
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'narrow' });
                        return (
                            <TouchableOpacity key={i} onPress={() => setSelectedDate(d.date)} style={{ width: 30, alignItems: 'center' }}>
                                <Text style={[styles.label, { color: selectedDate === d.date ? themeColors.text : themeColors.textSubtle }]}>
                                    {dayName}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.5,
    },
    scoreBadge: {
        fontSize: 12,
        fontWeight: '700',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    chartContainer: {
        height: 150,
        justifyContent: 'space-between',
    },
    labels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 4,
    }
});

export default ConsistencyGraph;
