import type { Shift } from "../types/shift";
import React from "react";

interface ShiftCardProps {
    shift: Shift
    onApply: (id: number) => void
    isApplying: boolean
    onSelect: (shift: Shift) => void
}

const ShiftCard = ({ shift, onApply, isApplying, onSelect } : ShiftCardProps) => {
    return (
        <div className="shift-card" onClick={() => onSelect(shift)}>
            <div className="shift-card-header">
                <h2>{shift.title}</h2>
                <span className={`badge badge-${shift.status}`}>
                    {shift.status}
                </span>
            </div>
            <div className="shift-card-body">
                <p><strong>Location:</strong> {shift.location}</p>
                <p><strong>Date:</strong> {shift.date}</p>
                <p><strong>Specialty:</strong> {shift.specialty}</p>
                <p><strong>Rate:</strong> {shift.hourlyRate}</p>
            </div>
            {shift.status === 'open' && (
                <div className="shift-card-footer">
                    <button 
                        className="btn-apply" 
                        onClick={(e) => {
                            e.stopPropagation()
                            onApply(shift.id)
                        }}
                        disabled={isApplying}
                    >
                        {isApplying ? 'Applying...' : 'Apply'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default React.memo(ShiftCard)