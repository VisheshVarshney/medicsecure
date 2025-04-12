import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigation } from './components/Navigation';
import { Sidebar } from './components/Sidebar';
import { RecordList } from './components/RecordList';
import { UploadModal } from './components/modals/UploadModal';
import { ShareModal } from './components/modals/ShareModal';
import { AuthModal } from './components/auth/AuthModal';
import { DoctorAuthModal } from './components/auth/DoctorAuthModal';
import { DoctorDashboard } from './components/DoctorDashboard';
import { LandingPage } from './components/landing/LandingPage';
import { Modal, AuthMode } from './types';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, doctor, loading, signOut } = useAuth();
  const [activeModal, setActiveModal] = useState<Modal>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const handleAuthModalOpen = (mode: AuthMode) => {
    setAuthMode(mode);
    setActiveModal(mode === 'doctor' ? 'doctorAuth' : 'auth');
  };

  const handleShare = async (email: string, permission: string, expiry: string) => {
    try {
      if (!selectedRecord) return;

      const { error } = await supabase
        .from('shared_records')
        .insert([{
          record_id: selectedRecord,
          shared_with: email,
          permission_level: permission,
          expires_at: expiry,
          user_id: user?.id
        }]);

      if (error) throw error;

      setActiveModal(null);
      setSelectedRecord(null);
      toast.success('Record shared successfully');
      fetchRecords();
    } catch (error) {
      console.error('Error sharing record:', error);
      toast.error('Failed to share record');
    }
  };

  const handleDelete = async (recordId: string) => {
    try {
      // Delete record shares first
      await supabase
        .from('record_shares')
        .delete()
        .eq('record_id', recordId);

      // Delete the record
      const { error } = await supabase
        .from('records')
        .delete()
        .eq('id', recordId);

      if (error) throw error;

      toast.success('Record deleted successfully');
      fetchRecords();
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (doctor) {
    return (
      <DoctorDashboard
        doctor={doctor}
        onSignOut={signOut}
      />
    );
  }

  if (!user) {
    return (
      <>
        <Toaster position="top-right" />
        <LandingPage onAuthModalOpen={handleAuthModalOpen} />
        
        {activeModal === 'auth' && (
          <AuthModal
            mode={authMode}
            onClose={() => setActiveModal(null)}
            onModeSwitch={setAuthMode}
          />
        )}

        {activeModal === 'doctorAuth' && (
          <DoctorAuthModal
            onClose={() => setActiveModal(null)}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Navigation
        user={user}
        onSignOut={signOut}
      />

      <main className="max-w-7xl mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Sidebar
            onUpload={() => setActiveModal('upload')}
          />
          <RecordList
            records={[]}
            onShare={(recordId) => {
              setSelectedRecord(recordId);
              setActiveModal('share');
            }}
            onDelete={handleDelete}
          />
        </div>
      </main>

      {activeModal === 'upload' && (
        <UploadModal
          onClose={() => setActiveModal(null)}
          doctors={[]}
          onUploadComplete={() => {}}
        />
      )}

      {activeModal === 'share' && (
        <ShareModal
          onClose={() => {
            setActiveModal(null);
            setSelectedRecord(null);
          }}
          onShare={handleShare}
        />
      )}
    </div>
  );
}

export default App;