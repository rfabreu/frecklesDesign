import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faBehance } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <footer>
            <div className='left-icons'>
                <a href='https://www.instagram.com/carlacaetano.antunes/' target='_blank' rel='noopener noreferrer' aria-label='Carla Antunes on Instagram'>
                    <FontAwesomeIcon icon={faInstagram} className='icon' aria-hidden='true' />
                </a>
                <a href='https://www.linkedin.com/in/carlacaetano/' target='_blank' rel='noopener noreferrer' aria-label='Carla Antunes on LinkedIn'>
                    <FontAwesomeIcon icon={faLinkedin} className='icon' aria-hidden='true' />
                </a>
                <a href='https://www.behance.net/eutenhosardas' target='_blank' rel='noopener noreferrer' aria-label='Carla Antunes on Behance'>
                    <FontAwesomeIcon icon={faBehance} className='icon' aria-hidden='true' />
                </a>
            </div>
            <div className='center'>
                <span className='copy'>&copy; {new Date().getFullYear()} Freckles Design <br /> All rights reserved</span>
            </div>
            <div className='right'>
                <a href='https://orangecatlabs.ca' target='_blank' rel='noopener noreferrer'>
                    Developed by: OrangeCat Labs
                </a>
            </div>
        </footer>
    );
}

export default Footer;