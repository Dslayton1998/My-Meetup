export default function Details({ event }) {
    // todo: needs group information
    //* Consider braking this up into smaller components
    return (
        <div>
            <img src={event ? event.previewImage : null} />
            <div>
                {/* GROUP DETAILS CARD */}
            <h1>{event ? event.Group.name : null}</h1>
            </div>
            <div>
                {/* EVENT DATES/PRICE/TYPE */}
            <p>START {event ? event.startDate : null}</p>
            <p>END {event ? event.endDate : null}</p>
            <span>{event ? event.price : null}</span>
            <span>{event ? event.type : null}</span>
            </div>
            
        </div>
    )
}