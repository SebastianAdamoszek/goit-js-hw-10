import { fetchBreeds, fetchCatByBreed } from './cat-api.js';

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
      catInfoDiv.classList.remove('hidden'); // Pokazujemy div.cat-info po zakończeniu ładowania
    }
  }

  // Inicjalizacja stanu ładowania
  setLoadingState(true);

  // Pobierz kolekcję ras i wypełnij select.breed-select opcjami
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

    // Aktualizacja stanu ładowania przy pobieraniu informacji o kocie
    setLoadingState(true);

    fetchCatByBreed(selectedBreedId)
      .then((catData) => {
        console.log('Odpowiedź od serwera API:', catData);

        // Wyświetlenie informacji o kocie (zdjęcie)
        if (catData && catData.url) {
          catInfoDiv.innerHTML = `
            <img src="${catData.url}" alt="Cat">
          `;
        } else {
          catInfoDiv.innerHTML = '<p>Brak informacji o tym kocie.</p>';
        }

        // Wyświetlenie informacji o rasie (jeśli dostępne)
        if (catData && catData.breeds && catData.breeds.length > 0) {
          catInfoDiv.innerHTML += `
            <p><strong>Rasa:</strong> ${catData.breeds[0].name}</p>
            <p><strong>Opis:</strong> ${catData.breeds[0].description}</p>
            <p><strong>Temperament:</strong> ${catData.breeds[0].temperament}</p>
          `;
        }

        // Wyłącz stan ładowania po zakończeniu żądania
        setLoadingState(false);
      })
      .catch((error) => {
        console.error('Wystąpił błąd podczas pobierania informacji o kocie:', error);
        errorElement.classList.remove('hidden'); // Wyświetl komunikat o błędzie
        setLoadingState(false); // Wyłącz stan ładowania po zakończeniu żądania
      });
  });
});
