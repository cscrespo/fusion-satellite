import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Filter, Image as ImageIcon, ArrowRight, CalendarRange } from 'lucide-react';

const NutritionFilters = ({
    selectedDate,
    onDateChange,
    filterType,
    onFilterTypeChange,
    showPhotosOnly,
    onShowPhotosOnlyChange,
    mode = 'day',
    onModeChange,
    dateRange,
    onDateRangeChange
}) => {
    // Format date for display (e.g., "Hoje, 03 Dez")
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

                {/* Filters */}
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                    <div className="flex items-center gap-2 px-3 py-2 bg-secondary/30 rounded-lg">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <select
                            value={filterType}
                            onChange={(e) => onFilterTypeChange(e.target.value)}
                            className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
                        >
                            <option value="all">Todas as Refeições</option>
                            <option value="Café da Manhã">Café da Manhã</option>
                            <option value="Almoço">Almoço</option>
                            <option value="Lanche">Lanche</option>
                            <option value="Jantar">Jantar</option>
                        </select>
                    </div>

                    <button
                        onClick={() => onShowPhotosOnlyChange(!showPhotosOnly)}
                        className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                            ${showPhotosOnly
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50 border border-transparent'}
                        `}
                    >
                        <ImageIcon className="w-4 h-4" />
                        <span>Apenas com Fotos</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NutritionFilters;
