import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin, faBehance } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <footer>
            <div className='left-icons'>
                <a href='https://www.instagram.com/carlacaetano.antunes/' target='_blank' rel='noopener noreferrer'>
                    <FontAwesomeIcon icon={faInstagram} className='icon' />
                </a>
                <a href='https://www.linkedin.com/in/carlacaetano/' target='_blank' rel='noopener noreferrer'>
                    <FontAwesomeIcon icon={faLinkedin} className='icon' />
                </a>
                <a href='https://www.behance.net/eutenhosardas' target='_blank' rel='noopener noreferrer'>
                    <FontAwesomeIcon icon={faBehance} className='icon' />
                </a>
            </div>
            <div className='center'>
                <span className='copy'>&copy; 2023 Freckles Design <br /> All rights reserved</span>
            </div>
            <div className='right'>
                <a href='https://www.linkedin.com/in/rafael-a-gomes/' target='_blank' rel='noopener noreferrer'>
                    Developed by: Rafael Abreu
                </a>
            </div>
        </footer>
    );
}

export default Footer;