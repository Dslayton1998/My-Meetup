export default function Details({ group }) {
    // console.log(group)
// todo: "Past Events"
    // console.log(group)
    return (
        <div>
            <h2>Organizer</h2>
            <p>firstname lastname</p>
            <h2>What we&apos;re about</h2>
            <p>{group ? group.about: null}</p>
        </div>
    )
}