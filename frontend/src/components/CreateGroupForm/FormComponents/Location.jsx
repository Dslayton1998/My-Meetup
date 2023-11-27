export default function Location() {
    return (
        <input
                type="text"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
                placeholder="City, STATE"
                name="location"
            />
    )
}