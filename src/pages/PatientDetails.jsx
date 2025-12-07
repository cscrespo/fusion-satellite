import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Pill, Lightbulb, Scale, Ruler, Plus, Activity, ClipboardList, Utensils, CheckCircle2, Stethoscope, Target } from 'lucide-react';
import { usePatients } from '../context/PatientContext';
import TabButton from '../components/TabButton';
import MedicationModal from '../components/MedicationModal';
import GenericList from '../components/GenericList';
import WeightTrendChart from '../components/charts/WeightTrendChart';
import BodyCompositionChart from '../components/charts/BodyCompositionChart';
import MeasurementsRadar from '../components/charts/MeasurementsRadar';
import StatCard from '../components/charts/StatCard';
import HistoryLogTable from '../components/HistoryLogTable';
import HistoryEntryModal from '../components/HistoryEntryModal';
import NutritionSummary from '../components/nutrition/NutritionSummary';
import NutritionFilters from '../components/nutrition/NutritionFilters';
import MealTimeline from '../components/nutrition/MealTimeline';
import DietChecklist from '../components/nutrition/DietChecklist';
import AddMealModal from '../components/nutrition/AddMealModal';
import AdherenceTimeline from '../components/medical/AdherenceTimeline';
import AdherenceSummary from '../components/medical/AdherenceSummary';
import ConsultationHistory from '../components/medical/ConsultationHistory';
import AdherenceFilters from '../components/medical/AdherenceFilters';
import DietPlanTab from '../components/diet/DietPlanTab';

const PatientDetails = () => {
    const { id } = useParams();
    const {
        patients,
        addPatientItem,
        removePatientItem,
        updatePatientItem,
        updatePatient,
        fetchPatientMeasurements,
        addPatientMeasurement,
        updatePatientMeasurement,
        deletePatientMeasurement
    } = usePatients();

    const patient = patients.find(p => p.id === id);
    const [activeTab, setActiveTab] = useState('evolution');

    // Measurements state
    const [measurements, setMeasurements] = useState([]);
    const [loadingMeasurements, setLoadingMeasurements] = useState(false);

    // Modal States
    const [isMedModalOpen, setIsMedModalOpen] = useState(false);
    const [modalType, setModalType] = useState('medications');
    const [editingItem, setEditingItem] = useState(null);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
    const [editingHistoryItem, setEditingHistoryItem] = useState(null);
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);
    const [editingMeal, setEditingMeal] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [filterType, setFilterType] = useState('all');
    const [showPhotosOnly, setShowPhotosOnly] = useState(false);
    const [adherenceFilterType, setAdherenceFilterType] = useState('all');

    // Fetch measurements when patient changes
    useEffect(() => {
        if (patient?.id && fetchPatientMeasurements) {
            setLoadingMeasurements(true);
            fetchPatientMeasurements(patient.id)
                .then(data => {
                    setMeasurements(data || []);
                })
                .catch(err => {
                    console.error('Error loading measurements:', err);
                    setMeasurements([]);
                })
                .finally(() => {
                    setLoadingMeasurements(false);
                });
        }
    }, [patient?.id, fetchPatientMeasurements]);

    if (!patient) return <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Paciente não encontrado</h2>
            <p className="text-muted-foreground">O paciente que você está procurando não existe ou foi removido.</p>
        </div>
    </div>;

    // ========================================
    // HELPER FUNCTIONS
    // ========================================

    const safeValue = (value, fallback = 0) => {
        if (value === null || value === undefined || value === '' || isNaN(value)) {
            return fallback;
        }
        return value;
    };

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) return 0;
        try {
            const today = new Date();
            const birthDate = new Date(dateOfBirth);
            if (isNaN(birthDate.getTime())) return 0;
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age > 0 ? age : 0;
        } catch (e) {
            return 0;
        }
    };

    const calculateBMI = (weight, height) => {
        const w = safeValue(weight);
        const h = safeValue(height, 175);
        if (w === 0 || h === 0) return 0;
        try {
            const heightInMeters = h / 100;
            const bmi = w / (heightInMeters * heightInMeters);
            return isNaN(bmi) ? 0 : parseFloat(bmi.toFixed(1));
        } catch (e) {
            return 0;
        }
    };

    const calculateProgress = (start, current, goal) => {
        const s = safeValue(start);
        const c = safeValue(current);
        const g = safeValue(goal);
        if (s === 0 || g === 0 || s === g) return 0;
        try {
            const totalToLose = s - g;
            const lostSoFar = s - c;
            const progress = (lostSoFar / totalToLose) * 100;
            return Math.min(100, Math.max(0, isNaN(progress) ? 0 : progress));
        } catch (e) {
            return 0;
        }
    };

    // Map patient data
    const patientData = {
        id: patient.id,
        name: patient.full_name || 'Sem nome',
        age: calculateAge(patient.date_of_birth),
        startWeight: safeValue(patient.start_weight),
        currentWeight: safeValue(patient.current_weight, patient.start_weight),
        goalWeight: safeValue(patient.goal_weight),
        height: safeValue(patient.height, 175),
        status: patient.status === 'active' ? 'Active' : 'Inactive',
        bmi: calculateBMI(patient.current_weight, patient.height),
        progress: calculateProgress(patient.start_weight, patient.current_weight, patient.goal_weight),
        detailedHistory: (measurements && Array.isArray(measurements)) ? measurements.map(m => ({
            date: new Date(m.measured_at).toLocaleDateString('pt-BR'),
            weight: safeValue(m.weight),
            fatMass: safeValue(m.body_fat_percentage),
            leanMass: safeValue(m.lean_mass),
            muscleMass: safeValue(m.muscle_mass)
        })) : [],
        measurements: (measurements && Array.isArray(measurements) && measurements.length > 0) ? [
            { subject: 'Cintura', B: safeValue(measurements[0].waist) },
            { subject: 'Quadril', B: safeValue(measurements[0].hip) },
            { subject: 'Peito', B: safeValue(measurements[0].chest) }
        ] : [],
        weightHistory: (measurements && Array.isArray(measurements)) ? measurements.map(m => ({
            date: new Date(m.measured_at).toLocaleDateString('pt-BR'),
            weight: safeValue(m.weight)
        })) : [],
        medications: patient.medications || [],
        supplements: patient.supplements || [],
        dailyLogs: patient.dailyLogs || { meals: [], checklist: [] },
        adherenceLogs: patient.adherenceLogs || {},
        consultations: patient.consultations || [],
        dietPlan: patient.dietPlan || {},
        nutritionGoals: patient.nutritionGoals || { calories: 2000, protein: 150, carbs: 200, fat: 60 }
    };

    // ========================================
    // EVENT HANDLERS
    // ========================================

    // Medication/Supplement handlers
    const handleAddMedication = () => {
        setModalType('medications');
        setEditingItem(null);
        setIsMedModalOpen(true);
    };

    const handleEditMedication = (item) => {
        setModalType('medications');
        setEditingItem(item);
        setIsMedModalOpen(true);
    };

    const handleAddSupplement = () => {
        setModalType('supplements');
        setEditingItem(null);
        setIsMedModalOpen(true);
    };

    const handleEditSupplement = (item) => {
        setModalType('supplements');
        setEditingItem(item);
        setIsMedModalOpen(true);
    };

    const handleSaveMedication = async (itemData) => {
        try {
            if (editingItem) {
                await updatePatientItem(patient.id, modalType, editingItem.id, itemData);
            } else {
                await addPatientItem(patient.id, modalType, itemData);
            }
            setIsMedModalOpen(false);
            setEditingItem(null);
        } catch (error) {
            console.error('Error saving medication:', error);
        }
    };

    const handleDeleteMedication = async (itemId) => {
        try {
            await removePatientItem(patient.id, modalType, itemId);
        } catch (error) {
            console.error('Error deleting medication:', error);
        }
    };

    // Measurement handlers
    const handleAddMeasurement = () => {
        setEditingHistoryItem(null);
        setIsHistoryModalOpen(true);
    };

    const handleEditMeasurement = (item) => {
        setEditingHistoryItem(item);
        setIsHistoryModalOpen(true);
    };

    const handleSaveMeasurement = async (data) => {
        try {
            if (editingHistoryItem) {
                await updatePatientMeasurement(patient.id, editingHistoryItem.id, data);
            } else {
                await addPatientMeasurement(patient.id, data);
            }
            setIsHistoryModalOpen(false);
            setEditingHistoryItem(null);
            const updatedMeasurements = await fetchPatientMeasurements(patient.id);
            setMeasurements(updatedMeasurements || []);
        } catch (error) {
            console.error('Error saving measurement:', error);
        }
    };

    const handleDeleteMeasurement = async (itemId) => {
        try {
            await deletePatientMeasurement(patient.id, itemId);
            const updatedMeasurements = await fetchPatientMeasurements(patient.id);
            setMeasurements(updatedMeasurements || []);
        } catch (error) {
            console.error('Error deleting measurement:', error);
        }
    };

    // Meal handlers
    const handleAddMeal = () => {
        setEditingMeal(null);
        setIsMealModalOpen(true);
    };

    const handleEditMeal = (meal) => {
        setEditingMeal(meal);
        setIsMealModalOpen(true);
    };

    const handleSaveMeal = async (mealData) => {
        try {
            const updatedLogs = { ...patient.dailyLogs };
            if (!updatedLogs.meals) updatedLogs.meals = [];

            if (editingMeal) {
                const index = updatedLogs.meals.findIndex(m => m.id === editingMeal.id);
                if (index !== -1) {
                    updatedLogs.meals[index] = { ...mealData, id: editingMeal.id };
                }
            } else {
                updatedLogs.meals.push({ ...mealData, id: Date.now().toString() });
            }

            await updatePatient(patient.id, { dailyLogs: updatedLogs });
            setIsMealModalOpen(false);
            setEditingMeal(null);
        } catch (error) {
            console.error('Error saving meal:', error);
        }
    };

    const handleDeleteMeal = async (mealId) => {
        try {
            const updatedLogs = { ...patient.dailyLogs };
            updatedLogs.meals = updatedLogs.meals.filter(m => m.id !== mealId);
            await updatePatient(patient.id, { dailyLogs: updatedLogs });
        } catch (error) {
            console.error('Error deleting meal:', error);
        }
    };

    // Diet plan handler - updated for day-based structure
    const handleUpdateDietPlan = async (day, dayPlan) => {
        try {
            const updatedDietPlan = {
                ...patient.dietPlan,
                [day]: dayPlan
            };
            await updatePatient(patient.id, { dietPlan: updatedDietPlan });
        } catch (error) {
            console.error('Error updating diet plan:', error);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <main className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h2 className="text-3xl font-bold text-foreground">{patientData.name}</h2>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${patientData.status === 'Active'
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                                    }`}>
                                    {patientData.status}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-3">
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-100 text-slate-700 border border-slate-200 shadow-sm">
                                    <span className="text-xs font-medium uppercase tracking-wider opacity-70">Idade</span>
                                    <span className="font-bold text-sm">{patientData.age || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-100 shadow-sm">
                                    <span className="text-xs font-medium uppercase tracking-wider opacity-70">Inicial</span>
                                    <span className="font-bold text-sm">{patientData.startWeight || 0} kg</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-100 shadow-sm ring-1 ring-blue-100/50">
                                    <span className="text-xs font-medium uppercase tracking-wider opacity-70">Atual</span>
                                    <span className="font-bold text-sm">{patientData.currentWeight || 0} kg</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                                    <span className="text-xs font-medium uppercase tracking-wider opacity-70">Meta</span>
                                    <span className="font-bold text-sm">{patientData.goalWeight || 0} kg</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 border-b border-border pb-2">
                        <TabButton
                            active={activeTab === 'evolution'}
                            onClick={() => setActiveTab('evolution')}
                            icon={Activity}
                            label="Evolução"
                        />
                        <TabButton
                            active={activeTab === 'medications'}
                            onClick={() => setActiveTab('medications')}
                            icon={Pill}
                            label="Medicamentos"
                        />
                        <TabButton
                            active={activeTab === 'supplements'}
                            onClick={() => setActiveTab('supplements')}
                            icon={Lightbulb}
                            label="Suplementos"
                        />
                        <TabButton
                            active={activeTab === 'diet'}
                            onClick={() => setActiveTab('diet')}
                            icon={Utensils}
                            label="Plano Alimentar"
                        />
                        <TabButton
                            active={activeTab === 'nutrition'}
                            onClick={() => setActiveTab('nutrition')}
                            icon={ClipboardList}
                            label="Registro Nutricional"
                        />
                        <TabButton
                            active={activeTab === 'adherence'}
                            onClick={() => setActiveTab('adherence')}
                            icon={CheckCircle2}
                            label="Aderência"
                        />
                        <TabButton
                            active={activeTab === 'consultations'}
                            onClick={() => setActiveTab('consultations')}
                            icon={Stethoscope}
                            label="Consultas"
                        />
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'evolution' && (
                        <div className="space-y-6">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard
                                    title="IMC Atual"
                                    value={patientData.bmi}
                                    unit=""
                                    icon={Scale}
                                    color="blue"
                                />
                                <StatCard
                                    title="Progresso"
                                    value={patientData.progress.toFixed(1)}
                                    unit="%"
                                    icon={Target}
                                    color="green"
                                />
                                <StatCard
                                    title="Altura"
                                    value={patientData.height}
                                    unit="cm"
                                    icon={Ruler}
                                    color="purple"
                                />
                                <StatCard
                                    title="Meta Restante"
                                    value={(patientData.currentWeight - patientData.goalWeight).toFixed(1)}
                                    unit="kg"
                                    icon={Target}
                                    color="orange"
                                />
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <WeightTrendChart data={patientData.weightHistory} />
                                <BodyCompositionChart data={patientData.detailedHistory} />
                            </div>

                            {patientData.measurements.length > 0 && (
                                <MeasurementsRadar data={patientData.measurements} />
                            )}

                            {/* History Table */}
                            <div className="bg-card rounded-xl border border-border p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">Histórico de Medições</h3>
                                    <button
                                        onClick={handleAddMeasurement}
                                        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Nova Medição
                                    </button>
                                </div>
                                <HistoryLogTable
                                    data={measurements}
                                    onEdit={handleEditMeasurement}
                                    onDelete={handleDeleteMeasurement}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'medications' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Medicamentos</h3>
                                <button
                                    onClick={handleAddMedication}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Adicionar Medicamento
                                </button>
                            </div>
                            <GenericList
                                items={patientData.medications}
                                type="medications"
                                onEdit={handleEditMedication}
                                onDelete={handleDeleteMedication}
                            />
                        </div>
                    )}

                    {activeTab === 'supplements' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Suplementos</h3>
                                <button
                                    onClick={handleAddSupplement}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Adicionar Suplemento
                                </button>
                            </div>
                            <GenericList
                                items={patientData.supplements}
                                type="supplements"
                                onEdit={handleEditSupplement}
                                onDelete={handleDeleteMedication}
                            />
                        </div>
                    )}

                    {activeTab === 'diet' && (
                        <DietPlanTab
                            dietPlan={patientData.dietPlan}
                            onUpdatePlan={handleUpdateDietPlan}
                        />
                    )}

                    {activeTab === 'nutrition' && (
                        <div className="space-y-6">
                            <NutritionFilters
                                selectedDate={selectedDate}
                                onDateChange={setSelectedDate}
                                filterType={filterType}
                                onFilterChange={setFilterType}
                                showPhotosOnly={showPhotosOnly}
                                onTogglePhotos={setShowPhotosOnly}
                            />
                            <NutritionSummary
                                goals={patientData.nutritionGoals}
                                meals={patientData.dailyLogs.meals || []}
                                selectedDate={selectedDate}
                            />
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-semibold">Refeições Registradas</h3>
                                <button
                                    onClick={handleAddMeal}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Adicionar Refeição
                                </button>
                            </div>
                            <MealTimeline
                                meals={patientData.dailyLogs.meals || []}
                                selectedDate={selectedDate}
                                filterType={filterType}
                                showPhotosOnly={showPhotosOnly}
                                onEdit={handleEditMeal}
                                onDelete={handleDeleteMeal}
                            />
                            <DietChecklist
                                checklist={patientData.dailyLogs.checklist || []}
                                selectedDate={selectedDate}
                            />
                        </div>
                    )}

                    {activeTab === 'adherence' && (
                        <div className="space-y-6">
                            <AdherenceFilters
                                filterType={adherenceFilterType}
                                onFilterChange={setAdherenceFilterType}
                            />
                            <AdherenceSummary logs={patientData.adherenceLogs} />
                            <AdherenceTimeline
                                logs={patientData.adherenceLogs}
                                filterType={adherenceFilterType}
                            />
                        </div>
                    )}

                    {activeTab === 'consultations' && (
                        <ConsultationHistory consultations={patientData.consultations} />
                    )}
                </div>
            </main>

            {/* Modals */}
            <MedicationModal
                isOpen={isMedModalOpen}
                onClose={() => {
                    setIsMedModalOpen(false);
                    setEditingItem(null);
                }}
                onSave={handleSaveMedication}
                type={modalType}
                editingItem={editingItem}
            />

            <HistoryEntryModal
                isOpen={isHistoryModalOpen}
                onClose={() => {
                    setIsHistoryModalOpen(false);
                    setEditingHistoryItem(null);
                }}
                onSave={handleSaveMeasurement}
                editingItem={editingHistoryItem}
            />

            <AddMealModal
                isOpen={isMealModalOpen}
                onClose={() => {
                    setIsMealModalOpen(false);
                    setEditingMeal(null);
                }}
                onSave={handleSaveMeal}
                editingMeal={editingMeal}
                selectedDate={selectedDate}
            />
        </div>
    );
};

export default PatientDetails;
