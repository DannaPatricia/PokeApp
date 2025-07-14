<script setup>
import {ref, watchEffect, onMounted} from 'vue'
import { useRouter } from 'vue-router'
import PokeApi from '@/service/PokeApi.js'
import PokeViewMoves from '@/views/PokeViewMoves.vue'
import EvolutionsView from '@/views/EvolutionsView.vue'
import AbilitiesView from '@/views/PokeAbilitiesView.vue'

// se obtiene el id del pokemon que se ha pasado por parámetro desde el PokeCard.vue
const props = defineProps({
    pokemonName:{
        required:true,
    }
})

const pokemon = ref({})
const router = useRouter()
onMounted(() => {
    // se utiliza el watchEffect para que este se actualice cada que la variable reactive cambie
    watchEffect(() =>{
        getPokemonData(props.pokemonName)
    })

})

// Se obtienen los datos del pokemon a través de su id
async function getPokemonData(pokemonName){
    try{
        const response = await PokeApi.getPokemon(pokemonName)
        // otorgamos esos datos a la variable reactiva
        pokemon.value = response
        // Ejecutar la función de obtener los datos de los movimientos de dicho pokemon pasando por parametro los movimientos
    }catch(error){
        // si no se encuentra el pokemon manda a unapágina de error
        router.push({ 
            name: '404Resource', 
            // pasamos por parametro el mensaje que se desea mostrar, para poder especificar mas
            params: { resource: 'pokemon' } 
        }) 
    }
}

// Funcion para obtener la imagen del tipo del pokemon
function getTypeImage(type) {
    return `../../public/tipos/${type}.png`
}

// funcion que devuelve un color dependiendo del tipo que sea el pokemon
function getBackgroundColorPokemon(type) {
    const colors = {
        fire: '#e09e9e',
        water: '#808ec0',
        grass: '#a0d09b',
        electric: '#f4f3bf',
        poison: '#65536f',
        ice: '#adb8de',
        dragon: '#4f60e2',
        fairy: '#e8b5ed',
        steel: '#89898c',
        normal: '#626264',
        psychic: '#a86f93',
        rock: '#ae9d8e',
        bug: '#79856b',
        dark: '#535355',
        fighting: '#c5a370',
        ghost: '#7e6090',
        ground: '#8f7560',
        flying: '#9baeb8',
    }
    return colors[type]
}

// Esta funcion devuelve el estilo final dependiendo de si el pokemon es un tipo o dos
function getPokemonBackgroundStyle(types) {
// Se obtiene el color del primer tipo
  const type1 = types[0].type.name;
  const color1 = getBackgroundColorPokemon(type1);
//   se devuelve el estilo con el color del primer tipo si solo es de un tipo
  if (types.length === 1) {
    return {
      backgroundColor: color1
    };
  }
//   al no cumplir la condicion de un tipo se obtiene el segundo color dependiendo del segundo tipo
  const type2 = types[1].type.name;
  const color2 = getBackgroundColorPokemon(type2);
//   se devuelve la union de los dos colores con un gradient
  return {
    background: `linear-gradient(135deg, ${color1}, ${color2})`
  };
}
</script>

<template>
    <div v-if = "pokemon.name" class="pokemon-card-container poke-card">
        <h1>{{ pokemon.name.toUpperCase() }}</h1>
        <!-- llamada a la funcion que da estilos al fondo del div, este le pasa el array de tipos -->
        <div class="pokemon" :style = "getPokemonBackgroundStyle(pokemon.types)">
            <img :src="pokemon.sprites" 
            alt="{{ pokemon.name }}"
            class = "pokemon-image" />
        </div>
        <h2>Description</h2>
        <div class="pokemon-details">
            <div class="detail-item">
                <p class = "nombreAtributo">Type</p>
                <!-- recorremos el array de tipos -->
                <div v-for = "type in pokemon.types" class = "tipoPokemon">
                    <img :src="getTypeImage(type.type.name)" :alt="(type.type.name)"/>
                </div>
            </div>
            <div class="detail-item">
                <p class = "nombreAtributo">Height</p><p>{{ pokemon.height / 10}} m</p>
            </div>
            <div class="detail-item">
                <p class = "nombreAtributo">Weight</p><p>{{ pokemon.weight / 10}} kg</p>
            </div>
            <div class="detail-item">
                <p class = "nombreAtributo">Base Experience</p><p>{{ pokemon.base_experience }}</p>
            </div>
        </div>
        <div class="stats-abilities">
            <div class="pokemon-details">
                <h2>Stats</h2>
                <!-- se recorre el array de las estadisticas -->
                <div v-for = "stat in pokemon.stats" class = "stats-container">
                    <div class="stat">
                        <p class = "nombreAtributo">{{ stat.stat.name }} </p><p>{{ stat.base_stat}}</p>
                    </div>
                </div>
            </div>
            <AbilitiesView :abilityList = "pokemon.abilities"></AbilitiesView>
        </div>
        <EvolutionsView :pokemonId = "pokemon.id" :pokemonName = "pokemon.name"></EvolutionsView>
        <!-- se llama al template del componente pokeviewMoves y se parsa por parámetro el array de los nombres de los movimientos del pokemon -->
        <PokeViewMoves v-if = "pokemon.moves" :pokemonMoves = "pokemon.moves"></PokeViewMoves>
    </div>
</template>

<style scoped>
h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #af4c4c;
  margin-bottom: 15px;
  text-transform: capitalize;
}

.pokemon-details {
    width: 90%;
  margin-bottom: 20px;
}

.detail-item, .pokemon-moves{
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    text-align: left;
    font-size: 1.1rem;
    color: #414046;
    margin: 1em 2em;
    border-bottom: 1px solid #ccc;
}

.pokemon-moves .detail-item{
    height: 1.5em;
    border: none;
}

.detail-item img{
    display: flex;
    margin: auto 1em;
    border-radius: 2em;
    width: 4em;
    height: 1.5em;
}

.stats-abilities{
    display: flex;
    flex-direction: row;
    gap: 2em;
    width: 100%;
}

.stats-container{
    display: flex;
    flex-direction: column;
    margin: 1em auto;
    gap: 0.5em;
    font-size: 1.1rem;
    color: #333;
    border-radius: 10px;
    width: 60%;
    height: 2.5em;
    padding: 0 2em;
    justify-content: center;
}

.stat{
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    align-items: center;
    align-content: center;
}

/* para impares */
.stats-container:nth-child(odd) {
    background-color: #e4a6a6;
    border: 1px solid rgb(92, 69, 69);
}

/* Para pares */
.stats-container:nth-child(even) {
    background-color: #e7c8c8;
    border: 1px solid rgb(82, 58, 58);
}

.pokemon-card-container {
  display: flex;
  margin: auto;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 20px;
}

.poke-card {
  background-color: #ffffff;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  width: 60em;
  text-align: center;
  transition: transform 0.3s ease;
}

.poke-card h2 {
  font-size: 2rem;
  font-weight: 600;
  color: #af4c4c;
  margin-bottom: 15px;
  text-transform: capitalize;
}

.pokemon{
    display: flex;
    margin: 2em auto;
    width: 25em;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    transition: transform 0.3s ease;

}

.pokemon-image {
  display: flex;
  margin: 2em auto;
  width: 15em;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  transition: transform 0.3s ease;
}

.nombreAtributo{
    text-transform: capitalize;
    font-weight: bold;
    color: rgb(6, 6, 90);
}

.poke-card p {
  font-size: 1.1rem;
  margin: 8px 0;
}

.tipoPokemon{
    display: flex;
    flex-direction: row;
}

.tipoPokemon img{
    display: flex;
    margin: auto;
    height: 1.3em;
    width: 4em;
}

</style>