export function filterRiders<T extends { name: string; city?: string; status: string }>(
    items: T[],
    query: string,
    status: string,
) {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => {
        const matchesSearch =
            !normalized ||
            item.name.toLowerCase().includes(normalized) ||
            item.status.toLowerCase().includes(normalized) ||
            String(item.city ?? "").toLowerCase().includes(normalized);
        const matchesStatus = status === "All" || item.status === status;
        return matchesSearch && matchesStatus;
    });
}
