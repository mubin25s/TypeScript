import React from 'react';
import './Loader.css';

const Loader = () => {
    return (
        <div className="loader-container-flex">
            <div className="pokemon-spinner"></div>
            <p className="loading-text">LOADING POKÉDEX...</p>
        </div>
    );
};

export default Loader;
