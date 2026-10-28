export const site = {
  name: 'YOKA Market',
  handle: '@yokamarket.ec',
  instagram: 'https://www.instagram.com/yokamarket.ec/',
  tagline: 'Come saludable, sin complicarte.',
  headline: 'Tu despensa saludable, llena de sabor.',
  sub: 'Bolones y tortillas de verde congelados, jugos verdes y postres cuchareables sin azúcar añadida. Pides hoy, lo recibes en casa.',
  city: 'Guayaquil',
  catalogYear: '2026',
  // Foto grande del hero (en public/products). Se cambia aquí o reemplazando el archivo.
  heroPhoto: 'https://res.cloudinary.com/xp6hinyz/image/upload/f_auto,q_auto,w_1000,c_limit/yokamarket/productos/bolones-1.jpg',
  pointsOfSale: [
    { name: 'Friendly Market · Icon Plaza', place: 'Los Olivos' },
    { name: 'Friendly Market', place: 'Ceibos' },
  ],
}

export const copy = {
  nav: {
    catalog: 'Catálogo',
    how: 'Cómo funciona',
    cart: 'Carrito',
    order: 'Mi pedido',
  },
  hero: {
    cta: 'Ver catálogo',
    secondary: 'Cómo funciona',
    pills: ['Sin azúcares añadidos', 'Sin gluten', 'Sin aceites añadidos', 'Entrega a domicilio'],
  },
  how: {
    title: 'Pedir es así de simple',
    steps: [
      {
        icon: 'fa-basket-shopping',
        title: 'Arma tu pedido',
        text: 'Elige tus favoritos del catálogo y ajusta las cantidades en el carrito.',
      },
      {
        icon: 'fa-credit-card',
        title: 'Paga seguro con Payphone',
        text: 'Tarjeta de crédito, débito o saldo Payphone. Nunca vemos los datos de tu tarjeta.',
      },
      {
        icon: 'fa-truck-fast',
        title: 'Lo recibes en casa',
        text: 'Te confirmamos la entrega por WhatsApp. Los congelados llegan listos para tu refri.',
      },
    ],
  },
  why: {
    title: 'Hecho para tenerlo siempre en casa',
    items: [
      {
        icon: 'fa-snowflake',
        title: 'Congelados que resuelven',
        text: 'Bolones y tortillas listos en minutos: sartén, airfryer u horno.',
      },
      {
        icon: 'fa-leaf',
        title: 'Ingredientes reales',
        text: 'Verde, queso mozzarella, yogur griego, apio, manzana. Sin cosas raras.',
      },
      {
        icon: 'fa-heart',
        title: 'Dulce sin culpa',
        text: 'Mix de harinas sin gluten y alulosa en toda la línea Sweet Bites.',
      },
    ],
  },
  footer: {
    rights: `© ${new Date().getFullYear()} YOKA Market · Pedidos a domicilio`,
    pay: 'Pagos procesados por Payphone',
  },
}
