import { NavLink } from 'react-router-dom'

export default function LandingPage()  {
    // todo: Think of some better things to say about your website dumby
    // todo: give functionality to Navlink's
    // todo: add img's 
    return (
        <>
        <div>
        <h1>The people platform- Where interests become friendships</h1>
        <p>This is gonna be a description about all the reasons you should want to use this website. </p>
        <img src=""/>  
        </div> {/* section 1 (title intro: left, infographic: right) */}


        <div>
        <h3>How Meetup works</h3>   
        <p>You meet up with people? wtf? i don&apos;t know</p> 
        </div> {/* section 2 (subtitle and caption: centered) */}


        <div>
            <div>
                <img/>
                <NavLink>See all groups</NavLink> 
                <p>Look through existing groups, to find the right one for you!</p>
            </div>
            <div>
                <img/>
                <NavLink>Find an event</NavLink>
                <p>Plenty of events to be apart of, far away or in your area! </p>
            </div>
            <div>
                <img/>
                <NavLink>Start a new group</NavLink>
                <p>Wanting to organize an event in your area? Create a group for like minded people!</p>
            </div>
        </div> {/* section 3 (3 columns with icons, underlined links and a caption) */}
        </>
    )
 }