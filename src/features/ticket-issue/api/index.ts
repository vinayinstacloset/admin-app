import { getApiErrorMessage } from "../../../shared/api/apiError";
import { clientAdmin } from "../../../shared/api/client/apiClient";
import type { TicketIssueItem } from "../types/ticketissue.types";

// No dedicated screen design was supplied for this module yet — the
// folder scaffold (api/hooks/screens/types/utils/validation) mirrors
// every other feature so the real implementation can drop straight in.
export const ticketIssueApi = {
    list: async (): Promise<TicketIssueItem[]> => {
        try {
            const { data } = await clientAdmin.get<TicketIssueItem[]>("/ticket-issue");
            return data;
        } catch (error) {
            console.warn("Ticket Issue API not implemented yet:", getApiErrorMessage(error));
            return [];
        }
    },
};
