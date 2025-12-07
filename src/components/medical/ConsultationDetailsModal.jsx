import React from 'react';
import { X, FileText, Activity, BrainCircuit, ClipboardList, Calendar, Clock, User } from 'lucide-react';

const ConsultationDetailsModal = ({ isOpen, onClose, consultation }) => {
    if (!isOpen || !consultation) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-2xl rounded-2xl shadow-xl border border-border p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold">Detalhes da Consulta</h2>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {consultation.date}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {consultation.time}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-secondary text-xs font-medium text-foreground">
                                {consultation.type}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Header Info */}
                    <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-xl border border-border/50">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Paciente</p>
                            <h3 className="font-bold text-lg text-foreground">{consultation.patient}</h3>
                        </div>
                        <div className="ml-auto text-right">
                            <p className="text-sm text-muted-foreground">Valor</p>
                            <h3 className="font-bold text-lg text-foreground">R$ {consultation.amount.toFixed(2)}</h3>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {/* Subjective */}
                        <div className="space-y-3">
                            <h4 className="font-bold flex items-center gap-2 text-foreground">
                                <FileText className="w-4 h-4 text-primary" /> Transcrição & Notas
                            </h4>
                            <div className="bg-background p-4 rounded-xl border border-border text-sm space-y-3">
                                {consultation.transcription && (
                                    <div>
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Transcrição</span>
                                        <p className="mt-1 text-muted-foreground italic">"{consultation.transcription}"</p>
                                    </div>
                                )}
                                <div>
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Notas Clínicas</span>
                                    <p className="mt-1">{consultation.notes || 'Nenhuma nota registrada.'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Objective */}
                        {(consultation.objective || consultation.weight || consultation.bp) && (
                            <div className="space-y-3">
                                <h4 className="font-bold flex items-center gap-2 text-foreground">
                                    <Activity className="w-4 h-4 text-primary" /> Dados Objetivos
                                </h4>
                                <div className="bg-background p-4 rounded-xl border border-border text-sm">
                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        {(consultation.objective?.weight || consultation.weight) && (
                                            <div className="p-2 bg-secondary/30 rounded-lg">
                                                <span className="text-xs text-muted-foreground block">Peso</span>
                                                <span className="font-bold text-lg">{consultation.objective?.weight || consultation.weight} kg</span>
                                            </div>
                                        )}
                                        {(consultation.objective?.bp || consultation.bp) && (
                                            <div className="p-2 bg-secondary/30 rounded-lg">
                                                <span className="text-xs text-muted-foreground block">Pressão Arterial</span>
                                                <span className="font-bold text-lg">{consultation.objective?.bp || consultation.bp}</span>
                                            </div>
                                        )}
                                    </div>
                                    {consultation.objective?.notes && (
                                        <p className="text-muted-foreground text-xs">{consultation.objective.notes}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Assessment */}
                        {consultation.assessment && (
                            <div className="space-y-3">
                                <h4 className="font-bold flex items-center gap-2 text-foreground">
                                    <BrainCircuit className="w-4 h-4 text-primary" /> Avaliação (Assessment)
                                </h4>
                                <div className="bg-background p-4 rounded-xl border border-border text-sm">
                                    <p>{consultation.assessment}</p>
                                </div>
                            </div>
                        )}

                        {/* Plan */}
                        {consultation.plan && consultation.plan.length > 0 && (
                            <div className="space-y-3">
                                <h4 className="font-bold flex items-center gap-2 text-foreground">
                                    <ClipboardList className="w-4 h-4 text-primary" /> Plano de Ação
                                </h4>
                                <div className="bg-background p-4 rounded-xl border border-border text-sm">
                                    <ul className="space-y-2">
                                        {consultation.plan.map((item, index) => (
                                            <li key={index} className="flex gap-2 items-start">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultationDetailsModal;
