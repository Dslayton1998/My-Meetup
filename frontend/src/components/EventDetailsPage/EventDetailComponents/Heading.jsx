export default function Heading({ event }) {
    console.log(event)

    return (
        <div>
            <h1>{event ? event.name : null}</h1>
            <p>Hosted by (figure this out later)</p>
            
        </div>
    )
}