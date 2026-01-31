import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { colors } from '../theme/colors';

const Journal: React.FC = () => {
    const navigation = useNavigation();
    const { state, addJournalEntry, deleteJournalEntry } = useApp();
    const [text, setText] = useState('');

    const handleSave = () => {
        if (text.trim()) {
            addJournalEntry(text.trim());
            setText('');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Reflections</Text>
                    <TouchableOpacity onPress={handleSave} disabled={!text.trim()}>
                        <Text style={[styles.saveButton, !text.trim() && styles.disabledText]}>Save</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.inputCard}>
                        <Text style={styles.todayLabel}>Today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="What's on your mind?..."
                            placeholderTextColor={colors.textSubtle}
                            multiline
                            value={text}
                            onChangeText={setText}
                        />
                    </View>

                    <View style={styles.historySection}>
                        <Text style={styles.historyTitle}>Your Archive</Text>
                        {state.journal.map(entry => (
                            <View key={entry.id} style={styles.entryCard}>
                                <View style={styles.entryHeader}>
                                    <Text style={styles.entryDate}>{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                        <View style={styles.emotionTag}>
                                            <Text style={styles.emotionText}>{entry.emotion}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => Alert.alert("Delete Entry", "Delete this reflection?", [{ text: "Cancel", style: "cancel" }, { text: "Delete", style: "destructive", onPress: () => deleteJournalEntry(entry.id) }])}>
                                            <Text style={styles.deleteIcon}>×</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text style={styles.entryText}>"{entry.text}"</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        color: colors.purple.primary,
        fontSize: 16,
        width: 60,
    },
    headerTitle: {
        color: colors.text,
        fontSize: 18,
        fontWeight: '700',
    },
    saveButton: {
        color: colors.purple.primary,
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'right',
        width: 60,
    },
    disabledText: {
        opacity: 0.3,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    inputCard: {
        marginTop: 20,
        marginBottom: 40,
    },
    todayLabel: {
        color: colors.textMuted,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontWeight: '700',
        marginBottom: 16,
    },
    input: {
        color: colors.text,
        fontSize: 20,
        lineHeight: 30,
        textAlignVertical: 'top',
        minHeight: 120,
    },
    historySection: {
        marginBottom: 40,
    },
    historyTitle: {
        color: colors.text,
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 20,
    },
    entryCard: {
        backgroundColor: colors.card,
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    entryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    entryDate: {
        color: colors.textSubtle,
        fontSize: 12,
        fontWeight: '600',
    },
    emotionTag: {
        backgroundColor: 'rgba(139, 92, 246, 0.12)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    emotionText: {
        color: colors.purple.primary,
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    entryText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 15,
        lineHeight: 24,
        fontStyle: 'italic',
    },
    deleteIcon: {
        color: colors.textSubtle,
        fontSize: 20,
        fontWeight: 'bold',
        padding: 5
    }
});

export default Journal;
