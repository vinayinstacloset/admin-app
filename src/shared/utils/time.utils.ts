export function formatRelativeTime(isoDate: string): string {
    const date = new Date(isoDate);
    const diffMs = Date.now() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "just now";
    if (diffHours === 1) return "1 hr ago";
    if (diffHours < 24) return `${diffHours} hrs ago`;

    const diffDays = Math.floor(diffHours / 24);
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
}

export function formatDateLabel(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
    });
}
