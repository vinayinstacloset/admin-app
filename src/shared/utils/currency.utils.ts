export function formatCurrency(value: number, locale = "en-IN"): string {
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value);
}

export function formatCompactCurrency(value: number): string {
    if (value >= 100000) {
        return `₹${(value / 100000).toFixed(1)}L`;
    }

    if (value >= 1000) {
        return `₹${(value / 1000).toFixed(1)}k`;
    }

    return `₹${value}`;
}
