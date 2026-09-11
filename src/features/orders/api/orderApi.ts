import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientOrders } from "../../../shared/api/client/apiClient";
import type { OrderDetail } from "../types/order.types";

const MOCK_ORDER_DETAIL: OrderDetail = {
    id: "#OD-5490",
    status: "On the way",
    eta: "12:30 PM",
    items: [
        {
            id: 1,
            title: "Alone dark blue T-shirt for Gen-Z",
            tags: ["T-Shirt", "L", "Dark blue"],
            description:
                "A versatile, casual garment formed for its T-shaped body and sleeves, typically featuring a crew neck and short sleeves without buttons or collars.",
            price: "₹499",
            mrp: "₹849",
            discount: "12% off",
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
        },
        {
            id: 2,
            title: "Red bright Anime cool T-shirt for Gen-Z",
            tags: ["T-Shirt", "M", "Red"],
            description:
                "A versatile, casual garment formed for its T-shaped body and sleeves, typically featuring a crew neck and short sleeves without buttons or collars.",
            price: "₹1,099",
            mrp: "₹1,349",
            discount: "21% off",
            image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80",
        },
    ],
    customer: {
        name: "Arjun Mehta",
        meta: "21yr/Female",
        email: "arjunmehta@gmail.com",
        phone: "8976929766",
        avatar: "https://i.pravatar.cc/80?img=12",
    },
    vendor: {
        name: "A-1 Fashion",
        email: "a1fashionstore@gmail.com",
        phone: "8259645722",
        avatar: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=100&q=80",
    },
    rider: {
        name: "Rajan Kumar",
        phone: "+91 82347 09765",
        rating: "4.8 (116)",
        avatar: "https://i.pravatar.cc/80?img=33",
    },
    priceDetails: {
        mrp: "₹1,589",
        gst: "₹50",
        total: "₹1,709",
        vendorPayout: "₹1,541",
        riderPayout: "₹39",
        platformCommission: "₹29",
    },
    availableRiders: [
        {
            id: "r1",
            name: "Vijay Kumar",
            phone: "+91 82347 09765",
            distance: "1.6 km",
            avatar: "https://i.pravatar.cc/64?img=20",
        },
        {
            id: "r2",
            name: "Vijay Kumar",
            phone: "+91 82347 09765",
            distance: "2.1 km",
            avatar: "https://i.pravatar.cc/64?img=21",
        },
        {
            id: "r3",
            name: "Vijay Kumar",
            phone: "+91 82347 09765",
            distance: "2.8 km",
            avatar: "https://i.pravatar.cc/64?img=22",
        },
    ],
};

export const orderApi = {
    getOrderDetail: async (orderId: string): Promise<OrderDetail> => {
        try {
            const { data } = await clientOrders.get<OrderDetail>(`/orders/${orderId}`);
            return data;
        } catch (error) {
            console.warn("Falling back to mock order detail:", getApiErrorMessage(error));
            return { ...MOCK_ORDER_DETAIL, id: orderId.startsWith("#") ? orderId : `#${orderId}` };
        }
    },

    reassignRider: async (orderId: string, riderId: string): Promise<void> => {
        try {
            await clientOrders.patch(`/orders/${orderId}/reassign-rider`, { riderId });
        } catch (error) {
            throw new Error(getApiErrorMessage(error, "Failed to reassign rider"));
        }
    },
};
