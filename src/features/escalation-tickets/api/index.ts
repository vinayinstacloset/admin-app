import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientAdmin } from "../../../shared/api/client/apiClient";
import type { EscalationTicketsItem } from "../types/escalationtickets.types";

// No dedicated screen design was supplied for this module yet — the
// folder scaffold (api/hooks/screens/types/utils/validation) mirrors
// every other feature so the real implementation can drop straight in.
export const escalationTicketsApi = {
    list: async (): Promise<EscalationTicketsItem[]> => {
        try {
            const { data } = await clientAdmin.get<EscalationTicketsItem[]>("/escalation-tickets");
            return data;
        } catch (error) {
            console.warn("Escalation Ticket API not implemented yet:", getApiErrorMessage(error));
            return [];
        }
    },
};
