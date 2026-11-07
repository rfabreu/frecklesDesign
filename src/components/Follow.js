import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faLink, faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

function Follow() {
    return (
        <section className='connect-section' aria-label='Connect with Carla Antunes'>
            <div className='connect-header'>
                <h2 className='connect-title'>Connect & Commissions</h2>
                <p className='connect-subtitle'>
                    Inquiries for original works, gallery exhibitions, or bespoke commissions are warmly welcomed.
                </p>
            </div>
            <div className='connect-actions'>
                <a
                    href='mailto:carla@frecklesdesign.ca?subject=Art%20Inquiry%20(Freckles%20Design)'
                    className='connect-pill primary'
                    aria-label='Email Carla Antunes'
                >
                    <FontAwesomeIcon icon={faEnvelope} className='connect-icon' />
                    <span>carla@frecklesdesign.ca</span>
                </a>
                <a
                    href='https://instagram.com/_freckles_design'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='connect-pill'
                    aria-label='Follow @_freckles_design on Instagram'
                >
                    <FontAwesomeIcon icon={faInstagram} className='connect-icon' />
                    <span>@_freckles_design</span>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='external-icon' />
                </a>
                <a
                    href='https://linktr.ee/carla_antunes'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='connect-pill'
                    aria-label='View Carla Antunes on Linktree'
                >
                    <FontAwesomeIcon icon={faLink} className='connect-icon' />
                    <span>Linktree Portfolio</span>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className='external-icon' />
                </a>
            </div>
        </section>
    );
}

export default Follow;
