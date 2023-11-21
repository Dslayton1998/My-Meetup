import Intro from './LandingComponents/Intro'
import Subtitle from './LandingComponents/Subtitle'
import JoinButton from './LandingComponents/JoinButton'
import LandingLinks from './LandingComponents/LandingLinks'
import '../LandingPage/LandingPage.css'


export default function LandingPage()  {
 // todo: needs more styles/ improve layout
 // todo: JoinButton still needs to render sign-up modal
    return (
        <>
        <div className='intro-container'> <Intro /> 
        <img className='section1-img' src='https://cdn-az.allevents.in/events5/banners/b7634bf5d34c8ed6bdb4a81d844f10637e5881e41f97149218b2a22488fb0242-rimg-w1000-h667-gmir.jpg?v=1699881508'/>
        </div> {/* section 1 (title intro: left, infographic: right) */}


        <div className='subtitle-container'> <Subtitle /> 
        </div> {/* section 2 (subtitle and caption: centered) */}


        <div className='nav-container'> <LandingLinks />
        </div> {/* section 3 (3 columns with icons, underlined links and a caption) */}


        <div className='join-button-container'> <JoinButton />
        </div> {/* section 4 (Join Meetup button) */}
        </>
    )
 }