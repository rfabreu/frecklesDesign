import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function Header() {
    return (
        <header className='App header'>
            <div className='brand-container'>
                <h1 className='title'>
                    <strong>CARLA ANTUNES</strong> <span className='brand-divider'>/</span> <span className='brand-sub'>Freckles Design</span>
                </h1>
                <p className='brand-tagline'>Contemporary Acrylic Paintings &bull; Portuguese Heritage</p>
            </div>
        </header>
    );
}

export default Header;
