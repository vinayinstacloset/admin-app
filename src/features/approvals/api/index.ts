import { clientBase } from "../../../shared/api/client/apiClient";
import type { ApprovalItem, ApprovalType } from "../types/approvals.types";

export interface ApprovalCounts {
  ALL?: number;
  PENDING?: number;
  REJECTED?: number;
}
export interface ApprovalPage {
  items: ApprovalItem[];
  counts: ApprovalCounts;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
type Raw = Record<string, unknown>;
const object = (v: unknown): Raw =>
  v && typeof v === "object" ? (v as Raw) : {};
const text = (v: unknown) => (v == null || v === "" ? "" : String(v));
const statusLabel = (v: unknown) => text(v).toUpperCase();
function mapListItem(raw: Raw, type: ApprovalType): ApprovalItem {
  const rider = type === "rider";
  const name = rider ? text(raw.name) : text(raw.ownerName);
  const city = text(raw.city);
  const state = text(raw.state);
  const docs = object(raw.documents);
  return {
    id: text(raw.referenceId),
    referenceId: text(raw.referenceId),
    type,
    name,
    email: text(raw.email),
    contact: text(raw.mobile),
    vehicle: rider
      ? [raw.vehicleBrand, raw.vehicleModel].filter(Boolean).join(" ") ||
        text(raw.vehicleType)
      : "",
    vehicleNumber: text(raw.vehicleNumber),
    city,
    state,
    waiting: text(raw.submittedAt),
    status: statusLabel(raw.status),
    rejectedCount: Number(docs.rejected ?? 0),
    documentsSummary: {
      total: Number(docs.total ?? 0),
      approved: Number(docs.approved ?? 0),
      rejected: Number(docs.rejected ?? 0),
      pending: Number(docs.pending ?? 0),
    },
    storeName: text(raw.companyName),
    panNumber: text(raw.panNumber),
    gstin: text(raw.gstin),
    address: [raw.addressLine1, raw.addressLine2, raw.landmark, city, state]
      .filter(Boolean)
      .join(", "),
    avatarUrl: null,
    personal: {
      name,
      email: text(raw.email),
      phone: text(raw.mobile),
      ageGender: "",
      cityState: [city, state].filter(Boolean).join(" / "),
      avatarUrl: null,
    },
    vehicleDetails: {
      name: rider
        ? [raw.vehicleBrand, raw.vehicleModel].filter(Boolean).join(" ") ||
          text(raw.vehicleType)
        : "",
      color: "",
      purchasedOn: "",
      number: text(raw.vehicleNumber),
      modelYear: "",
      imageUrl: null,
    },
    documents:
      !rider && (raw.aadhaarFrontUrl || raw.aadhaarBackUrl)
        ? [
            {
              id: "aadhaar",
              label: "Aadhaar card",
              imageUrls: [
                text(raw.aadhaarFrontUrl),
                text(raw.aadhaarBackUrl),
              ].filter(Boolean),
            },
          ]
        : [],
  };
}
function mapSection(key: string, value: Raw | undefined) {
  if (!value) return [];
  const files = Array.isArray(value.files) ? value.files.map(object) : [];
  return files.map((f: Raw, i: number) => ({
    id: `${key}-${i}`,
    label: `${key} ${text(f.type)}`.trim(),
    imageUrl: text(f.url) || null,
  }));
}
export const approvalsApi = {
  list: async (
    type: ApprovalType,
    params: { search?: string; page?: number; size?: number; status?: string },
  ) => {
    const path =
      type === "vendor"
        ? "/admin/vendors/approvals"
        : "/admin/riders/approvals";
    const { data } = await clientBase.get<Raw>(path, {
      params: {
        status: params.status ?? "",
        search: params.search ?? "",
        page: params.page ?? 0,
        size: params.size ?? 10,
        sortDir: "desc",
      },
    });
    return {
      ...data,
      items: (Array.isArray(data?.items) ? data.items : []).map((x: unknown) =>
        mapListItem(object(x), type),
      ),
      counts: data?.counts ?? {},
      page: Number(data?.page ?? params.page ?? 0),
      size: Number(data?.size ?? params.size ?? 10),
      totalElements: Number(data?.totalElements ?? 0),
      totalPages: Number(data?.totalPages ?? 0),
    } as ApprovalPage;
  },
  detail: async (id: string) => {
    const { data } = await clientBase.get<Raw>(
      `/admin/riders/${encodeURIComponent(id)}`,
    );
    const p = object(data.personal);
    const v = object(data.vehicle);
    const docs = [
      ...mapSection("Aadhaar", data.aadhaar),
      ...mapSection("PAN", data.pan),
      ...mapSection("Driving license", data.drivingLicense),
      ...mapSection("RC", v.rc),
      ...mapSection("Insurance", v.insurance),
    ];
    const name = [p.firstName, p.lastName].filter(Boolean).map(text).join(" ");
    const item: ApprovalItem = {
      id: text(data.referenceId ?? id),
      referenceId: text(data.referenceId ?? id),
      type: "rider",
      name,
      email: "",
      contact: text(p.mobile),
      vehicle: [v.brand, v.model].filter(Boolean).join(" ") || text(v.type),
      vehicleNumber: text(v.number),
      city: text(p.city),
      state: "",
      waiting: text(data.submittedAt),
      status: statusLabel(data.overallStatus),
      canApprove: Boolean(data.canApprove),
      rejectionReason: text(data.rejectionReason),
      personal: {
        name,
        email: "",
        phone: text(p.mobile),
        ageGender: text(p.dateOfBirth),
        cityState: text(p.city),
        avatarUrl: text(p.photoUrl) || null,
      },
      vehicleDetails: {
        name: [v.brand, v.model].filter(Boolean).join(" ") || text(v.type),
        color: text(v.color),
        purchasedOn: "",
        number: text(v.number),
        modelYear: "",
        imageUrl: text(v.photoUrl) || null,
      },
      documents: docs,
      riderDetail: data,
    };
    return item;
  },
  exportRiders: async (params: { search?: string; status?: string }) => {
    const response = await clientBase.get("/admin/riders/approvals/export", {
      params: { search: params.search ?? "", status: params.status ?? "" },
      responseType: "blob",
    });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rider-approvals.xlsx";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
  approveVendor: async (id: string) =>
    (await clientBase.post(`/admin/vendors/${encodeURIComponent(id)}/approve`))
      .data,
  rejectVendor: async (id: string, reason: string) =>
    (
      await clientBase.post(`/admin/vendors/${encodeURIComponent(id)}/reject`, {
        reason,
      })
    ).data,
};
