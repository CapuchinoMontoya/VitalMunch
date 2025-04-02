// Base de datos de productos (debe ser idéntica en ambas páginas)
const productos = [
    { 
        id: 1, 
        nombre: "Producto para perro", 
        precio: 1, 
        imagen: "img/producto-1.jpeg",
        descripcion: "Pollo crudo de alta calidad para dieta BARF"
    },
    { 
        id: 2, 
        nombre: "Combo Inicial BARF", 
        precio: 1, 
        imagen: "img/producto-2.jpeg",
        descripcion: "Todo lo necesario para comenzar con BARF"
    }
];

// Carrito (usa localStorage para persistencia)
let carrito = JSON.parse(localStorage.getItem('vitalmunch_carrito')) || [];

// Funciones compartidas
function updateCartCount() {
    const count = carrito.reduce((sum, item) => sum + item.cantidad, 0);
    const cartCountElement = document.getElementById('nav-cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

function renderCarrito() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartItems || !cartTotal) return;
    
    if (carrito.length === 0) {
        cartItems.innerHTML = '<li class="list-group-item text-center text-muted">Tu carrito está vacío</li>';
        cartTotal.textContent = '$0.00';
    } else {
        cartItems.innerHTML = '';
        let total = 0;
        
        carrito.forEach(item => {
            const producto = productos.find(p => p.id === item.id);
            total += producto.precio * item.cantidad;
            
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.innerHTML = `
                <div>
                    <h6 class="my-0">${producto.nombre}</h6>
                    <small class="text-muted">$${producto.precio.toFixed(2)} x ${item.cantidad}</small>
                </div>
                <div>
                    <span class="text-primary">$${(producto.precio * item.cantidad).toFixed(2)}</span>
                    <button class="btn btn-sm btn-outline-danger ms-2 remove-item" data-id="${producto.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`;
            cartItems.appendChild(li);
        });
        
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
    
    updateCartCount();
    localStorage.setItem('vitalmunch_carrito', JSON.stringify(carrito));
}

function generateWhatsAppMessage() {
    let message = "¡Hola Vital Munch! Quiero hacer un pedido:\n\n";
    
    carrito.forEach(item => {
        const producto = productos.find(p => p.id === item.id);
        message += `✔ ${producto.nombre} - ${item.cantidad} x $${producto.precio.toFixed(2)}\n`;
    });
    
    const total = carrito.reduce((sum, item) => {
        const producto = productos.find(p => p.id === item.id);
        return sum + (producto.precio * item.cantidad);
    }, 0);
    
    message += `\nTotal: $${total.toFixed(2)}\n\n`;
    message += "Por favor indíquenme cómo proceder con el pago y entrega. ¡Gracias!";
    
    return message;
}

// Configuración de eventos comunes
function setupCommonEventListeners() {
    // Eliminar items del carrito
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const btn = e.target.classList.contains('remove-item') ? e.target : e.target.closest('.remove-item');
            const id = parseInt(btn.dataset.id);
            
            carrito = carrito.filter(item => item.id !== id);
            renderCarrito();
        }
    });
    
    // Finalizar compra por WhatsApp
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (carrito.length === 0) {
                alert('Tu carrito está vacío');
                return;
            }
            
            const phone = "528138970758";
            const message = generateWhatsAppMessage();
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        });
    }
}

// Inicialización común
function initCommon() {
    updateCartCount();
    setupCommonEventListeners();
    
    // Si existe el modal del carrito, renderizarlo
    if (document.getElementById('cart-items')) {
        renderCarrito();
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initCommon);