import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { getAllGroupsThunk } from "../../../store/groups"
import { useNavigate, useParams } from "react-router-dom"
import { createEventThunk } from "../../../store/events";


export default function CreateEventForm() {
    const [ name , setName ] = useState('');
    const [ type , setType ] = useState('');
    const [ isPrivate , setIsPrivate ] = useState('');
    const [ price , setPrice ] = useState('');
    const [ startDate , setStartDate ] = useState('');
    const [ endDate , setEndDate ] = useState('');
    const [ url , setUrl ] = useState('');
    const [ description , setDescription ] = useState('');
    const [ validations , setValidations ] = useState({})
    const [ hasSubmitted, setHasSubmitted ] = useState(false)
    const { groupId } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const groups = useSelector(state => state.Groups ? Object.values(state.Groups) : null)
    const group = groups.find(group => group.id == groupId);


    useEffect(() => {
        dispatch(getAllGroupsThunk())
        const urlArr = url.split('.')
        // console.log(urlArr)
        const validSuffix = ['jpg', 'png', 'jpeg']
        const suffix = urlArr[urlArr.length - 1]
        // console.log(validSuffix.includes(suffix))
        // console.log(suffix) 
        const validations = {};

        if(!name) {
            validations.name = 'Name is required'
        }

        if(!type) {
            validations.type = 'Event Type is required'
        }

        if(!isPrivate) {
            validations.isPrivate = 'Visibility is required'
        }

        if(!price) {
            validations.price = 'Price is required'
        }

        if(!startDate) {
            validations.startDate = 'Event start is required'
        }

        if(!endDate) {
            validations.endDate = 'Event end is required'
        }

        if(!validSuffix.includes(suffix)) {
            validations.url = 'Image URL must end in .png, .jpg, .jpeg'
        }  

        if(description.length < 30) {
            validations.description = 'Description must be at least 30 characters long'
        }

        setValidations(validations)
    }, [ dispatch, name, type, isPrivate, price, startDate, endDate, description ])


    const reset = () => {
        setName('');
        setType('');
        setIsPrivate('');
        setPrice('');
        setStartDate('');
        setEndDate('');
        setDescription('');
        setUrl('');
        setHasSubmitted(false)
        setValidations({})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true)

        const newEvent = {
            groupId,
            venueId: 1,
            name,
            type,
            capacity: 15,
            price,
            description,
            startDate,
            endDate
        }

        await dispatch(createEventThunk(newEvent))
        reset();
        // todo: navigate to currentEvent details
        // navigate(`/events/${}`)
    }



    return (
        <div>
            <h1>Create an event for {group ? group.name: null}</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <p>What is the name of your event?</p>
                    <input 
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder="Event Name"
                        name="Event Name"
                    />
                </div>
                {hasSubmitted && validations.name && `*${validations.name}`}
                <div>
                    <p>Is this an in person or online event?</p>
                    <select onChange={(e) => setType(e.target.value)}> 
                        <option defaultValue="" selected disabled hidden>(select one)</option>
                        <option value={'Online'} >Online</option>
                        <option value={'In person'} >In-Person</option>
                    </select>
                    {hasSubmitted && validations.type && `*${validations.type}`}
                    <p>Is this event private or public?</p>
                    <select onChange={(e) => setIsPrivate(e.target.value)}> 
                        <option defaultValue="" selected disabled hidden>(select one)</option>
                        <option value={true} >Private</option>
                        <option value={false} >Public</option>
                    </select>
                    {hasSubmitted && validations.isPrivate && `*${validations.isPrivate}`}
                    <p>What is the price for your event</p>
                    {/* todo: add $ icon or figure something out */}
                    <input 
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="$"
                        name="price"
                    />
                </div>
                {hasSubmitted && validations.price && `*${validations.price}`}
                <div>
                    <p>When does your event start?</p>
                    <input 
                        type='datetime-local'
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        name="startDate"
                    />
                    {hasSubmitted && validations.startDate && `*${validations.startDate}`}
                    <p>When does your event end?</p>
                    <input 
                        type='datetime-local'
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        name="endDate"
                    />
                    {hasSubmitted && validations.endDate && `*${validations.endDate}`}
                </div>
                <div>
                    <p>Please add an image url for your event below:</p>
                    <input 
                    placeholder="Image Url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    />
                </div>
                {hasSubmitted && validations.url && `*${validations.url}`}
                <div>
                    <p>Please describe your event:</p>
                    <textarea 
                        // type="textarea"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {hasSubmitted && validations.description && `*${validations.description}`}
                </div>
                <button>Create Event</button>
            </form>
        </div>
    )
}