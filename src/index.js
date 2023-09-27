import { fetchBreeds, fetchCatByBreed } from './cat-api.js';
import SlimSelect from 'slim-select';
import { Report } from 'notiflix/build/notiflix-report-aio';

document.addEventListener('DOMContentLoaded', () => {
  const breedSelectElement = document.querySelector('select.breed-select');
  const loader = document.querySelector('#loader');
  const catInfoDiv = document.querySelector('.cat-info');
  const errorElement = document.querySelector('#error'); // Zmieniony identyfikator

  // Funkcja czyszcząca zawartość elementu DOM
  function clearElement(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  // Funkcja do tworzenia elementu <p> z pogrubionym tekstem i dodawania go do rodzica
  function addParagraph(parent, text) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = text;
    p.appendChild(strong);
    parent.appendChild(p);
  }

  // Funkcja do aktualizacji stanu ładowania
  function setLoadingState(isLoading) {
    if (isLoading) {
      breedSelectElement.classList.add('hidden');
      loader.classList.remove('hidden');
      catInfoDiv.classList.add('hidden');
      errorElement.classList.add('hidden');
    } else {
      breedSelectElement.classList.remove('hidden');
      loader.classList.add('hidden');
      catInfoDiv.classList.remove('hidden'); // Pokazujemy div.cat-info
    }
  }

  // Pobieranie i wypełnianie danych select.breed-select
  async function initialize() {
    try {
      setLoadingState(true); // Inicjalizacja stanu ładowania

      // Pobranie listy ras
      const breeds = await fetchBreeds();

      // Uzupełnienie selekta SlimSelect
      const breedOptions = breeds.map((breed) => ({
        value: breed.value,
        text: breed.label,
        style: 'color:#1b6162',
      }));
      breedOptions.unshift({
        'text': 'Select a breed',
        'value': 'empty',
        'style': 'color: #a95fde'
      });


      const breedSelect = new SlimSelect({
        select: '#breed-list',
        data: breedOptions,
        
      });

      // Uzupełnienie selekta HTML
      breeds.forEach((breed) => {
        const option = document.createElement('option');
        option.value = breed.value;
        option.textContent = breed.label;
        breedSelectElement.appendChild(option);
      });

      setLoadingState(false); // Wyłączenie stanu ładowania
    } catch (error) {
      console.error('An error occurred while retrieving information:', error);
      Report.failure('Oops! Something went wrong!', 'Try reloading the page! Click key F5', 'Close');
      errorElement.classList.remove('hidden'); // Komunikat o błędzie
      setLoadingState(false); // Wyłączenie stanu ładowania
    }
  }

  // Inicjalizacja stanu ładowania
  setLoadingState(true);

  // Obsługa wyboru rasy
  breedSelectElement.addEventListener('change', async () => {
    const selectedBreedId = breedSelectElement.value;

    // Aktualizacja stanu ładowania
    setLoadingState(true);

    // Wyczyszczenie zawartości div.cat-info
    clearElement(catInfoDiv);

    try {
      // Pobranie informacji o kocie wybranej rasy
      const catData = await fetchCatByBreed(selectedBreedId);

      if (catData && catData.url) {
        const catImage = document.createElement('img');
        catImage.src = catData.url;
        catImage.alt = 'Cat';
        catInfoDiv.appendChild(catImage);
      } else {
        catInfoDiv.textContent = 'Cat breeds are listed above.';
      }

      // Wyświetlenie informacji o rasie z pogrubionym tekstem
      if (catData && catData.breeds && catData.breeds.length > 0) {
        const breed = catData.breeds[0]; // Pobierz obiekt z informacjami o rasie
        addParagraph(catInfoDiv, `BREED: ${breed.name}`);
        addParagraph(catInfoDiv, `DESCRIPTION: ${breed.description}`);
        addParagraph(catInfoDiv, `TEMPERAMENT: ${breed.temperament}`);
      }

      // Wyłączenie stanu ładowania
      setLoadingState(false);
    } catch (error) {
      console.error('An error occurred while retrieving information', error);
      Report.failure('Oops! Something went wrong!', 'Try reloading the page! Click key F5', 'Close');
      errorElement.classList.remove('hidden'); // Pokaż komunikat o błędzie
      setLoadingState(false); // Wyłączenie stanu ładowania
    }
  });

  // Inicjalizacja
  initialize();
});
