import { csrfFetch } from './csrf';

const READ_EVENT_ID = 'events/READ_EVENT_ID'

export const readEventByIdAction = ( event, eventDetails ) => {
    return {
        type: READ_EVENT_ID,
        event, 
        eventDetails
    }
}

export const getEventByIdThunk = ( eventId ) => async (dispatch, getState) => {
    const state = getState().Events;
    // if(Object.keys(state).length === 0) {
    //     const res = await csrfFetch(`/api/events`);
    //     const data = await res.json();
    //     dispatch(readAllEventsAction(data))
    // }
    // cons/ole.log(event)
    const res = await csrfFetch(`/api/events/${eventId}`)
    const eventDetails = await res.json();
    // console.log(eventDetails)
    // console.log('OI', state)
    let eventInfo = state[eventId] || eventDetails
    // console.log(event)
    // console.log(data)
    dispatch(readEventByIdAction(eventInfo, eventDetails))
    return eventInfo
}

const initial = { };
const currentEventReducer = (state = initial, action) => {
    switch (action.type) {
        case READ_EVENT_ID: {
            // console.log('state!',state.Events)
            // console.log('action!',action)
            const event = action.event;
            const details = action.eventDetails;
            const newState = { ...state, [event.id]:{...state[event.id], ...event, ...details} };
            // console.log('newState',newState)
            return newState

            // const normalized = {};
            // Object.values(action.events.Events).forEach(event => {
            //     // console.log(event)
            //     normalized[event.id] = event
            // })
            // const newState = { ...normalized };
            // // console.log('newState',newState)
            // return newState
        }

        default: return state
    }
}
export default currentEventReducer;