import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPokemonDetails, fetchSpeciesStats, fetchEvolutionChain } from '../services/api';
import GenerationViewer from '../components/GenerationViewer';
import Loader from '../components/Loader';
import { ArrowLeft } from 'lucide-react';
import './PokemonDetail.css';

const PokemonDetail = () => {
    const { name } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [species, setSpecies] = useState(null);
    const [evolutionChainData, setEvolutionChainData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            console.log("Fetching data for:", name);
            setLoading(true);
            setError(null);
            try {
                const pokeData = await fetchPokemonDetails(name);
                console.log("Poke data loaded:", pokeData.name);
                setPokemon(pokeData);

                try {
                    const speciesData = await fetchSpeciesStats(pokeData.species.name);
                    setSpecies(speciesData);

                    if (speciesData.evolution_chain?.url) {
                        const evoData = await fetchEvolutionChain(speciesData.evolution_chain.url);
                        setEvolutionChainData(evoData);
                    }
                } catch (innerErr) {
                    console.warn("Evolution data failed to load", innerErr);
                }
            } catch (err) {
                console.error("Critical error in PokemonDetail:", err);
                setError(err.message || "Failed to load Pokémon");
            } finally {
                setLoading(false);
            }
        };
        getData();
    }, [name]);

    if (loading) {
        return (
            <div className="detail-container">
                <Loader />
            </div>
        );
    }

    if (error || !pokemon) {
        return (
            <div className="detail-container">
                <Link to="/" className="back-btn"><ArrowLeft /></Link>
                <div className="error-message-center">
                    <h2>{error || "Pokemon not found"}</h2>
                    <Link to="/" className="retry-btn">Back to Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="detail-container">
            <Link to="/" className="back-btn">
                <ArrowLeft />
            </Link>

            <div className="detail-card minimal-card">
                <GenerationViewer
                    initialPokemon={pokemon}
                    speciesData={species}
                    evolutionChain={evolutionChainData}
                />
            </div>
        </div>
    );
};

export default PokemonDetail;
