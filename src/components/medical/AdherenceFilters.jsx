import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Filter, Pill, Zap, ArrowRight, CalendarRange } from 'lucide-react';

const AdherenceFilters = ({
    selectedDate,
    onDateChange,
    filterType,
    onFilterTypeChange,
    mode = 'day',
    onModeChange,
    dateRange,
    onDateRangeChange
}) => {
    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Data inválida';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Data inválida';

        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();

        const options = { day: 'numeric', month: 'short' };
        const formatted = date.toLocaleDateString('pt-BR', options);

        return isToday ? `Hoje, ${formatted}` : formatted;
    };

    const handlePrevDay = () => {
        if (!selectedDate) return;
        const date = new Date(selectedDate);
        date.setDate(date.getDate() - 1);
        onDateChange(date.toISOString().split('T')[0]);
    };

    const handleNextDay = () => {
        if (!selectedDate) return;
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + 1);
        onDateChange(date.toISOString().split('T')[0]);
    };

    return (
        <div className="flex flex-col gap-4 bg-card p-4 rounded-xl border border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Mode Toggle & Date Selection */}
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    {/* View Mode Toggle */}
                    <div className="flex bg-secondary/30 rounded-lg p-1">
                        <button
                            onClick={() => onModeChange('day')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'day'
                                    ? 'bg-background shadow-sm text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <Calendar className="w-4 h-4" />
                            Dia
                        </button>
                        <button
                            onClick={() => onModeChange('range')}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${mode === 'range'
                                    ? 'bg-background shadow-sm text-foreground'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <CalendarRange className="w-4 h-4" />
                            Período
                        </button>
                    </div>

                    <div className="h-6 w-px bg-border hidden md:block"></div>

                    {/* Date Controls */}
                    {mode === 'day' ? (
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
                    ) : (
                        <div className="flex items-center gap-2 w-full md:w-auto bg-secondary/30 p-1 rounded-lg">
                            <input
                                type="date"
                                value={dateRange?.start || ''}
                                onChange={(e) => onDateRangeChange && onDateRangeChange({ ...dateRange, start: e.target.value })}
                                className="bg-transparent border-none focus:ring-0 text-sm p-1.5"
                            />
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            <input
                                type="date"
                                value={dateRange?.end || ''}
                                onChange={(e) => onDateRangeChange && onDateRangeChange({ ...dateRange, end: e.target.value })}
                                className="bg-transparent border-none focus:ring-0 text-sm p-1.5"
                            />
                        </div>
                    )}
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
        </div>
    );
};

export default AdherenceFilters;
