<script setup>
import { ref, onMounted, watchEffect } from 'vue'
// import PokeApi from '@/service/PokeApi.js'
import PokeApi from '@/service/PokeApi.js'

// obtengo el array de los nombres de los movimientos del PokeViewDetails.vue
const props = defineProps({
    abilityList: {
        required: true,
    }
})

// declaro la constante reactiva que se va a utilizar despues en el template
const abilities = ref([])
onMounted(() => {
    // se utiliza el watchEffect para que este se actualice cada que la variable reactive cambie
    watchEffect(() => {
        getAbilitiyData(props.abilityList)
    })
})

async function getAbilitiyData(abilityLisAux) {
    try {
        // Declarar un array para ir guardando cada dato
        let abilityDetails = []
        // Iterar y por cada movimiento obtener sus datos a través de la API, se gurdan los datos en el array
        for (const ability of abilityLisAux) {
            const response = await PokeApi.getPokemonAbility(ability)
            abilityDetails.push(response)
        }
        // Dar los valores al reactivo
        abilities.value = abilityDetails
    } catch (error) {
        console.log(error)
    }
}

</script>
<template>
    <div class="pokemon-details">
        <h2>Abilities</h2>
        <!-- se recorre el array de las estadisticas -->
        <div v-for="ability in abilities" class="stats-container">
            <div class="stat">
                <p class="nombreAtributo">{{ ability.name }} </p>
                <p>{{ ability.effect }}</p>
            </div>
        </div>
    </div>
</template>


<style scoped>
h2 {
    font-size: 2rem;
    font-weight: 600;
    color: #af4c4c;
    margin-bottom: 15px;
    text-transform: capitalize;
}

.stats-abilities {
    display: flex;
    flex-direction: row;
    gap: 2em;
    width: 100%;
}

.stats-container {
    display: flex;
    flex-direction: column;
    margin: 1em auto;
    gap: 0.5em;
    font-size: 1.1rem;
    color: #333;
    border-radius: 10px;
    width: 85%;
    height: auto;
    padding: 0 2em;
    justify-content: center;
}

.stat {
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

.pokemon-details {
    width: 90%;
    margin-bottom: 20px;
}

.nombreAtributo {
    text-transform: capitalize;
    font-weight: bold;
    color: rgb(6, 6, 90);
}
</style>