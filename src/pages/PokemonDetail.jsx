import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPokemonDetails, fetchSpeciesStats, fetchEvolutionChain } from '../services/api';
import EvolutionChain from '../components/EvolutionChain'; // Keeping for reference or removal
import GenerationViewer from '../components/GenerationViewer';
import Loader from '../components/Loader';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import './PokemonDetail.css';

const PokemonDetail = () => {
    const { name } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [species, setSpecies] = useState(null);
    const [evolutionChainData, setEvolutionChainData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const pokeData = await fetchPokemonDetails(name);
                setPokemon(pokeData);
                const speciesData = await fetchSpeciesStats(pokeData.species.name);
                setSpecies(speciesData);
                const evoData = await fetchEvolutionChain(speciesData.evolution_chain.url);
                setEvolutionChainData(evoData);
            } catch (error) {
                console.error("Error loading detail", error);
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [name]);

    if (loading) return <div className="detail-loader"><Loader /></div>;
    if (!pokemon) return <div className="error">Pokemon not found</div>;

    const { id, types, sprites, stats, height, weight, abilities } = pokemon;
    const image = sprites?.other['official-artwork']?.front_default || sprites.front_default;
    const description = species?.flavor_text_entries?.find(entry => entry.language.name === 'en')?.flavor_text.replace(/\f/g, ' ');

    return (
        <div className={`detail-container type-bg-${types[0].type.name}`}>
            <Link to="/" className="back-btn">
                <ArrowLeft />
            </Link>

            <motion.div
                className="detail-card minimal-card"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {species && evolutionChainData && (
                    <GenerationViewer
                        initialPokemon={pokemon}
                        speciesData={species}
                        evolutionChain={evolutionChainData}
                    />
                )}
            </motion.div>
        </div>
    );
};

export default PokemonDetail;
