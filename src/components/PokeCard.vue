<script setup>
// se obtiene los datos del pokemon que se ha insertado en el buscador
const props = defineProps({
    pokemonData: {
        type: Object,
        required: true
    }
})

// Funcion para obtener la imagen del tipo del pokemon
function getTypeImage(type) {
    return `/PokeApp/tipos/${type}.png`
}
</script>

<template>
    <!-- se muestran datos y se realiaz un router link hacia PokeDetailsView, se pasa por parámetro el id del pokemon -->
    <!-- Recordatorio. se deberá relizar en el index.js una ruta nueva que redirija hacia PokeViewDetails.vue -->
    <RouterLink :to="{ name: 'PokeViewDetails', params: { pokemonName: props.pokemonData.name } }"
        v-if="props.pokemonData && props.pokemonData.name" class="pokemon-card-container">
        <div class="poke-card">
            <h3>{{ props.pokemonData.name }}</h3>
            <div v-for="type in pokemonData.types" class="pokemon-type">
                <img :src="getTypeImage(type.type.name)" :alt="(type.type.name)" />
            </div>
            <img v-if="props.pokemonData.sprites" :src="props.pokemonData.sprites" alt="{{ props.pokemonData.name }}"
                class="pokemon-image" />
        </div>
    </RouterLink>
</template>

<style scoped>
.mensaje {
    width: 90%;
    color: #ff6347;
    background-color: #fff3f3;
    border: 1px solid #ff6347;
}

h3 {
    font-size: 1.5em;
    font-weight: bold;
    color: #af4c4c;
    margin: 0.2em 0;
    text-transform: capitalize;
}

p {
    font-size: 1.5rem;
    font-weight: 600;
    color: #af4c4c;
    margin-bottom: 15px;
    text-transform: capitalize;
}

.poke-card {
    margin: 1em auto;
    flex-basis: 200;
    background-color: #ffffff;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    width: 180px;
    height: 16em;
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

.poke-card p {
    font-size: 1.1rem;
    color: #333;
    margin: 8px 0;
}


.pokemon-type img {
    height: 1.4em;
    width: 6em;
}
</style>