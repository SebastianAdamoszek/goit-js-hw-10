import axios from "axios";
axios.defaults.headers.common["x-api-key"] = 'api_key=live_HXBK4uyPnCa2bPlC9MHzFcilVSbpGCWYlktY1sR2QHVsfeiZBbNbAYRClzpuleeq';

export function fetchBreeds() {
    return axios.get('https://api.thecatapi.com/v1/breeds')
      .then((response) => {
        // Przetwarzanie odpowiedzi i tworzenie tablicy ras
        const breeds = response.data.map((breed) => ({
          value: breed.id,
          label: breed.name,
        }));
        return breeds;
      })
      .catch((error) => {
        throw error; // Rzucenie błędu w przypadku niepowodzenia żądania
      });
  }



// // Funkcja do pobierania informacji o kocie na podstawie identyfikatora rasy
// function fetchCatByBreed(breedId) {
//     return axios.get(`https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}`)
//       .then((response) => {
//         // Zwróć całą tablicę kotów
//         return response.data;
//       })
//       .catch((error) => {
//         throw error; // Rzucenie błędu w przypadku niepowodzenia żądania
//       });
//   }
  
//   module.exports = { fetchCatByBreed };
  
  