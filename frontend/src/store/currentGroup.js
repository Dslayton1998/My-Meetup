import { csrfFetch } from './csrf';

const READ_GROUP_ID = 'groups/READ_GROUP_ID'

export const readGroupByIdAction = ( group, events, groupDetails ) => {
    return {
        type: READ_GROUP_ID,
        group,
        events,
        groupDetails
    }
}


export const getGroupByIdThunk = ( groupId ) => async (dispatch) => {

    const groupRes = await csrfFetch(`/api/groups/${groupId}`)
    const groupDetails = await groupRes.json();
    const eventRes = await fetch(`/api/groups/${groupId}/events`)
    const eventDetails = await eventRes.json();
    let group = groupDetails
    dispatch(readGroupByIdAction(group, eventDetails, groupDetails))

    return group
}

const initial = { }; // todo: see if this makes things look funky
const currentGroupReducer = (state = initial, action) => {
    switch (action.type) {
        

        case READ_GROUP_ID: {
            // console.log('state!',state)
            // console.log('action!',action.groupDetails)
            const group = action.group
            const events = action.events;
            const details = action.groupDetails
            const GroupImages = details.GroupImages
            const Organizer = details.Organizer
            const Venues = details.Venues
            const newState = { ...state, [group.id]: {...state[group.id], ...group, ...events, GroupImages, Organizer, Venues} };
            // console.log('newState',newState)
            return newState
        }


        default:
            return state
    }
}

export default currentGroupReducer;