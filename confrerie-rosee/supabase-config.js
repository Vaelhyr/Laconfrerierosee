// ==========================================
// CONFIGURATION DE CONNEXION SUPABASE
// ==========================================

// Remplacer ces valeurs par celles de votre projet Supabase.
// Vous pouvez les obtenir dans : Project Settings -> API
const SUPABASE_URL = "https://idayciottvjyeuovylar.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYXljaW90dHZqeWV1b3Z5bGFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MTM4NjIsImV4cCI6MjA5NTk4OTg2Mn0.kdTEeEJ6i8qTGv6Rn-Ute46pd0RMYfHhdVGaNNU0D10";

let supabaseClient = null;

try {
    // Le CDN Supabase expose un objet global 'supabase'
    if (typeof supabase !== 'undefined' && supabase.createClient) {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("Client Supabase initialisé avec succès !");
    } else {
        console.warn("L'objet global 'supabase' n'est pas encore défini. L'initialisation se fera au chargement de la page.");
    }
} catch (error) {
    console.error("Erreur lors de l'initialisation de Supabase :", error);
}

// Fonction utilitaire pour s'assurer que le client est prêt
function getSupabaseClient() {
    if (!supabaseClient && typeof supabase !== 'undefined') {
        supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabaseClient;
}
