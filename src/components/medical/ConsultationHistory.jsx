import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, ChevronDown, ChevronUp, Activity, Stethoscope, ClipboardList, Brain, Star, Edit, Trash2 } from 'lucide-react';
import clsx from 'clsx';
import RateConsultationModal from './RateConsultationModal';
import ConsultationFormModal from './ConsultationFormModal';

const ConsultationCard = ({ consultation, onRate, onEdit, onDelete }) => {
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

                        {/* Edit Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(consultation);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors"
                            title="Editar consulta"
                        >
                            <Edit className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm('Tem certeza que deseja excluir esta consulta?')) {
                                    onDelete(consultation.id);
                                }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                            title="Excluir consulta"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>

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
                                            <span className="font-bold text-lg">{consultation.objective?.weight || '-'} kg</span>
                                        </div>
                                        <div className="p-2 bg-secondary/30 rounded-lg">
                                            <span className="text-xs text-muted-foreground block">Pressão Arterial</span>
                                            <span className="font-bold text-lg">{consultation.objective?.bp || '-'}</span>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-xs">{consultation.objective?.notes || 'Sem observações.'}</p>
                                </div>
                            </div>

                            {/* Assessment */}
                            <div className="space-y-3">
                                <h4 className="font-bold flex items-center gap-2 text-foreground">
                                    <Brain className="w-4 h-4 text-primary" /> Avaliação (Assessment)
                                </h4>
                                <div className="bg-background p-4 rounded-xl border border-border text-sm">
                                    <p>{consultation.assessment || 'Sem avaliação registrada.'}</p>
                                </div>
                            </div>

                            {/* Plan */}
                            <div className="space-y-3">
                                <h4 className="font-bold flex items-center gap-2 text-foreground">
                                    <ClipboardList className="w-4 h-4 text-primary" /> Plano de Ação
                                </h4>
                                <div className="bg-background p-4 rounded-xl border border-border text-sm">
                                    <ul className="space-y-2">
                                        {(consultation.plan || []).map((item, index) => (
                                            <li key={index} className="flex gap-2 items-start">
                                                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                        {(!consultation.plan || consultation.plan.length === 0) && (
                                            <li className="text-muted-foreground italic">Nenhum plano registrado.</li>
                                        )}
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

const ConsultationHistory = ({ consultations, patientId, onAddConsultation, onUpdateConsultation, onDeleteConsultation }) => {
    const [consultationList, setConsultationList] = useState(consultations || []);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingConsultation, setEditingConsultation] = useState(null);

    useEffect(() => {
        setConsultationList(consultations || []);
    }, [consultations]);

    const handleRate = async (consultationId, ratingData) => {
        try {
            if (onUpdateConsultation) {
                // Call context update
                await onUpdateConsultation(consultationId, {
                    rating: ratingData.rating,
                    ratingComment: ratingData.comment // Check if backend expects snake_case? updateConsultation converts camelCase?
                    // updateConsultation in PatientContext uses: rating: consultationData.rating, rating_comment: consultationData.ratingComment
                });
            } else {
                // Fallback for local dev/mock
                setConsultationList(prev => prev.map(consultation =>
                    consultation.id === consultationId
                        ? { ...consultation, rating: ratingData.rating, ratingComment: ratingData.comment }
                        : consultation
                ));
            }
            // Alert removed or kept? Kept for UX
            alert(`Avaliação enviada com sucesso!`);
        } catch (err) {
            console.error('Error rating:', err);
            alert('Erro ao salvar avaliação.');
        }
    };

    const handleAddConsultation = () => {
        setEditingConsultation(null);
        setIsFormModalOpen(true);
    };

    const handleEditConsultation = (consultation) => {
        setEditingConsultation(consultation);
        setIsFormModalOpen(true);
    };

    const handleSaveConsultation = async (consultationData) => {
        try {
            if (editingConsultation) {
                // Update existing consultation
                if (onUpdateConsultation) {
                    await onUpdateConsultation(editingConsultation.id, consultationData);
                }
            } else {
                // Add new consultation
                if (onAddConsultation) {
                    await onAddConsultation(consultationData);
                }
            }
            setIsFormModalOpen(false);
            setEditingConsultation(null);
        } catch (error) {
            console.error('Error saving consultation:', error);
            alert('Erro ao salvar consulta. Por favor, tente novamente.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Histórico de Consultas</h2>
                <button
                    onClick={handleAddConsultation}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
                >
                    + Nova Consulta
                </button>
            </div>

            {(!consultationList || consultationList.length === 0) ? (
                <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Nenhuma consulta registrada.</p>
                    <p className="text-sm mt-2">Clique no botão acima para adicionar.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="space-y-4">
                        {consultationList.filter(Boolean).map((consultation) => (
                            <ConsultationCard
                                key={consultation.id}
                                consultation={{
                                    ...consultation,
                                    objective: consultation.objective || {},
                                    plan: Array.isArray(consultation.plan) ? consultation.plan : []
                                }}
                                onRate={handleRate}
                                onEdit={handleEditConsultation}
                                onDelete={async (consultationId) => {
                                    setConsultationList(prev => prev.filter(c => c.id !== consultationId));
                                    if (onDeleteConsultation) {
                                        await onDeleteConsultation(consultationId);
                                    }
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            <ConsultationFormModal
                isOpen={isFormModalOpen}
                onClose={() => {
                    setIsFormModalOpen(false);
                    setEditingConsultation(null);
                }}
                onSave={handleSaveConsultation}
                editingConsultation={editingConsultation}
                patientId={patientId}
            />
        </div>
    );
};

export default ConsultationHistory;
