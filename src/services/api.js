import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (limit = 20, offset = 0) => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
    const pokemonList = response.data.results;
    
    // Fetch details for each to show image/types in the grid
    const detailedList = await Promise.all(
      pokemonList.map(async (pokemon) => {
        const details = await fetchPokemonDetails(pokemon.name);
        return details;
      })
    );
    
    return {
      results: detailedList,
      next: response.data.next,
      previous: response.data.previous,
    };
  } catch (error) {
    console.error('Error fetching pokemon list:', error);
    throw error;
  }
};

export const fetchPokemonDetails = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for ${name}:`, error);
    throw error;
  }
};

export const fetchSpeciesStats = async (name) => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon-species/${name}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching species for ${name}:`, error);
    throw error;
  }
};

export const fetchEvolutionChain = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching evolution chain:', error);
    throw error;
  }
};

export const extractSpeciesNames = (chain) => {
  const species = [];
  const traverse = (node) => {
    species.push(node.species.name);
    if (node.evolves_to.length) {
      node.evolves_to.forEach(child => traverse(child));
    }
  };
  traverse(chain);
  return species;
};

export const fetchAllPokemon = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/pokemon?limit=10000&offset=0`);
    return response.data.results;
  } catch (error) {
    console.error('Error fetching all pokemon:', error);
    throw error;
  }
};
