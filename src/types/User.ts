export interface User {
  id: number;
  name: string;
  avatar: string;
  dateCreated: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Suspended';
}