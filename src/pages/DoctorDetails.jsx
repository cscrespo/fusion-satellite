import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Calendar, Clock, Video, ArrowLeft, ShieldCheck, Award, Edit, FileText, CheckCircle2, DollarSign, Loader2 } from 'lucide-react';
import DoctorModal from '../components/doctors/DoctorModal';
import { useDoctors } from '../context/DoctorContext';
import { supabase } from '../lib/supabase';

const DoctorDetails = () => {
    const { id } = useParams();
    const { getDoctorById, updateDoctor, loading } = useDoctors();
    const [doctor, setDoctor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Real Consultations State
    const [consultations, setConsultations] = useState([]);
    const [loadingConsultations, setLoadingConsultations] = useState(false);

    useEffect(() => {
        if (!loading) {
            const foundDoctor = getDoctorById(id);
            if (foundDoctor) {
                setDoctor(foundDoctor);
            }
        }
    }, [id, loading, getDoctorById]);

    // Fetch consultations when doctor is found
    useEffect(() => {
        const fetchConsultations = async () => {
            if (!doctor?.name) return;

            setLoadingConsultations(true);
            try {
                // Match by doctor_name since we don't have a direct ID link yet
                const { data, error } = await supabase
                    .from('patient_consultations')
                    .select('*, patients(name)')
                    .eq('doctor_name', doctor.name)
                    .order('date', { ascending: false });

                if (error) throw error;
                setConsultations(data || []);
            } catch (error) {
                console.error('Error fetching consultations:', error);
            } finally {
                setLoadingConsultations(false);
            }
        };

        fetchConsultations();
    }, [doctor]);

    const handleUpdateDoctor = async (updatedData) => {
        try {
            await updateDoctor(id, updatedData);
            setDoctor({ ...doctor, ...updatedData });
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            alert(`Erro ao atualizar especialista: ${error.message}`);
        }
    };

    // Calculate reviews from consultations
    const reviews = consultations
        .filter(c => c.rating && c.rating_comment)
        .map(c => ({
            id: c.id,
            patient: c.patients?.name || 'Paciente Anônimo',
            rating: c.rating,
            comment: c.rating_comment
        }));

    if (loading) return (
        <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    if (!doctor) return <div className="p-8">Médico não encontrado</div>;

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-6">
            <div className="flex justify-between items-center mb-4">
                <Link to="/doctors" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para Especialistas
                </Link>
                <div className="flex items-center gap-2">
                    <Link
                        to={`/doctors/${doctor.id}/payments`}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors text-sm font-medium"
                    >
                        <DollarSign className="w-4 h-4" />
                        Financeiro
                    </Link>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors text-sm font-medium"
                    >
                        <Edit className="w-4 h-4" />
                        Editar Perfil
                    </button>
                </div>
            </div>

            {/* Header Card */}
            <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
                <div className="h-32 bg-primary" />
                <div className="px-8 pb-8 flex flex-col md:flex-row gap-6 items-start -mt-12">
                    <div className="w-32 h-32 rounded-full p-1.5 bg-background shadow-xl">
                        <img
                            src={doctor.avatar_url || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1770&auto=format&fit=crop'}
                            alt={doctor.name}
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <div className="flex-1 pt-12 md:pt-14">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">{doctor.name}</h1>
                                <p className="text-lg text-primary font-medium">{doctor.specialty}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${doctor.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                <span className="text-sm font-medium text-muted-foreground">
                                    {doctor.status === 'online' ? 'Disponível Agora' : 'Offline'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-lg">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <span>CRM: {doctor.crm}</span>
                            </div>
                            {doctor.rqe && (
                                <div className="flex items-center gap-1.5 bg-secondary/50 px-3 py-1.5 rounded-lg">
                                    <Award className="w-4 h-4 text-primary" />
                                    <span>RQE: {doctor.rqe}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-lg text-amber-700 border border-amber-100">
                                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                                <span className="font-bold">{doctor.rating}</span>
                                <span>({doctor.reviews} avaliações)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Column: Bio & Info */}
            <div className="space-y-6">
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Sobre o Especialista</h3>
                    <p className="text-muted-foreground leading-relaxed">
                        {doctor.bio}
                    </p>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="p-4 bg-secondary/20 rounded-xl">
                            <h4 className="font-semibold text-foreground mb-1">Formação</h4>
                            <p className="text-sm text-muted-foreground">{doctor.education || 'Não informada'}</p>
                        </div>
                        <div className="p-4 bg-secondary/20 rounded-xl">
                            <h4 className="font-semibold text-foreground mb-1">Idiomas</h4>
                            <p className="text-sm text-muted-foreground">
                                {doctor.languages && doctor.languages.length > 0
                                    ? doctor.languages.join(', ')
                                    : 'Não informado'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Consultation History */}
                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Histórico de Consultas</h3>
                        <Link to={`/doctors/${doctor.id}/history`} className="text-sm text-primary hover:underline">Ver todas</Link>
                    </div>
                    <div className="space-y-3">
                        {consultations.length === 0 ? (
                            <p className="text-muted-foreground text-center py-4">Nenhuma consulta realizada com este especialista.</p>
                        ) : (
                            consultations.map((consultation) => (
                                <div key={consultation.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{consultation.patients?.name || 'Paciente'}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{new Date(consultation.date).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span>{consultation.type || 'Consulta'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-foreground">R$ {doctor.price.toFixed(2)}</p>
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                                            <CheckCircle2 className="w-3 h-3" />
                                            Concluída
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Avaliações Recentes</h3>
                    <div className="space-y-4">
                        {reviews.length === 0 ? (
                            <p className="text-muted-foreground text-center">Nenhuma avaliação ainda.</p>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                                                {review.patient.charAt(0)}
                                            </div>
                                            <span className="font-medium text-sm">{review.patient}</span>
                                        </div>
                                        <div className="flex text-amber-400">
                                            {[...Array(review.rating)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" />)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        "{review.comment}"
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <DoctorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleUpdateDoctor}
                initialData={doctor}
            />
        </div>
    );
};

export default DoctorDetails;
