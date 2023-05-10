import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Follow() {
    return (
        <div className='App'>
            <div className='content'>
                <div className='buttons'>
                    <button className='btn btn-outline-light btn-lg' onClick={() => window.open('https://linktr.ee/carla_antunes?fbclid=PAAaZvEwpQjeWTT9XHSHy9EZIPtEvInpc4yJlwmpryAdYnOOZ7vpgdlpG2MAA', '_blank', 'noopener noreferrer')}>Follow me</button>
                    <button className='btn btn-outline-light btn-lg' onClick={() => window.open('https://instagram.com/_freckles_design?igshid=YmMyMTA2M2Y=', '_blank', 'noopener noreferrer')}>
                        <FontAwesomeIcon icon={faArrowRight} className='btn-icon' /> @_freckles_design
                    </button>
                    <button className='btn btn-outline-light btn-lg' onClick={() => window.location.href = 'mailto:carla@frecklesdesign.ca'}>
                        <FontAwesomeIcon icon={faArrowRight} className='btn-icon' /> carla@frecklesdesign.ca
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Follow;
