import { csrfFetch } from './csrf';

// TYPES
const READ_ALL_EVENTS = 'events/READ_ALL_EVENTS'
const READ_EVENT_ID = 'events/READ_EVENT_ID'
const CREATE_EVENT = 'events/CREATE_EVENT'
const UPDATE_EVENT = 'events/UPDATE_EVENT'
const DELETE_EVENT = 'events/DELETE_EVENT'


// ACTIONS
// todo: Full CRUD   READ - CREATE - UPDATE - DELETE 
export const readAllEventsAction = ( events ) => {
    return {
        type: READ_ALL_EVENTS,
        events
    }
}
//todo: /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const readEventByIdAction = ( event, eventDetails ) => {
    return {
        type: READ_EVENT_ID,
        event, 
        eventDetails
    }
}


export const createEventAction = ( event ) => {
    return {
        type: CREATE_EVENT,
        event
    }
}

export const updateEventAction = ( events ) => {
    return {
        type: UPDATE_EVENT,
        events
    }
}

export const deleteEventAction = ( eventId ) => {
    return {
        type: DELETE_EVENT,
        eventId
    }
}


// todo: THUNKS!!!!--------------------------------------------------------------

export const getAllEventsThunk = () => async (dispatch, getState) => {
    const state = getState().Events;
    if(Object.keys(state).length === 0) {
        const res = await fetch('/api/events');
        const data = await res.json();
        dispatch(readAllEventsAction(data));
        return data
    }
    return state
}


export const getEventByIdThunk = ( eventId ) => async (dispatch, getState) => {
    const state = getState().Events;
    const res = await csrfFetch(`/api/events/${eventId}`)
    const eventDetails = await res.json();
    let event = state[eventId]
    dispatch(readEventByIdAction(event, eventDetails))
    return event
}



export const createEventThunk = ( newEvent, groupId ) => async (dispatch) => {
   try {
        console.log('newEvent in Thunk:', newEvent)
       const res = await csrfFetch(`/api/groups/${groupId}/events`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json'},
           body: JSON.stringify(newEvent)
       })
       if(res.ok) {
        const data = await res.json();
        dispatch(createEventAction(data))
        return data
    } 
   } catch (err) {
            //    console.log('err here', err)
               const error = await err.json()
            //    console.log('err here', error)
   }

}


export const deleteEventThunk = ( eventId ) => async (dispatch) => {
    const res = await csrfFetch(`/api/events/${eventId}`, { method: 'DELETE'} )
    
    if(res.ok) {
        const data = await res.json();
        dispatch(deleteEventAction(data))
    } else {
        // const err = await res.json()
        // console.log(err)
    }
}


export const updateEventThunk = ( update ) => async (dispatch) => {
    console.log('updatedData',update)
    // try {
        const res = await csrfFetch(`/api/groups/${update.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(update)
        })
        if(res.ok) {
            const data = await res.json();
            console.log('res',data)
            dispatch(updateEventAction(data))
        }
    // } catch(err) {
    //     const errors = await err.json()
    //     console.log('err',errors)

    // }
}




// todo: REDUCER!!!!--------------------------------------------------------------------
const initial = { }; // Events: { }
const eventsReducer = (state = initial, action) => {
    switch (action.type) {
        
        case READ_ALL_EVENTS: {
            // console.log('state!',state)
            // console.log('action!',action)
            const normalized = {};
            Object.values(action.events.Events).forEach(event => {
                // console.log(event)
                normalized[event.id] = event
            })
            const newState = { ...normalized };
            // console.log('newState',newState)
            return newState
        }

        case READ_EVENT_ID: {
            // console.log('state!',state.Events)
            // console.log('action!',action)
            const event = action.event;
            const details = action.eventDetails;
            const newState = { ...state, [event.id]:{...state[event.id], ...event, ...details} };
            // console.log('newState',newState)
            return newState
        }

        case CREATE_EVENT: {
            // console.log('state', state)
            // console.log('action', action)
            const event = action.event
            const newState = { ...state, [event.id]: {...state[event.id], ...event} };
            // console.log('newState', newState)
            
            return newState
        }

        case UPDATE_EVENT: {
            return state
        }

        case DELETE_EVENT: {
            // console.log('hello from reducer')
            // console.log('state', state)
            console.log('action',action)
            console.log('hello from reducer')
            const newState = { ...state };
            delete newState[action.event]
            // console.log(newState)
            return newState
        }


        default:
            return state
    }
}

export default eventsReducer;