let cart = [];

function addToCart(itemName, itemPrice, btnElement) {
    let quantity = 1;

    // Find the quantity input associated with this button
    if (btnElement) {
        const input = btnElement.previousElementSibling;
        if (input && input.classList.contains('qty-input')) {
            quantity = parseInt(input.value);
            if (isNaN(quantity) || quantity < 1) quantity = 1;
        }
    }

    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === itemName);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ name: itemName, price: itemPrice, quantity: quantity });
    }

    // Update the UI
    updateCartCount();

    // Show Toast
    showToast(`${quantity} x ${itemName} added to cart!`);
}

console.log("FastBites website loaded successfully.");

let currentCategory = 'all';
const itemsPerPage = 8;
let visibleItemCount = itemsPerPage;

function filterMenu(category, btnElement) {
    currentCategory = category;
    visibleItemCount = itemsPerPage;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    if (btnElement) {
        btnElement.classList.add('active');
    }
    
    updateMenuDisplay();
}

function loadMore() {
    visibleItemCount += itemsPerPage;
    updateMenuDisplay();
}

function updateMenuDisplay() {
    const items = document.querySelectorAll('.food-card');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    let matchCount = 0;
    let shownCount = 0;

    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        const shouldShow = (currentCategory === 'all' || itemCategory === currentCategory);

        if (shouldShow) {
            matchCount++;
            if (shownCount < visibleItemCount) {
                item.style.display = 'block';
                shownCount++;
            } else {
                item.style.display = 'none';
            }
        } else {
            item.style.display = 'none';
        }
    });

    if (loadMoreBtn) {
        if (visibleItemCount < matchCount) {
            loadMoreBtn.style.display = 'inline-block';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = count;
}

function openCart() {
    const modal = document.getElementById('cart-modal');
    const container = document.getElementById('cart-items-container');
    const countSpan = document.getElementById('modal-cart-count');
    const totalSpan = document.getElementById('modal-cart-total');

    // Render items
    container.innerHTML = '';
    let totalCount = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalCount += item.quantity;
        totalPrice += itemTotal;

        const itemDiv = document.createElement('div');
        itemDiv.style.display = 'flex';
        itemDiv.style.justifyContent = 'space-between';
        itemDiv.style.marginBottom = '5px';
        itemDiv.innerHTML = `<span>${item.quantity}x ${item.name}</span><span>${itemTotal.toFixed(2)} DH</span>`;
        container.appendChild(itemDiv);
    });

    countSpan.innerText = totalCount;
    totalSpan.innerText = totalPrice.toFixed(2);
    modal.style.display = 'flex';
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

function clearCart() {
    cart = [];
    updateCartCount();
    if (document.getElementById('cart-modal').style.display === 'flex') {
        openCart();
    }
}

function placeOrder(event) {
    event.preventDefault();
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;

    if (!name.trim() || !address.trim()) {
        alert("Please enter your name and address.");
        return;
    }

    let message = `*New Order from FastBites*\n\n`;
    message += `*Name:* ${name}\n`;
    message += `*Address:* ${address}\n\n`;
    message += `*Order:*\n`;

    cart.forEach(item => {
        message += `${item.quantity}x ${item.name} - ${(item.price * item.quantity).toFixed(2)} DH\n`;
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n*Total:* ${total.toFixed(2)} DH`;

    const phoneNumber = "212640234630"; // Replace with your WhatsApp number
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
    
    // Reset Cart
    cart = [];
    updateCartCount();
    closeCart();
}

// Close modal if clicking outside content
window.onclick = function(event) {
    const modal = document.getElementById('cart-modal');
    if (event.target == modal) {
        closeCart();
    }
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(function(){ toast.classList.remove("show"); }, 3000);
}

// Initialize menu display
updateMenuDisplay();