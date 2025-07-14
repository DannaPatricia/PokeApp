<script setup>
import EvolutionService from '@/service/EvolutionService.js'
import { onMounted, ref, watchEffect } from 'vue'
import PokeApi from '@/service/PokeApi.js'
import PokeCard from '@/components/PokeCard.vue'

const props = defineProps({
    pokemonId: {
        required: true,
    },
    pokemonName: {
        required: true,
    }
})

// se decalran variables reactiovas para almacenar el array que contiene las evoluciones del pokemon
// y el data para almacenar los datos de las evoluciones
const evolutionsData = ref([])
const evolutions = ref([])

// una vez el componente se haya creado correctamente
onMounted(() => {
    watchEffect(() => {
        evolutionsData.value = []
        evolutions.value = []
        // se obtiene las evoluciones del pokemon dada la id pasado por props
        getPokemonEvolutions(props.pokemonId, props.pokemonName)
    })
})

async function getPokemonEvolutions(id, name) {
    try {
        const response = await EvolutionService.getEvolutions(id, name)
        // se guarda el array de evoluciones en la variable reactiva
        evolutions.value = response
        // se llama a la funcion que busca los datos de esa evolucion
        buscarDatosPokemon()
    } catch (error) {
        console.log(error)
    }
}

async function buscarDatosPokemon() {
    // llamamos a la api y se obtienen lso datos del pokemon
    try {
        let promisesResponse = []
        // se itera sobre el array que contiene los nombres de las evoluciones
        for (const evolution of evolutions.value) {
            // por cada iteracion se hace una llamada a la api para obtner sus datoss
            const response = await PokeApi.getPokemon(evolution)
            // se guardan los responses
            promisesResponse.push(response)
        }
        // se itera por cada response que, es un array de objetos, y se guarda en la variable reactiva
        const responses = await Promise.all(promisesResponse)
        for (const response of responses) {
            evolutionsData.value.push(response)
        }
    } catch (error) {
        alert("El pokemon que buscas no existe en evolutionsview")
    }
}

</script>

<template>
    <h2>Evolutions</h2>
    <div v-if="evolutionsData && evolutions" class="evolutions">
        <PokeCard v-for="pokemon in evolutionsData" :pokemonData="pokemon"></PokeCard>
    </div>
</template>

<style scoped>
* {
    scroll-behavior: smooth;
}

h2 {
    font-size: 2rem;
    font-weight: 600;
    color: #af4c4c;
    margin-bottom: 15px;
    text-transform: capitalize;
}

p {
    font-size: 1.5rem;
    font-weight: 600;
    color: #af4c4c;
    margin-bottom: 15px;
    text-transform: capitalize;
}

a {
    text-decoration: none;
}

.evolutions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 1em;
}

.poke-card {
    margin: auto;
    flex-basis: 200;
    background-color: #ffffff;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    width: 180px;
    height: 17em;
    text-align: center;
    transition: transform 0.3s ease;
}

.poke-card:hover {
    transform: scale(1.05);
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
}

.pokemon-image {
    display: flex;
    margin: auto;
    width: 7em;
    height: 8em;
    margin-top: 20px;
    transition: transform 0.3s ease;
}

.pokemon-image:hover {
    transform: scale(1.05);
}

.pokemon-type img {
    height: 1.5em;
    width: 7em;
}
</style>
