
//Array of Food Menu
const menuItems = [
    { id: 1, name: "Jollof Rice", description: "Spicy tomato-based rice dish", price: 1500, image: "images/jollof rice.webp" },
    { id: 2, name: "Egusi Soup", description: "Egusi soup with assorted meat", price: 2000, image: "images/egusi.jpg" },
    { id: 3, name: "Suya", description: "Spicy grilled meat", price: 2500, image: "images/suya.jpg" },
    { id: 4, name: "Bitter leaf soup", description: "Bitter leaf soup with assorted meet", price: 2000, image: "images/bitter leaf soup.jpg" },
];

//initialize Local Storage for storing Items
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Display Menu from Grid
function displayMenu() {
    const menuGrid = document.getElementById('menuGrid');
    menuItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p>₦${item.price}</p>
                    <div class="quantity-selector" data-id="${item.id}">
                        <button class="minus">-</button>
                        <span class="quantity">1</span>
                        <button class="plus">+</button>
                    </div>
                    <button class="add-to-plate" data-id="${item.id}">Add to Plate</button>
                `;
        menuGrid.appendChild(card);
    });
}

 // Update cart display, total, and local storage
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `${item.name} (x${item.quantity}) - ₦${item.price * item.quantity} `;
        cartItems.appendChild(cartItem);
    });
    calculateTotal();
    localStorage.setItem('cart', JSON.stringify(cart));
    updateDeliveryTime();
}
 // Calculate and display total price of cart items
function calculateTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalPrice').textContent = total;
}
    // Calculate and display estimated delivery time based on total items
function updateDeliveryTime() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryTime = totalItems > 0 ? `${15 + (totalItems * 5)} minutes` : 'N/A';
    document.getElementById('deliveryTime').textContent = deliveryTime;
}


        // Add item to cart with specified quantity
function addToCart(itemId, quantity) {
    const item = menuItems.find(i => i.id === itemId);
    const cartItem = cart.find(i => i.id === itemId);

    if (cartItem) {
        cartItem.quantity += quantity;
    } else {
        cart.push({ ...item, quantity });
    }

    cart = cart.filter(item => item.quantity > 0);
    updateCart();
}

 // Show loading spinner and then success modal
function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'block';
    setTimeout(() => {
        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('successModal').style.display = 'flex';
    }, 1500);
}

     // Close success modal and clear cart
function closeModal() {
    document.getElementById('successModal').style.display = 'none';
    cart = [];
    updateCart();
}


/*Priniting of  order in windows*/
function printOrder() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
                <html>
                    <head>
                        <title>Order Summary</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1 { text-align: center; }
                            .item { margin: 10px 0; }
                            .total { font-weight: bold; margin-top: 20px; }
                        </style>
                    </head>
                    <body>
                        <h1>Your Order</h1>
                        ${cart.map(item => `<div class="item">${item.name} (x${item.quantity}) - ₦${item.price * item.quantity}</div>`).join('')}
                        <div class="total">Total: ₦${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)}</div>
                    </body>
                </html>
            `);
    printWindow.document.close();
    printWindow.print();
}

/* Event listener for all click interactions*/
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-plate')) {
        const itemId = parseInt(e.target.dataset.id);
        const quantityElement = e.target.parentElement.querySelector('.quantity');
        const quantity = parseInt(quantityElement.textContent);
        addToCart(itemId, quantity);
    }

    if (e.target.classList.contains('plus')) {
        const quantityElement = e.target.parentElement.querySelector('.quantity');
        quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
    }

    if (e.target.classList.contains('minus')) {
        const quantityElement = e.target.parentElement.querySelector('.quantity');
        const currentQuantity = parseInt(quantityElement.textContent);
        if (currentQuantity > 1) {
            quantityElement.textContent = currentQuantity - 1;
        }
    }

    if (e.target.id === 'submitOrder') {
        if (cart.length === 0) {
            alert('Please add at least one Food item!');
            return;
        }
        showLoading();
    }

    if (e.target.id === 'printOrder') {
        if (cart.length === 0) {
            alert('Please add at least one Food item!');
            return;
        }
        printOrder();
    }
});

displayMenu();
updateCart();