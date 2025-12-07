import React from 'react';
import { Edit, Trash2, Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

const PlanCard = ({ plan, onEdit, onDelete }) => {
    const categoryColors = {
        medication: 'from-blue-500 to-purple-600',
        nutrition: 'from-emerald-500 to-green-600',
        fitness: 'from-orange-500 to-red-600',
        wellness: 'from-pink-500 to-purple-600',
        other: 'from-slate-500 to-gray-600'
    };

    const categoryIcons = {
        medication: '💊',
        nutrition: '🥗',
        fitness: '🏃',
        wellness: '🧘',
        other: '📋'
    };

    const billingCycleLabels = {
        monthly: 'Mensal',
        quarterly: 'Trimestral',
        annual: 'Anual'
    };

    const gradient = categoryColors[plan.category] || categoryColors.other;
    const icon = plan.icon || categoryIcons[plan.category] || '📋';
    const occupancyRate = plan.maxPatients ? (plan.currentPatients / plan.maxPatients) * 100 : 0;

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
            {/* Header with Gradient */}
            <div className={`bg-gradient-to-r ${gradient} p-6 relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div className="text-5xl">{icon}</div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${plan.status === 'active'
                                ? 'bg-white/20 text-white border border-white/30'
                                : 'bg-black/20 text-white/70 border border-white/20'
                            }`}>
                            {plan.status === 'active' ? '✓ Ativo' : '○ Inativo'}
                        </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-white/80 text-sm line-clamp-2">{plan.description}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* Price */}
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                        R$ {plan.price.toLocaleString('pt-BR')}
                    </span>
                    <span className="text-muted-foreground text-sm">
                        /{billingCycleLabels[plan.billingCycle]}
                    </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{plan.duration} meses</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                            {plan.currentPatients} pacientes
                        </span>
                    </div>
                </div>

                {/* Occupancy Bar */}
                {plan.maxPatients && (
                    <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Ocupação</span>
                            <span>{Math.round(occupancyRate)}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                                style={{ width: `${occupancyRate}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Features Preview */}
                <div className="pt-2 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Recursos incluídos:</p>
                    <div className="flex flex-wrap gap-1">
                        {plan.features.slice(0, 3).map((feature, index) => (
                            <span
                                key={index}
                                className="text-xs px-2 py-1 bg-secondary rounded-lg text-foreground"
                            >
                                {feature}
                            </span>
                        ))}
                        {plan.features.length > 3 && (
                            <span className="text-xs px-2 py-1 text-muted-foreground">
                                +{plan.features.length - 3} mais
                            </span>
                        )}
                    </div>
                </div>

                {/* Revenue Indicator */}
                <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-foreground">
                        R$ {(plan.price * plan.currentPatients).toLocaleString('pt-BR')}/mês
                    </span>
                    <span className="text-xs text-muted-foreground">receita</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                    <button
                        onClick={() => onEdit(plan)}
                        className="flex-1 px-4 py-2 rounded-xl border border-border bg-background hover:bg-secondary transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                        <Edit className="w-4 h-4" />
                        Editar
                    </button>
                    <button
                        onClick={() => onDelete(plan)}
                        className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors font-medium text-sm flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlanCard;
