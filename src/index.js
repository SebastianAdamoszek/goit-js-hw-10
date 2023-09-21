import axios from "axios";
axios.defaults.headers.common["x-api-key"] = 'api_key=live_HXBK4uyPnCa2bPlC9MHzFcilVSbpGCWYlktY1sR2QHVsfeiZBbNbAYRClzpuleeq';

// Import funkcji fetchBreeds
import { fetchBreeds } from './cat-api.js';
import { fetchCatByBreed } from './cat-api.js';


document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = document.querySelector('select.breed-select');
  const loader = document.querySelector('.loader');
  const catInfoDiv = document.querySelector('.cat-info');
  const errorElement = document.querySelector('.error');

  // Funkcja do aktualizacji stanu ładowania
  function setLoadingState(isLoading) {
    if (isLoading) {
      breedSelect.classList.add('hidden');
      loader.classList.remove('hidden');
      catInfoDiv.classList.add('hidden');
      errorElement.classList.add('hidden');
    } else {
      breedSelect.classList.remove('hidden');
      loader.classList.add('hidden');
    }
  }

  // Pobierz kolekcję ras i wypełnij select.breed-select opcjami
  setLoadingState(true); // Włącz stan ładowania
  fetchBreeds()
    .then((breeds) => {
      breeds.forEach((breed) => {
        const option = document.createElement('option');
        option.value = breed.value;
        option.textContent = breed.label;
        breedSelect.appendChild(option);
      });
      setLoadingState(false); // Wyłącz stan ładowania po zakończeniu żądania
    })
    .catch((error) => {
      console.error('Wystąpił błąd podczas pobierania ras:', error);
      errorElement.classList.remove('hidden'); // Wyświetl komunikat o błędzie
      setLoadingState(false); // Wyłącz stan ładowania po zakończeniu żądania
    });

  // Obsługa wyboru rasy
  breedSelect.addEventListener('change', () => {
    const selectedBreedId = breedSelect.value;

    setLoadingState(true); // Włącz stan ładowania
    fetchCatByBreed(selectedBreedId)
      .then((catData) => {
        // Wyświetlenie informacji o kocie
        catInfoDiv.innerHTML = `
          <img src="${catData.url}" alt="Cat">
          <p><strong>Rasa:</strong> ${catData.breeds[0].name}</p>
          <p><strong>Opis:</strong> ${catData.breeds[0].description}</p>
          <p><strong>Temperament:</strong> ${catData.breeds[0].temperament}</p>
        `;
        setLoadingState(false); // Wyłącz stan ładowania po zakończeniu żądania
      })
      .catch((error) => {
        console.error('Wystąpił błąd podczas pobierania informacji o kocie:', error);
        errorElement.classList.remove('hidden'); // Wyświetl komunikat o błędzie
        setLoadingState(false); // Wyłącz stan ładowania po zakończeniu żądania
      });
  });
});

