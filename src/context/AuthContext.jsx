import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch user profile from database
    const fetchProfile = async (userId) => {
        try {
            console.log('🔍 Fetching profile for user:', userId);

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError) {
                console.error('❌ Profile fetch error:', profileError);
                throw profileError;
            }

            console.log('✅ Profile fetched:', profileData);

            // Fetch organization separately
            if (profileData.organization_id) {
                const { data: orgData, error: orgError } = await supabase
                    .from('organizations')
                    .select('*')
                    .eq('id', profileData.organization_id)
                    .single();

                if (!orgError && orgData) {
                    profileData.organization = orgData;
                    console.log('✅ Organization fetched:', orgData.name);
                }
            }

            return profileData;
        } catch (error) {
            console.error('❌ Error fetching profile:', error);
            return null;
        }
    };

    // Initialize auth state
    useEffect(() => {
        console.log('🚀 Initializing auth state...');

        // Get initial session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            console.log('📋 Initial session:', session ? 'Found' : 'Not found');

            if (session?.user) {
                console.log('👤 User from session:', session.user.email);
                const profileData = await fetchProfile(session.user.id);

                if (profileData) {
                    setUser(session.user);
                    setProfile(profileData);
                    setIsAuthenticated(true);
                    console.log('✅ Auth state initialized successfully');
                } else {
                    console.error('❌ Profile not found for user');
                    setIsAuthenticated(false);
                }
            } else {
                console.log('ℹ️  No session found');
            }
            setLoading(false);
        });

        // Listen for auth changes - DON'T fetch profile here to avoid loop!
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                console.log('🔄 Auth state changed:', event);

                if (event === 'SIGNED_OUT') {
                    console.log('ℹ️  User signed out');
                    setUser(null);
                    setProfile(null);
                    setIsAuthenticated(false);
                }
                // Don't handle SIGNED_IN here - it's handled in login()
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            console.log('🔐 Attempting login...');
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Fetch profile
            const profileData = await fetchProfile(data.user.id);

            if (profileData) {
                setUser(data.user);
                setProfile(profileData);
                setIsAuthenticated(true);
                console.log('✅ Login successful!');
            } else {
                throw new Error('Profile not found');
            }

            return data.user;
        } catch (error) {
            console.error('❌ Login error:', error);
            throw new Error(error.message || 'Email ou senha inválidos');
        }
    };

    const register = async (userData) => {
        try {
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        full_name: userData.name
                    }
                }
            });

            if (authError) throw authError;

            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: authData.user.id,
                    organization_id: userData.organization_id,
                    full_name: userData.name,
                    role: userData.role || 'doctor',
                    specialty: userData.specialty
                });

            if (profileError) throw profileError;

            return authData.user;
        } catch (error) {
            console.error('Register error:', error);
            throw new Error(error.message || 'Erro ao criar conta');
        }
    };

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            setUser(null);
            setProfile(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const updateUser = async (userData) => {
        try {
            if (!user) return;

            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: userData.name,
                    specialty: userData.specialty,
                    phone: userData.phone,
                    avatar_url: userData.avatar
                })
                .eq('id', user.id);

            if (error) throw error;

            const updatedProfile = await fetchProfile(user.id);
            setProfile(updatedProfile);
        } catch (error) {
            console.error('Update user error:', error);
            throw error;
        }
    };

    // Format user object for compatibility
    const formattedUser = profile ? {
        id: user?.id,
        name: profile.full_name,
        email: user?.email,
        role: profile.role,
        specialty: profile.specialty,
        phone: profile.phone,
        avatar: profile.avatar_url,
        organization: profile.organization
    } : null;

    return (
        <AuthContext.Provider value={{
            user: formattedUser,
            authUser: user,
            profile,
            isAuthenticated,
            loading,
            login,
            register,
            logout,
            updateUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
