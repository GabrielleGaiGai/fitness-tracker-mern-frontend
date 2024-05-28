import { Link } from 'react-router-dom'
import './Landing.css'

const Landing = () => {
    return (
        <section className="landing">
            <header>
                <h1 className="landing__header">Simple Fitness Tracker</h1>
            </header>
            <footer className='landing__links'>
                <Link to="/signup" className='landing__link'>Sign up</Link>
                <Link to="/signin" className='landing__link'>Sign In</Link>
            </footer>
        </section>
    )
}

export default Landing