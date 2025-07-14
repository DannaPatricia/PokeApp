<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import MovesApi from '@/service/MovesApi.js'

// obtengo el array de los nombres de los movimientos del PokeViewDetails.vue
const props = defineProps({
    pokemonMoves: {
        required: true,
    }
})

// declaro la constante reactiva que se va a utilizar despues en el template
const moves = ref([])
// se decalra la reactive ishover para verficar si el mouse esta sobre el movimiento o no
const isHover = ref({})
onMounted(() => {
    // se utiliza el watchEffect para que este se actualice cada que la variable reactive cambie
    watchEffect(() => {
        getMoveData(props.pokemonMoves)
    })


})

async function getMoveData(movesAux) {
    try {
        // Declarar un array para ir guardando cada dato
        let moveDetails = []
        // Iterar y por cada movimiento obtener sus datos a través de la API, se gurdan los datos en el array
        for (const move of movesAux) {
            const response = await MovesApi.getPokemonMoves(move.move.name)
            moveDetails.push(response)
        }
        // Dar los valores al reactivo
        moves.value = moveDetails
    } catch (error) {
        console.log(error)
    }
}

// funciones que dependiendo del tipo y tipo de daño muestran una imagen u otra
function getDamageClassImage(damageClass) {
    return `/PokeApp/damageClass/${damageClass}.png`
}

function getTypeImage(type) {
    return `/PokeApp/tipos/${type}.png`
}

</script>
<template>
    <h2>Movements</h2>
    <div v-if="!moves.length">Loading moves...</div>
    <div v-else class="pokemon-moves">
        <!-- recorro el array de movimiento y sus datos -->
        <!-- si esta sobre el movimiento el hover pasa a tener el valor de su nombre -->
        <div class="moves" v-for="move in moves" :key="move.name" @mouseover="isHover = move.name"
            @mouseleave="isHover = null">
            <!-- estilos que se aplicamn si esta hover o no -->
            <div :style="{ display: isHover === move.name ? 'block' : 'none' }" class="description">
                <h3>Description</h3>
                <p>{{ move.effect }}</p>
            </div>

            <h3 class="nombreMovimiento">{{ move.name }}</h3>
            <div class="detail-item">
                <p class="nombreAtributo">Type </p>
                <img :src="getTypeImage(move.type.name)" :alt="(move.type.name)" />
            </div>
            <div class="detail-item">
                <p class="nombreAtributo">Class </p>
                <img :src="getDamageClassImage(move.damage_class.name)" :alt="(move.damage_class.name)" />
            </div>
            <div class="detail-item">
                <p class="nombreAtributo">PP </p>
                <p>{{ move.pp }}</p>
            </div>
            <div v-if="move.power" class="detail-item">
                <p class="nombreAtributo">Power </p>
                <p>{{ move.power }}</p>
            </div>
            <div v-if="move.accuracy" class="detail-item">
                <p class="nombreAtributo">Accuracy </p>
                <p>{{ move.accuracy }}</p>
            </div>
        </div>
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

.description {
    position: absolute;
    top: 0;
    height: 70%;
    width: 13.6em;
    right: 0em;
    background-color: rgba(99, 95, 95, 0.788);
    color: white;
    padding: 1em;
    border-radius: 0.5em;
    opacity: 0;
    transition: opacity 600ms ease;
}

.description:hover {
    opacity: 1;
}

.description p {
    display: flex;
    text-align: center;
    align-items: center;
    font-weight: bold;
}

.pokemon-details {
    width: 90%;
    margin-bottom: 20px;
}

.detail-item,
.pokemon-moves {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    text-align: left;
    font-size: 1.1rem;
    color: #414046;
    margin: 1em 2em;
    border-bottom: 1px solid #ccc;
}

.pokemon-moves .detail-item {
    height: 1.5em;
    border: none;
}

.detail-item img {
    display: flex;
    margin: auto 1em;
    border-radius: 2em;
    width: 4em;
    height: 1.5em;
}

.pokemon-moves {
    width: 90%;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1em;
    justify-content: center;
    padding: 1em 0;
}

.moves {
    position: relative;
    border-bottom: 1px solid #ccc;
    text-transform: capitalize;
    background-color: #dfd9d9;
    border: 1px solid #443b3b;
    border-radius: 5px;
    text-align: center;
    padding: 1em;
    transition: transform 0.3s ease;
}

.nombreMovimiento {
    font-size: 1.4em;
    font-weight: bold;
    color: rgb(41, 41, 65);
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

.nombreAtributo {
    text-transform: capitalize;
    font-weight: bold;
    color: rgb(6, 6, 90);
}

.poke-card p {
    font-size: 1.1rem;
    margin: 8px 0;
}

.tipoPokemon {
    display: flex;
    flex-direction: row;
}

.tipoPokemon img {
    display: flex;
    margin: auto;
    height: 1.3em;
    width: 4em;
}
</style>