import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const Journal = ({ onBack }) => {
    const { state, addJournalEntry } = useApp();
    const [entry, setEntry] = useState('');

    const handleSave = () => {
        if (entry.trim()) {
            addJournalEntry(entry.trim());
            setEntry('');
        }
    };

    return (
        <div className="min-h-screen bg-[#0f0f1a] text-white p-6 flex flex-col animate-in fade-in slide-in-from-right duration-500">
            <div className="flex items-center justify-between mb-8">
                <button onClick={onBack} className="text-purple-400 font-bold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Back
                </button>
                <button
                    onClick={handleSave}
                    disabled={!entry.trim()}
                    className={`py-2 px-6 rounded-xl font-bold transition-all ${entry.trim() ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20 active:scale-95' : 'bg-white/5 text-white/20'}`}
                >
                    Save
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-12">
                <section>
                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 mb-6">Today's Refection</p>
                    <textarea
                        value={entry}
                        onChange={(e) => setEntry(e.target.value)}
                        placeholder="What's moving through your mind right now?"
                        className="w-full h-48 bg-transparent text-xl font-medium leading-relaxed resize-none focus:outline-none placeholder:text-white/10"
                    />
                </section>

                <section className="pb-12">
                    <p className="text-[10px] uppercase font-black tracking-[0.3em] text-white/30 mb-6">Archive</p>
                    <div className="space-y-6">
                        {state.journal.map(item => (
                            <div key={item.id} className="p-6 rounded-3xl bg-[#1a1a2e] border border-white/5 group hover:border-purple-500/20 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-xs font-bold text-white/30">{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    <span className="text-[10px] py-1 px-3 bg-purple-500/10 text-purple-400 rounded-lg font-black uppercase tracking-widest">{item.emotion}</span>
                                </div>
                                <p className="text-[15px] leading-relaxed text-white/70 italic">"{item.text}"</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Journal;
