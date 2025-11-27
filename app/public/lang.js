// ------------------------------------------------------
//  LANGUAGE DATABASE
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
    es: {
        listing_title: "Anuncio",
        contact_seller: "Contactar al vendedor",
        add_favorite: "Añadir a favoritos",
        remove_favorite: "Eliminar de favoritos",
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
    sh: {
        listing_title: "Oglas",
        contact_seller: "Kontaktiraj prodavača",
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
//  AUTO-DETECT LANGUAGE BASED ON COUNTRY
// ------------------------------------------------------

async function detectLanguageByLocation() {
    try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();

        const country = data.country_code?.toLowerCase();

        const map = {
            se: "en",
            no: "en",
            dk: "en",
            fi: "en",
            us: "en",
            gb: "en",
            ca: "en",

            de: "de",
            at: "de",
            ch: "de",

            fr: "fr",
            be: "fr",
            lu: "fr",

            it: "it",
            sm: "it",

            es: "es",
            mx: "es",
            ar: "es",
            cl: "es",
            co: "es",

            hr: "sh",
            rs: "sh",
            ba: "sh",
            me: "sh",
            mk: "sh"
        };

        return map[country] || "en";

    } catch {
        return "en";
    }
}


// ------------------------------------------------------
//  INITIALIZE LANGUAGE
// ------------------------------------------------------

async function initLanguage() {
    let stored = localStorage.getItem("lang");

    if (!stored) {
        stored = await detectLanguageByLocation();  
        localStorage.setItem("lang", stored);
    }

    applyLanguage(stored);

    const switcher = document.getElementById("langSwitcher");
    if (switcher) {
        switcher.value = stored;

        switcher.addEventListener("change", (e) => {
            applyLanguage(e.target.value);
        });
    }
}

document.addEventListener("DOMContentLoaded", initLanguage);
