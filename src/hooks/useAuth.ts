import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Doctor } from '../types';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session?.user) {
          const { data: doctorData } = await supabase
            .from('doctors')
            .select('*')
            .eq('contact_email', session.user.email)
            .single();

          if (doctorData) {
            setDoctor(doctorData);
          } else {
            await fetchUserProfile(session.user.id);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        toast.error('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('*')
          .eq('contact_email', session.user.email)
          .single();

        if (doctorData) {
          setDoctor(doctorData);
          setUser(null);
        } else {
          await fetchUserProfile(session.user.id);
          setDoctor(null);
        }
      } else {
        setUser(null);
        setDoctor(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (profile) {
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load user profile');
      setUser(null);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setDoctor(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return { user, doctor, loading, signOut };
}