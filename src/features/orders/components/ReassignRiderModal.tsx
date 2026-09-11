import Modal from "../../../shared/components/modals/Modal";
import { Button } from "../../../shared/components/common/buttons";
import type { AvailableRider, OrderRider } from "../types/order.types";

interface ReassignRiderModalProps {
    open: boolean;
    orderId: string;
    currentRider: OrderRider;
    availableRiders: AvailableRider[];
    selectedRiderId: string | null;
    isSubmitting: boolean;
    error: string;
    onSelectRider: (riderId: string) => void;
    onClose: () => void;
    onConfirm: () => void;
}

export default function ReassignRiderModal({
    open,
    orderId,
    currentRider,
    availableRiders,
    selectedRiderId,
    isSubmitting,
    error,
    onSelectRider,
    onClose,
    onConfirm,
}: ReassignRiderModalProps) {
    return (
        <Modal
            open={open}
            onClose={onClose}
            widthClassName="max-w-sm"
        >
            <h3 className="text-[15px] font-semibold text-ink mb-4">{orderId} Reassign rider</h3>

            <p className="text-[11px] text-ink/40 uppercase tracking-wide mb-2">Current rider</p>
            <div className="flex items-center gap-3 mb-4">
                <img
                    src={currentRider.avatar}
                    alt={currentRider.name}
                    className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                    <p className="text-[13px] text-ink">{currentRider.name}</p>
                    <p className="text-[11px] text-ink/40">{currentRider.phone} · 2.7 km · 16 min</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-2">
                <p className="text-[11px text-ink/40 uppercase tracking-wide">Select rider</p>
                <span className="text-[11px] text-emerald-600">{availableRiders.length} available</span>
            </div>

            <ul className="space-y-2 mb-5">
                {availableRiders.map((rider) => (
                    <li key={rider.id}>
                        <label className="flex items-center gap-3 border border-black/5 rounded-lg p-2.5 cursor-pointer hover:bg-cream">
                            <img
                                src={rider.avatar}
                                alt={rider.name}
                                className="w-9 h-9 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-[12.5px] text-ink">{rider.name}</p>
                                <p className="text-[11px] text-ink/40">
                                    {rider.phone} · {rider.distance}
                                </p>
                            </div>
                            <input
                                type="radio"
                                name="rider"
                                checked={selectedRiderId === rider.id}
                                onChange={() => onSelectRider(rider.id)}
                                className="accent-brand-600 w-4 h-4"
                            />
                        </label>
                    </li>
                ))}
            </ul>

            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

            <div className="flex gap-3">
                <Button
                    variant="secondary"
                    size="lg"
                    className="flex-1"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button
                    variant="brand"
                    size="lg"
                    className="flex-1"
                    disabled={!selectedRiderId}
                    loading={isSubmitting}
                    onClick={onConfirm}
                >
                    Reassign rider
                </Button>
            </div>
        </Modal>
    );
}
