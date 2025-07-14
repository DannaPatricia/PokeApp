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
let pokemonCaracteristisCache = JSON.parse(localStorage.getItem('pokemon')) || []
let pokemonAbilitiesCache = JSON.parse(localStorage.getItem('pokemon-abilities')) || []

export default {
  async getPokemon(pokemonName) {
    try {
      console.log('llamada a pokemon' + pokemonName)
      // se obtienen la cache actualizada
      pokemonCaracteristisCache = JSON.parse(localStorage.getItem('pokemon')) || []
      //  se busca al pokemon en el cache
      let pokemonCache = pokemonCaracteristisCache.find(pokemon => pokemon.name.toLowerCase() === pokemonName.toLowerCase())
      //  si lo encuentra devuelve el objeto que se guardó anteriormente
      if (pokemonCache) {
        console.log('pokemon encontrado en cache ' + pokemonCache.name)
        pokemonCache.timeout = Date.now()
        pokemonCache.callingTimes += 1
        localStorage.setItem('pokemon', JSON.stringify(pokemonCaracteristisCache))
        return pokemonCache;
      }

      // antes de insertar un elemento nuevo ,primero se eliminará el de menos prioridad, o el que se ha consultado menos
      // debido a que el almacenamiento es limitado, de 5MB, por cada dos páginas se eliminará el contenido de la cache
      if (pokemonCaracteristisCache.length > 12) {
        while(pokemonCaracteristisCache.length > 6){
        // se ordena la cache de menor a mayor en base a la propiedad callingTimes 
        pokemonCaracteristisCache.sort((a, b) => a.callingTimes - b.callingTimes)
        pokemonCaracteristisCache.shift()
        }
        console.log(pokemonCaracteristisCache.length)

      }
      
      // si el pokemon no esta lo guarda en el cache para evitar llamadas repetidas a la api
      let response = await PokeApi.get('pokemon/' + pokemonName);
      let pokemonData = response.data
      let abilitiesArray = pokemonData.abilities.map(ability => ability.ability.name)
      // se guarda el nuevo objeto con los datos del pokemon
      let pokemon = {
        name: pokemonData.name,
        id: pokemonData.id,
        types: pokemonData.types,
        height: pokemonData.height,
        weight: pokemonData.weight,
        stats: pokemonData.stats,
        abilities: abilitiesArray,
        moves: pokemonData.moves,
        sprites: pokemonData.sprites.other.showdown.front_default,
        timeout: Date.now(),
        callingTimes: 1
      }

      // se guarda en el array
      pokemonCaracteristisCache.unshift(pokemon)
      // se guarda en la cache el array con el nuevo objeto ya insertado, debido a que el localStorage solo puede almacenar strings
      // es necesario pasear el objeto al string
      localStorage.setItem('pokemon', JSON.stringify(pokemonCaracteristisCache))
      // por último se devuelve el objeto pokemon a los componentes
      return pokemon;
    } catch (error) {
      console.log(error)
    }
  },

  async getPokemonAbility(abilitieName) {
    try {
      // se obtiene la cache
      pokemonAbilitiesCache = JSON.parse(localStorage.getItem('pokemon-abilities')) || []
      // se verifica si la ahbilidad esta en cache
      let abilityCache = pokemonAbilitiesCache.find(ability => ability.name.toLowerCase() === abilitieName.toLowerCase())
      if(abilityCache) {
        console.log('Ability encontrado en cache ' + abilityCache.name)
        abilityCache.timeout = Date.now()
        abilityCache.callingTimes += 1
        localStorage.setItem('pokemon-abilities', JSON.stringify(pokemonAbilitiesCache))
        return abilityCache
      }
      // caso contrario se hace unapeticiona la api
      let response = await PokeApi.get('ability/' + abilitieName)
      let abilityData = response.data
      let abilityDescription = abilityData.flavor_text_entries.find(ability => ability.language.name === 'en')

      // se crea un nuevo objeto que se guardará en el cache
       let ability = {
         name: abilityData.name,
         effect: abilityDescription.flavor_text,
         timeout: Date.now(),
         callingTimes: 1
      }

      pokemonAbilitiesCache.push(ability)
      localStorage.setItem('pokemon-abilities', JSON.stringify(pokemonAbilitiesCache))
      return ability
    } catch (error) {
      console.log(error)
      
    }
  },

  // funcion pokelist para listar los pokemon dados un limit y un offset o elementos que saltará
  getPokemonList(limit, offset) {
    return PokeApi.get(`pokemon?limit=${limit}&offset=${offset}`)
  },
}
