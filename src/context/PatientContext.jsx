import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const PatientContext = createContext();

export const usePatients = () => {
    const context = useContext(PatientContext);
    if (!context) {
        throw new Error('usePatients must be used within a PatientProvider');
    }
    return context;
};

export const PatientProvider = ({ children }) => {
    const { profile } = useAuth();
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all patients for the organization
    const fetchPatients = async () => {
        if (!profile?.organization_id) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('patients')
                .select(`
                    *,
                    assigned_doctor:profiles(full_name, specialty),
                    tasks:patient_tasks(count),
                    medications:patient_medications(count),
                    supplements:patient_supplements(count)
                `)
                .eq('organization_id', profile.organization_id)
                .is('deleted_at', null)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setPatients(data || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching patients:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        if (profile?.organization_id) {
            fetchPatients();
        } else {
            setLoading(false);
        }
    }, [profile?.organization_id]); // eslint-disable-line react-hooks/exhaustive-deps

    // Add new patient
    const addPatient = async (patientData) => {
        if (!profile?.organization_id) {
            throw new Error('Organization not found');
        }

        try {
            const { data, error } = await supabase
                .from('patients')
                .insert({
                    organization_id: profile.organization_id,
                    full_name: patientData.name,
                    email: patientData.email,
                    phone: patientData.phone,
                    date_of_birth: patientData.birthDate,
                    gender: patientData.gender?.toLowerCase(),
                    start_weight: patientData.startWeight,
                    current_weight: patientData.startWeight,
                    goal_weight: patientData.goalWeight,
                    height: patientData.height,
                    status: 'active',
                    assigned_doctor_id: profile.id
                })
                .select()
                .single();

            if (error) throw error;

            // Add initial weight measurement
            if (patientData.startWeight) {
                await supabase
                    .from('patient_measurements')
                    .insert({
                        organization_id: profile.organization_id,
                        patient_id: data.id,
                        weight: patientData.startWeight,
                        measured_by: profile.id
                    });
            }

            // Refresh patients list
            await fetchPatients();
            return data;
        } catch (err) {
            console.error('Error adding patient:', err);
            throw new Error(err.message || 'Erro ao adicionar paciente');
        }
    };

    // Update patient
    const updatePatient = async (id, updatedData) => {
        try {
            const updatePayload = {};

            if (updatedData.name) updatePayload.full_name = updatedData.name;
            if (updatedData.email) updatePayload.email = updatedData.email;
            if (updatedData.phone) updatePayload.phone = updatedData.phone;
            if (updatedData.birthDate) updatePayload.date_of_birth = updatedData.birthDate;
            if (updatedData.gender) updatePayload.gender = updatedData.gender.toLowerCase();
            if (updatedData.currentWeight) updatePayload.current_weight = updatedData.currentWeight;
            if (updatedData.goalWeight) updatePayload.goal_weight = updatedData.goalWeight;
            if (updatedData.height) updatePayload.height = updatedData.height;
            if (updatedData.status) updatePayload.status = updatedData.status.toLowerCase();

            const { data, error } = await supabase
                .from('patients')
                .update(updatePayload)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            // If weight changed, add measurement
            if (updatedData.currentWeight) {
                await supabase
                    .from('patient_measurements')
                    .insert({
                        organization_id: profile.organization_id,
                        patient_id: id,
                        weight: updatedData.currentWeight,
                        measured_by: profile.id
                    });
            }

            // Refresh patients list
            await fetchPatients();
            return data;
        } catch (err) {
            console.error('Error updating patient:', err);
            throw new Error(err.message || 'Erro ao atualizar paciente');
        }
    };

    // Delete patient (soft delete)
    const deletePatient = async (id) => {
        try {
            const { error } = await supabase
                .from('patients')
                .update({ deleted_at: new Date().toISOString() })
                .eq('id', id);

            if (error) throw error;

            // Refresh patients list
            await fetchPatients();
        } catch (err) {
            console.error('Error deleting patient:', err);
            throw new Error(err.message || 'Erro ao deletar paciente');
        }
    };

    // ========================================
    // MEASUREMENTS CRUD - Phase 2: Evolution
    // ========================================

    // Fetch patient measurements
    const fetchPatientMeasurements = async (patientId) => {
        if (!profile?.organization_id) {
            return [];
        }

        try {
            const { data, error } = await supabase
                .from('patient_measurements')
                .select('*')
                .eq('patient_id', patientId)
                .eq('organization_id', profile.organization_id)
                .order('measured_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (err) {
            console.error('Error fetching measurements:', err);
            return [];
        }
    };

    // Add patient measurement
    const addPatientMeasurement = async (patientId, measurementData) => {
        if (!profile?.organization_id) {
            throw new Error('Organization not found');
        }

        try {
            const { data, error } = await supabase
                .from('patient_measurements')
                .insert({
                    organization_id: profile.organization_id,
                    patient_id: patientId,
                    weight: measurementData.weight,
                    body_fat_percentage: measurementData.fatMass,
                    lean_mass: measurementData.leanMass,
                    muscle_mass: measurementData.muscleMass,
                    waist: measurementData.waist,
                    hip: measurementData.hip,
                    chest: measurementData.chest,
                    measured_at: measurementData.date || new Date().toISOString(),
                    measured_by: profile.id,
                    notes: measurementData.notes
                })
                .select()
                .single();

            if (error) throw error;

            // Update patient's current_weight if this is the latest measurement
            if (measurementData.weight) {
                await supabase
                    .from('patients')
                    .update({ current_weight: measurementData.weight })
                    .eq('id', patientId);
            }

            return data;
        } catch (err) {
            console.error('Error adding measurement:', err);
            throw new Error(err.message || 'Erro ao adicionar medição');
        }
    };

    // Update patient measurement
    const updatePatientMeasurement = async (measurementId, measurementData) => {
        try {
            const updatePayload = {};

            if (measurementData.weight !== undefined) updatePayload.weight = measurementData.weight;
            if (measurementData.fatMass !== undefined) updatePayload.body_fat_percentage = measurementData.fatMass;
            if (measurementData.leanMass !== undefined) updatePayload.lean_mass = measurementData.leanMass;
            if (measurementData.muscleMass !== undefined) updatePayload.muscle_mass = measurementData.muscleMass;
            if (measurementData.waist !== undefined) updatePayload.waist = measurementData.waist;
            if (measurementData.hip !== undefined) updatePayload.hip = measurementData.hip;
            if (measurementData.chest !== undefined) updatePayload.chest = measurementData.chest;
            if (measurementData.date) updatePayload.measured_at = measurementData.date;
            if (measurementData.notes !== undefined) updatePayload.notes = measurementData.notes;

            const { data, error } = await supabase
                .from('patient_measurements')
                .update(updatePayload)
                .eq('id', measurementId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (err) {
            console.error('Error updating measurement:', err);
            throw new Error(err.message || 'Erro ao atualizar medição');
        }
    };

    // Delete patient measurement
    const deletePatientMeasurement = async (measurementId) => {
        try {
            const { error } = await supabase
                .from('patient_measurements')
                .delete()
                .eq('id', measurementId);

            if (error) throw error;
        } catch (err) {
            console.error('Error deleting measurement:', err);
            throw new Error(err.message || 'Erro ao deletar medição');
        }
    };

    // Add patient item (task, medication, supplement)
    const addPatientItem = async (patientId, category, item) => {
        if (!profile?.organization_id) {
            throw new Error('Organization not found');
        }

        try {
            let tableName, itemData;

            switch (category) {
                case 'tasks':
                    tableName = 'patient_tasks';
                    itemData = {
                        organization_id: profile.organization_id,
                        patient_id: patientId,
                        title: item.title,
                        description: item.description,
                        status: item.status || 'pending',
                        priority: item.priority || 'medium',
                        due_date: item.dueDate,
                        assigned_by: profile.id
                    };
                    break;

                case 'medications':
                    tableName = 'patient_medications';
                    itemData = {
                        organization_id: profile.organization_id,
                        patient_id: patientId,
                        name: item.name,
                        dosage: item.dosage,
                        frequency: item.frequency,
                        time_of_day: item.time,
                        instructions: item.instructions,
                        status: 'active',
                        prescribed_by: profile.id
                    };
                    break;

                case 'supplements':
                    tableName = 'patient_supplements';
                    itemData = {
                        organization_id: profile.organization_id,
                        patient_id: patientId,
                        name: item.name,
                        dosage: item.dosage,
                        frequency: item.frequency,
                        time_of_day: item.time,
                        instructions: item.instructions,
                        status: 'active',
                        recommended_by: profile.id
                    };
                    break;

                default:
                    throw new Error('Invalid category');
            }

            const { data, error } = await supabase
                .from(tableName)
                .insert(itemData)
                .select()
                .single();

            if (error) throw error;

            // Refresh patients to update counts
            await fetchPatients();
            return data;
        } catch (err) {
            console.error(`Error adding ${category}:`, err);
            throw new Error(err.message || `Erro ao adicionar ${category}`);
        }
    };

    // Remove patient item
    const removePatientItem = async (patientId, category, itemId) => {
        try {
            let tableName;

            switch (category) {
                case 'tasks':
                    tableName = 'patient_tasks';
                    break;
                case 'medications':
                    tableName = 'patient_medications';
                    break;
                case 'supplements':
                    tableName = 'patient_supplements';
                    break;
                default:
                    throw new Error('Invalid category');
            }

            const { error } = await supabase
                .from(tableName)
                .delete()
                .eq('id', itemId);

            if (error) throw error;

            // Refresh patients
            await fetchPatients();
        } catch (err) {
            console.error(`Error removing ${category}:`, err);
            throw new Error(err.message || `Erro ao remover ${category}`);
        }
    };

    // Update patient item
    const updatePatientItem = async (patientId, category, itemId, updatedItem) => {
        try {
            let tableName, updateData;

            switch (category) {
                case 'tasks':
                    tableName = 'patient_tasks';
                    updateData = {
                        title: updatedItem.title,
                        description: updatedItem.description,
                        status: updatedItem.status,
                        priority: updatedItem.priority,
                        due_date: updatedItem.dueDate
                    };
                    break;

                case 'medications':
                    tableName = 'patient_medications';
                    updateData = {
                        name: updatedItem.name,
                        dosage: updatedItem.dosage,
                        frequency: updatedItem.frequency,
                        time_of_day: updatedItem.time,
                        instructions: updatedItem.instructions,
                        status: updatedItem.status
                    };
                    break;

                case 'supplements':
                    tableName = 'patient_supplements';
                    updateData = {
                        name: updatedItem.name,
                        dosage: updatedItem.dosage,
                        frequency: updatedItem.frequency,
                        time_of_day: updatedItem.time,
                        instructions: updatedItem.instructions,
                        status: updatedItem.status
                    };
                    break;

                default:
                    throw new Error('Invalid category');
            }

            const { error } = await supabase
                .from(tableName)
                .update(updateData)
                .eq('id', itemId);

            if (error) throw error;

            // Refresh patients
            await fetchPatients();
        } catch (err) {
            console.error(`Error updating ${category}:`, err);
            throw new Error(err.message || `Erro ao atualizar ${category}`);
        }
    };

    // Update patient diet (placeholder for future diet plan implementation)
    const updatePatientDiet = async (patientId, dietPlan) => {
        // This will be implemented when we migrate diet plans
        console.log('Diet plan update:', patientId, dietPlan);
    };

    return (
        <PatientContext.Provider value={{
            patients,
            loading,
            error,
            addPatient,
            updatePatient,
            deletePatient,
            addPatientItem,
            removePatientItem,
            updatePatientItem,
            updatePatientDiet,
            refreshPatients: fetchPatients,
            // Measurements CRUD
            fetchPatientMeasurements,
            addPatientMeasurement,
            updatePatientMeasurement,
            deletePatientMeasurement
        }}>
            {children}
        </PatientContext.Provider>
    );
};
