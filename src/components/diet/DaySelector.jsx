import React from 'react';

const DaySelector = ({ selectedDay, onSelectDay }) => {
    const days = [
        { key: 'monday', label: 'Segunda' },
        { key: 'tuesday', label: 'Terça' },
        { key: 'wednesday', label: 'Quarta' },
        { key: 'thursday', label: 'Quinta' },
        { key: 'friday', label: 'Sexta' },
        { key: 'saturday', label: 'Sábado' },
        { key: 'sunday', label: 'Domingo' },
    ];

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {days.map((day) => (
                <button
                    key={day.key}
                    onClick={() => onSelectDay(day.key)}
                    className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${selectedDay === day.key
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-card border border-border text-muted-foreground hover:bg-secondary/50'
                        }`}
                >
                    {day.label}
                </button>
            ))}
        </div>
    );
};

export default DaySelector;
