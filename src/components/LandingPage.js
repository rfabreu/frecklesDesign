import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function LandingPage() {
    return (
        <div className='App'>
            <h4 className='header'>CARLA ANTUNES / Freckles Design</h4>
            <video className='video' src='./coming_soon.mp4' autoplay loop controls /> {/* add controls={false} to hide video controls */}
            <div className='content'>
                <h1 className='main-heading'>Will be celebrating the<br />
                    lauch of our new site soon.</h1>
                <div className='buttons'>
                    <button className='btn btn-outline-light' onClick={() => window.open('https://linktr.ee/carla_antunes?fbclid=PAAaZvEwpQjeWTT9XHSHy9EZIPtEvInpc4yJlwmpryAdYnOOZ7vpgdlpG2MAA', '_blank', 'noopener noreferrer')}>Follow me</button>
                    <button className='btn btn-outline-light' onClick={() => window.open('https://instagram.com/_freckles_design?igshid=YmMyMTA2M2Y=', '_blank', 'noopener noreferrer')}>
                        <FontAwesomeIcon icon={faArrowRight} /> @_freckles_design
                    </button>
                    <button className='btn btn-outline-light' onClick={() => window.location.href = 'mailto:carla@frecklesdesign.ca'}>
                        <FontAwesomeIcon icon={faArrowRight} /> carla@frecklesdesign.ca
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
