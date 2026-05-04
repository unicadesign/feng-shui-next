export interface Inquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  preferred_contact: string;
  preferred_time: string | null;
  service_type: string;
  home_type: string | null;
  main_goals: string[];
  challenges: string | null;
  heard_from: string | null;
  additional_info: string | null;
  status: 'new' | 'read';
  created_at: string;
}

export type InquiryInsert = Omit<Inquiry, 'id' | 'status' | 'created_at'>;
