<script setup>
import { ref } from 'vue'

// definimos el emit que usara el evento personalizado find-pokemon
const emit = defineEmits(['find-pokemon'])
// establecemos el nombre del pokemon como una variable reactiva o cambiante
const pokemonName = ref('')

function onSubmit() {
    if(pokemonName.value.trim() === ''){
        alert('Inserte nombre del Pokémon')
        return
    }
    // emitimos el evento con el nombre del pokemon que se busca por parámetro, este va al PokeView.vue
    emit('find-pokemon', pokemonName.value)
}
</script>

<template>
    <h1>Poke app</h1>
    <h2>Find your favourite pokemon!</h2>
    <!-- definimos el  metodo al hacer submit-->
    <form class = "formulario" @submit.prevent = "onSubmit">
        <input type="text" id="pokemonName" v-model = "pokemonName" placeholder = "Pokemon name here...">
        <button type="submit">Find pokemon</button>
    </form>
</template>

<style scoped>
h1{
    text-align: center;
    color: #af4c4c;
    font-size: 3rem;
    margin-top: 20px;
    font-family: 'Arial', sans-serif;
}

h2{color: #af4c4c;}

.formulario {
    margin: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    padding: 20px;
    background-color: #f4f4f4;
    border: 1px solid #7a2525;
    border-radius: 10px;
    width: 50%;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
}

input[type="text"] {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.3s;
}

input[type="text"]:focus {
    border-color: #af4c4c;
}

button {
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #af4c4c;
    color: white;
    font-size: 1rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #a04545;
}

.formulario input, .formulario button {
    margin-bottom: 15px;
}</style>