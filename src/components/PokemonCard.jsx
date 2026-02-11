import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './PokemonCard.css';

const PokemonCard = ({ pokemon, index }) => {
    const { id, name, types, sprites } = pokemon;
    const image = sprites?.other['official-artwork']?.front_default || sprites.front_default;

    return (
        <Link to={`/pokemon/${name}`} className="card-link">
            <motion.div
                className={`pokemon-card type-${types[0].type.name}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
            >
                <div className="card-image-container">
                    <img src={image} alt={name} className="card-image" loading="lazy" />
                </div>
                <div className="card-content">
                    <h3 className="card-name">{name}</h3>
                    <div className="card-types">
                        {types.map((typeObj) => (
                            <span
                                key={typeObj.type.name}
                                className={`type-badge type-${typeObj.type.name}`}
                            >
                                {typeObj.type.name}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default PokemonCard;
