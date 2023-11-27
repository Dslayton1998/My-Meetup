import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getAllGroupsThunk } from "../../../store/groups";
import { useNavigate, useParams } from "react-router-dom";
import { createEventThunk } from "../../../store/events";
import { csrfFetch } from "../../../store/csrf";


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
    }, [ dispatch, name, type, isPrivate, price, startDate, endDate, description, url])


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

        const img = {
            url,
            preview: true
        }

        const newEvent = {
            venueId: 1,
            name,
            type,
            capacity: 15,
            price,
            description,
            startDate,
            endDate
        }

        const newEventData = await dispatch(createEventThunk(newEvent, groupId))
        const newEventId = newEventData.id
        await csrfFetch(`/api/events/${newEventId}/images`, {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(img)
        })
        reset();
        navigate(`/events/${newEventId}`)
        // todo: navigate to currentEvent details
    }



    return (
        <div className="create-event-form-container">
            <h1>Create an event for {group ? group.name: null}</h1>
            <form className="create-event-form" onSubmit={handleSubmit}>
                <div className="form-info-containers">
                    <h4>What is the name of your event?</h4>
                    <div className="input-and-validation">
                    <input 
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        placeholder="Event Name"
                        name="Event Name"
                    />
                {hasSubmitted && validations.name && `*${validations.name}`}
                    </div>
                </div>
                <div className="form-info-containers">
                    <h4>Is this an in person or online event?</h4>
                    <div className="input-and-validation-select">
                    <select onChange={(e) => setType(e.target.value)}> 
                        <option defaultValue="" selected disabled hidden>(select one)</option>
                        <option value={'Online'} >Online</option>
                        <option value={'In person'} >In-Person</option>
                    </select>
                    {hasSubmitted && validations.type && `*${validations.type}`}
                    </div>
                    <h4>Is this event private or public?</h4>
                    <div className="input-and-validation-select">
                    <select onChange={(e) => setIsPrivate(e.target.value)}> 
                        <option defaultValue="" selected disabled hidden>(select one)</option>
                        <option value={true} >Private</option>
                        <option value={false} >Public</option>
                    </select>
                    {hasSubmitted && validations.isPrivate && `*${validations.isPrivate}`}
                    </div>
                    <h4>What is the price for your event</h4>
                    {/* todo: add $ icon or figure something out */}
                    <div className="input-and-validation">
                    <input 
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="$"
                        name="price"
                    />
                {hasSubmitted && validations.price && `*${validations.price}`}
                    </div>
                </div>
                <div className="form-info-containers">
                    <h4>When does your event start?</h4>
                    <div className="input-and-validation-date">
                    <input 
                        type='datetime-local'
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        name="startDate"
                    />
                    {hasSubmitted && validations.startDate && `*${validations.startDate}`}
                    </div>
                    <h4>When does your event end?</h4>
                    <div className="input-and-validation-date">
                    <input 
                        type='datetime-local'
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        name="endDate"
                    />
                    {hasSubmitted && validations.endDate && `*${validations.endDate}`}
                    </div>
                </div>
                <div className="form-info-containers">
                    <h4>Please add an image url for your event below:</h4>
                    <div className="input-and-validation">
                    <input 
                    placeholder="Image Url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    />
                {hasSubmitted && validations.url && `*${validations.url}`}
                    </div>
                </div>
                <div>
                    <h4>Please describe your event:</h4>
                    <div className="input-and-validation">
                    <textarea 
                        // type="textarea"
                        name="description"
                        placeholder="Please include at least 30 characters."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{width: 800, height: 200}}
                    />
                    {hasSubmitted && validations.description && `*${validations.description}`}
                    </div>
                </div>
                <button>Create Event</button>
            </form>
        </div>
    )
}