import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Filter, Pill, Zap } from 'lucide-react';

const AdherenceFilters = ({
    selectedDate,
    onDateChange,
    filterType,
    onFilterTypeChange
}) => {
    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        const options = { day: 'numeric', month: 'short' };
        const formatted = date.toLocaleDateString('pt-BR', options);

        return isToday ? `Hoje, ${formatted}` : formatted;
    };

    const handlePrevDay = () => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() - 1);
        onDateChange(date.toISOString().split('T')[0]);
    };

    const handleNextDay = () => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + 1);
        onDateChange(date.toISOString().split('T')[0]);
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-card p-2 rounded-xl border border-border">
            {/* Date Navigation */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <button onClick={handlePrevDay} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                    <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>

                <div className="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg flex-1 md:flex-none justify-center min-w-[160px]">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{formatDate(selectedDate)}</span>
                </div>

                <button onClick={handleNextDay} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="flex p-1 bg-secondary/30 rounded-lg w-full md:w-auto">
                    <button
                        onClick={() => onFilterTypeChange('all')}
                        className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterType === 'all' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => onFilterTypeChange('medication')}
                        className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 justify-center ${filterType === 'medication' ? 'bg-background shadow-sm text-blue-600' : 'text-muted-foreground hover:text-blue-600'
                            }`}
                    >
                        <Pill className="w-3.5 h-3.5" />
                        Medicações
                    </button>
                    <button
                        onClick={() => onFilterTypeChange('supplement')}
                        className={`flex-1 md:flex-none px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 justify-center ${filterType === 'supplement' ? 'bg-background shadow-sm text-purple-600' : 'text-muted-foreground hover:text-purple-600'
                            }`}
                    >
                        <Zap className="w-3.5 h-3.5" />
                        Suplementos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdherenceFilters;
