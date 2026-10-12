export interface OverviewStat {
  key: string;
  label: string;
  value: string;
  icon: string;
  tone: "green" | "purple" | "blue" | "orange" | "yellow" | "red";
}

export interface ChartPoint {
  day: string;
  value: number;
}

export interface RevenueSummary {
  weeklyRevenue: string;
  avgOrderValue: string;
  conversionRate: string;
}

export interface OverviewAlert {
  id: number | string;
  tone: "orange" | "blue" | "red" | "yellow" | "purple";
  icon: string;
  title: string;
  subtitle: string;
  time: string;
}

export interface RecentOrderRow {
  id: string;
  customer: string;
  vendor: string;
  rider: string;
  amount: string;
  status: string;
}

export interface TopVendorRow {
  name: string;
  orders: string;
  amount: string;
  initial?: string;
  logoUrl?: string | null;
}

export interface OverviewApprovalRow {
  id: string | number;
  name: string;
  type: "rider" | "vendor" | string;
  vehicleOrStore: string;
  waiting: string;
  avatarUrl?: string | null;
}

export interface OverviewResponse {
  stats: OverviewStat[];
  revenueChart: ChartPoint[];
  orderChart?: ChartPoint[];
  revenueSummary: RevenueSummary;
  alerts: OverviewAlert[];
  recentOrders?: RecentOrderRow[];
  topVendors: TopVendorRow[];
  approvals?: OverviewApprovalRow[];
}
