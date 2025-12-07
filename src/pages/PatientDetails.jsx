import React, { useState, useEffect, useMemo } from 'react';
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
import ErrorBoundary from '../components/ErrorBoundary';
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
        deletePatientMeasurement,
        // New CRUD
        fetchPatientItems,
        fetchPatientConsultations,
        addConsultation,
        updateConsultation,
        deleteConsultation,
        fetchPatientDietPlan,
        updatePatientDietPlan,
        fetchPatientDailyLogs,
        logDailyMeal,
        fetchAdherenceLogs,
        logAdherence
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

    // Nutrition State
    const [nutritionMode, setNutritionMode] = useState('day');
    const [nutritionDateRange, setNutritionDateRange] = useState({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });

    // Adherence State
    const [adherenceFilterType, setAdherenceFilterType] = useState('all');
    const [adherenceMode, setAdherenceMode] = useState('day'); // 'day' | 'range'
    const [adherenceDate, setAdherenceDate] = useState(new Date().toISOString().split('T')[0]);
    const [adherenceDateRange, setAdherenceDateRange] = useState({
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 7 days default
        end: new Date().toISOString().split('T')[0]
    });




    // Dynamic Data State
    const [fetchedMedications, setFetchedMedications] = useState([]);
    const [fetchedSupplements, setFetchedSupplements] = useState([]);
    const [fetchedTasks, setFetchedTasks] = useState([]);
    const [fetchedConsultations, setFetchedConsultations] = useState([]);
    const [fetchedDietPlan, setFetchedDietPlan] = useState({});
    const [fetchedDailyLogs, setFetchedDailyLogs] = useState([]); // Array of logs
    const [fetchedAdherenceLogs, setFetchedAdherenceLogs] = useState([]);

    // Fetch All Dynamic Data
    useEffect(() => {
        if (!patient?.id) return;

        const loadAll = async () => {
            // Items
            const items = await fetchPatientItems(patient.id);
            setFetchedMedications(items.medications);
            setFetchedSupplements(items.supplements);
            setFetchedTasks(items.tasks);

            // Consultations
            const consults = await fetchPatientConsultations(patient.id);
            setFetchedConsultations(consults);

            // Diet Plan
            const diet = await fetchPatientDietPlan(patient.id);
            setFetchedDietPlan(diet || {});
        };
        loadAll();
    }, [patient?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch Logs when range/date changes
    useEffect(() => {
        if (!patient?.id) return;

        // Nutrition Logs
        const nutriStart = nutritionMode === 'range' ? nutritionDateRange.start : selectedDate;
        const nutriEnd = nutritionMode === 'range' ? nutritionDateRange.end : selectedDate;
        fetchPatientDailyLogs(patient.id, nutriStart, nutriEnd).then(setFetchedDailyLogs);

        // Adherence Logs
        const adhStart = adherenceMode === 'range' ? adherenceDateRange.start : adherenceDate;
        const adhEnd = adherenceMode === 'range' ? adherenceDateRange.end : adherenceDate;
        fetchAdherenceLogs(patient.id, adhStart, adhEnd).then(setFetchedAdherenceLogs);

    }, [patient?.id, selectedDate, nutritionMode, nutritionDateRange, adherenceDate, adherenceMode, adherenceDateRange]);


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

    // Format history data for table
    // Format history data for table
    const historyData = useMemo(() => {
        if (!measurements || !Array.isArray(measurements)) return [];

        return measurements.map(m => {
            // Determine type based on available fields
            let type = 'weight';
            if (m.waist || m.hip || m.chest || m.arm_right || m.thigh_right) {
                type = 'measurement';
            } else if (m.body_fat_percentage || m.muscle_mass || m.visceral_fat || m.lean_mass || m.fatMass || m.leanMass) {
                type = 'composition';
            }

            // Format value summary with ROBUST checks
            const parts = [];

            // Weight
            if (m.weight) parts.push(`${m.weight} kg`);

            // Body Composition
            const fat = m.body_fat_percentage || m.fatMass;
            if (fat) parts.push(`${fat}% GC`);

            const muscle = m.muscle_mass || m.muscleMass;
            if (muscle) parts.push(`${muscle} kg M.M.`);

            const lean = m.lean_mass || m.leanMass;
            if (lean) parts.push(`${lean} kg Massa Magra`);

            const visceral = m.visceral_fat || m.visceralFat;
            if (visceral) parts.push(`G. Visceral: ${visceral}`);

            // Measurements
            const measureFields = {
                waist: 'Cintura',
                hip: 'Quadril',
                chest: 'Peito',
                abdomen: 'Abdômen',
                arm_right: 'Braço Dir.',
                arm_left: 'Braço Esq.',
                thigh_right: 'Coxa Dir.',
                thigh_left: 'Coxa Esq.',
                calf_right: 'Panturrilha Dir.',
                calf_left: 'Panturrilha Esq.',
                neck: 'Pescoço'
            };

            Object.entries(measureFields).forEach(([key, label]) => {
                const val = m[key];
                if (val) parts.push(`${label}: ${val} cm`);
            });

            // Height
            if (m.height) parts.push(`Altura: ${m.height} cm`);

            const dateStr = m.measured_at || m.date;

            return {
                id: m.id,
                date: dateStr ? new Date(dateStr).toISOString() : new Date().toISOString(),
                type: type,
                value: parts.join(' • ') || 'Sem dados detalhados',
                // Props for HistoryEntryModal
                weight: m.weight,
                fatMass: m.body_fat_percentage || m.fatMass,
                leanMass: m.lean_mass || m.leanMass,
                original: m // Keep original for edit actions
            };
        });
    }, [measurements]);

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
        medications: fetchedMedications || [],
        supplements: fetchedSupplements || [],
        dailyLogs: {
            meals: fetchedDailyLogs.flatMap(log => (log.meals || []).map(m => ({ ...m, date: log.date }))),
            checklist: fetchedDailyLogs.find(l => l.date === selectedDate)?.checklist || []
        },
        adherenceLogs: fetchedAdherenceLogs || [],
        consultations: fetchedConsultations || [],
        dietPlan: fetchedDietPlan || {},
        nutritionGoals: patient.nutritionGoals || { calories: 2000, protein: 150, carbs: 200, fat: 60 }

    };

    // Filter Adherence Logs (Merge Scheduled + Actual)
    const filteredAdherenceLogs = useMemo(() => {
        // 1. Identify Target Dates
        let dates = [];
        if (adherenceMode === 'day') {
            dates = [adherenceDate];
        } else {
            // Generate dates between start and end
            const start = new Date(adherenceDateRange.start);
            const end = new Date(adherenceDateRange.end);
            const curr = new Date(start);

            // Safety cap to prevent infinite loop if dates invalid
            let safety = 0;
            while (curr <= end && safety < 365) {
                dates.push(curr.toISOString().split('T')[0]);
                curr.setDate(curr.getDate() + 1);
                safety++;
            }
        }

        const scheduledItems = [];
        const meds = fetchedMedications || [];
        const supps = fetchedSupplements || [];
        const logs = fetchedAdherenceLogs || [];

        dates.forEach(date => {
            // Meds
            meds.forEach(med => {
                const log = logs.find(l => l.date === date && l.item_id === med.id);
                scheduledItems.push({
                    id: log ? log.id : `sched_${med.id}_${date}`, // Unique ID for key
                    itemId: med.id, // Real ID for DB
                    type: 'medication',
                    name: med.name,
                    dosage: med.dosage,
                    scheduledTime: med.time_of_day || '08:00', // Time
                    status: log ? log.status : 'pending',
                    date: date,
                    takenAt: log?.taken_at
                });
            });
            // Supps
            supps.forEach(sup => {
                const log = logs.find(l => l.date === date && l.item_id === sup.id);
                scheduledItems.push({
                    id: log ? log.id : `sched_${sup.id}_${date}`,
                    itemId: sup.id,
                    type: 'supplement',
                    name: sup.name,
                    dosage: sup.dosage,
                    scheduledTime: sup.time_of_day || '08:00',
                    status: log ? log.status : 'pending',
                    date: date,
                    takenAt: log?.taken_at
                });
            });
        });

        return scheduledItems.sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    }, [adherenceMode, adherenceDate, adherenceDateRange, fetchedMedications, fetchedSupplements, fetchedAdherenceLogs]);

    // Filter Meals
    const filteredMeals = useMemo(() => {
        const meals = patientData.dailyLogs.meals || [];
        return meals.filter(meal => {
            if (filterType !== 'all' && meal.type !== filterType) return false;

            const mealDate = meal.date || meal.timestamp?.split('T')[0];
            if (!mealDate) return false;

            if (nutritionMode === 'day') {
                return mealDate === selectedDate;
            } else {
                return mealDate >= nutritionDateRange.start && mealDate <= nutritionDateRange.end;
            }
        });
    }, [patientData.dailyLogs.meals, filterType, nutritionMode, selectedDate, nutritionDateRange]);

    // Calculate Scaled Nutrition Goals
    const scaledNutritionGoals = useMemo(() => {
        if (nutritionMode === 'day') return patientData.nutritionGoals;

        const start = new Date(nutritionDateRange.start);
        const end = new Date(nutritionDateRange.end);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return patientData.nutritionGoals;

        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        if (diffDays <= 0) return patientData.nutritionGoals;

        return {
            calories: patientData.nutritionGoals.calories * diffDays,
            protein: patientData.nutritionGoals.protein * diffDays,
            carbs: patientData.nutritionGoals.carbs * diffDays,
            fat: patientData.nutritionGoals.fat * diffDays
        };
    }, [patientData.nutritionGoals, nutritionMode, nutritionDateRange]);

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

            // Refresh items
            const items = await fetchPatientItems(patient.id);
            setFetchedMedications(items.medications);
            setFetchedSupplements(items.supplements);
            setFetchedTasks(items.tasks);

        } catch (error) {
            console.error('Error saving medication:', error);
        }
    };

    const handleDeleteMedication = async (itemId) => {
        try {
            await removePatientItem(patient.id, modalType, itemId);
            // Refresh items
            const items = await fetchPatientItems(patient.id);
            setFetchedMedications(items.medications);
            setFetchedSupplements(items.supplements);
            setFetchedTasks(items.tasks);
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
        if (!window.confirm('Tem certeza que deseja excluir este histórico?')) {
            return;
        }
        try {
            await deletePatientMeasurement(itemId);
            const updatedMeasurements = await fetchPatientMeasurements(patient.id);
            setMeasurements(updatedMeasurements || []);
        } catch (error) {
            console.error('Error deleting measurement:', error);
            alert('Erro ao excluir medição.');
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
            await logDailyMeal(patient.id, selectedDate, mealData);

            // Refresh logs
            const nutriStart = nutritionMode === 'range' ? nutritionDateRange.start : selectedDate;
            const nutriEnd = nutritionMode === 'range' ? nutritionDateRange.end : selectedDate;
            fetchPatientDailyLogs(patient.id, nutriStart, nutriEnd).then(setFetchedDailyLogs);

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
    // Diet plan handler - updated for day-based structure
    const handleUpdateDietPlan = async (day, dayPlan) => {
        try {
            await updatePatientDietPlan(patient.id, day, dayPlan);
            const updated = await fetchPatientDietPlan(patient.id);
            setFetchedDietPlan(updated);
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
                        >
                            Evolução
                        </TabButton>
                        <TabButton
                            active={activeTab === 'medications'}
                            onClick={() => setActiveTab('medications')}
                            icon={Pill}
                        >
                            Medicamentos
                        </TabButton>
                        <TabButton
                            active={activeTab === 'supplements'}
                            onClick={() => setActiveTab('supplements')}
                            icon={Lightbulb}
                        >
                            Suplementos
                        </TabButton>
                        <TabButton
                            active={activeTab === 'diet'}
                            onClick={() => setActiveTab('diet')}
                            icon={Utensils}
                        >
                            Plano Alimentar
                        </TabButton>
                        <TabButton
                            active={activeTab === 'nutrition'}
                            onClick={() => setActiveTab('nutrition')}
                            icon={ClipboardList}
                        >
                            Registro Nutricional
                        </TabButton>
                        <TabButton
                            active={activeTab === 'adherence'}
                            onClick={() => setActiveTab('adherence')}
                            icon={CheckCircle2}
                        >
                            Aderência
                        </TabButton>
                        <TabButton
                            active={activeTab === 'consultations'}
                            onClick={() => setActiveTab('consultations')}
                            icon={Stethoscope}
                        >
                            Consultas
                        </TabButton>
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
                                    data={historyData}
                                    onEdit={handleEditMeasurement}
                                    onDelete={handleDeleteMeasurement}
                                />
                            </div>
                        </div>
                    )}

                    {activeTab === 'medications' && (
                        <GenericList
                            title="Medicamentos"
                            items={patientData.medications}
                            onItemAdd={handleAddMedication}
                            onItemEdit={handleEditMedication}
                            onItemDelete={handleDeleteMedication}
                            renderItem={(item) => (
                                <div>
                                    <div className="font-semibold text-foreground">{item.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {item.dosage} - {item.frequency}
                                    </div>
                                    {item.notes && (
                                        <div className="text-xs text-muted-foreground mt-1">{item.notes}</div>
                                    )}
                                </div>
                            )}
                            emptyMessage="Nenhum medicamento cadastrado"
                            addItemLabel="Adicionar Medicamento"
                        />
                    )}

                    {activeTab === 'supplements' && (
                        <GenericList
                            title="Suplementos"
                            items={patientData.supplements}
                            onItemAdd={handleAddSupplement}
                            onItemEdit={handleEditSupplement}
                            onItemDelete={handleDeleteMedication}
                            renderItem={(item) => (
                                <div>
                                    <div className="font-semibold text-foreground">{item.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {item.dosage} - {item.frequency}
                                    </div>
                                    {item.notes && (
                                        <div className="text-xs text-muted-foreground mt-1">{item.notes}</div>
                                    )}
                                </div>
                            )}
                            emptyMessage="Nenhum suplemento cadastrado"
                            addItemLabel="Adicionar Suplemento"
                        />
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
                                onFilterTypeChange={setFilterType}
                                showPhotosOnly={showPhotosOnly}
                                onShowPhotosOnlyChange={setShowPhotosOnly}
                                mode={nutritionMode}
                                onModeChange={setNutritionMode}
                                dateRange={nutritionDateRange}
                                onDateRangeChange={setNutritionDateRange}
                            />
                            <NutritionSummary
                                goals={scaledNutritionGoals}
                                meals={filteredMeals}
                                selectedDate={nutritionMode === 'day' ? selectedDate : `Período: ${nutritionDateRange.start} - ${nutritionDateRange.end}`}
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
                                meals={filteredMeals}
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
                                selectedDate={adherenceDate}
                                onDateChange={setAdherenceDate}
                                filterType={adherenceFilterType}
                                onFilterTypeChange={setAdherenceFilterType}
                                mode={adherenceMode}
                                onModeChange={setAdherenceMode}
                                dateRange={adherenceDateRange}
                                onDateRangeChange={setAdherenceDateRange}
                            />
                            <AdherenceSummary logs={filteredAdherenceLogs} />
                            <AdherenceTimeline
                                items={filteredAdherenceLogs}
                                onToggleStatus={async (id) => {
                                    const item = filteredAdherenceLogs.find(i => i.id === id);
                                    if (!item) return;

                                    const newStatus = item.status === 'taken' ? 'pending' : 'taken';
                                    try {
                                        await logAdherence(patient.id, item.date, item.itemId, item.type, newStatus);
                                        // Refresh
                                        const adhStart = adherenceMode === 'range' ? adherenceDateRange.start : adherenceDate;
                                        const adhEnd = adherenceMode === 'range' ? adherenceDateRange.end : adherenceDate;
                                        fetchAdherenceLogs(patient.id, adhStart, adhEnd).then(setFetchedAdherenceLogs);
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}
                            />
                        </div>
                    )}

                    {activeTab === 'consultations' && (
                        <ErrorBoundary>
                            <ConsultationHistory
                                consultations={patientData.consultations}
                                patientId={patient.id}
                                onAddConsultation={async (consultationData) => {
                                    await addConsultation(patient.id, consultationData);
                                    const consults = await fetchPatientConsultations(patient.id);
                                    setFetchedConsultations(consults);
                                }}
                                onUpdateConsultation={async (consultationId, consultationData) => {
                                    await updateConsultation(consultationId, consultationData);
                                    const consults = await fetchPatientConsultations(patient.id);
                                    setFetchedConsultations(consults);
                                }}
                                onDeleteConsultation={async (consultationId) => {
                                    await deleteConsultation(consultationId);
                                    const consults = await fetchPatientConsultations(patient.id);
                                    setFetchedConsultations(consults);
                                }}
                            />
                        </ErrorBoundary>
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
                onSubmit={handleSaveMedication}
                type={modalType}
                initialData={editingItem}
            />

            <HistoryEntryModal
                isOpen={isHistoryModalOpen}
                onClose={() => {
                    setIsHistoryModalOpen(false);
                    setEditingHistoryItem(null);
                }}
                onSubmit={handleSaveMeasurement}
                initialData={editingHistoryItem}
            />

            <AddMealModal
                isOpen={isMealModalOpen}
                onClose={() => {
                    setIsMealModalOpen(false);
                    setEditingMeal(null);
                }}
                onSubmit={handleSaveMeal}
                initialData={editingMeal}
                selectedDate={selectedDate}
            />
        </div>
    );
};

export default PatientDetails;
