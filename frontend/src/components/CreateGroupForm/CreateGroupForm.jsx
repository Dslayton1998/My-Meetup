import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { createGroupThunk, getAllGroupsThunk } from "../../store/groups";
import { useNavigate } from "react-router-dom";


export default function CreateGroupForm() {
// todo: type, and isPrivate states may need adjustments
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('Online')
    const [isPrivate, setPrivate] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const groups = useSelector(state => Object.values(state.groups.Groups))
    console.log(groups, 'GROUPS')
    useEffect(() => {
        dispatch(getAllGroupsThunk())
    }, [ dispatch ])

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const locationArr = location.split(',')
        
        const newGroup = {
            name,
            city: locationArr[0],
            state: locationArr[1],
            about: description,
            type,
            isPrivate
        };
        console.log('NEW_GROUP', newGroup)
        await dispatch(createGroupThunk(newGroup));

        reset();

        navigate(`/groups/${groups.length + 1}`)
    }

    const reset = () => {
        setName('');
        setLocation('');
        setDescription('');
        setType('Online')
        setPrivate(true)
      };

    return (

        <>
        <h1>Create New Group</h1>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
                placeholder="City, STATE"
                name="location"
            />
            <input
                type="text"
                onChange={(e) => setName(e.target.value)}
                value={name}
                placeholder="Group name"
                name="name"
            />
            <input
                type="text"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Please write at least 30 characters"
                name="description"
            />
            <select onChange={(e) => setType(e.target.value)}>
                <option value={'Online'} >Online</option>
                <option value={'In-person'} >In-Person</option>
            </select>
            <select onChange={(e) => setPrivate(e.target.value)}>
                <option value={true} >true</option>
                <option value={false} >false</option>
            </select>
            <button type="submit">Create group</button>
        </form>
        </>
    )
}