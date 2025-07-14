import axios from 'axios';

const EvolutionService = axios.create({
    baseURL: 'https://pokeapi.co/api/v2/',
    withCredentials: false,
    headers: {
        // se indica que la info recibida y la que se vaya a enviar por post sera en formato JSON
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})
localStorage.clear()

let evolutionCache = JSON.parse(localStorage.getItem('evolution-cache')) || []

export default {
    async getEvolutions(id, name) {
        try {
            // se obtiene la cahce eactualizada
            evolutionCache = JSON.parse(localStorage.getItem('evolution-cache')) || []
            // se busca el nombre del pokemon entre los diferentes arrays de evoluciones que tiene la cache
            let chainCache = evolutionCache.find(evolution => evolution.evolutions.includes(name))
            if (chainCache) {
                console.log('Cadena evolutiva encontrada en cache ' + chainCache.evolutions)
                chainCache.timeout = Date.now()
                chainCache.callingTimes = chainCache.callingTimes + 1
                // se actualiza el cache
                localStorage.setItem('evolution-cache', JSON.stringify(evolutionCache))
                return chainCache.evolutions
            }

            // antes de insertar un elemento nuevo ,primero se eliminará el de menos prioridad, o el que se ha consultado menos
            // debido a que el almacenamiento es limitado, de 5MB, por cada dos páginas se eliminará el contenido de la cache
            if (evolutionCache.length === 12) {
                // se ordena la cache de menor a mayor en base a la propiedad callingTimes
                evolutionCache.sort((a, b) => a.callingTimes - b.callingTimes)
                evolutionCache.shift()
            }

            // si no se ha encontrado el nombre en la cache se realiza una llamada a la api
            const speciesResponse = await EvolutionService.get(`pokemon-species/${id}`)
            // se obtiene la url de la evolution chain
            let evolutionChainUrl = speciesResponse.data.evolution_chain.url
            // se hace un replace para obtner la ruta relativa y poder aprovechar la url base
            evolutionChainUrl = evolutionChainUrl.replace('https://pokeapi.co/api/v2/', '')
            // se hace una llamada a la api con la url extraida de la cadena evolutiva
            const evolutionResponse = await EvolutionService.get(evolutionChainUrl)
            // se hace uso de una funcion que procesa la cadena evolutiva
            let evolutionsAux = processEvolutionChain(evolutionResponse.data.chain)
            // se guarda el array devuelto en un objeto que se añadira a la cache
            let evolutions = {
                name: name,
                evolutions: evolutionsAux,
                timeout: Date.now(),
                callingTimes: 1
            }
            evolutionCache.push(evolutions)
            localStorage.setItem('evolution-cache', JSON.stringify(evolutionCache))
            // se regresa la cadena evolutiva
            return evolutions.evolutions
        } catch (error) {
            console.log('Error al obtener cadena evolutiva' + error)
        }
        return EvolutionService.get(`pokemon-species/${id}`)
    }
}

// dado que dentro de una cadena evolutiva, si hay evolucion, existe otra cadena evolutiva, por tanto se iterarán sobre las cadenas
function processEvolutionChain(chain) {
    let evolutions = []
    // se declara la cadena evolutiva actual en un array que ira almacenando cada cadena evolutiva
    let chains = [chain]
    while (chains.length > 0) {
        // se obtiene el primer elemento para procesar sus evoluciones, el primer elemento ya que hay pokemon que tienen mas de una
        // evolucion final por ejemplo
        let currentChain = chains.shift()
        // ese elemento se añade al array de evoluciones
        evolutions.push(currentChain.species.name);
        // si dicho elemento tiene evoluciones entonces se iterara sobre este y la cadena evolutiva se guardara en el array de cadenas
        if (currentChain.evolves_to && currentChain.evolves_to.length > 0) {
            currentChain.evolves_to.forEach(evolvesChain => {
                chains.push(evolvesChain)
            });
        }
    }
    return evolutions
}