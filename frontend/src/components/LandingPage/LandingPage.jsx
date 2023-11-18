import LandingLinks from './LandingLinks'
import infographic from '../../../../images/LP-section1.jpg'
import './LandingPage.css'


export default function LandingPage()  {
    // todo: Think of some better things to say about your website dumby
    // todo: add img's 
    return (
        <>
        <div className='intro-container'>
        <h2>The people platform- Where interests become friendships</h2>
        <p>This is gonna be a description about all the reasons you should want to use this website. </p>
        <img className='section1-img' src={infographic}/>  
        </div> {/* section 1 (title intro: left, infographic: right) */}


        <div className='subtitle'>
        <h3>How Meetup works</h3>   
        <p>You meet up with people? i don&apos;t know yet</p> 
        </div> {/* section 2 (subtitle and caption: centered) */}


        <div className='nav-container'> <LandingLinks />
        </div> {/* section 3 (3 columns with icons, underlined links and a caption) */}
        </>
    )
 }