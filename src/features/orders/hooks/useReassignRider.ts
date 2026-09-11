import { useState } from "react";
import { orderApi } from "../api/orderApi";

export function useReassignRider(orderId: string) {
    const [selectedRiderId, setSelectedRiderId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const reassign = async (onSuccess: () => void) => {
        if (!selectedRiderId) return;

        setIsSubmitting(true);
        setError("");

        try {
            await orderApi.reassignRider(orderId, selectedRiderId);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reassign rider.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return { selectedRiderId, setSelectedRiderId, isSubmitting, error, reassign };
}
