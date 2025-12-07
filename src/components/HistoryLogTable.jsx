import React, { useState, useMemo } from 'react';
import { Search, Filter, Calendar, ChevronDown, ArrowUp, ArrowDown, Edit2, Trash2 } from 'lucide-react';

const HistoryLogTable = ({ data, onDelete, onEdit }) => {
    const [filterType, setFilterType] = useState('all');
    const [dateRange, setDateRange] = useState('all');
    const [sortOrder, setSortOrder] = useState('desc'); // 'desc' or 'asc'

    const filteredData = useMemo(() => {
        let processed = [...data];

        // Filter by type
        if (filterType !== 'all') {
            processed = processed.filter(item => item.type === filterType);
        }

        // Filter by date range
        if (dateRange !== 'all') {
            const now = new Date();
            const pastDate = new Date();
            pastDate.setDate(now.getDate() - parseInt(dateRange));
            processed = processed.filter(item => new Date(item.date) >= pastDate);
        }

        // Sort by date
        processed.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });

        return processed;
    }, [data, filterType, dateRange, sortOrder]);

    const getTypeColor = (type) => {
        switch (type) {
            case 'weight': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'composition': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'measurement': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'weight': return 'Peso';
            case 'composition': return 'Composição';
            case 'measurement': return 'Medidas';
            default: return type;
        }
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                    {/* Type Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                            className="pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">Todos os Tipos</option>
                            <option value="weight">Peso</option>
                            <option value="composition">Composição Corporal</option>
                            <option value="measurement">Medidas</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>

                    {/* Date Filter */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                            className="pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option value="all">Todo o período</option>
                            <option value="30">Últimos 30 dias</option>
                            <option value="90">Últimos 3 meses</option>
                            <option value="180">Últimos 6 meses</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>

                    <button
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="p-2 bg-card border border-border rounded-lg hover:bg-secondary transition-colors text-muted-foreground"
                        title={sortOrder === 'desc' ? "Mais recentes primeiro" : "Mais antigos primeiro"}
                    >
                        {sortOrder === 'desc' ? <ArrowDown className="w-4 h-4" /> : <ArrowUp className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/30 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4">Data</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4">Valor / Detalhes</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item.id} className="hover:bg-secondary/10 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                {new Date(item.date).toLocaleDateString('pt-BR')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                                                {getTypeLabel(item.type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-foreground">
                                            {item.value}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => onEdit && onEdit(item)}
                                                    className="p-1.5 hover:bg-secondary rounded-md text-muted-foreground hover:text-primary transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => onDelete && onDelete(item.id)}
                                                    className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-md text-muted-foreground transition-colors"
                                                    title="Excluir"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-muted-foreground">
                                        Nenhum registro encontrado para este filtro.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HistoryLogTable;
