<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

onMounted(() => {
    // se crea el web worker
    const worker = new Worker('/worker.js');

    // se declara intervalo cada 5 segundos para revisar la cache y ejecutar el worker
    setInterval(() => {
        // obtener las caches
        const caches = [
            { type: 'pokemon', data: JSON.parse(localStorage.getItem('pokemon')) || [] },
            { type: 'evolution-cache', data: JSON.parse(localStorage.getItem('evolution-cache')) || [] },
            { type: 'pokemon-moves', data: JSON.parse(localStorage.getItem('pokemon-moves')) || [] },
            { type: 'pokemon-abilities', data: JSON.parse(localStorage.getItem('pokemon-abilities')) || [] }
        ];
        // enviar la cache al worker, siempre y cuando el action sea igual a start, pasa un objeto
        worker.postMessage({ action: 'start',  caches: caches });

        // escuchar respuestas del worker
        worker.onmessage = (e) => {
            // se obtienen los datos del worker
            const data = e.data;
            // si el action es igual a updateData se obtiene el cache modificado del worker
            // en este caso el action no haria falta comprobar ya que el worker solo tiene que devolver el resultado una tarea
            if (data.action === 'updateData') {
                // actualizar el localStorage
                data.data.forEach(cache => {
                    localStorage.setItem(cache.type, JSON.stringify(cache.data));
                    // console.log('[Main Thread] Datos a modificar:', cache.data);
                });
            }
        };
    }, 5000);
    // se envia el mensaje start para que el worker pueda ejecutar el codigo correspondiente,  el worker empieza a ejecutar codigo
    // en cuanto se crea
    worker.postMessage('start');
})


// establecemos el nombre del pokemon como una variable reactiva o cambiante
const pokemonName = ref('')
const router = useRouter()

// updatePokemonTimeout()

// una vez se haya hecho submit se comprueba que los datos estan llenos, caso contrario muestra un mensaje
function onSubmit() {
    if (pokemonName.value.trim() === '') {
        alert('Inserte nombre del Pokémon')
        return
    }
    // una vez insertado el nombre del pokemon se redirige a la vista de detalles
    router.push({
        name: 'PokeViewDetails',
        params: {
            pokemonName: pokemonName.value.toLowerCase().trim()
        }
    })
}

</script>

<template>
    <header>
        <nav class="nav-usuario" aria-label="nav-usuario">
            <div class="container-usuario">
                <span class="nombre-web">PokeApp</span>
                <img src="./assets/logo.png" alt="eevee">
            </div>
        </nav>
        <nav class="nav-navegacion">
            <div class="container-navegacion">
                <ul class="menu" id="navNavegacion">
                    <li>
                        <RouterLink to="/">Home</RouterLink>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
    <form class="formulario" @submit.prevent="onSubmit">
        <input type="text" id="pokemonName" v-model="pokemonName" placeholder="Pokemon name here...">
        <button type="submit">Find pokemon</button>
    </form>
    <RouterView />
</template>

<style scoped>
.nav-navegacion {
    background-color: #ae4040;
    color: white;
    padding: 1em 0;
}

.container-navegacion {
    text-align: center;
}

.menu {
    list-style-type: none;
    margin: 0;
    padding: 0;
}

.menu li {
    display: inline-block;
    margin: 0 1.5em;
    position: relative;
}

.menu li a {
    color: white;
    text-decoration: none;
    font-size: 16px;
    transition: color 0.3s ease;
}

.menu li a:hover {
    color: #333333;
}

.menu li a::after {
    content: '';
    display: block;
    width: 0%;
    height: 2px;
    background-color: #333333;
    transition: width 0.3s ease;
}

.menu li a:hover::after {
    width: 100%;
}

header {
    width: 100%;
}

.nav-usuario {
    background-image: url('../public/portada.jpg');
    padding: 1em 0;
}

.container-usuario {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 1.7em;
}

img {
    width: 3em;
    display: flex;
    margin-left: 1em;
}

.nombre-web {
    color: white;
    font-size: 24px;
    font-weight: bold;
}

.usuario-opciones {
    display: flex;
    align-items: center;
    margin-right: 1em;
}

.usuario {
    color: white;
    margin-right: 2em;
    transition: color 0.3s ease;
}

.cerrar-sesion {
    color: white;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.3s ease;
}

.usuario:hover,
.cerrar-sesion:hover {
    color: #b6a745;
}

.cerrar-sesion:hover {
    text-decoration: none;
}
</style>
