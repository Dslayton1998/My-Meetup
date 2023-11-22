import { csrfFetch } from './csrf';

// TYPES
const READ_EVENTS = 'events/LOAD_EVENTS'
const CREATE_EVENT = 'events/CREATE_EVENT'
const UPDATE_EVENT = 'events/UPDATE_EVENT'
const DELETE_EVENT = 'events/DELETE_EVENT'


// ACTIONS
// todo: Full CRUD   READ - CREATE - UPDATE - DELETE 
export const readEventsAction = ( events ) => {
    return {
        type: READ_EVENTS,
        events
    }
}

export const createEventAction = ( events ) => {
    return {
        type: CREATE_EVENT,
        events
    }
}

export const updateEventAction = ( events ) => {
    return {
        type: UPDATE_EVENT,
        events
    }
}

export const deleteEventAction = ( response ) => {
    return {
        type: DELETE_EVENT,
        response
    }
}


// todo: THUNKS!!!!--------------------------------------------------------------

export const getAllEventsThunk = () => async (dispatch) => {
    const res = await fetch('/api/events');
    // console.log('HEEEEEEEEY',res)
    
    if(res.ok) {
        const data = await res.json();
        dispatch(readEventsAction(data));
    } else {
        // console.log(res, "Hello")
    }
}

export const createEventThunk = ( newEvent ) => async (dispatch) => {
//    try {
       const res = await csrfFetch('/api/events', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json'},
           body: JSON.stringify(newEvent)
       })

       if(res.ok) {
        const data = await res.json();
        dispatch(createEventAction(data))
        return data
    } 
//    } catch (err) {
//        // todo: handle errors
//             //    console.log('err here', err)
//                const error = await err.json()
//                console.log('err here', error)
//    }

}


export const deleteEventThunk = ( event ) => async (dispatch) => {
    // console.log(group)
    const res = await csrfFetch(`/api/groups/${event.id}`, { method: 'DELETE'} )
    
    if(res.ok) {
        const data = await res.json();
        // console.log('here', data)
        dispatch(deleteEventAction(data))
    } else {
        const err = await res.json()
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
        
        case READ_EVENTS: {
            // console.log('state!',state)
            // console.log('action!',action.events)
            const newState = { ...action.events.Events };
            // console.log('newState',newState)
            return newState
        }

        case CREATE_EVENT: {
            // console.log('state', state)
            // console.log('action', action)
            // const newGroup = action.group
            const newState = { ...state, ...action.event.Events };
            // console.log('newState', newState)
            
            return newState
        }

        case UPDATE_EVENT: {
            return state
        }

        case DELETE_EVENT: {
            // console.log('hello from reducer')
            // console.log('state', state)
            // console.log('action',action)
            console.log('hello from reducer')
            const newState = { ...state };
            // console.log(newState)
            return newState
        }


        default:
            return state
    }
}

export default eventsReducer;