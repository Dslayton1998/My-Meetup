import GroupFutureEventCards from "./GroupFutureEventCards";
import GroupPastEventCards from "./GroupPastEventCards";

export default function Details({ group, events }) {
    let firstName;
    let lastName;

    let futureEvents = group && group.Events && group.Events.filter(event => Date.parse(event.startDate) > Date.now());
    let pastEvents = group && group.Events && group.Events.filter(event => Date.parse(event.startDate) < Date.now());

    if(group) {
        if(group.Organizer) {
            firstName = group.Organizer.firstName
            lastName = group.Organizer.lastName
        }
    }
    

    // todo: need an array of past and future events map through and create a component for each element
    
    return (
        <div className="event-details-container">
            <div className="event-details">
                <h2 style={{marginBottom: 0}}>Organizer</h2>
                <p>{firstName} {lastName}</p>
                <h2 style={{marginTop: 35}}>What we&apos;re about</h2>
                <p>{group ? group.about: null}</p>

                <div style={{marginTop: 55}}>
                {futureEvents && futureEvents.length > 0 && <h3>Upcoming Events ({futureEvents.length})</h3>}
                { futureEvents ? futureEvents.map(event => (
                <div style={{cursor: 'pointer'}}><GroupFutureEventCards event={event} group={group} /></div>
            )) : null}
                {pastEvents && pastEvents.length > 0 && <h3 style={{marginTop: 40}}>Past Events ({pastEvents.length})</h3>}
                {pastEvents ? pastEvents.map(event => (
                // console.log('hoi',event)
                <div style={{cursor: 'pointer'}}><GroupPastEventCards event={event} group={group} /></div>
            )) : null}

                <p>{events.length ? events[1].description : null}</p>
                </div>
            </div>
        </div>
    )
}