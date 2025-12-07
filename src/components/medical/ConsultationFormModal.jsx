import React, { useState, useEffect } from 'react';
import { X, FileText, Activity, Brain, ClipboardList, Calendar, Clock, User, Stethoscope, Plus, Trash2 } from 'lucide-react';

const ConsultationFormModal = ({ isOpen, onClose, onSave, editingConsultation, patientId }) => {
    const [formData, setFormData] = useState({
        doctor: '',
        specialty: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        type: 'Presencial',
        transcription: '',
        notes: '',
        weight: '',
        bp: '',
        objectiveNotes: '',
        assessment: '',
        plan: ['']
    });

    useEffect(() => {
        if (isOpen) {
            if (editingConsultation) {
                setFormData({
                    doctor: editingConsultation.doctor || '',
                    specialty: editingConsultation.specialty || '',
                    date: editingConsultation.date ? new Date(editingConsultation.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    time: editingConsultation.date ? new Date(editingConsultation.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    type: editingConsultation.type || 'Presencial',
                    transcription: editingConsultation.transcription || '',
                    notes: editingConsultation.notes || '',
                    weight: editingConsultation.objective?.weight || editingConsultation.weight || '',
                    bp: editingConsultation.objective?.bp || editingConsultation.bp || '',
                    objectiveNotes: editingConsultation.objective?.notes || '',
                    assessment: editingConsultation.assessment || '',
                    plan: editingConsultation.plan && editingConsultation.plan.length > 0 ? editingConsultation.plan : ['']
                });
            } else {
                setFormData({
                    doctor: '',
                    specialty: '',
                    date: new Date().toISOString().split('T')[0],
                    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                    type: 'Presencial',
                    transcription: '',
                    notes: '',
                    weight: '',
                    bp: '',
                    objectiveNotes: '',
                    assessment: '',
                    plan: ['']
                });
            }
        }
    }, [isOpen, editingConsultation]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        // Combine date and time
        const dateTime = new Date(`${formData.date}T${formData.time}`);

        const consultationData = {
            patient_id: patientId,
            doctor: formData.doctor,
            specialty: formData.specialty,
            date: dateTime.toISOString(),
            type: formData.type,
            transcription: formData.transcription,
            notes: formData.notes,
            objective: {
                weight: formData.weight ? parseFloat(formData.weight) : null,
                bp: formData.bp,
                notes: formData.objectiveNotes
            },
            assessment: formData.assessment,
            plan: formData.plan.filter(item => item.trim() !== '')
        };

        onSave(consultationData);
        onClose();
    };

    const handleAddPlanItem = () => {
        setFormData({
            ...formData,
            plan: [...formData.plan, '']
        });
    };

    const handleRemovePlanItem = (index) => {
        const newPlan = formData.plan.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            plan: newPlan.length > 0 ? newPlan : ['']
        });
    };

    const handlePlanItemChange = (index, value) => {
        const newPlan = [...formData.plan];
        newPlan[index] = value;
        setFormData({
            ...formData,
            plan: newPlan
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card w-full max-w-3xl rounded-2xl shadow-xl border border-border p-6 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold">
                            {editingConsultation ? 'Editar Consulta' : 'Nova Consulta'}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Preencha os dados da consulta no formato SOAP
                        </p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4 p-4 bg-secondary/10 rounded-xl border border-border/50">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-primary" />
                            Informações Básicas
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Médico/Profissional *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.doctor}
                                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                    placeholder="Nome do profissional"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Especialidade *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.specialty}
                                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                    placeholder="Ex: Nutricionista"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Data *
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Horário *
                                </label>
                                <input
                                    type="time"
                                    required
                                    value={formData.time}
                                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1">
                                    Tipo de Consulta *
                                </label>
                                <select
                                    required
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                >
                                    <option value="Presencial">Presencial</option>
                                    <option value="Telemedicina">Telemedicina</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Subjective - S */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            Subjetivo (S) - Transcrição & Notas
                        </h3>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Transcrição da Consulta
                            </label>
                            <textarea
                                rows={3}
                                value={formData.transcription}
                                onChange={(e) => setFormData({ ...formData, transcription: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                                placeholder="Transcrição da fala do paciente..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Notas Clínicas *
                            </label>
                            <textarea
                                rows={4}
                                required
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                                placeholder="Queixas, sintomas, histórico relevante..."
                            />
                        </div>
                    </div>

                    {/* Objective - O */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Activity className="w-4 h-4 text-primary" />
                            Objetivo (O) - Dados Mensuráveis
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Peso (kg)
                                </label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                    placeholder="Ex: 75.5"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Pressão Arterial
                                </label>
                                <input
                                    type="text"
                                    value={formData.bp}
                                    onChange={(e) => setFormData({ ...formData, bp: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                    placeholder="Ex: 120/80"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Outras Observações Objetivas
                            </label>
                            <textarea
                                rows={2}
                                value={formData.objectiveNotes}
                                onChange={(e) => setFormData({ ...formData, objectiveNotes: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                                placeholder="Exames, medidas corporais, etc..."
                            />
                        </div>
                    </div>

                    {/* Assessment - A */}
                    <div className="space-y-3">
                        <h3 className="font-semibold flex items-center gap-2">
                            <Brain className="w-4 h-4 text-primary" />
                            Avaliação (A) - Diagnóstico/Análise
                        </h3>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Avaliação Clínica *
                            </label>
                            <textarea
                                rows={4}
                                required
                                value={formData.assessment}
                                onChange={(e) => setFormData({ ...formData, assessment: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none"
                                placeholder="Diagnóstico, análise do quadro, interpretação dos dados..."
                            />
                        </div>
                    </div>

                    {/* Plan - P */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold flex items-center gap-2">
                                <ClipboardList className="w-4 h-4 text-primary" />
                                Plano (P) - Ações e Condutas
                            </h3>
                            <button
                                type="button"
                                onClick={handleAddPlanItem}
                                className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                            >
                                <Plus className="w-3 h-3" />
                                Adicionar Item
                            </button>
                        </div>

                        <div className="space-y-2">
                            {formData.plan.map((item, index) => (
                                <div key={index} className="flex gap-2 items-start">
                                    <input
                                        type="text"
                                        value={item}
                                        onChange={(e) => handlePlanItemChange(index, e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                        placeholder={`Item ${index + 1} do plano de ação...`}
                                    />
                                    {formData.plan.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemovePlanItem(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border border-border bg-background hover:bg-secondary transition-colors font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                        >
                            {editingConsultation ? 'Salvar Alterações' : 'Criar Consulta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConsultationFormModal;
