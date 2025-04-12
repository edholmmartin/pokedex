
// PokéDogDex – En React + TailwindCSS app med routing och README

import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./index.css"; // Tailwind should be configured here

function Home({ favorites, setFavorites }) {
  const [pokemon, setPokemon] = useState(null);
  const [dog, setDog] = useState(null);

  const fetchPokemon = async () => {
    const id = Math.floor(Math.random() * 151) + 1;
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    setPokemon({
      name: data.name,
      image: data.sprites.front_default,
    });
  };

  const fetchDog = async () => {
    const res = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await res.json();
    setDog({ image: data.message });
  };

  const handleGenerate = async () => {
    await Promise.all([fetchPokemon(), fetchDog()]);
  };

  const handleSaveFavorite = () => {
    if (!pokemon || !dog) return;
    const combo = {
      id: Date.now(),
      pokemon,
      dog,
      addedAt: new Date().toLocaleString(),
    };
    const updated = [...favorites, combo];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold text-center mb-8">PokéDogDex 🐶✨</h1>
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handleGenerate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow"
        >
          Slumpa Pokémon & Hund
        </button>
        <button
          onClick={handleSaveFavorite}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl shadow"
        >
          Spara Favorit
        </button>
      </div>

      {pokemon && dog && (
        <div className="flex justify-center items-center gap-8 bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="text-center">
            <img src={pokemon.image} alt={pokemon.name} className="w-32 h-32 mx-auto" />
            <p className="capitalize mt-2 font-semibold">{pokemon.name}</p>
          </div>
          <div className="text-center">
            <img src={dog.image} alt="dog" className="w-32 h-32 object-cover rounded-lg" />
            <p className="mt-2 italic text-gray-500">Hundkompis</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Favorites({ favorites, setFavorites }) {
  const handleRemove = (id) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">⭐ Favoriter</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {favorites.map((fav) => (
          <div key={fav.id} className="bg-white p-4 rounded-xl shadow">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium capitalize">{fav.pokemon.name}</p>
              <button
                onClick={() => handleRemove(fav.id)}
                className="text-red-500 hover:underline text-sm"
              >
                Ta bort
              </button>
            </div>
            <div className="flex gap-4 items-center">
              <img src={fav.pokemon.image} alt={fav.pokemon.name} className="w-16 h-16" />
              <img src={fav.dog.image} alt="dog" className="w-16 h-16 rounded-md" />
            </div>
            <p className="text-xs text-gray-400 mt-2">Sparad: {fav.addedAt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-r from-indigo-200 to-pink-100">
        <nav className="p-4 bg-white shadow flex justify-center gap-6">
          <Link to="/" className="text-blue-700 font-semibold">Start</Link>
          <Link to="/favorites" className="text-blue-700 font-semibold">Favoriter</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home favorites={favorites} setFavorites={setFavorites} />} />
          <Route path="/favorites" element={<Favorites favorites={favorites} setFavorites={setFavorites} />} />
        </Routes>
      </div>
    </Router>
  );
}
