<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import PokeApi from '@/service/PokeApi.js'

// declarampos el objeto vacio que contendra los datos del pokemon
const pokemonList = ref([])

// se obtiene el prop pasado por el padre para realizar la paginacion
const props = defineProps({
  page: {
    type: Number,
    default: 1
  }
})

// se declaran variables para la paginacion
const limit = 6
const isLastPage = ref(false)

onMounted(() =>{
    watchEffect (() =>{
        getPokemonList()
    })
})

// en este caso en principio se esperaba hacer un for y por cada pokemon llamara a la api y resolviera la promesa
// sin embargo esto resultaba poco eficiente, por ello interviene el Promise.all, esta funcion se encarga de recibir un array de promesas
// este junto al await se encargan de esperar a que todas las promeas se resuelvan o rechacen. La diferencia claves está en que al usar el
// promise.all todas las peticiones se realizan al mismo tiempo y se espera una sola vez a que todas terminen. Por ello finalmente devuelve
// un array con los datos de todas las promesas resuletas
async function getPokemonList(){
    try{
        // se marca el offset o desde que pagina se empezara a mostrar el listado
        const offset = (props.page - 1) * limit
        const response = await PokeApi.getPokemonList(limit, offset)
        // se guarda el lsitado de pokemon que devolvio la api
        const pokemonListAux = response.data
        // se inicializa un array de promesas en la que se guardaran las promesas que resuelva la api
        const promises = []
        for (const pokemonAux of pokemonListAux.results) {
            // guardo cada promesa
            const promise = PokeApi.getPokemon(pokemonAux.name)
            promises.push(promise)
        }
        // console.log(promises)
        // se declara un array de responses para guardar los datos de cada promesa resuelta
        const responsesData = []
        // obtenemos el array que devuelve el promise.all, son todos los datos de las promesas resueltas
        const responses = await Promise.all(promises)
        for (const response of responses) {
            // se guarda cada response.data o datos de cada promesa en el array
            responsesData.push(response)
        }
        // se guardan los datos en la constante reactiva
        pokemonList.value = responsesData
        // si la lista es menor al limit entoences es la ultima pagina
        isLastPage.value = pokemonListAux.length < limit
    }catch(error){
        console.log(error)
    }
}

// Funcion para obtener la imagen del tipo del pokemon
function getTypeImage(type) {
    return `../../public/tipos/${type}.png`
}
</script>

<template>
    <div class="pagination">
        <router-link
            v-if="page > 1"
            :to="{ name: 'PokeView', query: { page: props.page - 1 } }">⬅ 
        </router-link>
        <span>Page {{ page }}</span>
        <router-link
            v-if="!isLastPage"
            :to="{ name: 'PokeView', query: { page: props.page + 1 } }">
            ➡
        </router-link>
    </div>
    <div class="pokemon-card-container">
      <!-- se realiza por cada itereacion un enlace hacia los detalles de ese pokemon -->
          <RouterLink :to = "{name: 'PokeViewDetails', params: {pokemonName: pokemon.name}}"
          v-for="pokemon in pokemonList" :key="pokemon.name" class="poke-card">
            <p>{{ pokemon.name }}</p>
            <!-- recorremos el array de tipos -->
            <div v-for = "type in pokemon.types"  class = "pokemon-type">
                <img :src="getTypeImage(type.type.name)" :alt="(type.type.name)"/>
            </div>
            <img v-if="pokemon.sprites" 
            :src="pokemon.sprites" 
            alt="{{ pokemon.name }}"/>
          </RouterLink>    
    </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1em;
  margin: 2em 0;
}

a{
  text-decoration: none;
}
.pokemon-card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 20px;
  width: 75%;
  gap: 2em;
}

.poke-card {
    flex-basis: 200;
    flex-grow: 1;
    background-color: #ffffff;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    transition: transform 0.3s ease;
    text-transform: capitalize;
    width: 20em;
    height: 20em;
}

.poke-card img{
    width: 13em;
    height: 10em;
}

.poke-card:hover {
  transform: scale(1.05);
  box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
}

.poke-card p {
  font-size: 1.5rem;
  font-weight: 600;
  color: #af4c4c;
  margin-bottom: 15px;
  text-transform: capitalize;
}

.pokemon-image {
  display: flex;
  margin: auto;
  width: 15em;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  transition: transform 0.3s ease;
}

.pokemon-image:hover {
  transform: scale(1.05);
}

.pokemon-type img{
    height: 1.5em;
    width: 7em;
    margin-bottom: 1em;
}
</style>
