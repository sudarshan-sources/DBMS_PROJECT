export interface Soldier {
  Soldier_ID: string;
  FName: string;
  LName: string;
  Rank_Name: string;
  Department: string;
  Age: number;
  Phone_Number: string;
  Posting_Location: string;
}

export interface Weapon {
  Weapon_ID: string;
  Name: string;
  Type: string;
  Quantity: number;
  Status: string;
}

export interface Vehicle {
  Vehicle_ID: string;
  Name: string;
  Type: string;
  Fuel_Status: string;
  Unit_Name: string;
}

export interface Mission {
  Mission_ID: string;
  Name: string;
  Location: string;
  Mission_Date: string;
  Status: string;
}

export interface Training {
  Training_ID: string;
  Soldier_ID: string;
  Type: string;
  Training_Name: string;
  Training_Status: string;
  Soldier_Name?: string; // Joined field
}

export interface DashboardStats {
  soldiersCount: number;
  weaponsCount: number;
  weaponsTotalQuantity: number;
  vehiclesCount: number;
  missionsCount: number;
  trainingsCount: number;
}

export type ToastType = 'success' | 'error';

export interface ToastMessage {
  id: string;
  text: string;
  type: ToastType;
}
