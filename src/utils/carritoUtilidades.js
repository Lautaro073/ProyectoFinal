export function obtenerCarrito() {
    const carrito = localStorage.getItem('carrito');
    return carrito ? JSON.parse(carrito) : [];
}

export function guardarCarrito(carrito) {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

export function agregarProductoAlCarrito(producto) {
    const carrito = obtenerCarrito();
    // Aquí puedes agregar lógica para verificar si el producto ya está en el carrito y simplemente incrementar su cantidad, o agregarlo como un nuevo ítem.
    carrito.push(producto);
    guardarCarrito(carrito);
}
