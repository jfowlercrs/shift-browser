import type { Shift } from "../types/shift";

interface ShiftModalProps {
    shift: Shift
    onClose: () => void
    onApply: (id: number) => void
    isApplying: boolean
}

const ShiftModal = ({ shift, onClose, onApply, isApplying }: ShiftModalProps) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{shift.title}</h2>
                    <button className="modal-close" onClick={onClose}>X</button>
                </div>
                <div className="modal-body">
                    <div className="modal-detail">
                        <span className="modal-label">Location</span>
                        <span>{shift.location}</span>
                    </div>
                    <div className="modal-detail">
                        <span className="modal-label">Date</span>
                        <span>{shift.date}</span>
                    </div>
                    <div className="modal-detail">
                        <span className="modal-label">Specialty</span>
                        <span>{shift.specialty}</span>
                    </div>
                    <div className="modal-detail">
                        <span className="modal-label">Hourly Rate</span>
                        <span>{shift.hourlyRate}</span>
                    </div>
                    <div className="modal-detail">
                        <span className="modal-label">Status</span>
                        <span className={`badge badge-${shift.status}`}>{shift.status}</span>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>X</button>
                    {shift.status === 'open' && (
                        <button 
                            className="btn-apply" 
                            onClick={() => onApply(shift.id)} 
                            disabled={isApplying}
                        >
                            {isApplying ? 'Applying' : 'Apply for Shift'}
                        </button>
                    )}
                </div>
            </div>
        </div>        
    )
}

export default ShiftModal