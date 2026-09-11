import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientRiders } from "../../../shared/api/client/apiClient";
import type { RiderDetail } from "../types/rider.types";

const MOCK_RIDER_DETAIL: RiderDetail = {
    stats: [
        { label: "Total Orders", value: "128", icon: "Package", tone: "yellow" },
        { label: "Completion Rate", value: "99%", icon: "CheckCircle2", tone: "green" },
        { label: "Cancellation Rate", value: "1%", icon: "XCircle", tone: "red" },
        { label: "Acceptance Rate", value: "96%", icon: "ThumbsUp", tone: "blue" },
        { label: "Rating", value: "4.6", icon: "Star", tone: "yellow" },
    ],
    personal: {
        name: "Rajan Kumar",
        email: "rajankumar@gmail.com",
        phone: "+91 99087 55441",
        ageGender: "21/Female",
        city: "Mumbai/Maharashtra",
        avatar: "https://i.pravatar.cc/80?img=33",
    },
    vehicle: {
        name: "Honda Activa 4G",
        color: "Light Green",
        purchasedOn: "26th Mar, 2023",
        number: "MH02-KV-4532",
        year: "2018",
    },
    documents: [
        { label: "Aadhar card front/back", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&q=80" },
        { label: "PAN card", image: "https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?w=300&q=80" },
        { label: "RC book", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&q=80" },
        { label: "Insurance", image: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=300&q=80" },
    ],
};

export const riderApi = {
    getRiderDetail: async (riderId: string): Promise<RiderDetail> => {
        try {
            const { data } = await clientRiders.get<RiderDetail>(`/riders/${riderId}`);
            return data;
        } catch (error) {
            console.warn("Falling back to mock rider detail:", getApiErrorMessage(error));
            return MOCK_RIDER_DETAIL;
        }
    },
};
