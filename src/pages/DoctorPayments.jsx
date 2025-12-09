import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, DollarSign, Clock, TrendingUp, Download, Search, Filter, Eye, Calendar, Star, Loader2 } from 'lucide-react';
import { useDoctors } from '../context/DoctorContext';
import { supabase } from '../lib/supabase';
import TransactionDetailsModal from '../components/doctors/TransactionDetailsModal';

const DoctorPayments = () => {
    const { id } = useParams();
    const { getDoctorById, loading: loadingDoctors } = useDoctors();
    const [doctor, setDoctor] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Load Doctor
    useEffect(() => {
        if (!loadingDoctors) {
            const foundDoctor = getDoctorById(id);
            if (foundDoctor) {
                setDoctor(foundDoctor);
            }
        }
    }, [id, loadingDoctors, getDoctorById]);

    // Fetch Transactions (Simulated from Consultations)
    useEffect(() => {
        const fetchTransactions = async () => {
            if (!doctor?.name) return;

            setLoadingTransactions(true);
            try {
                // Fetch consultations to simulate transactions
                const { data: consultations, error } = await supabase
                    .from('patient_consultations')
                    .select('*, patients(full_name)')
                    .eq('doctor_name', doctor.name)
                    .order('date', { ascending: false });

                if (error) throw error;

                // Transform consultations into transactions
                const simulatedTransactions = (consultations || []).map((consultation, index) => {
                    const price = doctor.price || 0;
                    const fee = price * 0.20; // 20% platform fee

                    // Simulate status based on mock rules or date
                    // Older than 30 days = 'Pago', Older than 7 days = 'Disponível', else 'Pendente'
                    const date = new Date(consultation.date);
                    const now = new Date();
                    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

                    let status = 'Pendente';
                    let paymentDate = null;
                    let releaseDate = new Date(date);
                    releaseDate.setDate(releaseDate.getDate() + 7); // Release after 7 days

                    if (diffDays > 30) {
                        status = 'Pago';
                        const pDate = new Date(date);
                        pDate.setDate(pDate.getDate() + 30);
                        paymentDate = pDate.toISOString().split('T')[0];
                    } else if (diffDays > 7) {
                        status = 'Disponível';
                    }

                    return {
                        id: consultation.id,
                        consultationId: consultation.id, // Use UUID
                        patientName: consultation.patients?.full_name || 'Paciente',
                        protocol: 'Consulta Padrão', // Placeholder
                        consultationDate: new Date(consultation.date).toLocaleDateString(),
                        consultationTime: new Date(consultation.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        grossAmount: price,
                        platformFee: fee,
                        netAmount: price - fee,
                        status: status,
                        releaseDate: releaseDate.toLocaleDateString(),
                        paymentDate: paymentDate,
                        patientRating: consultation.rating ? { score: consultation.rating, comment: consultation.rating_comment } : null,
                        transcription: { duration: "50 min", status: consultation.transcription ? "Aprovado" : "Pendente" }
                    };
                });

                setTransactions(simulatedTransactions);

            } catch (err) {
                console.error("Error fetching transactions:", err);
            } finally {
                setLoadingTransactions(false);
            }
        };

        fetchTransactions();
    }, [doctor]);

    if (loadingDoctors) return (
        <div className="flex items-center justify-center p-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );

    if (!doctor) return <div className="p-8">Médico não encontrado</div>;

    // Calculate totals
    const availableBalance = transactions
        .filter(t => t.status === 'Disponível')
        .reduce((sum, t) => sum + t.netAmount, 0);

    const pendingBalance = transactions
        .filter(t => t.status === 'Pendente')
        .reduce((sum, t) => sum + t.netAmount, 0);

    const totalEarned = transactions
        .filter(t => t.status === 'Pago')
        .reduce((sum, t) => sum + t.netAmount, 0);

    // Filter transactions
    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.protocol.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pago': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Disponível': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Pendente': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Solicitado': return 'bg-purple-50 text-purple-700 border-purple-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    return (
        <div className="max-w-6xl mx-auto pb-20 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <Link to={`/doctors/${id}`} className="p-2 rounded-full hover:bg-secondary transition-colors">
                    <ArrowLeft className="w-5 h-5 text-muted-foreground" />
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
                    <p className="text-muted-foreground">Dr. {doctor.name} • {doctor.specialty}</p>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Solicitar Saque
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-100 text-sm font-medium">Saldo Disponível</span>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <DollarSign className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">R$ {availableBalance.toFixed(2)}</p>
                    <p className="text-blue-100 text-xs mt-1">Pronto para saque</p>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-amber-100 text-sm font-medium">Saldo Pendente</span>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <Clock className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">R$ {pendingBalance.toFixed(2)}</p>
                    <p className="text-amber-100 text-xs mt-1">Aguardando liberação</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-2xl text-white shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-emerald-100 text-sm font-medium">Total Recebido</span>
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                    </div>
                    <p className="text-3xl font-bold">R$ {totalEarned.toFixed(2)}</p>
                    <p className="text-emerald-100 text-xs mt-1">{transactions.filter(t => t.status === 'Pago').length} consultas pagas</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card p-4 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Buscar por paciente ou protocolo..."
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
                        <option value="Pago">Pagos</option>
                        <option value="Disponível">Disponíveis</option>
                        <option value="Pendente">Pendentes</option>
                        <option value="Solicitado">Solicitados</option>
                    </select>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary/30 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Data</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Paciente</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Protocolo</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Valor Bruto</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Taxa</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Valor Líquido</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Avaliação</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-secondary/5 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Calendar className="w-4 h-4 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium text-foreground">{transaction.consultationDate}</p>
                                                <p className="text-xs text-muted-foreground">{transaction.consultationTime}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm font-medium text-foreground">{transaction.patientName}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-muted-foreground">{transaction.protocol}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm font-medium text-foreground">R$ {transaction.grossAmount.toFixed(2)}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm text-red-600">-R$ {transaction.platformFee.toFixed(2)}</p>
                                        <p className="text-xs text-muted-foreground">20%</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <p className="text-sm font-bold text-emerald-600">R$ {transaction.netAmount.toFixed(2)}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                                            {transaction.status}
                                        </span>
                                        {transaction.status === 'Pendente' && (
                                            <p className="text-xs text-muted-foreground mt-1">Libera em {transaction.releaseDate}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {transaction.patientRating ? (
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                                <span className="text-sm font-medium">{transaction.patientRating.score}</span>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Sem avaliação</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => {
                                                setSelectedTransaction(transaction);
                                                setIsModalOpen(true);
                                            }}
                                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                                        >
                                            <Eye className="w-4 h-4 text-muted-foreground" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <TransactionDetailsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transaction={selectedTransaction}
            />
        </div>
    );
};

export default DoctorPayments;
