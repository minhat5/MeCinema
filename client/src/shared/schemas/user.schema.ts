import type { Role } from '../constants/roles';
export interface User {
  id?: string | number;
  _id?: string;
  email: string;
  fullName: string;
  phone?: string;
  role: Role | string;
  isActive?: boolean;
  avatar?: string;
}
