import '../GroupList.css'

// todo: might not need this, but "Events" and "Groups" headings need to be links
export default function ListHeading() {
    return (
        <>
        <h1 className='event-heading'>Events</h1>
        <h1 className='group-heading'>Groups</h1>
        </>
    )
}