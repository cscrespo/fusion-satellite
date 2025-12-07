import React from 'react';
import { X, AlertTriangle, Users } from 'lucide-react';

const DeletePlanModal = ({ isOpen, plan, onClose, onConfirm }) => {
    if (!isOpen || !plan) return null;

    const hasActivePatients = plan.currentPatients > 0;

    const handleConfirm = () => {
        onConfirm(plan.id);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border animate-in fade-in zoom-in duration-200">
                <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-foreground mb-2">
                                Excluir Plano?
                            </h2>
                            <p className="text-muted-foreground text-sm">
                                Você está prestes a excluir o plano <span className="font-semibold text-foreground">"{plan.name}"</span>.
                            </p>
                        </div>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {hasActivePatients && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                            <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-amber-900 mb-1">
                                        Atenção: Pacientes Ativos
                                    </p>
                                    <p className="text-sm text-amber-700">
                                        Este plano possui <span className="font-semibold">{plan.currentPatients} paciente(s) ativo(s)</span>.
                                        Considere desativar o plano ao invés de excluí-lo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-secondary/50 rounded-xl p-4 mb-6">
                        <p className="text-sm text-muted-foreground mb-2">Informações do plano:</p>
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Preço:</span>
                                <span className="font-medium text-foreground">R$ {plan.price.toLocaleString('pt-BR')}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Pacientes:</span>
                                <span className="font-medium text-foreground">{plan.currentPatients}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Status:</span>
                                <span className={`font-medium ${plan.status === 'active' ? 'text-emerald-600' : 'text-slate-600'}`}>
                                    {plan.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={handleConfirm}
                            className="w-full px-4 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2"
                        >
                            <AlertTriangle className="w-5 h-5" />
                            Sim, Excluir Plano
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full px-4 py-3 rounded-xl border border-border bg-background hover:bg-secondary transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center mt-4">
                        Esta ação não pode ser desfeita.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DeletePlanModal;
