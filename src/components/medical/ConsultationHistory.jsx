import React, { useState } from 'react';
import { Calendar, Clock, User, FileText, ChevronDown, ChevronUp, Activity, Stethoscope, ClipboardList, BrainCircuit, Star } from 'lucide-react';
import clsx from 'clsx';
import RateConsultationModal from './RateConsultationModal';

const ConsultationCard = ({ consultation, onRate }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);

    const handleRate = (ratingData) => {
        onRate(consultation.id, ratingData);
    };

    return (
        <>
            <div className="bg-card border border-border rounded-2xl overflow-hidden transition-all hover:shadow-md">
                <div
                    className="p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between cursor-pointer hover:bg-secondary/5"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    <div className="flex items-start gap-4">
                        <div className={clsx(
                            "p-3 rounded-xl flex items-center justify-center shrink-0",
                            consultation.type === 'Presencial' ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                        )}>
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg">{consultation.doctor}</h3>
                                <span className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full font-medium">
                                    {consultation.specialty}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(consultation.date).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {new Date(consultation.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span className={clsx(
                                    "px-2 py-0.5 rounded text-xs font-medium",
                                    consultation.type === 'Presencial' ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"
                                )}>
                                    {consultation.type}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {consultation.rating ? (
                            <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-100">
                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                <span className="text-sm font-medium text-amber-700">{consultation.rating}/5</span>
                            </div>
                        ) : (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowRatingModal(true);
                                }}
                                className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
                            >
                                <Star className="w-4 h-4" />
                                Avaliar
                            </button>
                        )}
                        <div className="text-primary font-medium">
                            {isExpanded ? 'Ver menos' : 'Ver detalhes'}
                            {isExpanded ? <ChevronUp className="w-4 h-4 inline ml-1" /> : <ChevronDown className="w-4 h-4 inline ml-1" />}
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <div className="p-5 pt-0 border-t border-border/50 bg-secondary/5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                            {/* Subjective */}
                            <div className="space-y-3">
                                <h4 className="font-bold flex items-center gap-2 text-foreground">
                                    <FileText className="w-4 h-4 text-primary" /> Transcrição & Notas
                                </h4>
                                <div className="bg-background p-4 rounded-xl border border-border text-sm space-y-3">
                                    <div>
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Transcrição</span>
                                        <p className="mt-1 text-muted-foreground italic">"{consultation.transcription}"</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Notas Clínicas</span>
                                        <p className="mt-1">{consultation.notes}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Objective */}
                            <div className="space-y-3">
                                <h4 className="font-bold flex items-center gap-2 text-foreground">
                                    <Activity className="w-4 h-4 text-primary" /> Dados Objetivos
                                </h4>
                                <div className="bg-background p-4 rounded-xl border border-border text-sm">
                                    <div className="grid grid-cols-2 gap-4 mb-3">
                                        <div className="p-2 bg-secondary/30 rounded-lg">
                                            <span className="text-xs text-muted-foreground block">Peso</span>
                                            <span className="font-bold text-lg">{consultation.objective.weight} kg</span>
                                        </div>
                                        <div className="p-2 bg-secondary/30 rounded-lg">
                                            <span className="text-xs text-muted-foreground block">Pressão Arterial</span>
                                            <span className="font-bold text-lg">{consultation.objective.bp}</span>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-xs">{consultation.objective.notes}</p>
                                </div>
                            </div>

                            {/* Assessment */}
                            <div className="space-y-3">
                                <h4 className="font-bold flex items-center gap-2 text-foreground">
                                    <BrainCircuit className="w-4 h-4 text-primary" /> Avaliação (Assessment)
                                </h4>
                                <div className="bg-background p-4 rounded-xl border border-border text-sm">
                                    <p>{consultation.assessment}</p>
                                </div>
                            </div>

                            {/* Plan */}
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
                        </div>
                    </div>
                )}
            </div>

            <RateConsultationModal
                isOpen={showRatingModal}
                onClose={() => setShowRatingModal(false)}
                consultation={consultation}
                onSubmit={handleRate}
            />
        </>
    );
};

const ConsultationHistory = ({ consultations }) => {
    const [consultationList, setConsultationList] = useState(consultations || []);

    const handleRate = (consultationId, ratingData) => {
        setConsultationList(prev => prev.map(consultation =>
            consultation.id === consultationId
                ? { ...consultation, rating: ratingData.rating, ratingComment: ratingData.comment }
                : consultation
        ));
        alert(`Avaliação enviada com sucesso! ${ratingData.rating} estrelas`);
    };

    if (!consultationList || consultationList.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p>Nenhuma consulta registrada.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Histórico de Consultas</h2>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                    + Nova Consulta
                </button>
            </div>
            <div className="space-y-4">
                {consultationList.map((consultation) => (
                    <ConsultationCard key={consultation.id} consultation={consultation} onRate={handleRate} />
                ))}
            </div>
        </div>
    );
};

export default ConsultationHistory;
