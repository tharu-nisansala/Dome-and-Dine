import { Timestamp } from "firebase/firestore";

export interface User {
  id: string;
  uid: string;
  email: string;
  fullName: string;
  userType: 'student' | 'shop_owner' | 'admin';
  telephone?: string;
  address?: string;
  university?: string;
  createdAt: Timestamp;
  shopName?: string;
  provider?: string;
  status: 'active' | 'inactive' | 'suspended';
  profileUrl?: string;
}

export interface UserStats {
  total: number;
  students: number;
  shopOwners: number;
  admins: number;
}