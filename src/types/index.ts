export type User = {
  id: string;
  email: string;
  full_name: string;
  date_of_birth: string;
  contact_number: string;
  is_doctor?: boolean;
  doctor_id?: string;
};

export type Doctor = {
  id: string;
  full_name: string;
  specialization: string;
  years_experience: number;
  contact_email: string;
  contact_phone: string;
  is_active?: boolean;
  last_sign_in_at?: string;
};

export type Record = {
  id: string;
  title: string;
  date: string;
  type: string;
  file_path: string;
  file_size: number;
  file_type: string;
  original_name: string;
  uploaded_by: string;
  user_id: string;
  storage_path?: string;
};

export type RecordShare = {
  id: string;
  record_id: string;
  doctor_id: string;
  created_at: string;
};

export type Modal = 'upload' | 'share' | 'auth' | 'doctorAuth' | null;

export type AuthMode = 'signin' | 'signup' | 'doctor';