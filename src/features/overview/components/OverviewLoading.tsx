export default function OverviewLoading() {
    return (
        <div className="space-y-5 animate-pulse">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-20 bg-white rounded-2xl border border-black/5"
                    />
                ))}
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
                <div className="h-[320px] bg-white rounded-2xl border border-black/5" />
                <div className="h-[320px] bg-white rounded-2xl border border-black/5" />
            </div>
        </div>
    );
}
