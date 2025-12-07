import React from 'react';
import { CheckCircle2, XCircle, Clock, Pill, Zap } from 'lucide-react';

const AdherenceTimeline = ({ items, onToggleStatus }) => {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'taken': return <CheckCircle2 className="w-6 h-6 text-green-500" />;
            case 'missed': return <XCircle className="w-6 h-6 text-red-500" />;
            default: return <Clock className="w-6 h-6 text-gray-300" />;
        }
    };

    const getTypeIcon = (type) => {
        return type === 'medication' ? <Pill className="w-4 h-4" /> : <Zap className="w-4 h-4" />;
    };

    if (!items || items.length === 0) {
        return (
            <div className="bg-card p-8 rounded-2xl border border-border text-center text-muted-foreground">
                <Pill className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>Nenhum medicamento ou suplemento agendado para este dia.</p>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
                <h3 className="text-lg font-bold">Linha do Tempo</h3>
                <p className="text-sm text-muted-foreground">Acompanhamento diário de adesão</p>
            </div>
            <div className="divide-y divide-border">
                {items.map((item) => (
                    <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-secondary/10 transition-colors">
                        {/* Time */}
                        <div className="w-16 text-center">
                            <span className="text-lg font-bold text-primary">{item.scheduledTime}</span>
                        </div>

                        {/* Status Icon (Clickable) */}
                        <button
                            onClick={() => onToggleStatus(item.id)}
                            className="shrink-0 hover:scale-110 transition-transform"
                            title="Alternar Status"
                        >
                            {getStatusIcon(item.status)}
                        </button>

                        {/* Details */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-lg">{item.name}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${item.type === 'medication' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                                    }`}>
                                    {getTypeIcon(item.type)}
                                    {item.type === 'medication' ? 'Medicamento' : 'Suplemento'}
                                </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Dose: {item.dosage}
                                {item.takenAt && <span className="ml-2 text-green-600">• Tomado às {item.takenAt}</span>}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdherenceTimeline;
