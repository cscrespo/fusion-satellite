import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Calendar, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { mockDoctors } from '../lib/mockData';
import ConsultationDetailsModal from '../components/medical/ConsultationDetailsModal';

const DoctorHistory = () => {
    const { id } = useParams();
    const doctor = mockDoctors.find(d => d.id === parseInt(id));

    // Expanded Mock Consultations with full details
    const [consultations] = useState([
        {
            id: 1,
            date: '2023-11-01',
            time: '14:00',
            patient: 'Alice Johnson',
            type: 'Teleconsulta',
            status: 'Concluída',
            amount: 350.00,
            notes: 'Paciente relatou melhora nos sintomas.',
            transcription: "Paciente refere sentir-se mais disposta após início da suplementação. Nega efeitos colaterais. Sono melhorou.",
            objective: { weight: 68.5, bp: '120/80', notes: 'Perda de 1.5kg desde a última consulta.' },
            assessment: 'Boa resposta ao tratamento inicial.',
            plan: ['Manter prescrição atual', 'Retorno em 30 dias']
        },
        {
            id: 2,
            date: '2023-11-03',
            time: '09:30',
            patient: 'Bob Smith',
            type: 'Presencial',
            status: 'Concluída',
            amount: 350.00,
            notes: 'Solicitado exames de sangue.',
            transcription: "Queixa de fadiga persistente. Exame físico sem alterações significativas.",
            objective: { weight: 82.0, bp: '130/85', notes: 'Ganho de peso leve.' },
            assessment: 'Investigar causas metabólicas para fadiga.',
            plan: ['Solicitar hemograma completo e perfil tireoidiano', 'Ajustar dieta']
        },
        {
            id: 3,
            date: '2023-11-05',
            time: '16:00',
            patient: 'Charlie Brown',
            type: 'Teleconsulta',
            status: 'Agendada',
            amount: 350.00,
            notes: ''
        },
        {
            id: 4,
            date: '2023-10-28',
            time: '11:00',
            patient: 'Diana Prince',
            type: 'Presencial',
            status: 'Concluída',
            amount: 350.00,
            notes: 'Retorno de rotina.',
            transcription: "Paciente assintomática. Traz exames de rotina normais.",
            objective: { weight: 60.0, bp: '110/70', notes: 'Peso estável.' },
            assessment: 'Saúde excelente. Manter estilo de vida.',
            plan: ['Retorno anual']
        },
        {
            id: 5,
            date: '2023-10-25',
            time: '15:30',
            patient: 'Evan Wright',
            type: 'Teleconsulta',
            status: 'Cancelada',
            amount: 0.00,
            notes: 'Paciente cancelou.'
        },
        {
            id: 6,
            date: '2023-10-20',
            time: '10:00',
            patient: 'Fiona Green',
            type: 'Presencial',
            status: 'Concluída',
            amount: 350.00,
            notes: 'Primeira consulta.',
            transcription: "Busca orientação para emagrecimento saudável. Histórico de dietas restritivas sem sucesso.",
            objective: { weight: 95.0, bp: '135/85', notes: 'IMC 32.5' },
            assessment: 'Obesidade grau I. Necessidade de reeducação alimentar.',
            plan: ['Dieta hipocalórica balanceada', 'Iniciar caminhadas 30min/dia', 'Solicitar bioimpedância']
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!doctor) return <div className="p-8">Médico não encontrado</div>;

    const filteredConsultations = consultations.filter(consultation => {
        const matchesSearch = consultation.patient.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleConsultationClick = (consultation) => {
        setSelectedConsultation(consultation);
        setIsModalOpen(true);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Concluída': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Agendada': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Cancelada': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Concluída': return <CheckCircle2 className="w-3 h-3" />;
            case 'Agendada': return <Clock className="w-3 h-3" />;
            case 'Cancelada': return <AlertCircle className="w-3 h-3" />;
            default: return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Link to={`/doctors/${id}`} className="p-2 rounded-full hover:bg-secondary transition-colors">
                    <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Histórico de Consultas</h1>
                    <p className="text-muted-foreground">Dr. {doctor.name} • {doctor.specialty}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar por paciente..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <select
                        className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Todos os Status</option>
                        <option value="Concluída">Concluídas</option>
                        <option value="Agendada">Agendadas</option>
                        <option value="Cancelada">Canceladas</option>
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredConsultations.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Nenhuma consulta encontrada.</p>
                    </div>
                ) : (
                    filteredConsultations.map((consultation) => (
                        <div
                            key={consultation.id}
                            onClick={() => handleConsultationClick(consultation)}
                            className="bg-card p-5 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all cursor-pointer hover:bg-secondary/5"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground">{consultation.patient}</h3>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {consultation.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5" />
                                                {consultation.time}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-md bg-secondary text-xs font-medium">
                                                {consultation.type}
                                            </span>
                                        </div>
                                        {consultation.notes && (
                                            <p className="text-sm text-muted-foreground mt-3 bg-secondary/30 p-3 rounded-lg border border-border/50">
                                                "{consultation.notes}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-between gap-2">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(consultation.status)}`}>
                                        {getStatusIcon(consultation.status)}
                                        {consultation.status}
                                    </span>
                                    <span className="font-bold text-lg text-foreground">R$ {consultation.amount.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <ConsultationDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                consultation={selectedConsultation}
            />
        </div>
    );
};

export default DoctorHistory;
