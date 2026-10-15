export type ApprovalType = "vendor" | "rider";
export interface ApprovalItem {
  id: string;
  referenceId?: string;
  type: ApprovalType;
  name: string;
  email: string;
  contact: string;
  vehicle: string;
  vehicleNumber: string;
  city: string;
  state: string;
  waiting: string;
  avatarUrl?: string | null;
  storeName?: string;
  panNumber?: string;
  gstin?: string;
  address?: string;
  status?: string;
  rejectedCount?: number;
  documentsSummary?: {
    total?: number;
    approved?: number;
    rejected?: number;
    pending?: number;
  };
  canApprove?: boolean;
  rejectionReason?: string;
  riderDetail?: Record<string, unknown>;
  personal?: {
    name: string;
    email: string;
    phone: string;
    ageGender: string;
    cityState: string;
    avatarUrl?: string | null;
  };
  vehicleDetails?: {
    name: string;
    color: string;
    purchasedOn: string;
    number: string;
    modelYear: string;
    imageUrl?: string | null;
  };
  documents?: ApprovalDocument[];
}
export interface ApprovalDocument {
  id: string;
  label: string;
  imageUrl?: string | null;
  imageUrls?: string[];
}
export interface ApprovalListResponse {
  items?: ApprovalItem[];
  vendors?: ApprovalItem[];
  riders?: ApprovalItem[];
  data?: ApprovalItem[];
  total?: number;
}
