import React, { useState, useEffect } from 'react';
import { fetchAllPokemon, fetchPokemonDetails } from '../services/api';
import PokemonCard from '../components/PokemonCard';
import Loader from '../components/Loader';
import Pokeball from '../components/Pokeball';
import { motion } from 'framer-motion';
import './Home.css';
import { Search } from 'lucide-react';

const Home = () => {
    const [allPokemon, setAllPokemon] = useState([]);
    const [displayedList, setDisplayedList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputBuffer, setInputBuffer] = useState('');

    // Initial Fetch of ALL names
    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            try {
                const data = await fetchAllPokemon();
                setAllPokemon(data);
                // Initial display logic will be handled by the next effect
            } catch (error) {
                console.error("Failed to load pokemon list", error);
            }
        };
        loadAll();
    }, []);

    // Debounce Search Input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(inputBuffer);
            setLimit(20); // Reset limit on search change
        }, 500);
        return () => clearTimeout(timer);
    }, [inputBuffer]);

    // Update Display List based on filter + limit
    useEffect(() => {
        if (allPokemon.length === 0) return;

        const updateDisplay = async () => {
            setLoading(true);
            const filtered = allPokemon.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            const slice = filtered.slice(0, limit);

            // Check if we need to fetch details or if we can use cached/existing (not implemented here for simplicity, always fetching is safer for accuracy but maybe slower, let's optimize if needed)
            // Actually, the browser caches GET requests, so re-fetching same URLs is fast.
            try {
                const details = await Promise.all(
                    slice.map(p => fetchPokemonDetails(p.name))
                );
                setDisplayedList(details);
            } catch (err) {
                console.error("Error fetching details subset", err);
            } finally {
                setLoading(false);
            }
        };

        updateDisplay();
    }, [searchTerm, limit, allPokemon]);

    const handleSearch = (e) => {
        setInputBuffer(e.target.value);
    };

    const loadMore = () => {
        setLimit(prev => prev + 20);
    };

    const hasMore = () => {
        // Calculate total matches
        if (allPokemon.length === 0) return false;
        const totalMatches = allPokemon.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).length;
        return limit < totalMatches;
    };

    return (
        <div className="home-container">
            <header className="header">
                <h1 className="title">Pokédex</h1>
                <div className="search-bar">
                    <Search size={20} color="#888" />
                    <input
                        type="text"
                        placeholder="Search all 1000+ Pokémon..."
                        value={inputBuffer}
                        onChange={handleSearch}
                    />
                </div>
            </header>

            <div className="pokemon-grid">
                {displayedList.map((pokemon, index) => (
                    <PokemonCard key={`${pokemon.id}-${index}`} pokemon={pokemon} index={index} />
                ))}
            </div>

            {loading && <div className="loader-container"><Loader /></div>}

            {!loading && hasMore() && (
                <div className="load-more-container">
                    <button className="load-more-btn" onClick={loadMore}>
                        Load More Pokémon
                    </button>
                </div>
            )}

            {!loading && displayedList.length === 0 && (
                <div className="no-results">No Pokémon found.</div>
            )}
        </div>
    );
};

export default Home;
