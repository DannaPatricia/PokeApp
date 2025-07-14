<script setup>
// Esta prop sera tomada desde PokeView.vue, es el mensaje específico que se va a mostrar
const props = defineProps({
  resource: {
    type: String,
    required: true,
   } 
})
</script>

<template>
    <div class="mensaje">
        <h1>Oops!</h1>
        <h3>The {{ props.resource }} you're looking for is not here.</h3>
        <img src="../../public/error.png" alt="">
        <router-link :to="{ name: 'PokeView' }">Back to the home page</router-link>
    </div>
</template>

<style scoped>
.mensaje{
    display: flex;
    flex-direction: column;
    text-align: center;
    margin: 2em auto;
    padding: 2em;
    width: 50%;
    color: #bb4b37;
    background-color: #fff3f3;
    border: 1px solid #9e3d2c;
    border-radius: 10px;
    font-size: 1em;
}

img{
    display: flex;
    margin: auto;
    width: 20em;
}

a{
    text-decoration: none;
    font-size: 2em;
    color: #bb4b37;
    font-weight: bold;
}
</style>