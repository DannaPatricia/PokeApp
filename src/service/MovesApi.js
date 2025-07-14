import axios from 'axios';

const PokeApi = axios.create({
  baseURL: 'https://pokeapi.co/api/v2/',
  withCredentials: false,
  headers: {
    // se indica que la info recibida y la que se vaya a enviar por post sera en formato JSON
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

// localStorage.clear()
let pokemonMovesCache = JSON.parse(localStorage.getItem('pokemon-moves')) || []

export default {
  async getPokemonMoves(moveName) {
    try {
      pokemonMovesCache = JSON.parse(localStorage.getItem('pokemon-moves')) || []
      //  se busca el movimiento en el cache
      let movesCache = pokemonMovesCache.find(move => move.name.toLowerCase() === moveName.toLowerCase());
      //  si lo encuentra devuelve el objeto que se guardó anteriormente
      if (movesCache) {
        console.log('encontrado movimientos' + movesCache)
        movesCache.timeout = Date.now()
        movesCache.callingTimes += 1
        localStorage.setItem('pokemon-moves', JSON.stringify(pokemonMovesCache))
        return movesCache;
      }

       // debido a que el almacenamiento es limitado, de 5MB, por cada dos páginas se eliminará el contenido de la cache
       if (pokemonMovesCache.length >= 50) {
          // se ordena la cache de menor a mayor en base a la propiedad callingTimes
          pokemonMovesCache.sort((a, b) => a.callingTimes - b.callingTimes);
          pokemonMovesCache.shift()
      }

      // si el pokemon no esta lo guarda en el cache para evitar llamadas repetidas a la api
      let response = await PokeApi.get('move/' + moveName)
      let moveData = response.data
      let moveDescription = moveData.flavor_text_entries.find(move => move.language.name === 'en')

      // se guarda el nuevo objeto con los datos del pokemon
      let move = {
        name: moveData.name,
        accuracy: moveData.accuracy,
        power: moveData.power,
        pp: moveData.pp,
        type: moveData.type,
        damage_class: moveData.damage_class,
        effect: moveDescription.flavor_text,
        timeout: Date.now(),
        callingTimes: 1
      }

      // se guarda en el array
      pokemonMovesCache.unshift(move)
      // se guarda en la cache el array con el nuevo objeto ya insertado, debido a que el localStorage solo puede almacenar strings
      // es necesario pasear el objeto al string
      localStorage.setItem('pokemon-moves', JSON.stringify(pokemonMovesCache))
      // por último se devuelve el objeto pokemon a los componentes
      return move;
    } catch (error) {
      console.log(error)
    }
  },
}
