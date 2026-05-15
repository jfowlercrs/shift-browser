const ShiftCardSkeleton = () => {
    return (
        <div className="shift-card skeleton-card">
            <div className="shift-card-header">
                <div className="skeleton skeleton-title" />
                <div className="skeleton skeleton-badge" />
            
            </div>
            <div className="shift-card-body">
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line" />
                <div className="skeleton skeleton-line short" />
            </div>
            <div className="shift-card-footer">
                <div className="skeleton skeleton-button" />
            </div>
        </div>
    )
}

export default ShiftCardSkeleton