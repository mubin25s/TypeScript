import React from 'react';
import './Pokeball.css';

const Pokeball = () => {
    return (
        <div className="pokeball">
            <div className="pokeball__upper"></div>
            <div className="pokeball__lower"></div>
            <div className="pokeball__center">
                <div className="pokeball__center-inner"></div>
            </div>
        </div>
    );
};

export default Pokeball;
