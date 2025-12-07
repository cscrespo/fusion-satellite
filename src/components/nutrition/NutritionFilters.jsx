import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Filter, Image as ImageIcon } from 'lucide-react';

const NutritionFilters = ({
    selectedDate,
    onDateChange,
    filterType,
    onFilterTypeChange,
    showPhotosOnly,
    onShowPhotosOnlyChange
}) => {
    // Format date for display (e.g., "Hoje, 03 Dez")
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
    );
};

export default NutritionFilters;
