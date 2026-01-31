import React from 'react';

const StatCard = ({ label, value, accentColor, active = false, onClick }) => {
    const accentStyles = {
        blue: {
            gradient: 'from-blue-500/10 to-blue-600/5',
            border: 'border-blue-500/20',
            text: 'text-blue-600 dark:text-blue-400',
            activeBorder: 'border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
        },
        green: {
            gradient: 'from-emerald-500/10 to-emerald-600/5',
            border: 'border-emerald-500/20',
            text: 'text-emerald-600 dark:text-emerald-400',
            activeBorder: 'border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
        },
        orange: {
            gradient: 'from-orange-500/10 to-orange-600/5',
            border: 'border-orange-500/20',
            text: 'text-orange-600 dark:text-orange-400',
            activeBorder: 'border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]',
        },
        purple: {
            gradient: 'from-purple-500/10 to-purple-600/5',
            border: 'border-purple-500/20',
            text: 'text-purple-600 dark:text-purple-400',
            activeBorder: 'border-purple-400 shadow-[0_0_15px_rgba(167,139,250,0.2)]',
        },
    };

    const accent = accentStyles[accentColor] || accentStyles.blue;
    const isLongText = value && value.length > 8;

    return (
        <div
            onClick={onClick}
            className={`
        relative overflow-hidden cursor-pointer
        bg-white dark:bg-[#1a1a2e] backdrop-blur-md
        rounded-2xl p-5
        border border-gray-100 dark:border-white/10
        ${active ? accent.activeBorder : ''}
        transition-all duration-500 ease-out
        hover:shadow-md dark:hover:shadow-none
        ${active ? 'scale-[1.02]' : 'hover:border-gray-200 dark:hover:border-white/20'}
      `}
        >
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${accent.gradient} opacity-50`} />

            <div className="flex justify-between items-start h-full">
                <div className="flex flex-col justify-between h-full">
                    <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${accent.text} mb-1 opacity-80`}>
                        {label}
                    </p>
                    <p className={`font-bold text-gray-800 dark:text-white/90 tracking-tight leading-none ${isLongText ? 'text-lg' : 'text-2xl'}`}>
                        {value}
                    </p>
                </div>
                {active && (
                    <div className="flex gap-1 items-center">
                        <span className={`w-1.5 h-1.5 rounded-full ${accent.text.replace('text', 'bg')} animate-pulse`} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
