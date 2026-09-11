interface LoadingScreenProps {
    message?: string;
}

export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-cream">
            <div className="w-9 h-9 rounded-full border-[3px] border-brand-200 border-t-brand-600 animate-spin" />
            <p className="text-sm text-ink/60">{message}</p>
        </div>
    );
}
