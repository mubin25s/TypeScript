import React, { useState, useEffect } from 'react';
import { fetchAllPokemon, fetchPokemonDetails } from '../services/api';
import PokemonCard from '../components/PokemonCard';
import SkeletonCard from '../components/SkeletonCard';
import Loader from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import './Home.css';
import { Search, Filter } from 'lucide-react';

const POKEMON_TYPES = [
    'all', 'grass', 'fire', 'water', 'bug', 'normal', 'poison', 'electric',
    'ground', 'fairy', 'fighting', 'psychic', 'rock', 'ghost', 'ice',
    'dragon', 'dark', 'steel', 'flying'
];

const Home = () => {
    const [allPokemon, setAllPokemon] = useState([]);
    const [displayedList, setDisplayedList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(20);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputBuffer, setInputBuffer] = useState('');
    const [selectedType, setSelectedType] = useState('all');

    // Initial Fetch of ALL names
    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            try {
                const data = await fetchAllPokemon();
                setAllPokemon(data);
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
            setLimit(20);
        }, 500);
        return () => clearTimeout(timer);
    }, [inputBuffer]);

    // Update Display List based on filter + limit + type
    useEffect(() => {
        if (allPokemon.length === 0) return;

        const updateDisplay = async () => {
            setLoading(true);

            let filtered = allPokemon.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            // Fetch details for initial filtering by type if needed
            // This is tricky because we only have names initially.
            // For a smoother experience, we'll fetch details as we scroll
            // but for type filtering we might need more.
            // Optimization: If a type is selected, we filter by that type.
            // API limitation: Filtering by type requires a different endpoint or fetching all details.
            // Let's keep it simple: search and limit for now, and only show type badges.

            const slice = filtered.slice(0, limit);

            try {
                const details = await Promise.all(
                    slice.map(p => fetchPokemonDetails(p.name))
                );

                // Client-side type filter
                const typeFiltered = selectedType === 'all'
                    ? details
                    : details.filter(p => p.types.some(t => t.type.name === selectedType));

                setDisplayedList(typeFiltered);
            } catch (err) {
                console.error("Error fetching details subset", err);
            } finally {
                setLoading(false);
            }
        };

        updateDisplay();
    }, [searchTerm, limit, allPokemon, selectedType]);

    const handleSearch = (e) => {
        setInputBuffer(e.target.value);
    };

    const loadMore = () => {
        setLimit(prev => prev + 20);
    };

    const hasMore = () => {
        if (allPokemon.length === 0) return false;
        const totalMatches = allPokemon.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        ).length;
        return limit < totalMatches;
    };

    return (
        <motion.div
            className="home-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <header className="header">
                <motion.h1
                    className="title"
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    Pokédex
                </motion.h1>

                <div className="search-and-filter">
                    <div className="search-bar">
                        <Search size={20} color="#888" />
                        <input
                            type="text"
                            placeholder="Search Pokemon..."
                            value={inputBuffer}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="type-filters-scroll">
                        {POKEMON_TYPES.map(type => (
                            <button
                                key={type}
                                className={`type-filter-btn ${selectedType === type ? 'active' : ''} type-color-${type}`}
                                onClick={() => {
                                    setSelectedType(type);
                                    setLimit(20);
                                }}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            <div className="pokemon-grid">
                <AnimatePresence mode='popLayout'>
                    {displayedList.map((pokemon, index) => (
                        <motion.div
                            key={pokemon.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3, delay: index % 10 * 0.05 }}
                        >
                            <PokemonCard pokemon={pokemon} index={index} />
                        </motion.div>
                    ))}

                    {loading && Array.from({ length: 8 }).map((_, i) => (
                        <SkeletonCard key={`skeleton-${i}`} />
                    ))}
                </AnimatePresence>
            </div>

            {!loading && hasMore() && (
                <div className="load-more-container">
                    <button className="load-more-btn" onClick={loadMore}>
                        Load More
                    </button>
                </div>
            )}

            {!loading && displayedList.length === 0 && (
                <div className="no-results">No Pokémon match your filters.</div>
            )}
        </motion.div>
    );
};

export default Home;
