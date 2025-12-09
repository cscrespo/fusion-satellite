import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const DoctorContext = createContext();

export const DoctorProvider = ({ children }) => {
    const { profile } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch doctors
    const fetchDoctors = async () => {
        if (!profile?.organization_id) return;

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('doctors')
                .select('*')
                .eq('organization_id', profile.organization_id)
                .order('name');

            if (error) throw error;
            setDoctors(data || []);
        } catch (err) {
            console.error('Error fetching doctors:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Initial fetch when profile is available
    useEffect(() => {
        if (profile?.organization_id) {
            fetchDoctors();
        } else {
            setLoading(false);
        }
    }, [profile?.organization_id]);

    // Add Doctor
    const addDoctor = async (doctorData) => {
        try {
            if (!profile?.organization_id) throw new Error('No organization ID found');

            const { data, error } = await supabase
                .from('doctors')
                .insert([{
                    ...doctorData,
                    organization_id: profile.organization_id
                }])
                .select()
                .single();

            if (error) throw error;
            setDoctors(prev => [...prev, data]);
            return data;
        } catch (err) {
            console.error('Error adding doctor:', err);
            throw err;
        }
    };

    // Update Doctor
    const updateDoctor = async (id, updates) => {
        try {
            const { data, error } = await supabase
                .from('doctors')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            setDoctors(prev => prev.map(d => d.id === id ? data : d));
            return data;
        } catch (err) {
            console.error('Error updating doctor:', err);
            throw err;
        }
    };

    // Delete Doctor
    const deleteDoctor = async (id) => {
        try {
            const { error } = await supabase
                .from('doctors')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setDoctors(prev => prev.filter(d => d.id !== id));
        } catch (err) {
            console.error('Error deleting doctor:', err);
            throw err;
        }
    };

    const getDoctorById = (id) => {
        return doctors.find(d => d.id === id);
    };

    return (
        <DoctorContext.Provider value={{
            doctors,
            loading,
            error,
            fetchDoctors,
            addDoctor,
            updateDoctor,
            deleteDoctor,
            getDoctorById
        }}>
            {children}
        </DoctorContext.Provider>
    );
};

export const useDoctors = () => {
    const context = useContext(DoctorContext);
    if (!context) {
        throw new Error('useDoctors must be used within DoctorProvider');
    }
    return context;
};
