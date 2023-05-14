import React, { useState } from 'react';
import Modal from 'react-modal';
import {
    // MDBContainer,
    MDBCol,
    MDBRow,
} from 'mdb-react-ui-kit';

export default function Gallery() {
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (event) => {
        setSelectedImage(event.target.src);
    };

    const handleModalClose = () => {
        setSelectedImage(null);
    };

    return (
        <div className='img-gallery'>
            <MDBRow>
                <MDBCol lg={4} md={12} className='mb-4 mb-lg-0'>
                    <div className='gallery-item mb-5'>
                        <img
                            src='https://res.cloudinary.com/dchkpwyce/image/upload/v1684030195/fernando_rzkj8q.png'
                            className='w-100 shadow-1-strong rounded mb-3'
                            alt='Fernando Pessoa, poeta português (Portuguese Poet). Acrylic technique, dimensions = 36in X 36in. Available for sale.'
                            onClick={handleImageClick}
                        />
                        <div className='img-description'>
                            <h3>Fernando Pessoa</h3>
                            <p>Poeta português (Portuguese Poet) - 36in X 36in</p>
                        </div>
                    </div>

                    <div className='gallery-item mb-5'>
                        <img
                            src='https://res.cloudinary.com/dchkpwyce/image/upload/v1684030193/acores_uei20r.png'
                            className='w-100 shadow-1-strong rounded mb-3'
                            alt='Açores - ilhéu de Vila França. Acrylic technique, dimensions = 36in X 36in. Available for sale.'
                            onClick={handleImageClick}
                        />
                        <div className='img-description'>
                            <h3>Açores - Ilhéu de Vila França</h3>
                            <p>36in X 36in</p>
                        </div>
                    </div>
                </MDBCol>

                <MDBCol lg={4} className='mb-4 mb-lg-0'>
                    <div className='gallery-item mb-5'>
                        <img
                            src='https://res.cloudinary.com/dchkpwyce/image/upload/v1684030196/nazare_lzpug7.png'
                            className='w-100 shadow-1-strong rounded mb-3'
                            alt='Nazarena - Praia da Nazaré (Nazaré beach). Acrylic technique, dimensions = 30in X 48in. Available for sale.'
                            onClick={handleImageClick}
                        />
                        <div className='img-description'>
                            <h3>Nazarena</h3>
                            <p>Praia da Nazaré (Nazaré beach) - 30in X 48in</p>
                        </div>
                    </div>

                    <div className='gallery-item mb-5'>
                        <img
                            src='https://res.cloudinary.com/dchkpwyce/image/upload/v1684030192/andorinhas_ep0xb5.png'
                            className='w-100 shadow-1-strong rounded mb-3'
                            alt='Andorinha (Swallow). Acrylic technique, dimensions = 36in X 36in. Available for sale.'
                            onClick={handleImageClick}
                        />
                        <div className='img-description'>
                            <h3>Andorinha</h3>
                            <p>Swallow - 36in X 36in</p>
                        </div>
                    </div>
                </MDBCol>

                <MDBCol lg={4} className='mb-4 mb-lg-0'>
                    <div className='gallery-item mb-5'>
                        <img
                            src='https://res.cloudinary.com/dchkpwyce/image/upload/v1684030196/sobreiro_szofnx.png'
                            className='w-100 shadow-1-strong rounded mb-3'
                            alt='Sobreiro do Alentejo (Alentejo cork oak). Acrylic technique, dimensions = 36in X 36in. Available for sale.'
                            onClick={handleImageClick}
                        />
                        <div className='img-description'>
                            <h3>Sobreiro do Alentejo</h3>
                            <p>(Alentejo cork oak) - 36in X 36in</p>
                        </div>
                    </div>

                    <div className='gallery-item mb-5'>
                        <img
                            src='https://res.cloudinary.com/dchkpwyce/image/upload/v1684030197/streetcar_kq6vxa.png'
                            className='w-100 shadow-1-strong rounded mb-3'
                            alt='Elétrico de Lisboa (Streetcar - Lisbon). Acrylic technique, dimensions = 30in X 48in. Available for sale.'
                            onClick={handleImageClick}
                        />
                        <div className='img-description'>
                            <h3>Elétrico de Lisboa</h3>
                            <p>(Streetcar - Lisbon) - 30in X 48in</p>
                        </div>
                    </div>
                </MDBCol>

                <MDBCol lg={4} md={12} className='mb-4 mb-lg-0'>
                    <div className='gallery-item mb-5'>
                        <img
                            src='https://res.cloudinary.com/dchkpwyce/image/upload/v1684030196/sardinhas_tty2s2.png'
                            className='w-100 shadow-1-strong rounded mb-3'
                            alt='Sardinhas portuguesas (Portuguese sardines). Acrylic technique, dimensions = 24in X 24in. Available for sale.'
                            onClick={handleImageClick}
                        />
                        <div className='img-description'>
                            <h3>Sardinhas</h3>
                            <p>(Sardines) - 24in X 24in</p>
                        </div>
                    </div>

                    <div className='gallery-item mb-5'>
                        <img
                            src='https://res.cloudinary.com/dchkpwyce/image/upload/v1684030193/fado_f6xdeh.png'
                            className='w-100 shadow-1-strong rounded mb-3'
                            alt='Noite de Fado (Fado night). Acrylic technique, dimensions = 36in X 48in. Available for sale.'
                            onClick={handleImageClick}
                        />
                        <div className='img-description'>
                            <h3>Noite de Fado</h3>
                            <p>(Fado night) - 36in X 48in</p>
                        </div>
                    </div>
                </MDBCol>

                <MDBCol lg={4} className='mb-4 mb-lg-0'>
                    <div className='gallery-item mb-5'>
                        <img
                            src='https://res.cloudinary.com/dchkpwyce/image/upload/v1684030193/immigrants_uueqbl.png'
                            className='w-100 shadow-1-strong rounded mb-3'
                            alt='Emigração (Portuguese emigration). Acrylic technique, dimensions = 30in X 36in. Available for sale.'
                            onClick={handleImageClick}
                        />
                        <div className='img-description'>
                            <h3>Emigração</h3>
                            <p>(Portuguese emigration) - 30in X 36in</p>
                        </div>
                    </div>

                    <div className='gallery-item mb-5'>
                        <img
                            src='https://res.cloudinary.com/dchkpwyce/image/upload/v1684030193/market_wfnqjt.png'
                            className='w-100 shadow-1-strong rounded mb-3'
                            alt='Peixaria Portuguesa (Portuguese fish market). Acrylic technique, dimensions = 36in X 36in. Available for sale.'
                            onClick={handleImageClick}
                        />
                        <div className='img-description'>
                            <h3>Peixaria Portuguesa</h3>
                            <p>(Portuguese fish market) - 36in X 36in</p>
                        </div>
                    </div>
                </MDBCol>

                <MDBCol lg={4} className='mb-4 mb-lg-0'>
                    <div className='gallery-item mb-5'>
                        <img
                            src='https://res.cloudinary.com/dchkpwyce/image/upload/v1684030193/descobrimento_dvjdbi.png'
                            className='w-100 shadow-1-strong rounded mb-3'
                            alt='Padrão dos Descobrimentos (Monument of the discoveries). Acrylic technique, dimensions = 36in X 36in. Available for sale.'
                            onClick={handleImageClick}
                        />
                        <div className='img-description'>
                            <h3>Padrão dos Descobrimentos</h3>
                            <p>(Monument of the discoveries) - 36in X 36in</p>
                        </div>
                    </div>

                    <div className='gallery-item mb-5'>
                        <img
                            src='https://res.cloudinary.com/dchkpwyce/image/upload/v1684030196/revolucao_yuf0a4.png'
                            className='w-100 shadow-1-strong rounded mb-3'
                            alt='Revolução de 25 de Abril (April 25 Revolution). Acrylic technique, dimensions = 36in X 48in. Available for sale.'
                            onClick={handleImageClick}
                        />
                        <div className='img-description'>
                            <h3>Revolução de 25 de Abril</h3>
                            <p>(April 25 Revolution) - 36in X 48in</p>
                        </div>
                    </div>
                </MDBCol>
            </MDBRow>
            <Modal
                isOpen={selectedImage !== null}
                onRequestClose={handleModalClose}
                className='modal'>
                <img src={selectedImage} className='img-isOpen' alt='' onClick={handleModalClose} />
            </Modal>
        </div>
    );
}