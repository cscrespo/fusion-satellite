import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const FeatureContext = createContext({});

export const useFeatures = () => useContext(FeatureContext);

export const FeatureProvider = ({ children }) => {
    const { user, profile } = useAuth();
    const [features, setFeatures] = useState([]);
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (profile?.organization_id) {
            loadFeatures(profile.organization_id);
        } else {
            setFeatures([]);
            setPlan(null);
            setLoading(false);
        }
    }, [profile]);

    const loadFeatures = async (orgId) => {
        try {
            // 1. Get Organization's Plan
            const { data: org, error: orgError } = await supabase
                .from('organizations')
                .select('plan_type, saas_plans(id, name, slug)')
                .eq('id', orgId)
                .single();

            if (orgError) throw orgError;

            // If linked to a SaaS Plan (new system)
            if (org.saas_plans) {
                setPlan(org.saas_plans);

                // 2. Get Features for this Plan
                const { data: planFeatures, error: featError } = await supabase
                    .from('saas_plan_features')
                    .select('enabled, limit_value, saas_features(key, category)')
                    .eq('plan_id', org.saas_plans.id)
                    .eq('enabled', true);

                if (featError) throw featError;

                const loadedFeatures = planFeatures.map(pf => ({
                    key: pf.saas_features.key,
                    category: pf.saas_features.category,
                    limit: pf.limit_value
                }));

                setFeatures(loadedFeatures);
            } else {
                // Fallback for legacy 'plan_type' string (free, basic, premium)
                // Map legacy types to features manually or just give all for now
                console.warn('Using legacy plan type:', org.plan_type);
                setPlan({ name: org.plan_type, slug: org.plan_type });

                // Temporary mapping for legacy
                if (org.plan_type === 'premium' || org.plan_type === 'enterprise') {
                    setFeatures([
                        { key: 'financial', category: 'module' },
                        { key: 'telemedicine', category: 'module' },
                        { key: 'multi_user', category: 'setting' }
                    ]);
                } else {
                    setFeatures([]);
                }
            }

        } catch (error) {
            console.error('Error loading features:', error);
        } finally {
            setLoading(false);
        }
    };

    const hasFeature = (key) => {
        // Super Admin has everything
        if (profile?.role === 'super_admin') return true;

        return features.some(f => f.key === key);
    };

    const getLimit = (key) => {
        const feature = features.find(f => f.key === key);
        return feature?.limit || null;
    };

    return (
        <FeatureContext.Provider value={{ features, plan, hasFeature, getLimit, loading }}>
            {children}
        </FeatureContext.Provider>
    );
};
