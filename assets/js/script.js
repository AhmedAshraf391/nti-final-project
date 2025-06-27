// Selecting elements
const toggle = document.getElementById("menu-toggle");
const links = document.querySelector(".nav-links");
const icons = document.querySelector(".nav-icons");
const cartButton = document.getElementById("cart-button");
const cartModal = document.getElementById("cart-modal");
const closeCart = document.getElementById("close-cart");
const cartItemsList = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const addToCartButtons = document.querySelectorAll(".add-to-cart");

const userIcon = document.getElementById("user-icon");
const userMenu = document.getElementById("user-menu");
const logoutBtn = document.getElementById("logout-user");
const welcomeMessage = document.getElementById("welcome-message");


// Variables
let cartItems = [];
let cartId = 0;

const users = ["ashrooof", "sarah", "mohamed", "lina"];
let currentUser = null;

// Onload
loadCartFromStorage();
updateCartCount();
updateCartUI();

document.addEventListener("DOMContentLoaded", function () {
	const toggle = document.getElementById("menu-toggle");
	const links = document.querySelector(".nav-links");
	const icons = document.querySelector(".nav-icons");

	toggle.addEventListener("click", () => {
		links.classList.toggle("active");
		icons.classList.toggle("active");
	});
});

document.addEventListener("DOMContentLoaded", () => {
	const savedUser = localStorage.getItem("loggedInUser");
	if (savedUser && users.includes(savedUser)) {
		currentUser = savedUser;
		welcomeMessage.textContent = `Welcome, ${currentUser}!`;
		loadCartFromStorage();
		updateCartCount();
		updateCartUI();
	}
});

userIcon.addEventListener("click", () => {
	userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
	if (!e.target.closest(".user-dropdown")) {
		userMenu.style.display = "none";
	}
});

document.querySelectorAll("#user-menu li").forEach((item) => {
	item.addEventListener("click", () => {
		const selectedUser = item.getAttribute("data-user");
		if (users.includes(selectedUser)) {
			currentUser = selectedUser;
			localStorage.setItem("loggedInUser", currentUser);
			welcomeMessage.textContent = `Welcome, ${currentUser}!`;

			loadCartFromStorage();
			updateCartCount();
			updateCartUI();

			userMenu.style.display = "none";
		}
	});
});

function getCartKey() {
	return `cart_user_${currentUser}`;
}


logoutBtn.addEventListener("click", () => {
	localStorage.removeItem("loggedInUser");

	currentUser = null;
	cartItems = [];

	updateCartCount();
	updateCartUI();
	welcomeMessage.textContent = "";
	userMenu.style.display = "none";

	alert("You have been logged out.");
});

function updateCartUI() {
	cartItemsList.innerHTML = "";

	if (cartItems.length === 0) {
		cartItemsList.innerHTML = "<li>Your cart is empty.</li>";
		cartTotal.textContent = "Total: $0";
		return;
	}

	let total = 0;

	cartItems.forEach((item) => {
		total += item.price * item.quantity;

		const li = document.createElement("li");
		li.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <div style="display: flex; gap: 10px; align-items: center;">
          <img src="${item.imgSrc}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />
          <div>
            <strong>${item.name}</strong><br>
            <span>$${item.price} × ${item.quantity}</span>
          </div>
        </div>
        <button class="remove-item" data-name="${item.name}" style="background: none; border: none; color: red; font-size: 20px; cursor: pointer;">&minus;</button>
      </div>
    `;
		cartItemsList.appendChild(li);
		saveCartToStorage();
	});

	cartTotal.textContent = `Total: $${total.toFixed(2)}`;

	document.querySelectorAll(".remove-item").forEach(button => {
		button.addEventListener("click", () => {
			const name = button.getAttribute("data-name");
			const item = cartItems.find(i => i.name === name);
			if (item) {
				if (item.quantity > 1) {
					item.quantity -= 1;
				} else {
					cartItems = cartItems.filter(i => i.name !== name);
				}
			}
			saveCartToStorage();
			updateCartCount();
			updateCartUI();
		});
	});
}


function updateCartCount() {
	const cartCount = document.getElementById("cart-count");
	const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
	if (cartCount) {
		cartCount.textContent = totalItems;
	}
}


addToCartButtons.forEach(button => {
	button.addEventListener("click", () => {
		const item = button.closest(".item");
		const name = item.querySelector(".caption span").textContent.trim();
		const priceText = item.querySelector(".caption small").textContent.trim();
		const price = parseFloat(priceText.replace("$", ""));
		const imgSrc = item.querySelector("img").getAttribute("src");

		const existingItem = cartItems.find(i => i.name === name);

		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			cartItems.push({
				name,
				price,
				imgSrc,
				quantity: 1,
			});
		}
		updateCartCount();
		updateCartUI();
	});
});


cartButton.addEventListener("click", () => {
	updateCartUI();
	cartModal.style.display = "flex";
});

closeCart.addEventListener("click", () => {
	cartModal.style.display = "none";
});

window.addEventListener("click", (e) => {
	if (e.target === cartModal) {
		cartModal.style.display = "none";
	}
});

function saveCartToStorage() {
	if (!currentUser) return; 
	const key = `cart_user_${currentUser}`;
	localStorage.setItem(key, JSON.stringify(cartItems));
}

function loadCartFromStorage() {
	const data = localStorage.getItem(`cart_user_${currentUser}`);
	cartItems = data ? JSON.parse(data) : [];
}