export interface WebinarRegistration {
  id: string;
  full_name: string;
  birth_date: string | null;
  city: string | null;
  email: string;
  phone: string | null;
  note: string | null;
  status: 'new' | 'read';
  created_at: string;
}

export type WebinarRegistrationInsert = Omit<
  WebinarRegistration,
  'id' | 'status' | 'created_at'
>;
