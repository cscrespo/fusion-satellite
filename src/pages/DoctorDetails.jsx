import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Calendar, Clock, Video, ArrowLeft, ShieldCheck, Award, Edit, FileText, CheckCircle2, DollarSign } from 'lucide-react';
import { mockDoctors } from '../lib/mockData';
import DoctorModal from '../components/doctors/DoctorModal';

const DoctorDetails = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Consultations for this doctor
    const [consultations] = useState([
        { id: 1, date: '2023-11-01', time: '14:00', patient: 'Alice Johnson', type: 'Teleconsulta', status: 'Concluída', amount: 350.00 },
        { id: 2, date: '2023-11-03', time: '09:30', patient: 'Bob Smith', type: 'Presencial', status: 'Concluída', amount: 350.00 },
        { id: 3, date: '2023-11-05', time: '16:00', patient: 'Charlie Brown', type: 'Teleconsulta', status: 'Agendada', amount: 350.00 },
    ]);

    useEffect(() => {
        const foundDoctor = mockDoctors.find(d => d.id === parseInt(id));
        if (foundDoctor) {
            setDoctor(foundDoctor);
        }
    }, [id]);

    const handleUpdateDoctor = (updatedData) => {
        setDoctor({ ...doctor, ...updatedData });
        setIsModalOpen(false);
    };

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
                <div className="h-32 bg-gradient-to-r from-primary/10 to-blue-500/10" />
                <div className="px-8 pb-8 flex flex-col md:flex-row gap-6 items-start -mt-12">
                    <div className="w-32 h-32 rounded-full p-1.5 bg-background shadow-xl">
                        <img
                            src={doctor.avatar}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Bio & Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <h3 className="text-lg font-bold mb-4">Sobre o Especialista</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            {doctor.bio}
                        </p>
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="p-4 bg-secondary/20 rounded-xl">
                                <h4 className="font-semibold text-foreground mb-1">Formação</h4>
                                <p className="text-sm text-muted-foreground">Faculdade de Medicina da USP</p>
                            </div>
                            <div className="p-4 bg-secondary/20 rounded-xl">
                                <h4 className="font-semibold text-foreground mb-1">Idiomas</h4>
                                <p className="text-sm text-muted-foreground">Português, Inglês</p>
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
                            {consultations.map((consultation) => (
                                <div key={consultation.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-secondary/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground">{consultation.patient}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{consultation.date} às {consultation.time}</span>
                                                <span>•</span>
                                                <span>{consultation.type}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-foreground">R$ {consultation.amount.toFixed(2)}</p>
                                        <span className={`inline-flex items-center gap-1 text-xs font-medium ${consultation.status === 'Concluída' ? 'text-emerald-600' : 'text-amber-600'
                                            }`}>
                                            {consultation.status === 'Concluída' && <CheckCircle2 className="w-3 h-3" />}
                                            {consultation.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                        <h3 className="text-lg font-bold mb-4">Avaliações Recentes</h3>
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="border-b border-border last:border-0 pb-4 last:pb-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold">
                                                P{i}
                                            </div>
                                            <span className="font-medium text-sm">Paciente Anônimo</span>
                                        </div>
                                        <div className="flex text-amber-400">
                                            {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-current" />)}
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        "Excelente profissional! Muito atencioso e explicou tudo com detalhes."
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Booking */}
                <div className="space-y-6">
                    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm sticky top-6">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <p className="text-sm text-muted-foreground">Valor da Consulta</p>
                                <h3 className="text-3xl font-bold text-primary">R$ {doctor.price.toFixed(2)}</h3>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                                <Clock className="w-4 h-4" />
                                <span>50 min</span>
                            </div>
                        </div>

                        <div className="space-y-4 mb-6">
                            <h4 className="font-medium text-sm">Próximos Horários</h4>
                            <div className="grid grid-cols-3 gap-2">
                                {['09:00', '10:00', '14:00', '15:30', '16:00', '17:30'].map((time) => (
                                    <button
                                        key={time}
                                        className="px-2 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary/5 text-sm transition-colors focus:ring-2 focus:ring-primary"
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Link
                            to={`/consultation/${doctor.id}`}
                            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                        >
                            <Video className="w-5 h-5" />
                            Agendar Teleconsulta
                        </Link>

                        <p className="text-xs text-center text-muted-foreground mt-4">
                            Pagamento seguro via plataforma. Cancelamento grátis até 24h antes.
                        </p>
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
