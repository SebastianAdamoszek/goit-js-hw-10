import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import SlimSelect from 'slim-select';
import { Report } from 'notiflix/build/notiflix-report-aio';

document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = new SlimSelect({
    select: '#breed-list',
    placeholder: 'Select a breed',
  });

  // Pobieranie do listy SlimSelect
  fetchBreeds()
    .then((breeds) => {
      const breedOptions = breeds.map((breed) => ({
        value: breed.value,
        text: breed.label,
      }));
      breedSelect.setData(breedOptions);
    })
    .catch((error) => {
      console.error('An error occurred while retrieving information:', error);
    });

  });
  
document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = document.querySelector('select.breed-select');
  const loader = document.querySelector('#loader');
  const catInfoDiv = document.querySelector('.cat-info');
  const errorElement = document.querySelector('#error');
  const refreshBtn = document.querySelector('.refresh-btn');

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
      catInfoDiv.classList.remove('hidden'); // Pokazujemy div.cat-info
    }
  }

  // Inicjalizacja stanu ładowania
  setLoadingState(true);

  // Pobieranie i  wypełnianie danych select.breed-select
  fetchBreeds()
    .then((breeds) => {
      breeds.forEach((breed) => {
        const option = document.createElement('option');
        option.value = breed.value;
        option.textContent = breed.label;
        breedSelect.appendChild(option);
      });
      setLoadingState(false); // Wyłącz stan ładowania
    })
    .catch((error) => {
      console.error('An error occurred while retrieving information:', error);
      // Notiflix
      Report.failure('Oops! Something went wrong!', 
                      'Try reloading the page! Click key F5',
                       'Close'
      )
      errorElement.classList.remove('hidden'); // Komunikat o błędzie
      setLoadingState(false); // Wyłączeni stanu ładowania
    });

  // Obsługa wyboru rasy
  breedSelect.addEventListener('change', () => {
    const selectedBreedId = breedSelect.value;

    // Aktualizacja stanu ładowania 
    setLoadingState(true);

    fetchCatByBreed(selectedBreedId)
      .then((catData) => {
        
        // Wyświetlenie zdjęcia kota
        if (catData && catData.url) {
          catInfoDiv.innerHTML = `
            <img src="${catData.url}" alt="Cat">
          `;
        } else {
          catInfoDiv.innerHTML = '<p>No information about this cat.</p>';
        }

      // Wyświetlenie informacji o rasie
if (catData && catData.breeds && catData.breeds.length > 0) {
  const breed = catData.breeds[0]; // Pobierz obiekt z informacjami o rasie

  catInfoDiv.innerHTML += `
    <p><strong>Breed:</strong> ${breed.name}</p>
    <p><strong>Description:</strong> ${breed.description}</p>
    <p><strong>Temperament:</strong> ${breed.temperament}</p>
  `;
  
} else {
  console.log('No information about breed.');
}
console.log('Reply from the server API:', catData);


        // Wyłączam stan ładowania
        setLoadingState(false);
      })
      .catch((error) => {
        console.error('An error occurred while retrieving information', error);
        errorElement.classList.remove('hidden'); // Pokaż komunikat o błędzie
        setLoadingState(false); // Wyłączam stan ładowania
      });
  });
});
