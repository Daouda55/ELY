/* =====================================
   ELY — GALERIE PHOTO
===================================== */

const mainImage = document.querySelector("#main-image");
const prevButton = document.querySelector("#gallery-prev");
const nextButton = document.querySelector("#gallery-next");
const galleryCounter = document.querySelector("#gallery-counter");

const productImages = {
    Noir: ["images/veste-noire.jpg"],
    Blanc: ["images/veste-blanc.jpg"],
    Beige: ["images/veste-beige.jpeg"],
    Rose: ["images/veste-rose.jpeg"],
    Bleu: ["images/veste-bleu1.jpg"],
    Rouge: ["images/veste-rouge.jpg"],
    Vert: ["images/veste-vert.jpg"],
    Gris: ["images/veste-grise.jpg"]
};

const colors = Object.keys(productImages);

let currentColorIndex = 0;
let currentImage = 0;
let galleryAnimationTimer;

const colorButtons = document.querySelectorAll(".color-btn");
const selectedColor = document.querySelector("#selected-color");

function updateGallery(animate = false) {
    const color = colors[currentColorIndex];
    const images = productImages[color];
    const imagePath = images[currentImage];

    // Actualiser la couleur affichée
    selectedColor.textContent = color;

    // Actualiser le bouton de couleur actif
    colorButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.color === color
        );
    });

    // Actualiser le compteur
    galleryCounter.textContent =
        `${String(currentImage + 1).padStart(2, "0")} / ${String(images.length).padStart(2, "0")}`;

    clearTimeout(galleryAnimationTimer);

    if (!animate) {
        mainImage.classList.remove("changing");
        mainImage.src = imagePath;
        return;
    }

    mainImage.classList.add("changing");

    galleryAnimationTimer = setTimeout(() => {
        mainImage.src = imagePath;
        mainImage.classList.remove("changing");
    }, 200);
}

// Afficher la veste noire dès l'ouverture
updateGallery();


/* FLÈCHES DE LA GALERIE */

nextButton.addEventListener("click", () => {
    const images = productImages[colors[currentColorIndex]];

    if (currentImage < images.length - 1) {
        // Photo suivante de la même couleur
        currentImage++;
    } else {
        // Passer à la couleur suivante
        currentColorIndex =
            (currentColorIndex + 1) % colors.length;
        currentImage = 0;
    }

    updateGallery(true);
});

prevButton.addEventListener("click", () => {
    if (currentImage > 0) {
        // Photo précédente de la même couleur
        currentImage--;
    } else {
        // Passer à la couleur précédente
        currentColorIndex =
            (currentColorIndex - 1 + colors.length) % colors.length;

        const images = productImages[colors[currentColorIndex]];
        currentImage = images.length - 1;
    }

    updateGallery(true);
});


/* SÉLECTION MANUELLE DES COULEURS */

colorButtons.forEach(button => {
    button.addEventListener("click", () => {
        const color = button.dataset.color;

        if (!productImages[color]) return;

        currentColorIndex = colors.indexOf(color);
        currentImage = 0;

        updateGallery(true);
    });
});


/* =====================================
   ELY — SÉLECTION DES TAILLES
===================================== */

const sizeButtons = document.querySelectorAll(".size-btn");

sizeButtons.forEach(button => {
    button.addEventListener("click", () => {
        sizeButtons.forEach(size => {
            size.classList.remove("active");
        });

        button.classList.add("active");
    });
});


/* =====================================
   ELY — QUANTITÉ
===================================== */

const decreaseBtn = document.querySelector("#decrease");
const increaseBtn = document.querySelector("#increase");
const quantityDisplay = document.querySelector("#quantity");

let quantity = 1;

increaseBtn.addEventListener("click", () => {
    quantity++;
    quantityDisplay.textContent = quantity;
});

decreaseBtn.addEventListener("click", () => {
    if (quantity > 1) {
        quantity--;
        quantityDisplay.textContent = quantity;
    }
});


/* =====================================
   ELY — PANIER LATÉRAL
===================================== */

const addToCartBtn = document.querySelector(".add-to-cart");
const cartDrawer = document.querySelector("#cart-drawer");
const cartOverlay = document.querySelector("#cart-overlay");
const cartClose = document.querySelector("#cart-close");
const cartContinue = document.querySelector("#cart-continue");

const cartBody = document.querySelector("#cart-body");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");

function openCart() {
    cartDrawer.classList.add("open");
    cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeCart() {
    cartDrawer.classList.remove("open");
    cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
}

cartClose.addEventListener("click", closeCart);
cartContinue.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

cartDrawer.addEventListener("click", event => {
    event.stopPropagation();
});


/* =====================================
   ELY — DONNÉES PRODUIT
===================================== */

const product = {
    name: "Veste Essentielle",
    price: 25000
};

let cart = JSON.parse(localStorage.getItem("elyCart")) || [];

function saveCart() {
    localStorage.setItem("elyCart", JSON.stringify(cart));
}


/* =====================================
   ELY — AFFICHAGE DU PANIER
===================================== */

function renderCart() {
    cartBody.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    if (cart.length === 0) {
        cartBody.innerHTML = `
            <p class="cart-empty">
                Votre panier est vide.
            </p>
        `;
    } else {
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;

            total += itemTotal;
            totalQuantity += item.quantity;

            cartBody.innerHTML += `
                <div class="cart-item">

                    <img src="${item.image}"
                         alt="${item.name} - ${item.color}">

                    <div class="cart-item-info">
                        <h3>${item.name}</h3>

                        <p>Couleur : ${item.color}</p>
                        <p>Taille : ${item.size}</p>
                        <p>Quantité : ${item.quantity}</p>

                        <strong>
                            ${itemTotal.toLocaleString("fr-FR")} FCFA
                        </strong>
                    </div>

                    <button
                        type="button"
                        class="remove-cart-item"
                        data-index="${index}"
                        aria-label="Supprimer cet article"
                        title="Supprimer cet article">

                        <svg xmlns="http://www.w3.org/2000/svg"
                             width="18"
                             height="18"
                             viewBox="0 0 24 24"
                             fill="none"
                             stroke="currentColor"
                             stroke-width="1.7"
                             stroke-linecap="round"
                             stroke-linejoin="round"
                             aria-hidden="true">

                            <path d="M3 6h18"/>
                            <path d="M8 6V4h8v2"/>
                            <path d="M5 6l1 15h12l1-15"/>
                            <path d="M10 10v7"/>
                            <path d="M14 10v7"/>
                        </svg>
                    </button>
                </div>
            `;
        });
    }

    cartCount.textContent = `(${totalQuantity})`;

    cartTotal.textContent =
        `${total.toLocaleString("fr-FR")} FCFA`;
}


/* =====================================
   ELY — SUPPRESSION D'UN ARTICLE
===================================== */

// Un seul événement, en dehors de renderCart()

cartBody.addEventListener("click", event => {
    const removeButton =
        event.target.closest(".remove-cart-item");

    if (!removeButton) return;

    event.stopPropagation();

    const index = Number(removeButton.dataset.index);

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= cart.length
    ) {
        return;
    }

    // Supprimer uniquement l'article choisi
    cart.splice(index, 1);

    saveCart();
    renderCart();
});


/* =====================================
   ELY — AJOUTER AU PANIER
===================================== */

addToCartBtn.addEventListener("click", () => {
    const selectedSize =
        document.querySelector(".size-btn.active");

    if (!selectedSize) {
        alert("Veuillez sélectionner une taille.");
        return;
    }

    const size = selectedSize.textContent.trim();
    const color = colors[currentColorIndex];

    // Photo correspondant à la couleur sélectionnée
    const image = productImages[color][0];

    const existingItem = cart.find(item =>
        item.name === product.name &&
        item.size === size &&
        item.color === color
    );

    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.image = image;
    } else {
        cart.push({
            name: product.name,
            price: product.price,
            image: image,
            size: size,
            color: color,
            quantity: quantity
        });
    }

    saveCart();
    renderCart();
    openCart();
});

// Afficher les articles déjà enregistrés
renderCart();