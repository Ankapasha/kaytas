// ------------------------------------------------------
//  SPRÅKDATABAS
// ------------------------------------------------------

const LANG = {
    sv: {
        listing_title: "Annons",
        contact_seller: "Kontakta säljaren",
        add_favorite: "Lägg till favorit",
        remove_favorite: "Ta bort favorit",
        price: "Pris",
        address: "Adress",
        description: "Beskrivning",
        login_required: "Du måste vara inloggad",
        back: "Tillbaka",
        favorites: "Favoriter",
        chat: "Chat",
        my_listings: "Mina annonser",
        add_listing: "Skapa annons"
    },
    en: {
        listing_title: "Listing",
        contact_seller: "Contact seller",
        add_favorite: "Add to favorites",
        remove_favorite: "Remove favorite",
        price: "Price",
        address: "Address",
        description: "Description",
        login_required: "You must be logged in",
        back: "Back",
        favorites: "Favorites",
        chat: "Chat",
        my_listings: "My Listings",
        add_listing: "Create listing"
    },
    fr: {
        listing_title: "Annonce",
        contact_seller: "Contacter le vendeur",
        add_favorite: "Ajouter aux favoris",
        remove_favorite: "Retirer des favoris",
        price: "Prix",
        address: "Adresse",
        description: "Description",
        login_required: "Vous devez être connecté",
        back: "Retour",
        favorites: "Favoris",
        chat: "Chat",
        my_listings: "Mes annonces",
        add_listing: "Créer une annonce"
    },
    bs: {
        listing_title: "Oglas",
        contact_seller: "Kontaktiraj prodavaca",
        add_favorite: "Dodaj u favorite",
        remove_favorite: "Ukloni iz favorita",
        price: "Cijena",
        address: "Adresa",
        description: "Opis",
        login_required: "Morate biti prijavljeni",
        back: "Nazad",
        favorites: "Favoriti",
        chat: "Chat",
        my_listings: "Moji oglasi",
        add_listing: "Kreiraj oglas"
    }
};

// ------------------------------------------------------
//  FUNKTION FÖR ATT APPLICERA SPRÅK
// ------------------------------------------------------

function applyLanguage(lang) {
    localStorage.setItem("lang", lang);
    const dict = LANG[lang];

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) el.textContent = dict[key];
    });
}

// ------------------------------------------------------
//  INITIALISERING
// ------------------------------------------------------

function initLanguage() {
    const saved = localStorage.getItem("lang") || "sv";
    applyLanguage(saved);

    const switcher = document.getElementById("langSwitcher");
    if (switcher) {
        switcher.value = saved;
        switcher.addEventListener("change", (e) => {
            applyLanguage(e.target.value);
        });
    }
}

document.addEventListener("DOMContentLoaded", initLanguage);