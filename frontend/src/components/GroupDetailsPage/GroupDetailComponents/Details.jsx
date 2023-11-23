import { useSelector } from "react-redux"

export default function Details({ group }) {
    const organizer = useSelector(state => state.Groups.CurrentGroupDetails ? state.Groups.CurrentGroupDetails.Organizer: null)
    // console.log(group)
// todo: "Past Events"
    // console.log(group)
    return (
        <div>
            <h2>Organizer</h2>
            <p>{organizer ? organizer.firstName: null} {organizer ? organizer.lastName: null}</p>
            <h2>What we&apos;re about</h2>
            <p>{group ? group.about: null}</p>
        </div>
    )
}