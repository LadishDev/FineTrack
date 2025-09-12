export interface Fine {
  id: string;
  type: 'speeding' | 'parking' | 'dartford' | 'mot' | 'insurance' | 'congestion' | 'other';
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  issueDate: string;
  status: 'unpaid' | 'paid' | 'overdue' | 'disputed';
  referenceNumber?: string;
  paymentLink?: string;
  location?: string;
  vehicleReg?: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderDays: number;
}

export interface LinkSection {
  title: string;
  description: string;
  links: Array<{
    title: string;
    description: string;
    url: string;
    type: 'payment' | 'information' | 'comparison' | 'government';
  }>;
}

export interface CategoryData {
  title: string;
  description: string;
  icon: string;
  sections: LinkSection[];
}

export type FineType = Fine['type'];
export type FineStatus = Fine['status'];
