import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import './EvolutionChain.css';

const EvolutionChain = ({ speciesUrl }) => {
    const [evolutionData, setEvolutionData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvo = async () => {
            try {
                const speciesRes = await axios.get(speciesUrl);
                const evoUrl = speciesRes.data.evolution_chain.url;
                const evoRes = await axios.get(evoUrl);
                setEvolutionData(evoRes.data.chain);
            } catch (err) {
                console.error("Evolution fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        if (speciesUrl) fetchEvo();
    }, [speciesUrl]);

    const getEvolutionStages = (chainNode) => {
        let stages = [];

        const traverse = (node, level) => {
            if (!stages[level]) stages[level] = [];
            stages[level].push(node.species);

            if (node.evolves_to && node.evolves_to.length > 0) {
                node.evolves_to.forEach(child => traverse(child, level + 1));
            }
        };

        if (chainNode) traverse(chainNode, 0);
        return stages;
    };

    if (loading) return <div className="evo-loader">Loading Evolution...</div>;
    if (!evolutionData) return null;

    const stages = getEvolutionStages(evolutionData);

    return (
        <div className="evolution-container">
            <h3 className="evo-title">Evolution Chain</h3>
            <div className="evo-stages">
                {stages.map((stage, idx) => (
                    <div key={idx} className="evo-stage">
                        {/* Arrow between stages */}
                        {idx > 0 && <div className="evo-arrow">↓</div>}

                        <div className="evo-row">
                            {stage.map((poke) => {
                                // We need image for each pokemon in the chain logic
                                // Image URL: https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png
                                const id = poke.url.split('/').filter(Boolean).pop();
                                const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

                                return (
                                    <Link to={`/pokemon/${poke.name}`} key={poke.name} className="evo-card-link">
                                        <motion.div
                                            className="evo-card"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <img src={image} alt={poke.name} className="evo-img" />
                                            <span className="evo-name">{poke.name}</span>
                                        </motion.div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EvolutionChain;
