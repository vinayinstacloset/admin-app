import type {
  ExchangeDetail,
  ExchangeRow,
  ExchangeStatus,
  ExchangeStoreRow,
} from "../types/exchange.types";

const productRed = "/reference/riders/product-red.jpg";
const avatar = "/reference/riders/avatar.jpg";
const riderAvatar = "/reference/riders/avatar-list.jpg";
const nike = "/reference/brands/nike.jpg";

export const INDIAN_STATES = [
  "All State",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Maharashtra",
];

export const exchangeStores: ExchangeStoreRow[] = [
  {
    id: "nike",
    name: "NIKE",
    state: "Maharashtra",
    totalExchange: 32,
    exchangeRate: "6.7%",
    exchangedItem: 27,
    rejectedItem: 11,
    logoUrl: nike,
  },
  {
    id: "q1-fashion",
    name: "Q-1 Fashion",
    state: "Telangana",
    totalExchange: 34,
    exchangeRate: "4.1%",
    exchangedItem: 19,
    rejectedItem: 6,
    logoUrl: nike,
  },
  {
    id: "a1-fashion",
    name: "A-1 Fashion",
    state: "Telangana",
    totalExchange: 28,
    exchangeRate: "5.3%",
    exchangedItem: 21,
    rejectedItem: 5,
    logoUrl: nike,
  },
  {
    id: "urban-wear",
    name: "Urban Wear",
    state: "Gujarat",
    totalExchange: 25,
    exchangeRate: "4.8%",
    exchangedItem: 17,
    rejectedItem: 4,
    logoUrl: nike,
  },
  {
    id: "fable-street",
    name: "Fable Street",
    state: "Maharashtra",
    totalExchange: 23,
    exchangeRate: "3.9%",
    exchangedItem: 18,
    rejectedItem: 3,
    logoUrl: nike,
  },
  {
    id: "trend-house",
    name: "Trend House",
    state: "Andhra Pradesh",
    totalExchange: 21,
    exchangeRate: "3.7%",
    exchangedItem: 15,
    rejectedItem: 4,
    logoUrl: nike,
  },
  {
    id: "style-hub",
    name: "Style Hub",
    state: "Telangana",
    totalExchange: 19,
    exchangeRate: "3.4%",
    exchangedItem: 14,
    rejectedItem: 3,
    logoUrl: nike,
  },
  {
    id: "westside",
    name: "Westside",
    state: "Goa",
    totalExchange: 18,
    exchangeRate: "3.2%",
    exchangedItem: 12,
    rejectedItem: 2,
    logoUrl: nike,
  },
  {
    id: "max-fashion",
    name: "Max Fashion",
    state: "Gujarat",
    totalExchange: 17,
    exchangeRate: "3.0%",
    exchangedItem: 11,
    rejectedItem: 2,
    logoUrl: nike,
  },
  {
    id: "zudio",
    name: "Zudio",
    state: "Maharashtra",
    totalExchange: 16,
    exchangeRate: "2.9%",
    exchangedItem: 10,
    rejectedItem: 2,
    logoUrl: nike,
  },
];

const statusSequence: ExchangeStatus[] = [
  "New",
  "Approved",
  "Ready",
  "On the way",
  "Exchanged",
  "Rejected",
];

export const exchangeRows: ExchangeRow[] = Array.from(
  { length: 24 },
  (_, index) => {
    const status = statusSequence[index % statusSequence.length];
    const rider =
      status === "New" || status === "Approved" ? "-" : "Rajan Kumar";
    return {
      id: `#EX-${5490 + index}`,
      customer:
        index % 3 === 0
          ? "Meena Prakhar"
          : index % 3 === 1
            ? "Arjun Mehta"
            : "Ayan Qureshi",
      rider,
      item: "Red T-shirt (M)",
      replace: "(L)",
      reason: "Size too small",
      requested: `${20 - Math.floor(index / 6)}th Apr`,
      status,
      action:
        status === "Ready"
          ? index % 2 === 0
            ? "Rider reached the store"
            : "Rider is on the way"
          : status === "On the way"
            ? "Estimated Delivery in 18 mins"
            : "View details",
    };
  },
);

export const exchangeDetails: Record<string, ExchangeDetail> = {};

for (const row of exchangeRows) {
  exchangeDetails[row.id.replace("#", "")] = {
    id: row.id,
    store: "NIKE",
    status: row.status,
    exchangeWith: "Red T-shirt (M) <----> Red T-shirt (L)",
    reason: row.reason,
    customer: {
      name: row.customer,
      email: row.customer.toLowerCase().replaceAll(" ", "") + "@gmail.com",
      mobile: "+91 99887 55441",
      ageGender: "21/Female",
      cityState: "Mumbai/Maharashtra",
      address:
        "Shimla park, MM Valley, 5th floor, Building no: 502, kausa – Mumbra, Lingampalli (Telangana)– 2.8 Km",
    },
    item: {
      name: "Red bright Anime cool T-shirt for Gen-Z",
      category: "T-Shirt",
      size: "M",
      color: "Red",
      price: 1099,
      mrp: 1249,
      discount: 21,
      image: productRed,
    },
    exchangedItem: {
      name: "Red bright Anime cool T-shirt for Gen-Z",
      category: "T-Shirt",
      size: "L",
      color: "Red",
      price: 1099,
      mrp: 1249,
      discount: 21,
      image: productRed,
    },
    rider:
      status === "New" || status === "Approved"
        ? undefined
        : {
            name: "Rajan Kumar",
            phone: "+91 82347 09765",
            rating: "4.6 (116)",
            distance: "1.6 km",
            image: riderAvatar,
          },
    rejectionMessage:
      status === "Rejected" ? "It’s looking invalid to me." : undefined,
    rejectedAt: status === "Rejected" ? "20th Apr, 12:35 PM" : undefined,
    exchangedAt: status === "Exchanged" ? "26th Mar, 7:50 PM" : undefined,
    eta: status === "On the way" ? "12:30 PM" : undefined,
  };
}

exchangeDetails["EX-5490"] = {
  ...exchangeDetails["EX-5490"],
  customer: {
    ...exchangeDetails["EX-5490"].customer,
    name: "Arjun Mehta",
    email: "arjunmehta@gmail.com",
    mobile: "+91 99887 55441",
    ageGender: "21/Female",
    cityState: "Mumbai/Maharashtra",
  },
};

export const statusCounts: Record<ExchangeStatus | "All", number> = {
  All: 32,
  New: 4,
  Approved: 4,
  Ready: 4,
  "On the way": 3,
  Exchanged: 23,
  Rejected: 7,
};

export const getExchangeDetail = (
  exchangeId: string,
  storeName?: string,
): ExchangeDetail => {
  const key = exchangeId.replace("#", "");
  const detail = exchangeDetails[key] ?? exchangeDetails["EX-5490"];
  return storeName ? { ...detail, store: storeName } : detail;
};
