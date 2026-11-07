import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import { MDBCol, MDBRow } from 'mdb-react-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faChevronLeft,
    faChevronRight,
    faXmark,
    faEnvelope
} from '@fortawesome/free-solid-svg-icons';
import artworks from '../data/artworks.json';

// Configure Modal accessibility element safely for CRA/test environments
if (typeof document !== 'undefined') {
    const rootEl = document.getElementById('root');
    if (rootEl) {
        Modal.setAppElement('#root');
    }
}

export default function Gallery() {
    const [filter, setFilter] = useState('all');
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    const availableCount = artworks.filter(a => !a.sold).length;
    const soldCount = artworks.filter(a => a.sold).length;

    const visibleArtworks = artworks.filter(art => {
        if (filter === 'available') return !art.sold;
        if (filter === 'sold') return art.sold;
        return true;
    });

    const handleImageClick = (artworkId) => {
        const index = visibleArtworks.findIndex(a => a.id === artworkId);
        if (index !== -1) {
            setSelectedIndex(index);
        }
    };

    const handleModalClose = () => {
        setSelectedIndex(null);
    };

    const handleNext = useCallback(() => {
        if (visibleArtworks.length === 0) return;
        setSelectedIndex(prev => (prev === null ? 0 : (prev + 1) % visibleArtworks.length));
    }, [visibleArtworks.length]);

    const handlePrev = useCallback(() => {
        if (visibleArtworks.length === 0) return;
        setSelectedIndex(prev => (prev === null ? 0 : (prev - 1 + visibleArtworks.length) % visibleArtworks.length));
    }, [visibleArtworks.length]);

    // Keyboard navigation (Arrow keys and ESC)
    useEffect(() => {
        if (selectedIndex === null) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                handleModalClose();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex, handleNext, handlePrev]);

    // Mobile touch swipe handlers
    const minSwipeDistance = 45;
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };
    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) {
            handleNext();
        } else if (distance < -minSwipeDistance) {
            handlePrev();
        }
    };

    const createInquiryUrl = (art) => {
        const subject = encodeURIComponent(`Inquiry: ${art.title} (Freckles Design)`);
        const body = encodeURIComponent(
            `Hello Carla,\n\nI am interested in acquiring your original acrylic painting "${art.title}" (${art.dimensions}, ${art.medium}).\n\nPlease let me know about pricing, framing, and delivery options.\n\nThank you!`
        );
        return `mailto:carla@frecklesdesign.ca?subject=${subject}&body=${body}`;
    };

    // Partition visible artworks into pairs for responsive 3-column layout
    const columns = [];
    for (let i = 0; i < visibleArtworks.length; i += 2) {
        columns.push(visibleArtworks.slice(i, i + 2));
    }

    const currentArt = selectedIndex !== null ? visibleArtworks[selectedIndex] : null;

    return (
        <section className='img-gallery' aria-label='Artwork Gallery'>
            {/* Gallery Status Filter Bar */}
            <div className='gallery-filter-bar' role='tablist' aria-label='Filter artworks by acquisition status'>
                <button
                    type='button'
                    role='tab'
                    aria-selected={filter === 'all'}
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => { setFilter('all'); setSelectedIndex(null); }}
                >
                    All Works ({artworks.length})
                </button>
                <button
                    type='button'
                    role='tab'
                    aria-selected={filter === 'available'}
                    className={`filter-btn ${filter === 'available' ? 'active' : ''}`}
                    onClick={() => { setFilter('available'); setSelectedIndex(null); }}
                >
                    Available for Acquisition ({availableCount})
                </button>
                <button
                    type='button'
                    role='tab'
                    aria-selected={filter === 'sold'}
                    className={`filter-btn ${filter === 'sold' ? 'active' : ''}`}
                    onClick={() => { setFilter('sold'); setSelectedIndex(null); }}
                >
                    Private Collection ({soldCount})
                </button>
            </div>

            {/* Artwork Grid */}
            <MDBRow>
                {columns.map((colArtworks, colIndex) => (
                    <MDBCol
                        key={colIndex}
                        lg={4}
                        md={colIndex % 3 === 0 ? 12 : undefined}
                        className='mb-4 mb-lg-0'
                    >
                        {colArtworks.map((art, itemIndex) => (
                            <article key={art.id} className='gallery-item mb-5'>
                                <div className='img-wrapper'>
                                    <img
                                        src={art.imageUrl}
                                        className='w-100 shadow-1-strong rounded mb-3'
                                        alt={art.alt}
                                        loading={colIndex === 0 && itemIndex === 0 ? 'eager' : 'lazy'}
                                        onClick={() => handleImageClick(art.id)}
                                    />
                                    <span className={`card-badge ${art.sold ? 'badge-sold' : 'badge-available'}`}>
                                        {art.sold ? 'Private Collection' : 'Available'}
                                    </span>
                                </div>
                                <div className='img-description'>
                                    <div className='d-flex justify-content-between align-items-baseline flex-wrap'>
                                        <h3>{art.title}</h3>
                                        {!art.sold && (
                                            <a
                                                href={createInquiryUrl(art)}
                                                className='card-inquire-link'
                                                title={`Inquire about ${art.title}`}
                                                aria-label={`Inquire about ${art.title}`}
                                            >
                                                <FontAwesomeIcon icon={faEnvelope} className='me-1' /> Inquire
                                            </a>
                                        )}
                                    </div>
                                    <p>
                                        {art.medium} - {art.dimensions}{' '}
                                        {art.sold && <strong className='sold'>(SOLD)</strong>}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </MDBCol>
                ))}
            </MDBRow>

            {/* Enhanced Interactive Lightbox */}
            <Modal
                isOpen={selectedIndex !== null}
                onRequestClose={handleModalClose}
                className='lightbox-modal'
                overlayClassName='lightbox-overlay'
                contentLabel='Artwork Lightbox'
                ariaHideApp={false}
            >
                {currentArt && (
                    <div
                        className='lightbox-container'
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        {/* Top Header Controls */}
                        <div className='lightbox-top-bar'>
                            <span className='lightbox-counter' aria-live='polite'>
                                {selectedIndex + 1} / {visibleArtworks.length}
                            </span>
                            <button
                                type='button'
                                className='lightbox-close-btn'
                                onClick={handleModalClose}
                                aria-label='Close full artwork view'
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>

                        {/* Image Viewer with Navigation Controls */}
                        <div className='lightbox-stage'>
                            <button
                                type='button'
                                className='lightbox-nav-btn prev-btn'
                                onClick={handlePrev}
                                aria-label='Previous artwork'
                            >
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>

                            <div className='lightbox-img-wrapper' onClick={handleNext}>
                                <img
                                    src={currentArt.imageUrl}
                                    className='lightbox-img'
                                    alt={currentArt.alt}
                                />
                            </div>

                            <button
                                type='button'
                                className='lightbox-nav-btn next-btn'
                                onClick={handleNext}
                                aria-label='Next artwork'
                            >
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>

                        {/* Bottom Metadata & Acquisition CTA */}
                        <div className='lightbox-caption'>
                            <div className='caption-header'>
                                <h2 className='lightbox-title'>{currentArt.title}</h2>
                                <span className={`lightbox-status-badge ${currentArt.sold ? 'badge-sold' : 'badge-available'}`}>
                                    {currentArt.sold ? 'Private Collection / Sold' : 'Available for Acquisition'}
                                </span>
                            </div>
                            <p className='lightbox-meta'>
                                {currentArt.medium} &bull; {currentArt.dimensions}
                            </p>
                            <div className='lightbox-actions'>
                                {!currentArt.sold ? (
                                    <a
                                        href={createInquiryUrl(currentArt)}
                                        className='btn btn-inquire'
                                    >
                                        <FontAwesomeIcon icon={faEnvelope} className='me-2' />
                                        Inquire to Acquire This Piece
                                    </a>
                                ) : (
                                    <a
                                        href='mailto:carla@frecklesdesign.ca?subject=Commission%20Inquiry%20(Freckles%20Design)'
                                        className='btn btn-commission'
                                    >
                                        <FontAwesomeIcon icon={faEnvelope} className='me-2' />
                                        Inquire About a Custom Commission
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    );
}
