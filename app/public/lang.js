// ------------------------------------------------------
//  LANGUAGE DATABASE
//  Languages: EN, SR (latin), DE, FR, ES, IT, SQ
// ------------------------------------------------------

const LANG = {
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
    sr: {
        listing_title: "Oglas",
        contact_seller: "Kontaktiraj prodavca",
        add_favorite: "Dodaj u omiljene",
        remove_favorite: "Ukloni iz omiljenih",
        price: "Cena",
        address: "Adresa",
        description: "Opis",
        login_required: "Morate biti prijavljeni",
        back: "Nazad",
        favorites: "Omiljeni",
        chat: "Čet",
        my_listings: "Moji oglasi",
        add_listing: "Kreiraj oglas"
    },
    de: {
        listing_title: "Anzeige",
        contact_seller: "Verkäufer kontaktieren",
        add_favorite: "Zu Favoriten hinzufügen",
        remove_favorite: "Aus Favoriten entfernen",
        price: "Preis",
        address: "Adresse",
        description: "Beschreibung",
        login_required: "Sie müssen eingeloggt sein",
        back: "Zurück",
        favorites: "Favoriten",
        chat: "Chat",
        my_listings: "Meine Anzeigen",
        add_listing: "Anzeige erstellen"
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
    es: {
        listing_title: "Anuncio",
        contact_seller: "Contactar al vendedor",
        add_favorite: "Añadir a favoritos",
        remove_favorite: "Quitar de favoritos",
        price: "Precio",
        address: "Dirección",
        description: "Descripción",
        login_required: "Debes iniciar sesión",
        back: "Atrás",
        favorites: "Favoritos",
        chat: "Chat",
        my_listings: "Mis anuncios",
        add_listing: "Crear anuncio"
    },
    it: {
        listing_title: "Annuncio",
        contact_seller: "Contatta il venditore",
        add_favorite: "Aggiungi ai preferiti",
        remove_favorite: "Rimuovi dai preferiti",
        price: "Prezzo",
        address: "Indirizzo",
        description: "Descrizione",
        login_required: "Devi essere loggato",
        back: "Indietro",
        favorites: "Preferiti",
        chat: "Chat",
        my_listings: "I miei annunci",
        add_listing: "Crea annuncio"
    },
    sq: {
        listing_title: "Shpallje",
        contact_seller: "Kontakto shitësin",
        add_favorite: "Shto tek të preferuarat",
        remove_favorite: "Hiq nga të preferuarat",
        price: "Çmimi",
        address: "Adresa",
        description: "Përshkrimi",
        login_required: "Duhet të jeni i kyçur",
        back: "Kthehu",
        favorites: "Të preferuarat",
        chat: "Chat",
        my_listings: "Shpalljet e mia",
        add_listing: "Krijo shpallje"
    }
};

// ------------------------------------------------------
//  APPLY LANGUAGE
// ------------------------------------------------------

function applyLanguage(lang) {
    if (!LANG[lang]) lang = "en";

    localStorage.setItem("lang", lang);
    const dict = LANG[lang];

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (dict[key]) el.textContent = dict[key];
    });
}

// ------------------------------------------------------
//  INITIALISATION (AUTO-DETECT FIRST TIME)
//  Sweden -> English by default
// ------------------------------------------------------

function initLanguage() {
    let saved = localStorage.getItem("lang");

    if (!saved) {
        const browser = (navigator.language || navigator.userLanguage || "en").slice(0,2).toLowerCase();

        if (browser === "sv") {
            saved = "en";
        } else if (["en","sr","de","fr","es","it","sq"].includes(browser)) {
            saved = browser;
        } else {
            saved = "en";
        }

        localStorage.setItem("lang", saved);
    }

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
