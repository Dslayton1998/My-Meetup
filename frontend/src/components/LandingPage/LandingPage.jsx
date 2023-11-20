import Intro from './Intro'
import Subtitle from './Subtitle'
import JoinButton from './JoinButton'
import LandingLinks from './LandingLinks'
import './LandingPage.css'

import infographic from '../../../../images/LP-section1.jpg';

export default function LandingPage()  {
 // todo: needs more styles/ improve layout
 // todo: JoinButton still needs to render sign-up modal
    return (
        <>
        <div className='intro-container'> <Intro /> 
        <img className='section1-img' src={infographic}/>
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