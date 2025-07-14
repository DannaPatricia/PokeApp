

function filterByInactivity(cache, tipo) {
    // se almacena los nuevos datos filtrados
    return cache.filter(item => {
        // condicion para comprobar si el timeout del pokemon supera la media hora
        if (Date.now() - item.timeout > 1000 * 60 * 30) {
            console.log(`Eliminando ${tipo} ${item.name} por inactividad`);
            //  se retorna falso para indicar a la funcion que ese valor no se debe almacenar en el nuvo array
            return false
        }
        //  si no cumple esa condicion se almacenara el elemento en el nuevo array
        return true
    });
}

// se defienq ue va aa hacer el worker cuando reciba el mensaje desde el hilo pirncipal
self.onmessage = function (e) {
    // se extraen los datos enviados desde la rama prinipal
    const data = e.data
    // se declara nuevo array que almacenara los datos filtrados, en este caso los que esten activos
    let newCache = []
    // se declara la cache
    let caches = data.caches
    // si el action es igual a start se obtiene el dato almacenado, en este caso la cache
    if (data.action === 'start') {
        // se pasa la cache y el tipo por paremetro
        caches.forEach(cache => {
            let filterCache = filterByInactivity(cache.data, cache.type)
            // console.log(cache.type.toUpperCase())
            // console.log('FILTRADO')
            // console.log(filterCache)
            // console.log('CACHE original')
            // console.log(cache.data)
            newCache.push({ type: cache.type, data: filterCache })
        });

    }

    // se envia el mensaje al hilo principal, se pasa la el array de caches modificada
    postMessage({
        action: 'updateData',
        data: newCache,
    });
};

