export default function ListItems({ group }) {
    // todo: add basic styles (font sizes/layout)
    return (
        <div>
            <img />
            <div>
                <span>{group.name}</span>
                <span>{group.city}</span>
                <span>{group.about}</span>
                {/* Somehow check private status */}
            </div>
        </div>
    )
}