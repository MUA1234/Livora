'use client';

export interface ConfirmModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({
    title,
    message,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Poppins',_sans-serif]">
            {/* Dark backdrop overlay */}
            <div
                className="fixed inset-0 bg-[#1C1C1C]/60 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
                aria-hidden="true"
            />

            {/* Modal content */}
            <div className="relative bg-[#F5F1E8] rounded-xl shadow-2xl max-w-md w-full p-6 overflow-hidden transform transition-all">
                <h3 className="text-xl font-semibold text-[#1C1C1C] mb-3">
                    {title}
                </h3>
                <p className="text-sm text-[#1C1C1C]/80 mb-6 leading-relaxed">
                    {message}
                </p>

                <div className="flex justify-end gap-3 mt-2">
                    <button
                        onClick={onCancel}
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-[#1C1C1C] bg-transparent border border-[#1C1C1C]/20 rounded-lg hover:bg-[#1C1C1C]/5 transition-colors focus:ring-2 focus:ring-[#1C1C1C]/20 focus:outline-none"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-[#F5F1E8] bg-[#663F23] rounded-lg hover:bg-[#C6A75E] transition-colors shadow-sm focus:ring-2 focus:ring-[#663F23]/50 focus:outline-none"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
