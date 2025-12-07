import React, { useState } from 'react';
import { Search, Plus, Trash2, Edit, Eye, Filter, TrendingDown, Calendar } from 'lucide-react';
import { usePatients } from '../context/PatientContext';
import { Link } from 'react-router-dom';
import PatientModal from '../components/PatientModal';

const Patients = () => {
    const { patients, addPatient, updatePatient, deletePatient } = usePatients();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'Active', 'Inactive'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = (patient.full_name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || patient.status?.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const handleAddClick = () => {
        setEditingPatient(null);
        setIsModalOpen(true);
    };

    // Helper function to calculate age from date_of_birth
    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return '';
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const handleEditClick = (patient) => {
        // Map Supabase fields to modal format
        const mappedPatient = {
            id: patient.id,
            name: patient.full_name,
            age: calculateAge(patient.date_of_birth),
            phone: patient.phone || '',
            address: patient.address || '',
            avatar: patient.avatar_url || '',
            startWeight: patient.start_weight || '',
            currentWeight: patient.current_weight || patient.start_weight || '',
            goalWeight: patient.goal_weight || '',
            status: patient.status?.toLowerCase() === 'active' ? 'Active' : 'Inactive'
        };
        setEditingPatient(mappedPatient);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
            deletePatient(id);
        }
    };

    const handleModalSubmit = (data) => {
        // Calculate date_of_birth from age
        const dateOfBirth = data.age ?
            new Date(new Date().getFullYear() - parseInt(data.age), 0, 1).toISOString().split('T')[0]
            : null;

        // Map modal format to Supabase format
        const supabaseData = {
            full_name: data.name,
            date_of_birth: dateOfBirth,
            phone: data.phone,
            address: data.address,
            avatar_url: data.avatar,
            start_weight: data.startWeight,
            current_weight: data.currentWeight,
            goal_weight: data.goalWeight,
            status: data.status?.toLowerCase() || 'active'
        };

        if (editingPatient) {
            updatePatient(editingPatient.id, supabaseData);
        } else {
            addPatient(supabaseData);
        }
    };

    // Helper to calculate progress
    const calculateProgress = (start, current, goal) => {
        if (!start || !current || !goal) return 0;
        const totalToLose = parseFloat(start) - parseFloat(goal);
        const lostSoFar = parseFloat(start) - parseFloat(current);
        if (totalToLose === 0) return 100;
        const percentage = (lostSoFar / totalToLose) * 100;
        return Math.min(Math.max(percentage, 0), 100); // Clamp between 0 and 100
    };

    // Helper to calculate BMI (assuming height is available or mocking it for demo)
    const calculateBMI = (weight) => {
        // Mock height 1.75m if not available, just for demo richness
        const height = 1.75;
        return (weight / (height * height)).toFixed(1);
    };

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-foreground">Pacientes</h2>
                    <p className="text-muted-foreground mt-1">Gerencie os registros e acompanhe a evolução.</p>
                </div>
                <button
                    onClick={handleAddClick}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Adicionar Paciente
                </button>
            </div>

            <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-border flex flex-col md:flex-row items-center gap-4 bg-secondary/10">
                    <div className="relative flex-1 w-full md:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por nome..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <select
                            className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Todos os Status</option>
                            <option value="Active">Ativos</option>
                            <option value="Inactive">Inativos</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary/30">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Paciente</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Progresso</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">Peso Atual</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Última Consulta</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-muted-foreground uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="w-8 h-8 opacity-20" />
                                            <p>Nenhum paciente encontrado.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map((patient) => {
                                    const progress = calculateProgress(patient.start_weight, patient.current_weight, patient.goal_weight);
                                    const bmi = calculateBMI(patient.current_weight || patient.start_weight || 70);

                                    return (
                                        <tr key={patient.id} className="group hover:bg-secondary/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold shadow-sm ring-2 ring-background overflow-hidden">
                                                        {patient.avatar_url ? (
                                                            <img src={patient.avatar_url} alt={patient.full_name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            (patient.full_name || 'P').charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground">{patient.full_name}</p>
                                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                            ID: #{patient.id.toString().slice(-8)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${patient.status?.toLowerCase() === 'active'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    : 'bg-slate-50 text-slate-600 border-slate-100'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${patient.status?.toLowerCase() === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                                    {patient.status?.toLowerCase() === 'active' ? 'Ativo' : 'Inativo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 w-48">
                                                <div className="flex flex-col gap-1.5">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-muted-foreground">Meta: {patient.goal_weight || '-'}kg</span>
                                                        <span className="font-medium text-primary">{Math.round(progress)}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-foreground">{patient.current_weight || patient.start_weight || '-'} kg</span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <TrendingDown className="w-3 h-3 text-emerald-500" />
                                                        IMC: {bmi}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="w-4 h-4 opacity-50" />
                                                    <span>12 Out, 2023</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link
                                                        to={`/patients/${patient.id}`}
                                                        className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors group/btn"
                                                        title="Ver Detalhes"
                                                    >
                                                        <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleEditClick(patient)}
                                                        className="p-2 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-colors group/btn"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(patient.id)}
                                                        className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors group/btn"
                                                        title="Excluir"
                                                    >
                                                        <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PatientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={editingPatient}
            />
        </div>
    );
};

export default Patients;
