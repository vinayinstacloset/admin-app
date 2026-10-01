export default function OverviewLoading() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-[102px] rounded-xl bg-white" />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_385px]">
                <div className="space-y-4">
                    <div className="h-[365px] rounded-xl bg-white" />
                    <div className="h-[365px] rounded-xl bg-white" />
                </div>
                <div className="space-y-4">
                    <div className="h-[360px] rounded-xl bg-white" />
                    <div className="h-[430px] rounded-xl bg-white" />
                </div>
            </div>
        </div>
    );
}
