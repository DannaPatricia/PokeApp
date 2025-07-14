<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import PokeApi from '@/service/PokeApi.js'
import PokeCard from '@/components/PokeCard.vue'
import PokeForm from '@/components/PokeForm.vue'
import PokeListView from '@/views/PokeListView.vue'

// obtengo el prop pasado por el route para pasarselo al hasInjectionContext, en este caso PokemonViewList.vue
const props = defineProps({
  page: {
    type: Number,
    default: 1
  }
})

// declarampos el objeto vacio que contendra los datos del pokemon
const pokemonData = ref({})
const router = useRouter()

async function buscarDatosPokemon(nombrePokemon) {
  // llamamos a la api y se obtienen lso datos del pokemon
  try {
    const response = await PokeApi.getPokemon(nombrePokemon)
    pokemonData.value = response
    // si la respuesta se trada de un 404 no encontrado entoences se lanza un error para que el cathc redirija a la pagina de error
    // si quito esto el catch no se ejecuta, no se por que
    if (response.status === 404) {
      throw new Error('Pokemon no encontrado')
    }
  } catch (error) {
    console.log(error)
    // si no se encuentra el pokemon manda a unapágina de error
    router.push({
      name: '404Resource',
      // pasamos por parametro el mensaje que se desea mostrar, para poder especificar mas
      params: { resource: 'pokemon' }
    })
  }
}
</script>

<template>
  <main>
    <!-- se llama al evento personalizado que accionó el formulario y se ejecuta la funcion de buscar el pokemon 
     automáticamente se pasa por parámetro el nombre del pokemon que se ha buscado-->
    <PokeForm @find-pokemon="buscarDatosPokemon" />
    <!-- mostramos solo si el objeto pokemonData tiene datos -->
    <PokeCard v-if="pokemonData && pokemonData.name" :pokemonData="pokemonData" />
    <div v-else class="bienvenida">
      <p class="otroMensaje">Welcome to PokeApp! This is the place where you can discover everything you need to know about the fascinating world of
         Pokémon. From the most powerful legendary Pokémon to the most unique moves, you'll find information about every creature here. 
         Explore our simple Pokémon encyclopedia, learn about their types, abilities, and much more. Whether you're an experienced trainer 
         or just starting your adventure, there's something for everyone here!</p>
    </div>
    <!-- paso el prop.page para que pueda realizar la paginacion -->
    <PokeListView :page="props.page" />
  </main>
</template>

<style scoped>
a {
  text-decoration: none;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

h1 {
  font-size: 3rem;
  color: #4caf50;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
}

.bienvenida {
  display: flex;
  justify-content: center;
  margin-top: 2em;
}

.otroMensaje {
  width: 70%;
  padding: 2em;
  color: #77690d;
  background-color: #b1a4138a;
  border: 1px solid #7d6e0d;
  border-radius: 10px;
  line-height: 2em;
  font-size: 1em;
}

.mensaje {
  width: 90%;
  color: #ff6347;
  background-color: #fff3f3;
  border: 1px solid #ff6347;
}
</style>
