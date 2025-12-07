import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

const AdherenceSummary = ({ logs }) => {
    // Calculate stats based on logs (handle both array and object/map)
    const logsArray = Array.isArray(logs) ? logs : Object.values(logs || {});

    const total = logsArray.length;
    const taken = logsArray.filter(l => l.status === 'taken').length;
    const missed = logsArray.filter(l => l.status === 'missed').length;

    const adherenceRate = total > 0 ? Math.round((taken / total) * 100) : 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-6 rounded-2xl border border-border flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Adesão Hoje</p>
                    <p className="text-2xl font-bold">{adherenceRate}%</p>
                </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Tomados</p>
                    <p className="text-2xl font-bold">{taken}/{total}</p>
                </div>
            </div>

            <div className="bg-card p-6 rounded-2xl border border-border flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Perdidos/Pendentes</p>
                    <p className="text-2xl font-bold">{total - taken}</p>
                </div>
            </div>
        </div>
    );
};

export default AdherenceSummary;
