import React from 'react';

const StatCard = ({ label, value, accentColor, active = false, onClick }) => {
    const accentStyles = {
        blue: {
            gradient: 'from-blue-500/10 to-blue-600/5',
            border: 'border-blue-500/20',
            text: 'text-blue-400',
            activeBorder: 'border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
        },
        green: {
            gradient: 'from-emerald-500/10 to-emerald-600/5',
            border: 'border-emerald-500/20',
            text: 'text-emerald-400',
            activeBorder: 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
        },
        orange: {
            gradient: 'from-orange-500/10 to-orange-600/5',
            border: 'border-orange-500/20',
            text: 'text-orange-400',
            activeBorder: 'border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]',
        },
        purple: {
            gradient: 'from-purple-500/10 to-purple-600/5',
            border: 'border-purple-500/20',
            text: 'text-purple-400',
            activeBorder: 'border-purple-400 shadow-[0_0_15px_rgba(167,139,250,0.2)]',
        },
    };

    const accent = accentStyles[accentColor] || accentStyles.blue;

    return (
        <div
            onClick={onClick}
            className={`
        relative overflow-hidden cursor-pointer
        bg-[#1a1a2e] backdrop-blur-md
        rounded-2xl p-5
        border ${active ? accent.activeBorder : accent.border}
        transition-all duration-500 ease-out
        ${active ? 'scale-[1.02]' : 'hover:border-white/20'}
      `}
        >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${accent.gradient} opacity-50`} />

            <div className="flex justify-between items-start">
                <div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${accent.text} mb-1 opacity-80`}>
                        {label}
                    </p>
                    <p className="text-2xl font-bold text-white/90 tracking-tight">
                        {value}
                    </p>
                </div>
                {active && (
                    <div className="flex gap-1 items-center">
                        <span className={`w-1.5 h-1.5 rounded-full ${accent.text.replace('text', 'bg')} animate-pulse`} />
                        <span className="text-[9px] font-medium text-white/40 uppercase tracking-widest">Active</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
