import React, { useState } from 'react';
import Modal from 'react-modal';
import { MDBCol, MDBRow } from 'mdb-react-ui-kit';
import artworks from '../data/artworks.json';

export default function Gallery() {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (event) => {
        setSelectedImage(event.target.src);
    };

    const handleModalClose = () => {
        setSelectedImage(null);
    };

    // Partition artworks into 6 pairs to maintain the exact 2-item-per-column desktop layout
    const columns = [];
    for (let i = 0; i < artworks.length; i += 2) {
        columns.push(artworks.slice(i, i + 2));
    }

    return (
        <div className='img-gallery'>
            <MDBRow>
                {columns.map((colArtworks, colIndex) => (
                    <MDBCol
                        key={colIndex}
                        lg={4}
                        md={colIndex % 3 === 0 ? 12 : undefined}
                        className='mb-4 mb-lg-0'
                    >
                        {colArtworks.map((art) => (
                            <div key={art.id} className='gallery-item mb-5'>
                                <img
                                    src={art.imageUrl}
                                    className='w-100 shadow-1-strong rounded mb-3'
                                    alt={art.alt}
                                    onClick={handleImageClick}
                                />
                                <div className='img-description'>
                                    <h3>{art.title}</h3>
                                    <p>
                                        {art.medium} - {art.dimensions}{' '}
                                        {art.sold && <strong className='sold'>(SOLD)</strong>}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </MDBCol>
                ))}
            </MDBRow>
            <Modal
                isOpen={selectedImage !== null}
                onRequestClose={handleModalClose}
                className='modal'
            >
                <img
                    src={selectedImage}
                    className='img-isOpen'
                    alt=''
                    onClick={handleModalClose}
                />
            </Modal>
        </div>
    );
}