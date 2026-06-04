// ==========================================
// MOCK DATABASES (FALLBACK)
// ==========================================

const MEMBERS_DB = [
    { id: "memb-1", name: "Rosalya", class: "Eniripsa", level: 200, rank: "RosEvent", rankIcon: "🌸", avatar: "assets/rosalya_avatar.png", success_points: 14200, alignment: "Bontarien" },
    { id: "memb-2", name: "Sramy-Dew", class: "Sram", level: 200, rank: "Meneuse", rankIcon: "👑", avatar: "assets/guild_crest.png", success_points: 12450, alignment: "Brakmarien" },
    { id: "memb-3", name: "Lysandra", class: "Cra", level: 200, rank: "Rosy Diamond", rankIcon: "⚜️", avatar: "assets/rosalya_avatar.png", success_points: 9800, alignment: "Bontarien" },
    { id: "memb-4", name: "Grominet", class: "Ecaflip", level: 198, rank: "Rouletteur", rankIcon: "🎲", avatar: "assets/guild_crest.png", success_points: 6200, alignment: "Neutre" },
    { id: "memb-5", name: "Fecator", class: "Feca", level: 200, rank: "Rosy Diamond", rankIcon: "⚜️", avatar: "assets/guild_members.png", success_points: 15420, alignment: "Neutre" },
    { id: "memb-6", name: "Sadidette", class: "Sadida", level: 195, rank: "Rouletteur", rankIcon: "🎲", avatar: "assets/rosalya_avatar.png", success_points: 4800, alignment: "Neutre" },
    { id: "memb-7", name: "Iop-Rose", class: "Iop", level: 200, rank: "RosEvent", rankIcon: "🌸", avatar: "assets/guild_members.png", success_points: 11100, alignment: "Bontarien" },
    { id: "memb-8", name: "Pandala-Bier", class: "Pandawa", level: 185, rank: "P'tite Rosette", rankIcon: "🌹", avatar: "assets/guild_crest.png", success_points: 3400, alignment: "Neutre" },
    { id: "memb-9", name: "Tictac-Time", class: "Xelor", level: 200, rank: "Rouletteur", rankIcon: "🎲", avatar: "assets/guild_members.png", success_points: 8900, alignment: "Brakmarien" },
    { id: "memb-10", name: "Sacri-Fils", class: "Sacrieur", level: 190, rank: "P'tite Rosette", rankIcon: "🌹", avatar: "assets/guild_crest.png", success_points: 5400, alignment: "Brakmarien" }
];

const MOCK_EVENTS = [
    { id: "evt-tournoi-3v3", day: "24", month: "Mai", time: "20h00", title: "Tournoi de la Rose Écarlate", desc: "Préparez vos équipes pour notre grand tournoi 3v3 annuel inter-membres ! Draft de classes classique dans les arènes de guilde.", organizer: "Sramy-Dew", participants: 12 },
    { id: "evt-harebourg", day: "31", month: "Mai", time: "21h00", title: "Sortie Donjon : Comte Harebourg", desc: "Sortie d'aide pour débloquer Frigost III. On explique les mécaniques de temps et de placement pour que tout le monde reparte avec son succès.", organizer: "Fecator", participants: 6 },
    { id: "evt-chasse", day: "07", month: "Juin", time: "19h00", title: "Chasse au Trésor Géante", desc: "Chasse d'indices collaborative à travers Astrub et Amakna, suivie d'un quizz de culture Dofus en vocal !", organizer: "Rosalya", participants: 15 }
];

const SKINS_DB = [
    { winner: "Lysandra", theme: "Fleurs Sauvages", reward: "5 000 000 Kamas", image: "assets/rosalya_avatar.png", date: "Mai 2026" },
    { winner: "Sramy-Dew", theme: "Ombres de la Forêt", reward: "3 000 000 Kamas", image: "assets/guild_crest.png", date: "Avril 2026" },
    { winner: "Rosalya", theme: "Fleur Céleste", reward: "2 000 000 Kamas", image: "assets/guild_members.png", date: "Mars 2026" }
];

const GARDEN_DB = [
    { image: "assets/garden_memory_1.jpg", caption: "Rassemblement sous le cerisier céleste" },
    { image: "assets/garden_memory_2.png", caption: "Duo complice en pleine exploration" }
];

const HALL_DETAILED_DB = [
    { trophy: "🏆", title: "Meilleur temps : Comte Harebourg", desc: "La Team Sramy a surclassé le donjon du Comte Harebourg en un temps record de 48 minutes et 32 secondes !", winner: "Team Sramy", sub: "Mai 2026", avatar: "assets/guild_members.png", rank: "Meneuse" },
    { trophy: "👗", title: "Maître du Style", desc: "Élue plus belle apparence de la guilde lors du concours de skins printanier avec un build floral exceptionnel.", winner: "Lysandra", sub: "Thème : Floral", avatar: "assets/podium_char2.png", rank: "Rosy Diamond" },
    { trophy: "💰", title: "Plus grand Donateur", desc: "A fait don d'une somme colossale à la caisse de guilde pour financer l'enclos de guilde 10 places.", winner: "Rosalya", sub: "12 000 000 Kamas", avatar: "assets/rosalya_avatar.png", rank: "RosEvent" },
    { trophy: "⚔️", title: "Aventurier Légendaire", desc: "Le premier membre à avoir atteint 15 000 points de succès sur son personnage principal au sein de la guilde.", winner: "Fecator", sub: "15 420 Succès", avatar: "assets/podium_char1.png", rank: "Rosy Diamond" }
];

// State variables
let currentUserProfile = null;
let currentSession = null;
let globalMembersList = [];

// ==========================================
// TOAST ALERTS SYSTEM
// ==========================================

function showToast(message, type = "success") {
    // Remove existing toasts
    document.querySelectorAll(".toast-alert").forEach(t => t.remove());

    const toast = document.createElement("div");
    toast.className = `toast-alert ${type}`;
    toast.innerHTML = `
        <span>${type === 'success' ? '🌸' : '⚠️'}</span>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    // Auto removal
    setTimeout(() => {
        toast.style.animation = "toast-slide-in 0.3s reverse forwards ease-out";
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}

// ==========================================
// UTILITY: CHECK IF SUPABASE CONNECTED
// ==========================================

function isSupabaseConfigured() {
    if (localStorage.getItem("rosee_force_demo") === "true") {
        return false;
    }
    const client = getSupabaseClient();
    if (!client) return false;
    
    // Check if configuration parameters are still placeholders
    const isPlaceholder = SUPABASE_URL === "https://votre-projet.supabase.co" || 
                          SUPABASE_ANON_KEY === "votre-cle-anon-publique-ici" ||
                          !SUPABASE_URL || !SUPABASE_ANON_KEY;
    return !isPlaceholder;
}

function hasSupabaseKeys() {
    const isPlaceholder = SUPABASE_URL === "https://votre-projet.supabase.co" || 
                          SUPABASE_ANON_KEY === "votre-cle-anon-publique-ici" ||
                          !SUPABASE_URL || !SUPABASE_ANON_KEY;
    return !isPlaceholder;
}

// ==========================================
// CORE APP INITIALIZATION
// ==========================================

document.addEventListener("DOMContentLoaded", async () => {
    initSPA();
    initPetalsAnimation();
    initHoverSparkles();
    initGallery();
    initHallOfFame();
    initRoulette();
    await initLivreDor();
    renderAuthModeIndicator();
    initFramesShowcaseDrawer();
    
    // Init Supabase Connection or fall back
    if (isSupabaseConfigured()) {
        console.log("Supabase configuré. Lancement des fonctionnalités cloud...");
        await initSupabaseAuth();
    } else {
        console.warn("Supabase non configuré. Mode démo (mock local) activé.");
        showToast("Site en mode Démo. Connectez Supabase pour activer les comptes !", "error");
        await initLocalDemoAuth();
    }
});

// ==========================================
// SPA ROUTER & NAVIGATION
// ==========================================

function initSPA() {
    const navButtons = document.querySelectorAll(".nav-btn");
    const tabs = document.querySelectorAll(".tab-content");
    const navLinks = document.getElementById("nav-links");
    const mobileMenuToggle = document.getElementById("mobile-menu-toggle");

    function switchTab(tabId) {
        navButtons.forEach(btn => btn.classList.remove("active"));
        tabs.forEach(tab => tab.classList.remove("active"));

        const activeNavBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
        if (activeNavBtn) activeNavBtn.classList.add("active");

        const targetTab = document.getElementById(tabId);
        if (targetTab) {
            targetTab.classList.add("active");
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        // Close mobile
        navLinks.classList.remove("active");
        mobileMenuToggle.classList.remove("active");
    }

    navButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            switchTab(btn.getAttribute("data-tab"));
        });
    });

    document.addEventListener("click", (e) => {
        const button = e.target.closest("[data-target-tab]");
        if (button) {
            switchTab(button.getAttribute("data-target-tab"));
        }
    });

    mobileMenuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        mobileMenuToggle.classList.toggle("active");
    });
}

// ==========================================
// SUPABASE AUTH & SESSION LOGIC
// ==========================================

async function initSupabaseAuth() {
    const client = getSupabaseClient();
    
    // Listen to session state changes
    client.auth.onAuthStateChange(async (event, session) => {
        currentSession = session;
        const user = session?.user || null;

        if (user) {
            // User is signed in, fetch or create profile
            await fetchUserProfile(user);
        } else {
            // User is logged out
            currentUserProfile = null;
            updateUIForLoggedOut();
        }
        
        // Reload data
        await loadMembers();
        await loadEvents();
        await loadAdminDashboard();
    });

    // Sign in listener
    const signinForm = document.getElementById("signin-form");
    signinForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("signin-email").value.trim();
        const password = document.getElementById("signin-password").value;

        try {
            const { error } = await client.auth.signInWithPassword({ email, password });
            if (error) throw error;
            showToast("Connexion réussie !");
        } catch (error) {
            console.error("Login error:", error);
            showToast("Erreur de connexion : " + error.message, "error");
        }
    });

    // Sign up listener
    const signupForm = document.getElementById("signup-form");
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("signup-username").value.trim();
        const className = document.getElementById("signup-class").value;
        const level = parseInt(document.getElementById("signup-level").value);
        const email = document.getElementById("signup-email-input").value.trim();
        const password = document.getElementById("signup-password-input").value;

        try {
            // Sign up auth account
            const { data, error } = await client.auth.signUp({
                email,
                password,
                options: {
                    data: { username, class: className, level }
                }
            });

            if (error) throw error;

            if (data.user) {
                // Insert profile entry manually
                const { error: profileError } = await client
                    .from('profiles')
                    .insert({
                        id: data.user.id,
                        username: username,
                        class: className,
                        level: level,
                        rank: 'P\'tite Rosette',
                        role: 'user',
                        success_points: 0,
                        alignment: 'Neutre'
                    });

                if (profileError) console.error("Error creating profile entry:", profileError);
                
                showToast("Compte créé avec succès ! Connectez-vous.");
                // Switch back to Sign In form
                document.getElementById("btn-toggle-to-signin").click();
            }
        } catch (error) {
            console.error("Signup error:", error);
            showToast("Erreur lors de l'inscription : " + error.message, "error");
        }
    });

    // Update Profile dashboard listener
    const updateProfileForm = document.getElementById("profile-update-form");
    updateProfileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!currentUserProfile) return;

        const className = document.getElementById("profile-class-select").value;
        const level = parseInt(document.getElementById("profile-level-input").value);
        const successPoints = parseInt(document.getElementById("profile-success-input").value) || 0;
        const alignment = document.getElementById("profile-align-select").value;
 
        try {
            const { error } = await client
                .from('profiles')
                .update({ 
                    class: className, 
                    level: level,
                    success_points: successPoints,
                    alignment: alignment
                })
                .eq('id', currentUserProfile.id);

            if (error) throw error;

            showToast("Informations de personnage mises à jour !");
            await fetchUserProfile(client.auth.user ? client.auth.user : currentSession.user);
            await loadMembers();
        } catch (error) {
            console.error("Profile update error:", error);
            showToast("Erreur de mise à jour : " + error.message, "error");
        }
    });

    // Sign out listener
    const signoutBtn = document.getElementById("btn-signout");
    signoutBtn.addEventListener("click", async () => {
        try {
            const { error } = await client.auth.signOut();
            if (error) throw error;
            showToast("Déconnexion réussie.");
        } catch (error) {
            showToast("Erreur de déconnexion : " + error.message, "error");
        }
    });

    // Login/Signup form toggles
    document.getElementById("btn-toggle-to-signup").addEventListener("click", () => {
        document.getElementById("signin-form").style.display = "none";
        document.getElementById("signup-form").style.display = "flex";
        document.getElementById("auth-title").textContent = "Inscription à la Guilde";
        document.getElementById("auth-subtitle").textContent = "Créez votre compte de guilde et paramétrez votre personnage.";
    });

    document.getElementById("btn-toggle-to-signin").addEventListener("click", () => {
        document.getElementById("signup-form").style.display = "none";
        document.getElementById("signin-form").style.display = "flex";
        document.getElementById("auth-title").textContent = "Connexion à la Confrérie";
        document.getElementById("auth-subtitle").textContent = "Accédez à votre espace membre pour gérer votre personnage.";
    });
}

async function fetchUserProfile(user) {
    const client = getSupabaseClient();
    try {
        const { data, error } = await client
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code === 'PGRST116') {
            // Profile entry doesn't exist, create it from auth metadata
            const username = user.user_metadata?.username || "Aventurier";
            const className = user.user_metadata?.class || "Iop";
            const level = user.user_metadata?.level || 200;

            const { data: newProfile, error: createError } = await client
                .from('profiles')
                .insert({
                    id: user.id,
                    username,
                    class: className,
                    level,
                    rank: 'P\'tite Rosette',
                    role: 'user',
                    success_points: 0,
                    alignment: 'Neutre'
                })
                .select()
                .single();

            if (createError) throw createError;
            currentUserProfile = newProfile;
        } else if (error) {
            throw error;
        } else {
            currentUserProfile = data;
        }

        updateUIForLoggedIn();
    } catch (error) {
        console.error("Error fetching user profile:", error);
    }
}

function updateUIForLoggedIn() {
    if (!currentUserProfile) return;

    // Navbar connection status update
    const navBtnAuth = document.getElementById("nav-btn-auth");
    navBtnAuth.innerHTML = `<i class="fas fa-user-shield"></i> ${currentUserProfile.username}`;
    
    // Toggle login/profile dashboards
    document.getElementById("auth-logged-out-view").style.display = "none";
    document.getElementById("auth-logged-in-view").style.display = "block";

    // Set profile inputs values
    document.getElementById("profile-username").textContent = currentUserProfile.username;
    document.getElementById("profile-rank").textContent = currentUserProfile.rank;
    document.getElementById("profile-role-badge").textContent = currentUserProfile.role === 'admin' ? "Officier 🛡️" : "Membre";
    document.getElementById("profile-class-select").value = currentUserProfile.class;
    document.getElementById("profile-level-input").value = currentUserProfile.level;

    // Set profile avatar
    const profileAvatar = document.getElementById("profile-avatar");
    if (profileAvatar) {
        profileAvatar.src = currentUserProfile.avatar_url || "assets/guild_crest.png";
    }
    updateProfileAvatarFrame();

    const successPoints = currentUserProfile.success_points || 0;
    const alignment = currentUserProfile.alignment || "Neutre";

    const successInput = document.getElementById("profile-success-input");
    if (successInput) successInput.value = successPoints;

    const alignSelect = document.getElementById("profile-align-select");
    if (alignSelect) alignSelect.value = alignment;

    const alignDisplay = document.getElementById("profile-align-display");
    if (alignDisplay) {
        alignDisplay.innerHTML = alignment === "Bontarien" ? "💙 Bontarien" : alignment === "Brakmarien" ? "🔴 Brâkmarien" : "⚖️ Neutre";
    }
    const successDisplay = document.getElementById("profile-success-display");
    if (successDisplay) {
        successDisplay.innerHTML = `🏆 ${successPoints.toLocaleString()} Succès`;
    }

    // Show Admin Link if they are admin
    const navItemAdmin = document.getElementById("nav-item-admin");
    if (currentUserProfile.role === 'admin') {
        navItemAdmin.style.display = "block";
    } else {
        navItemAdmin.style.display = "none";
    }
}

function updateUIForLoggedOut() {
    const navBtnAuth = document.getElementById("nav-btn-auth");
    navBtnAuth.innerHTML = `<i class="fas fa-user-circle"></i> Connexion`;

    document.getElementById("auth-logged-in-view").style.display = "none";
    document.getElementById("auth-logged-out-view").style.display = "block";
    document.getElementById("nav-item-admin").style.display = "none";
}

// ==========================================
// LOAD MEMBERS FROM DATABASE
// ==========================================

async function loadMembers() {
    if (isSupabaseConfigured()) {
        const client = getSupabaseClient();
        try {
            const { data, error } = await client
                .from('profiles')
                .select('*')
                .order('username', { ascending: true });

            if (error) throw error;

            globalMembersList = data.map(dbMember => ({
                id: dbMember.id,
                name: dbMember.username,
                class: dbMember.class,
                level: dbMember.level,
                rank: dbMember.rank,
                rankIcon: getRankIcon(dbMember.rank),
                avatar: dbMember.avatar_url || 'assets/guild_crest.png',
                role: dbMember.role,
                success_points: dbMember.success_points || 0,
                alignment: dbMember.alignment || 'Neutre'
            }));

            renderMembersList(globalMembersList);
        } catch (error) {
            console.error("Error loading profiles:", error);
        }
    } else {
        const localUsers = JSON.parse(localStorage.getItem("rosee_demo_users")) || [];
        const localMembers = localUsers.map(u => ({
            id: u.profile.id,
            name: u.profile.username,
            class: u.profile.class,
            level: u.profile.level,
            rank: u.profile.rank,
            rankIcon: getRankIcon(u.profile.rank),
            avatar: u.profile.avatar_url || 'assets/guild_crest.png',
            role: u.profile.role,
            success_points: u.profile.success_points || 0,
            alignment: u.profile.alignment || 'Neutre'
        }));

        const mergedList = [...MEMBERS_DB];
        localMembers.forEach(lm => {
            const exists = mergedList.some(m => m.name.toLowerCase() === lm.name.toLowerCase());
            if (!exists) {
                mergedList.push(lm);
            } else {
                const idx = mergedList.findIndex(m => m.name.toLowerCase() === lm.name.toLowerCase());
                mergedList[idx] = { ...mergedList[idx], ...lm };
            }
        });

        const customRanks = JSON.parse(localStorage.getItem("rosee_custom_ranks")) || {};
        globalMembersList = mergedList.map(m => {
            const rankName = customRanks[m.name] || m.rank;
            return {
                ...m,
                rank: rankName,
                rankIcon: getRankIcon(rankName),
                success_points: m.success_points || 0,
                alignment: m.alignment || 'Neutre'
            };
        });

        renderMembersList(globalMembersList);
    }
}

function getRankIcon(rankName) {
    const icons = {
        "Meneuse": "👑",
        "Rosy Diamond": "⚜️",
        "Veilleur Solidaire": "🕯️",
        "RosEvent": "🌸",
        "Bâtisseur de Fortune": "🪙",
        "Rouletteur": "🎲",
        "P'tite Rosette": "🌹"
    };
    return icons[rankName] || "👤";
}



function renderMembersList(list) {
    const container = document.getElementById("members-container");
    const searchInput = document.getElementById("member-search");
    const rankFilter = document.getElementById("member-rank-filter");
    const classFilter = document.getElementById("member-class-filter");

    if (!container) return;

    // Filter implementation helper
    function refreshList() {
        const query = searchInput.value.toLowerCase().trim();
        const rank = rankFilter.value;
        const charClass = classFilter.value;

        container.innerHTML = "";

        const filtered = list.filter(m => {
            const matchesSearch = m.name.toLowerCase().includes(query) || m.class.toLowerCase().includes(query);
            const matchesRank = rank === "all" || m.rank === rank;
            const matchesClass = charClass === "all" || m.class === charClass;
            return matchesSearch && matchesRank && matchesClass;
        });

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="card-parchment" style="grid-column: 1 / -1; text-align: center; padding: 40px 0;">
                    <p style="font-size: 1.1rem; font-weight: 700; color: var(--bg-burgundy);">Aucun membre ne correspond à cette recherche. 🍂</p>
                </div>
            `;
            return;
        }

        const isAdmin = currentUserProfile && currentUserProfile.role === 'admin';

        filtered.forEach(member => {
            const card = document.createElement("div");
            card.className = "member-card";
            const equippedFrame = (currentUserProfile && member.id === currentUserProfile.id)
                ? (localStorage.getItem(`rosee_equipped_frame_${currentUserProfile.id}`) || member.rank)
                : member.rank;
            const frameClass = getFrameClassByRank(equippedFrame);
            card.innerHTML = `
                <div class="member-avatar-box ${frameClass}">
                    <img class="member-avatar-img" src="${member.avatar}" alt="${member.name}">
                    <span class="member-rank-icon" title="${member.rank}" id="rank-badge-${member.id || 'mock'}">${member.rankIcon}</span>
                </div>
                <div class="member-info-group">
                    <h3>${member.name}</h3>
                    <div class="member-class-name">${getClassEmoji(member.class)} ${member.class}</div>
                    <div class="member-level">Niveau ${member.level}</div>
                    <div class="member-stats" style="font-size: 0.75rem; margin: 0; color: var(--text-dark); display: flex; justify-content: center; gap: 8px; font-weight: 500;">
                        <span class="member-success" title="Points de succès" style="color: var(--bg-burgundy); font-weight: 600;">🏆 ${member.success_points ? member.success_points.toLocaleString() : 0}</span>
                        <span style="color: rgba(74, 14, 23, 0.25);">|</span>
                        <span class="member-alignment">${member.alignment === 'Bontarien' ? '💙 Bontarien' : member.alignment === 'Brakmarien' ? '🔴 Brâkmarien' : '⚖️ Neutre'}</span>
                    </div>
                    
                    ${isAdmin && member.id && member.id !== currentUserProfile.id ? `
                        <div style="margin-top: 3px;">
                            <select class="rank-select-admin" data-member-id="${member.id}">
                                <option value="Meneuse" ${member.rank === 'Meneuse' ? 'selected' : ''}>Meneuse</option>
                                <option value="Rosy Diamond" ${member.rank === 'Rosy Diamond' ? 'selected' : ''}>Rosy Diamond</option>
                                <option value="RosEvent" ${member.rank === 'RosEvent' ? 'selected' : ''}>RosEvent</option>
                                <option value="Rouletteur" ${member.rank === 'Rouletteur' ? 'selected' : ''}>Rouletteur</option>
                                <option value="Veilleur Solidaire" ${member.rank === 'Veilleur Solidaire' ? 'selected' : ''}>Veilleur Solidaire</option>
                                <option value="Bâtisseur de Fortune" ${member.rank === 'Bâtisseur de Fortune' ? 'selected' : ''}>Bâtisseur de Fortune</option>
                                <option value="P'tite Rosette" ${member.rank === 'P\'tite Rosette' ? 'selected' : ''}>P'tite Rosette</option>
                            </select>
                        </div>
                    ` : ''}
                </div>
            `;
            container.appendChild(card);
        });

        // Rank updates event handler
        if (isAdmin) {
            container.querySelectorAll(".rank-select-admin").forEach(select => {
                select.addEventListener("change", async (e) => {
                    const memberId = select.getAttribute("data-member-id");
                    const newRank = select.value;

                    if (!isSupabaseConfigured()) {
                        // Demo mode: update local storage
                        const member = globalMembersList.find(m => m.id === memberId);
                        if (member) {
                            const customRanks = JSON.parse(localStorage.getItem("rosee_custom_ranks")) || {};
                            customRanks[member.name] = newRank;
                            localStorage.setItem("rosee_custom_ranks", JSON.stringify(customRanks));
                            
                            // Also update rosee_demo_users if this is a registered local user
                            const localUsers = JSON.parse(localStorage.getItem("rosee_demo_users")) || [];
                            const idx = localUsers.findIndex(u => u.profile.id === memberId);
                            if (idx !== -1) {
                                localUsers[idx].profile.rank = newRank;
                                localStorage.setItem("rosee_demo_users", JSON.stringify(localUsers));
                            }
                        }
                        showToast(`Rang mis à jour : ${newRank} (Démo) !`);
                        await loadMembers();
                        return;
                    }

                    const client = getSupabaseClient();
                    try {
                        const { error } = await client
                            .from('profiles')
                            .update({ rank: newRank })
                            .eq('id', memberId);

                        if (error) throw error;
                        showToast(`Rang mis à jour : ${newRank} !`);
                        await loadMembers();
                    } catch (error) {
                        console.error("Rank update error:", error);
                        showToast("Erreur lors de la modification de grade.", "error");
                    }
                });
            });
        }
    }

    // Connect handlers once
    searchInput.oninput = refreshList;
    rankFilter.onchange = refreshList;
    classFilter.onchange = refreshList;

    refreshList();
}

function getClassEmoji(className) {
    const classEmojis = {
        Cra: "🏹", Iop: "⚔️", Feca: "🛡️", Eniripsa: "🧪", Sacrieur: "🩸",
        Sadida: "🌿", Sram: "💀", Pandawa: "🐼", Ecaflip: "🎲", Enutrof: "⛏️",
        Xelor: "⏳", Osamodas: "🐉", Roublard: "💣", Zobal: "🎭", Steamer: "⚓",
        Hupper: "🔮", Ouginak: "🐺", Forgelance: "🔱"
    };
    return classEmojis[className] || "👤";
}

// ==========================================
// LOAD EVENTS FROM DATABASE
// ==========================================

async function loadEvents() {
    if (isSupabaseConfigured()) {
        const client = getSupabaseClient();
        try {
            // Fetch events
            const { data: dbEvents, error: evError } = await client
                .from('events')
                .select('*')
                .order('created_at', { ascending: true });

            if (evError) throw evError;

            // Fetch registrations
            const { data: dbRegs, error: regError } = await client
                .from('event_registrations')
                .select('*');

            if (regError) throw regError;

            renderEventsList(dbEvents, dbRegs);
        } catch (error) {
            console.error("Error loading events:", error);
        }
    } else {
        let localEvents = localStorage.getItem("rosee_events");
        if (!localEvents) {
            localStorage.setItem("rosee_events", JSON.stringify(MOCK_EVENTS));
            localEvents = MOCK_EVENTS;
        } else {
            localEvents = JSON.parse(localEvents);
        }

        let localRegs = localStorage.getItem("rosee_event_registrations");
        if (!localRegs) {
            localStorage.setItem("rosee_event_registrations", JSON.stringify([]));
            localRegs = [];
        } else {
            localRegs = JSON.parse(localRegs);
        }

        renderEventsList(localEvents, localRegs);
    }
}

function renderEventsList(events, registrations) {
    const fullContainer = document.getElementById("events-container-full");
    if (!fullContainer) return;

    fullContainer.innerHTML = "";

    if (events.length === 0) {
        fullContainer.innerHTML = `
            <div class="card-parchment" style="text-align: center; padding: 40px 0;">
                <p style="font-size: 1.1rem; color: var(--text-dark);">Aucun événement prévu au calendrier pour le moment. 🍂</p>
            </div>
        `;
        return;
    }

    const isAdmin = currentUserProfile && currentUserProfile.role === 'admin';
    const currentUserId = currentUserProfile?.id || null;

    events.forEach(event => {
        // Calculate participants
        const eventRegs = registrations.filter(r => r.event_id.toString() === event.id.toString());
        const isRegistered = currentUserId && eventRegs.some(r => r.user_id.toString() === currentUserId.toString());
        const displayParticipants = eventRegs.length;

        const card = document.createElement("div");
        card.className = "event-full-card";
        card.innerHTML = `
            <div class="event-card-date">
                <span class="day">${event.day}</span>
                <span class="month">${event.month}</span>
                <span class="time">${event.time}</span>
            </div>
            <div class="event-card-details">
                <div class="event-card-info">
                    <h3 style="display: flex; align-items: center;">
                        ${event.title}
                        ${isAdmin ? `<button class="event-delete-btn" data-event-id="${event.id}" title="Supprimer"><i class="fas fa-trash-alt"></i></button>` : ''}
                    </h3>
                    <p>${event.description}</p>
                    <span class="event-card-organizer"><i class="fas fa-crown"></i> Organisé par <strong>${event.organizer}</strong></span>
                </div>
                <div style="text-align: center; min-width: 140px;">
                    <p style="font-size: 0.8rem; margin-bottom: 8px; color: var(--light-gold);">
                        <i class="fas fa-users"></i> <strong>${displayParticipants}</strong> inscrits
                    </p>
                    <button class="btn-medieval btn-participate ${isRegistered ? 'registered' : ''}" data-event-id="${event.id}">
                        ${isRegistered ? '<i class="fas fa-check"></i> Inscrit' : '<i class="fas fa-file-signature"></i> Participer'}
                    </button>
                </div>
            </div>
        `;
        fullContainer.appendChild(card);
    });

    // Attach event participation click handler
    fullContainer.querySelectorAll(".btn-participate").forEach(btn => {
        btn.addEventListener("click", async () => {
            if (!currentUserProfile) {
                showToast("Vous devez être connecté pour participer à une sortie !", "error");
                document.getElementById("nav-btn-auth").click();
                return;
            }

            const eventId = btn.getAttribute("data-event-id");
            const currentUserId = currentUserProfile.id;

            if (isSupabaseConfigured()) {
                const client = getSupabaseClient();
                const isAlreadyRegistered = registrations.some(r => r.event_id === eventId && r.user_id === currentUserId);
                try {
                    if (isAlreadyRegistered) {
                        const { error } = await client
                            .from('event_registrations')
                            .delete()
                            .eq('event_id', eventId)
                            .eq('user_id', currentUserId);

                        if (error) throw error;
                        showToast("Vous êtes désinscrit de la sortie.");
                    } else {
                        const { error } = await client
                            .from('event_registrations')
                            .insert({ event_id: eventId, user_id: currentUserId });

                        if (error) throw error;
                        showToast("Vous êtes inscrit à la sortie ! ⚔️");
                    }
                    await loadEvents();
                } catch (error) {
                    console.error("Registration error:", error);
                    showToast("Erreur d'inscription.", "error");
                }
            } else {
                let localRegs = JSON.parse(localStorage.getItem("rosee_event_registrations")) || [];
                const isAlreadyRegistered = localRegs.some(r => r.event_id.toString() === eventId.toString() && r.user_id.toString() === currentUserId.toString());
                
                if (isAlreadyRegistered) {
                    localRegs = localRegs.filter(r => !(r.event_id.toString() === eventId.toString() && r.user_id.toString() === currentUserId.toString()));
                    showToast("Vous êtes désinscrit de la sortie.");
                } else {
                    localRegs.push({ event_id: eventId, user_id: currentUserId });
                    showToast("Vous êtes inscrit à la sortie ! ⚔️");
                }
                localStorage.setItem("rosee_event_registrations", JSON.stringify(localRegs));
                await loadEvents();
            }
        });
    });

    // Attach deletion handler for admin
    if (isAdmin) {
        fullContainer.querySelectorAll(".event-delete-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                if (!confirm("Voulez-vous vraiment supprimer cet événement ?")) return;

                const eventId = btn.getAttribute("data-event-id");

                if (isSupabaseConfigured()) {
                    const client = getSupabaseClient();
                    try {
                        const { error } = await client
                            .from('events')
                            .delete()
                            .eq('id', eventId);

                        if (error) throw error;
                        showToast("Événement supprimé !");
                        await loadEvents();
                    } catch (error) {
                        console.error("Delete event error:", error);
                        showToast("Erreur lors de la suppression.", "error");
                    }
                } else {
                    let localEvents = JSON.parse(localStorage.getItem("rosee_events")) || [];
                    localEvents = localEvents.filter(e => e.id.toString() !== eventId.toString());
                    localStorage.setItem("rosee_events", JSON.stringify(localEvents));
                    
                    showToast("Mode démo : Événement supprimé !");
                    await loadEvents();
                }
            });
        });
    }
}

// ==========================================
// RECRUITMENT APPLICATION
// ==========================================

const recruitmentForm = document.getElementById("recruitment-form");
if (recruitmentForm) {
    recruitmentForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("char-name").value.trim();
        const className = "Aventurier";
        const level = parseInt(document.getElementById("char-level").value);
        const discord = document.getElementById("discord-tag").value.trim();
        const motivation = document.getElementById("char-motivation").value.trim();

        if (isSupabaseConfigured()) {
            const client = getSupabaseClient();
            try {
                const { error } = await client
                    .from('applications')
                    .insert({
                        char_name: name,
                        char_class: className,
                        char_level: level,
                        discord_tag: discord,
                        motivation: motivation
                    });

                if (error) throw error;

                recruitmentForm.style.display = "none";
                document.getElementById("form-success").style.display = "block";
                showToast("Candidature envoyée avec succès !");
            } catch (error) {
                console.error("Application submission error:", error);
                showToast("Erreur lors de l'envoi de la candidature : " + error.message, "error");
            }
        } else {
            let list = JSON.parse(localStorage.getItem("rosee_applications")) || [];
            list.push({ id: Date.now(), char_name: name, char_class: className, char_level: level, discord_tag: discord, motivation, status: 'en_attente' });
            localStorage.setItem("rosee_applications", JSON.stringify(list));

            recruitmentForm.style.display = "none";
            document.getElementById("form-success").style.display = "block";
            showToast("Mode démo : Candidature enregistrée en local !");
            await loadAdminDashboard();
        }
    });

    document.getElementById("btn-success-reset").addEventListener("click", () => {
        recruitmentForm.reset();
        document.getElementById("form-success").style.display = "none";
        recruitmentForm.style.display = "flex";
        document.querySelector('.nav-btn[data-tab="tab-home"]').click();
    });
}

// ==========================================
// ADMIN DASHBOARD LOADER
// ==========================================

async function loadAdminDashboard() {
    const isAdmin = currentUserProfile && currentUserProfile.role === 'admin';
    if (!isAdmin) return;

    if (isSupabaseConfigured()) {
        const client = getSupabaseClient();
        try {
            const { data: apps, error } = await client
                .from('applications')
                .select('*')
                .eq('status', 'en_attente')
                .order('created_at', { ascending: false });

            if (error) throw error;
            renderAdminApplications(apps);
        } catch (error) {
            console.error("Error loading candidate applications:", error);
        }

        const eventForm = document.getElementById("admin-create-event-form");
        if (eventForm) {
            eventForm.onsubmit = async (e) => {
                e.preventDefault();

                const title = document.getElementById("event-title").value.trim();
                const desc = document.getElementById("event-desc").value.trim();
                const day = document.getElementById("event-day").value.trim();
                const month = document.getElementById("event-month").value.trim();
                const time = document.getElementById("event-time").value.trim();
                const organizer = document.getElementById("event-organizer").value.trim();

                try {
                    const { error } = await client
                        .from('events')
                        .insert({
                            title,
                            description: desc,
                            day,
                            month,
                            time,
                            organizer
                        });

                    if (error) throw error;

                    showToast("Nouvel événement créé avec succès ! 🛡️");
                    eventForm.reset();
                    await loadEvents();
                } catch (error) {
                    console.error("Event creation error:", error);
                    showToast("Erreur lors de la création d'événement.", "error");
                }
            };
        }
    } else {
        let apps = JSON.parse(localStorage.getItem("rosee_applications")) || [];
        let pendingApps = apps.filter(a => a.status === 'en_attente' || !a.status);
        renderAdminApplications(pendingApps);

        const eventForm = document.getElementById("admin-create-event-form");
        if (eventForm) {
            eventForm.onsubmit = async (e) => {
                e.preventDefault();

                const title = document.getElementById("event-title").value.trim();
                const desc = document.getElementById("event-desc").value.trim();
                const day = document.getElementById("event-day").value.trim();
                const month = document.getElementById("event-month").value.trim();
                const time = document.getElementById("event-time").value.trim();
                const organizer = document.getElementById("event-organizer").value.trim();

                let localEvents = JSON.parse(localStorage.getItem("rosee_events")) || [];
                localEvents.push({
                    id: "evt-" + Date.now(),
                    title,
                    description: desc,
                    day,
                    month,
                    time,
                    organizer,
                    participants: 0
                });
                localStorage.setItem("rosee_events", JSON.stringify(localEvents));

                showToast("Mode démo : Nouvel événement créé avec succès ! 🛡️");
                eventForm.reset();
                await loadEvents();
            };
        }
    }
}

function renderAdminApplications(apps) {
    const container = document.getElementById("admin-applications-list");
    if (!container) return;

    container.innerHTML = "";

    if (apps.length === 0) {
        container.innerHTML = `<p style="font-size:0.85rem; color:rgba(251,230,232,0.6); text-align:center; padding: 20px 0;">Aucune candidature en attente. 🌸</p>`;
        return;
    }

    apps.forEach(app => {
        const card = document.createElement("div");
        card.className = "admin-application-card";
        card.innerHTML = `
            <div class="admin-application-meta">
                <span>Personnage: <strong>${app.char_name}</strong></span>
                <span>Niv. ${app.char_level} - ${app.char_class}</span>
            </div>
            <p style="font-size: 0.85rem; color:#fbe6e8; margin-top:5px;">${app.motivation}</p>
            <div style="font-size: 0.8rem; color: var(--light-gold); margin-top:5px;">Discord: ${app.discord_tag || "Non fourni"}</div>
            
            <div class="admin-application-buttons">
                <button class="btn-admin-action btn-admin-approve" data-app-id="${app.id}" data-app-name="${app.char_name}"><i class="fas fa-check"></i> Recruter</button>
                <button class="btn-admin-action btn-admin-reject" data-app-id="${app.id}"><i class="fas fa-times"></i> Rejeter</button>
            </div>
        `;
        container.appendChild(card);
    });

    // Accept action
    container.querySelectorAll(".btn-admin-approve").forEach(btn => {
        btn.addEventListener("click", async () => {
            const appId = btn.getAttribute("data-app-id");
            const appName = btn.getAttribute("data-app-name");

            if (isSupabaseConfigured()) {
                const client = getSupabaseClient();
                try {
                    const { error } = await client
                        .from('applications')
                        .update({ status: 'acceptee' })
                        .eq('id', appId);

                    if (error) throw error;
                    showToast(`${appName} a été recruté avec succès !`);
                    await loadAdminDashboard();
                } catch (error) {
                    console.error("Approve candidate error:", error);
                    showToast("Erreur lors de la validation.", "error");
                }
            } else {
                let apps = JSON.parse(localStorage.getItem("rosee_applications")) || [];
                const idx = apps.findIndex(a => a.id.toString() === appId.toString());
                if (idx !== -1) {
                    apps[idx].status = 'acceptee';
                    localStorage.setItem("rosee_applications", JSON.stringify(apps));

                    // Add to custom users/members so they appear in members directory!
                    let localUsers = JSON.parse(localStorage.getItem("rosee_demo_users")) || [];
                    const email = `${apps[idx].char_name.toLowerCase().replace(/[^a-z0-9]/g, "")}@rosee.fr`;
                    localUsers.push({
                        email,
                        password: "password",
                        profile: {
                            id: "demo-user-" + apps[idx].id,
                            username: apps[idx].char_name,
                            class: apps[idx].char_class,
                            level: apps[idx].char_level,
                            rank: "P'tite Rosette",
                            role: "user",
                            avatar_url: "assets/guild_crest.png"
                        }
                    });
                    localStorage.setItem("rosee_demo_users", JSON.stringify(localUsers));
                }
                showToast(`Mode démo : ${appName} a été recruté avec succès !`);
                await loadAdminDashboard();
                await loadMembers();
            }
        });
    });

    // Reject action
    container.querySelectorAll(".btn-admin-reject").forEach(btn => {
        btn.addEventListener("click", async () => {
            const appId = btn.getAttribute("data-app-id");

            if (isSupabaseConfigured()) {
                const client = getSupabaseClient();
                try {
                    const { error } = await client
                        .from('applications')
                        .update({ status: 'refusee' })
                        .eq('id', appId);

                    if (error) throw error;
                    showToast("Candidature rejetée.");
                    await loadAdminDashboard();
                } catch (error) {
                    console.error("Reject candidate error:", error);
                    showToast("Erreur lors du rejet.", "error");
                }
            } else {
                let apps = JSON.parse(localStorage.getItem("rosee_applications")) || [];
                const idx = apps.findIndex(a => a.id.toString() === appId.toString());
                if (idx !== -1) {
                    apps[idx].status = 'refusee';
                    localStorage.setItem("rosee_applications", JSON.stringify(apps));
                }
                showToast("Mode démo : Candidature rejetée.");
                await loadAdminDashboard();
            }
        });
    });
}

// ==========================================
// OTHER VISUAL EFFECTS (GALLERY, ACCORDION...)
// ==========================================

function initPetalsAnimation() {
    const canvas = document.getElementById("petals-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
        width = (canvas.width = window.innerWidth);
        height = (canvas.height = window.innerHeight);
    });

    const petalCount = 40;
    const petals = [];

    class Petal {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * -height - 20;
            this.r = Math.random() * 6 + 4;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.velX = Math.random() * 1.5 - 0.5;
            this.velY = Math.random() * 1 + 1.2;
            this.angle = Math.random() * Math.PI * 2;
            this.angleSpeed = Math.random() * 0.02 - 0.01;
        }
        update() {
            this.x += this.velX;
            this.y += this.velY;
            this.angle += this.angleSpeed;
            if (this.y > height + 20 || this.x < -20 || this.x > width + 20) this.reset();
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.beginPath();
            ctx.ellipse(0, 0, this.r * 1.6, this.r, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(210, 93, 107, ${this.opacity})`;
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(0, 0, this.r * 1.2, this.r * 0.15, 0, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 128, 147, ${this.opacity * 0.5})`;
            ctx.fill();
            ctx.restore();
        }
    }

    for (let i = 0; i < petalCount; i++) petals.push(new Petal());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        petals.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();
}

function initHoverSparkles() {
    document.addEventListener("mousemove", (e) => {
        const hoveredBtn = e.target.closest(".btn-medieval, .nav-btn, .social-icon-btn, .btn-admin-action");
        if (!hoveredBtn) return;
        if (Math.random() > 0.15) return;
        createSparkle(e.pageX, e.pageY);
    });

    function createSparkle(x, y) {
        const sparkle = document.createElement("span");
        sparkle.classList.add("sparkle");
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 40 + 20;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed;
        sparkle.style.setProperty("--dx", `${dx}px`);
        sparkle.style.setProperty("--dy", `${dy}px`);
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        const size = Math.random() * 6 + 3;
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 800);
    }
}

function initGallery() {
    const skinsContainer = document.getElementById("skins-container");
    const gardenContainer = document.getElementById("garden-container");
    const modal = document.getElementById("lightbox-modal");
    const modalImg = document.getElementById("lightbox-img");
    const modalCaption = document.getElementById("lightbox-caption");
    const modalClose = document.getElementById("lightbox-close");

    if (!skinsContainer || !gardenContainer) return;

    skinsContainer.innerHTML = "";
    SKINS_DB.forEach(skin => {
        const card = document.createElement("div");
        card.className = "skin-card";
        card.innerHTML = `
            <div class="skin-img-wrapper">
                <img class="skin-img" src="${skin.image}" alt="Skin de ${skin.winner}">
                <span class="skin-overlay-badge">${skin.date}</span>
            </div>
            <div class="skin-details">
                <div class="skin-winner-name">${skin.winner}</div>
                <div class="skin-theme">Thème : ${skin.theme}</div>
                <div class="skin-reward"><i class="fas fa-coins"></i> ${skin.reward}</div>
            </div>
        `;
        skinsContainer.appendChild(card);
    });

    gardenContainer.innerHTML = "";
    GARDEN_DB.forEach(shot => {
        const item = document.createElement("div");
        item.className = "garden-item";
        item.innerHTML = `
            <img class="garden-screenshot" src="${shot.image}" alt="${shot.caption}">
            <div class="garden-caption">${shot.caption}</div>
        `;
        gardenContainer.appendChild(item);
    });

    document.addEventListener("click", (e) => {
        const clickImg = e.target.closest(".skin-img, .garden-screenshot");
        if (clickImg) {
            const caption = clickImg.alt || clickImg.parentElement.querySelector(".garden-caption")?.textContent || "";
            modalImg.src = clickImg.src;
            modalCaption.textContent = caption;
            modal.classList.add("active");
        }
    });

    modalClose.addEventListener("click", () => modal.classList.remove("active"));
    modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.closest(".lightbox-content") === null) modal.classList.remove("active");
    });
}

// ==========================================
// MOCK APPRECIATIONS DATA (FALLBACK)
// ==========================================
const MOCK_APPRECIATIONS = [
    {
        id: "app-1",
        sender_name: "Pandala-Bier",
        target_name: "Rosalya",
        categories: ["Aide en Donjon", "Aide à l'XP"],
        message: "Merci beaucoup à Rosalya de m'avoir aidé à passer le donjon du Chêne Mou et pour l'XP bonus, c'était super sympa !",
        created_at: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
    },
    {
        id: "app-2",
        sender_name: "Sacri-Fils",
        target_name: "Fecator",
        categories: ["Prêt d'équipement", "Quêtes & Succès"],
        message: "Un grand merci à Fecator pour le prêt de la panoplie Meulou pour mes succès, j'aurais pas pu le faire sans toi.",
        created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
    },
    {
        id: "app-3",
        sender_name: "Grominet",
        target_name: "Rosalya",
        categories: ["Aide en Donjon", "Artisanat & Métiers"],
        message: "Rosalya m'a crafté ma nouvelle cape et m'a aidé à valider les succès du donjon Mansot Royal, au top !",
        created_at: new Date(Date.now() - 3600000 * 12).toISOString()
    },
    {
        id: "app-4",
        sender_name: "Iop-Rose",
        target_name: "Lysandra",
        categories: ["Quêtes & Succès", "Dons de ressources"],
        message: "Merci Lysandra pour le coup de main sur les quêtes d'Astrub et les ressources gratuites !",
        created_at: new Date(Date.now() - 3600000 * 6).toISOString()
    },
    {
        id: "app-5",
        sender_name: "Tictac-Time",
        target_name: "Rosalya",
        categories: ["Aide en Donjon"],
        message: "Toujours présente pour m'aider sur les donjons frigost. Merci Rosalya !",
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
        id: "app-6",
        sender_name: "Eni-Soin",
        target_name: "Grominet",
        categories: ["Mission Guilde", "Artisanat & Métiers"],
        message: "Merci Grominet pour m'avoir crafté mes potions de soin et aidé sur la mission de guilde !",
        created_at: new Date(Date.now() - 3600000 * 48).toISOString()
    },
    {
        id: "app-7",
        sender_name: "Cra-Cra",
        target_name: "Sacri-Fils",
        categories: ["Aide à l'XP"],
        message: "Super session d'XP hier soir, merci Sacri-Fils !",
        created_at: new Date(Date.now() - 3600000 * 72).toISOString()
    }
];

// ==========================================
// DEFAULT DEMO USERS (LOCAL FALLBACK)
// ==========================================
const DEFAULT_DEMO_USERS = [
    {
        email: "admin@rosee.fr",
        password: "password",
        profile: {
            id: "demo-user-1",
            username: "Sramy-Dew",
            class: "Sram",
            level: 200,
            rank: "Meneuse",
            role: "admin",
            avatar_url: "assets/guild_crest.png",
            success_points: 12450,
            alignment: "Brakmarien"
        }
    },
    {
        email: "rosalya@rosee.fr",
        password: "password",
        profile: {
            id: "demo-user-2",
            username: "Rosalya",
            class: "Eniripsa",
            level: 200,
            rank: "RosEvent",
            role: "user",
            avatar_url: "assets/rosalya_avatar.png",
            success_points: 14200,
            alignment: "Bontarien"
        }
    },
    {
        email: "fecator@rosee.fr",
        password: "password",
        profile: {
            id: "demo-user-3",
            username: "Fecator",
            class: "Feca",
            level: 200,
            rank: "Rosy Diamond",
            role: "admin",
            avatar_url: "assets/guild_members.png",
            success_points: 15420,
            alignment: "Neutre"
        }
    }
];

// ==========================================
// LIVRE D'OR INITIALIZATION
// ==========================================
async function initLivreDor() {
    const form = document.getElementById("goldbook-appreciation-form");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            await submitAppreciation();
        });
    }

    toggleAppreciationForm();
    await loadAppreciations();
}

async function loadAppreciations() {
    let appreciations = [];
    if (isSupabaseConfigured()) {
        const client = getSupabaseClient();
        try {
            const { data, error } = await client
                .from('appreciations')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            appreciations = data;
        } catch (error) {
            console.error("Error loading appreciations from Supabase:", error);
            appreciations = getLocalAppreciations();
        }
    } else {
        appreciations = getLocalAppreciations();
    }

    renderLivreDor(appreciations);
}

function getLocalAppreciations() {
    let localData = localStorage.getItem("rosee_appreciations");
    if (!localData) {
        localStorage.setItem("rosee_appreciations", JSON.stringify(MOCK_APPRECIATIONS));
        return MOCK_APPRECIATIONS;
    }
    return JSON.parse(localData);
}

function renderLivreDor(appreciations) {
    // 1. Calculate leaderboard counts
    const counts = {};
    appreciations.forEach(app => {
        const target = app.target_name.trim();
        if (target) {
            counts[target] = (counts[target] || 0) + 1;
        }
    });

    // Sort descending
    const sortedLeaderboard = Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    // Top 5 Leaderboard
    const top5 = sortedLeaderboard.slice(0, 5);

    const leaderboardContainer = document.getElementById("goldbook-leaderboard");
    if (leaderboardContainer) {
        leaderboardContainer.innerHTML = "";
        if (top5.length === 0) {
            leaderboardContainer.innerHTML = `
                <p style="font-size: 0.9rem; text-align: center; opacity: 0.7; padding: 10px 0; color: var(--text-dark);">Aucun remerciement pour le moment. 🌱</p>
            `;
        } else {
            top5.forEach((item, index) => {
                const rankNum = index + 1;
                const medal = rankNum === 1 ? "🥇" : rankNum === 2 ? "🥈" : rankNum === 3 ? "🥉" : rankNum === 4 ? "🏅" : "🎖️";
                const div = document.createElement("div");
                div.className = `leaderboard-item rank-${rankNum}`;
                div.innerHTML = `
                    <div style="display: flex; align-items: center;">
                        <span class="leaderboard-rank">${medal}</span>
                        <span class="leaderboard-name">${item.name}</span>
                    </div>
                    <span class="leaderboard-count"><strong>${item.count}</strong> ${item.count > 1 ? 'mercis' : 'merci'}</span>
                `;
                leaderboardContainer.appendChild(div);
            });
        }
    }

    // 2. Render Feed
    const feedContainer = document.getElementById("goldbook-feed");
    if (feedContainer) {
        feedContainer.innerHTML = "";
        if (appreciations.length === 0) {
            feedContainer.innerHTML = `
                <p style="font-size: 0.9rem; text-align: center; opacity: 0.7; padding: 20px 0; color: var(--text-dark);">Le livre d'or est vide. Laissez un message ! ✍️</p>
            `;
        } else {
            const sortedAppreciations = [...appreciations].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            sortedAppreciations.forEach(app => {
                const card = document.createElement("div");
                card.className = "appreciation-card";
                
                let dateStr = "";
                try {
                    const d = new Date(app.created_at);
                    dateStr = d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
                } catch (e) {
                    dateStr = app.created_at;
                }

                const categoriesHtml = (app.categories || [])
                    .map(cat => `<span class="appreciation-tag">${cat}</span>`)
                    .join("");

                card.innerHTML = `
                    <div class="appreciation-card-header">
                        <div class="appreciation-players">
                            <span class="appreciation-sender">${app.sender_name}</span>
                            <span class="appreciation-arrow"><i class="fas fa-long-arrow-alt-right"></i></span>
                            <span class="appreciation-target">${app.target_name}</span>
                        </div>
                        <span class="appreciation-date">${dateStr}</span>
                    </div>
                    <div class="appreciation-categories">
                        ${categoriesHtml}
                    </div>
                    <p class="appreciation-message">"${app.message}"</p>
                `;
                feedContainer.appendChild(card);
            });
        }
    }
}

async function submitAppreciation() {
    if (!currentUserProfile) {
        showToast("Vous devez être connecté pour laisser un remerciement !", "error");
        return;
    }

    const targetInput = document.getElementById("goldbook-target");
    const messageInput = document.getElementById("goldbook-message");
    const categoryCheckboxes = document.querySelectorAll("input[name='help-category']:checked");

    const target_name = targetInput.value.trim();
    const message = messageInput.value.trim();
    
    if (!target_name) {
        showToast("Veuillez indiquer le pseudo du joueur à remercier.", "error");
        return;
    }

    if (!message) {
        showToast("Veuillez écrire un message de remerciement.", "error");
        return;
    }

    if (categoryCheckboxes.length === 0) {
        showToast("Veuillez cocher au moins une catégorie d'aide reçue.", "error");
        return;
    }

    const categories = Array.from(categoryCheckboxes).map(cb => cb.value);
    const sender_name = currentUserProfile.username;

    const newAppreciation = {
        sender_name,
        target_name,
        categories,
        message,
        created_at: new Date().toISOString()
    };

    let success = false;

    if (isSupabaseConfigured()) {
        const client = getSupabaseClient();
        try {
            const { error } = await client
                .from('appreciations')
                .insert(newAppreciation);
            if (error) throw error;
            success = true;
        } catch (error) {
            console.error("Error saving appreciation to Supabase:", error);
            showToast("Erreur lors de la sauvegarde : " + error.message, "error");
        }
    } else {
        try {
            const localData = getLocalAppreciations();
            newAppreciation.id = "app-" + Date.now();
            localData.push(newAppreciation);
            localStorage.setItem("rosee_appreciations", JSON.stringify(localData));
            success = true;
        } catch (error) {
            console.error("Error saving appreciation to local storage:", error);
            showToast("Erreur de sauvegarde locale.", "error");
        }
    }

    if (success) {
        showToast("Votre remerciement a été scellé dans le Livre d'Or ! 🌸", "success");
        playChimeSound();

        targetInput.value = "";
        messageInput.value = "";
        categoryCheckboxes.forEach(cb => cb.checked = false);

        await loadAppreciations();
    }
}

function playChimeSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioCtx.currentTime;

        const playNote = (freq, startTime, duration) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);
            
            gain.gain.setValueAtTime(0.12, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(startTime);
            osc.stop(startTime + duration);
        };

        playNote(523.25, now, 0.15); // C5
        playNote(659.25, now + 0.12, 0.15); // E5
        playNote(783.99, now + 0.24, 0.15); // G5
        playNote(1046.50, now + 0.36, 0.40); // C6
    } catch (e) {
        console.warn("Could not play victory chime:", e);
    }
}

function toggleAppreciationForm() {
    const formCard = document.getElementById("goldbook-form-card");
    const loginWarning = document.getElementById("goldbook-login-warning");

    if (!formCard || !loginWarning) return;

    if (currentUserProfile) {
        formCard.style.display = "block";
        loginWarning.style.display = "none";
    } else {
        formCard.style.display = "none";
        loginWarning.style.display = "block";
    }
}

// ==========================================
// LOCAL DEMO AUTHENTICATION
// ==========================================
async function initLocalDemoAuth() {
    let localUsers = localStorage.getItem("rosee_demo_users");
    let users = [];
    if (!localUsers) {
        users = [...DEFAULT_DEMO_USERS];
        localStorage.setItem("rosee_demo_users", JSON.stringify(users));
    } else {
        users = JSON.parse(localUsers);
        DEFAULT_DEMO_USERS.forEach(defUser => {
            if (!users.some(u => u.email.toLowerCase() === defUser.email.toLowerCase())) {
                users.push(defUser);
            }
        });
        localStorage.setItem("rosee_demo_users", JSON.stringify(users));
    }

    let customRanks = localStorage.getItem("rosee_custom_ranks");
    if (!customRanks) {
        localStorage.setItem("rosee_custom_ranks", JSON.stringify({}));
    }

    let sessionData = localStorage.getItem("rosee_demo_session");
    if (!sessionData) {
        const defaultProfile = {
            id: "demo-user-2",
            username: "Rosalya",
            class: "Eniripsa",
            level: 200,
            rank: "RosEvent",
            role: "user",
            avatar_url: "assets/rosalya_avatar.png",
            success_points: 14200,
            alignment: "Bontarien"
        };
        localStorage.setItem("rosee_demo_session", JSON.stringify(defaultProfile));
        sessionData = JSON.stringify(defaultProfile);
    }

    if (sessionData) {
        currentUserProfile = JSON.parse(sessionData);
        updateUIForLoggedIn();
    } else {
        currentUserProfile = null;
        updateUIForLoggedOut();
    }

    toggleAppreciationForm();
    await loadMembers();
    await loadEvents();
    await loadAdminDashboard();

    const signinForm = document.getElementById("signin-form");
    if (signinForm) {
        signinForm.onsubmit = null;
        signinForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("signin-email").value.trim();
            const password = document.getElementById("signin-password").value;

            const users = JSON.parse(localStorage.getItem("rosee_demo_users")) || [];
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

            if (user) {
                currentUserProfile = user.profile;
                localStorage.setItem("rosee_demo_session", JSON.stringify(currentUserProfile));
                showToast(`Connexion Démo réussie ! Bienvenue ${currentUserProfile.username}`);
                
                updateUIForLoggedIn();
                toggleAppreciationForm();
                
                loadMembers();
                loadEvents();
                loadAdminDashboard();
            } else {
                showToast("Identifiants incorrects (mode démo). Essayez rosalya@rosee.fr / password", "error");
            }
        });
    }

    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.onsubmit = null;
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("signup-username").value.trim();
            const className = document.getElementById("signup-class").value;
            const level = parseInt(document.getElementById("signup-level").value);
            const email = document.getElementById("signup-email-input").value.trim();
            const password = document.getElementById("signup-password-input").value;

            const users = JSON.parse(localStorage.getItem("rosee_demo_users")) || [];
            if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                showToast("Cet email est déjà utilisé (mode démo).", "error");
                return;
            }

            const newUser = {
                email,
                password,
                profile: {
                    id: "demo-user-" + Date.now(),
                    username,
                    class: className,
                    level,
                    rank: "P'tite Rosette",
                    role: "user",
                    avatar_url: "assets/guild_crest.png",
                    success_points: 0,
                    alignment: "Neutre"
                }
            };

            users.push(newUser);
            localStorage.setItem("rosee_demo_users", JSON.stringify(users));

            currentUserProfile = newUser.profile;
            localStorage.setItem("rosee_demo_session", JSON.stringify(currentUserProfile));
            
            showToast("Compte démo créé avec succès ! Connecté.", "success");
            
            updateUIForLoggedIn();
            toggleAppreciationForm();
            
            document.getElementById("btn-toggle-to-signin").click();
            
            loadMembers();
            loadEvents();
            loadAdminDashboard();
        });
    }

    const updateProfileForm = document.getElementById("profile-update-form");
    if (updateProfileForm) {
        updateProfileForm.onsubmit = null;
        updateProfileForm.addEventListener("submit", (e) => {
            e.preventDefault();
            if (!currentUserProfile) return;

            const className = document.getElementById("profile-class-select").value;
            const level = parseInt(document.getElementById("profile-level-input").value);
            const successPoints = parseInt(document.getElementById("profile-success-input").value) || 0;
            const alignment = document.getElementById("profile-align-select").value;
 
            currentUserProfile.class = className;
            currentUserProfile.level = level;
            currentUserProfile.success_points = successPoints;
            currentUserProfile.alignment = alignment;
            localStorage.setItem("rosee_demo_session", JSON.stringify(currentUserProfile));
 
            const users = JSON.parse(localStorage.getItem("rosee_demo_users")) || [];
            const idx = users.findIndex(u => u.profile.id === currentUserProfile.id);
            if (idx !== -1) {
                users[idx].profile.class = className;
                users[idx].profile.level = level;
                users[idx].profile.success_points = successPoints;
                users[idx].profile.alignment = alignment;
                localStorage.setItem("rosee_demo_users", JSON.stringify(users));
            }

            showToast("Profil démo mis à jour !", "success");
            updateUIForLoggedIn();
            loadMembers();
        });
    }



    const signoutBtn = document.getElementById("btn-signout");
    if (signoutBtn) {
        const newSignoutBtn = signoutBtn.cloneNode(true);
        signoutBtn.parentNode.replaceChild(newSignoutBtn, signoutBtn);
        newSignoutBtn.addEventListener("click", () => {
            currentUserProfile = null;
            localStorage.removeItem("rosee_demo_session");
            showToast("Déconnexion réussie (mode démo).");
            
            updateUIForLoggedOut();
            toggleAppreciationForm();
            
            loadMembers();
            loadEvents();
            loadAdminDashboard();
        });
    }

    const toggleToSignupBtn = document.getElementById("btn-toggle-to-signup");
    if (toggleToSignupBtn) {
        const newBtn = toggleToSignupBtn.cloneNode(true);
        toggleToSignupBtn.parentNode.replaceChild(newBtn, toggleToSignupBtn);
        newBtn.addEventListener("click", () => {
            document.getElementById("signin-form").style.display = "none";
            document.getElementById("signup-form").style.display = "flex";
            document.getElementById("auth-title").textContent = "Inscription à la Guilde";
            document.getElementById("auth-subtitle").textContent = "Créez votre compte de guilde et paramétrez votre personnage.";
        });
    }

    const toggleToSigninBtn = document.getElementById("btn-toggle-to-signin");
    if (toggleToSigninBtn) {
        const newBtn = toggleToSigninBtn.cloneNode(true);
        toggleToSigninBtn.parentNode.replaceChild(newBtn, toggleToSigninBtn);
        newBtn.addEventListener("click", () => {
            document.getElementById("signup-form").style.display = "none";
            document.getElementById("signin-form").style.display = "flex";
            document.getElementById("auth-title").textContent = "Connexion à la Confrérie";
            document.getElementById("auth-subtitle").textContent = "Accédez à votre espace membre pour gérer votre personnage.";
        });
    }
}

function initHallOfFame() {
    const container = document.getElementById("hall-of-fame-detailed-container");
    if (!container) return;
    container.innerHTML = "";
    HALL_DETAILED_DB.forEach(item => {
        const card = document.createElement("div");
        card.className = "hall-fame-card";
        const frameClass = getFrameClassByRank(item.rank || "P'tite Rosette");
        card.innerHTML = `
            <div class="hall-fame-trophy">${item.trophy}</div>
            <div class="hall-fame-info">
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            </div>
            <div class="hall-fame-winner-box">
                <span style="font-size:0.75rem; text-transform:uppercase; color:var(--light-gold);">Détenteur</span>
                <div class="hall-fame-avatar-wrapper ${frameClass}">
                    <img class="hall-fame-avatar" src="${item.avatar}" alt="Avatar de ${item.winner}">
                </div>
                <div class="hall-fame-winner-name">${item.winner}</div>
                <div class="hall-fame-stat">${item.sub}</div>
            </div>
        `;
        container.appendChild(card);
    });
}

// ==========================================
// CLASS ROULETTE FUNCTIONALITY
// ==========================================

function initRoulette() {
    const DOOFUS_CLASSES = [
        "Iop", "Crâ",
        "Eniripsa", "Ecaflip",
        "Enutrof", "Sram",
        "Sadida", "Osamodas",
        "Xélor", "Sacrieur",
        "Pandawa", "Roublard",
        "Zobal", "Steamer",
        "Eliotrope", "Huppermage",
        "Ouginak", "Féca",
        "Forgelance"
    ];

    let currentRotationAngle = 0;
    let isSpinning = false;
    let lastWinningIndex = -1;
    let isMuted = false;
    let audioCtx = null;

    function sanitizeClassName(cls) {
        return cls.toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "");
    }

    function getActiveClasses() {
        const active = [];
        DOOFUS_CLASSES.forEach(cls => {
            const chkId = `chk-class-${sanitizeClassName(cls)}`;
            const chk = document.getElementById(chkId);
            if (chk && chk.checked) {
                active.push(cls);
            }
        });
        return active;
    }

    function updateCheckedCount() {
        const checkboxes = document.querySelectorAll(".classes-checkbox-grid input[type='checkbox']");
        const checkedCount = Array.from(checkboxes).filter(c => c.checked).length;
        const totalCount = checkboxes.length;

        const countEl = document.getElementById("checked-classes-count");
        if (countEl) {
            countEl.textContent = `${checkedCount} / ${totalCount}`;
        }

        const spinBtn = document.getElementById("btn-spin");
        if (spinBtn) {
            spinBtn.disabled = (checkedCount === 0);
        }
    }

    function playTickSound() {
        if (isMuted) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.03);

            gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + 0.03);
        } catch (e) {
            console.warn(e);
        }
    }

    function playWinSound() {
        if (isMuted) return;
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            const now = audioCtx.currentTime;

            const playNote = (freq, startTime, duration) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime);
                gain.gain.setValueAtTime(0.08, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(startTime);
                osc.stop(startTime + duration);
            };

            playNote(523.25, now, 0.15); // C5
            playNote(659.25, now + 0.12, 0.15); // E5
            playNote(783.99, now + 0.24, 0.15); // G5
            playNote(1046.50, now + 0.36, 0.40); // C6
        } catch (e) {
            console.warn(e);
        }
    }

    function drawWheel(angle) {
        const canvas = document.getElementById("wheel-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;
        const radius = width / 2;

        ctx.clearRect(0, 0, width, height);

        const activeClasses = getActiveClasses();
        if (activeClasses.length === 0) {
            ctx.beginPath();
            ctx.arc(radius, radius, radius - 10, 0, 2 * Math.PI);
            ctx.fillStyle = "#120204";
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.strokeStyle = "rgba(212, 175, 55, 0.4)";
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(radius, radius, 45, 0, 2 * Math.PI);
            ctx.fillStyle = "#2e090e";
            ctx.fill();
            ctx.strokeStyle = "var(--gold)";
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.fillStyle = "rgba(251, 230, 232, 0.4)";
            ctx.font = "bold 14px 'Inter', sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("VIDE", radius, radius);
            return;
        }

        const sliceAngle = (2 * Math.PI) / activeClasses.length;

        const palette = [
            "hsl(350, 45%, 55%)",  // Deep Rose
            "hsl(280, 20%, 60%)",  // Lavender Purple
            "hsl(35, 30%, 70%)",   // Parchment Gold
            "hsl(25, 45%, 48%)",   // Warm Bronze
            "hsl(340, 55%, 62%)",  // Warm Pink
            "hsl(42, 25%, 80%)"    // Cream
        ];

        for (let i = 0; i < activeClasses.length; i++) {
            const startAngle = angle + i * sliceAngle;
            const endAngle = angle + (i + 1) * sliceAngle;

            ctx.beginPath();
            ctx.moveTo(radius, radius);
            ctx.arc(radius, radius, radius - 8, startAngle, endAngle);
            ctx.closePath();

            ctx.fillStyle = palette[i % palette.length];
            ctx.fill();

            ctx.strokeStyle = "#2e090e";
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.save();
            ctx.translate(radius, radius);
            ctx.rotate(startAngle + sliceAngle / 2);

            ctx.fillStyle = "#1c0407";
            ctx.font = "bold 13px 'Outfit', 'Inter', sans-serif";
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";

            const label = activeClasses[i].toUpperCase();
            ctx.fillText(label, radius - 35, 0);
            ctx.restore();
        }

        ctx.beginPath();
        ctx.arc(radius, radius, radius - 8, 0, 2 * Math.PI);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "var(--gold)";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(radius, radius, 45, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(46, 9, 14, 0.95)";
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "var(--gold)";
        ctx.stroke();
    }

    function getWinningClassIndex(angle, numClasses) {
        const sliceAngle = (2 * Math.PI) / numClasses;
        let normalized = (-Math.PI / 2 - angle) % (2 * Math.PI);
        if (normalized < 0) normalized += 2 * Math.PI;
        return Math.floor(normalized / sliceAngle) % numClasses;
    }

    function displayWinner(winningClass) {
        const resultDisplay = document.getElementById("roulette-result");
        const classNameEl = document.getElementById("result-class-name");
        if (resultDisplay && classNameEl) {
            classNameEl.textContent = winningClass.toUpperCase();
            resultDisplay.style.display = "flex";
            
            showToast(`🎰 ROULETTE : La classe tirée est ${winningClass} !`);
            playWinSound();
        }
    }

    const grid = document.getElementById("classes-checkbox-grid");
    if (grid) {
        grid.innerHTML = "";
        DOOFUS_CLASSES.forEach(cls => {
            const item = document.createElement("div");
            item.className = "class-checkbox-item selected";
            item.setAttribute("data-class", cls);

            const chkId = `chk-class-${sanitizeClassName(cls)}`;
            
            item.innerHTML = `
                <input type="checkbox" id="${chkId}" checked>
                <span class="checkbox-custom"></span>
                <label for="${chkId}">${cls}</label>
            `;

            grid.appendChild(item);

            const checkbox = item.querySelector("input");
            checkbox.addEventListener("change", () => {
                if (checkbox.checked) {
                    item.classList.add("selected");
                } else {
                    item.classList.remove("selected");
                }
                updateCheckedCount();
                drawWheel(currentRotationAngle);
            });

            item.addEventListener("click", (e) => {
                if (e.target !== checkbox && e.target.tagName !== "LABEL") {
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event("change"));
                }
            });
        });
    }

    const btnCheckAll = document.getElementById("btn-check-all");
    const btnUncheckAll = document.getElementById("btn-uncheck-all");

    if (btnCheckAll) {
        btnCheckAll.addEventListener("click", () => {
            const checkboxes = document.querySelectorAll(".classes-checkbox-grid input[type='checkbox']");
            checkboxes.forEach(chk => {
                chk.checked = true;
                chk.closest(".class-checkbox-item").classList.add("selected");
            });
            updateCheckedCount();
            drawWheel(currentRotationAngle);
        });
    }

    if (btnUncheckAll) {
        btnUncheckAll.addEventListener("click", () => {
            const checkboxes = document.querySelectorAll(".classes-checkbox-grid input[type='checkbox']");
            checkboxes.forEach(chk => {
                chk.checked = false;
                chk.closest(".class-checkbox-item").classList.remove("selected");
            });
            updateCheckedCount();
            drawWheel(currentRotationAngle);
        });
    }

    const soundBtn = document.getElementById("btn-sound-toggle");
    if (soundBtn) {
        soundBtn.addEventListener("click", () => {
            isMuted = !isMuted;
            if (isMuted) {
                soundBtn.classList.add("muted");
                soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                showToast("Son désactivé", "error");
            } else {
                soundBtn.classList.remove("muted");
                soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                showToast("Son activé");

                if (!audioCtx) {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
                if (audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }
                playTickSound();
            }
        });
    }

    // Listen to navigation changes to redraw the wheel when the Members tab becomes active
    const mainNavButtons = document.querySelectorAll(".nav-btn[data-tab='tab-members'], [data-target-tab='tab-members']");
    mainNavButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            setTimeout(() => {
                drawWheel(currentRotationAngle);
            }, 100);
        });
    });

    const btnSpin = document.getElementById("btn-spin");
    if (btnSpin) {
        btnSpin.addEventListener("click", () => {
            if (isSpinning) return;

            const activeClasses = getActiveClasses();
            if (activeClasses.length === 0) return;

            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }

            isSpinning = true;
            btnSpin.disabled = true;
            if (btnCheckAll) btnCheckAll.disabled = true;
            if (btnUncheckAll) btnUncheckAll.disabled = true;
            
            const checkboxes = document.querySelectorAll(".classes-checkbox-grid input[type='checkbox']");
            checkboxes.forEach(chk => chk.disabled = true);

            const resultDisplay = document.getElementById("roulette-result");
            if (resultDisplay) {
                resultDisplay.style.display = "none";
            }

            let spinVelocity = 0.4 + Math.random() * 0.25;
            const deceleration = 0.982 + Math.random() * 0.004;
            lastWinningIndex = getWinningClassIndex(currentRotationAngle, activeClasses.length);

            function animateSpin() {
                currentRotationAngle += spinVelocity;
                currentRotationAngle = currentRotationAngle % (2 * Math.PI);

                drawWheel(currentRotationAngle);

                const numClasses = activeClasses.length;
                const currentIndex = getWinningClassIndex(currentRotationAngle, numClasses);
                if (currentIndex !== lastWinningIndex) {
                    playTickSound();
                    lastWinningIndex = currentIndex;
                }

                spinVelocity *= deceleration;

                if (spinVelocity > 0.0018) {
                    requestAnimationFrame(animateSpin);
                } else {
                    isSpinning = false;
                    btnSpin.disabled = false;
                    if (btnCheckAll) btnCheckAll.disabled = false;
                    if (btnUncheckAll) btnUncheckAll.disabled = false;
                    checkboxes.forEach(chk => chk.disabled = false);

                    const winningClass = activeClasses[currentIndex];
                    displayWinner(winningClass);
                }
            }

            animateSpin();
        });
    }

    updateCheckedCount();
    drawWheel(currentRotationAngle);
}

// ==========================================
// AUTHENTICATION MODE INDICATOR & SWITCHER
// ==========================================
function renderAuthModeIndicator() {
    const container = document.getElementById("auth-mode-indicator");
    if (!container) return;

    const hasKeys = hasSupabaseKeys();

    if (isSupabaseConfigured()) {
        container.innerHTML = `
            <span class="news-tag" style="background: rgba(41, 128, 185, 0.2); border-color: #2980b9; color: #3498db; font-size: 0.75rem; font-weight: 600;">☁️ Mode Supabase Cloud</span>
            <button id="btn-toggle-demo-mode" class="btn-small-medieval" style="font-size: 0.7rem; padding: 4px 10px; margin-top: 5px;">
                <i class="fas fa-desktop"></i> Activer le Mode Démo (Local)
            </button>
        `;
    } else {
        container.innerHTML = `
            <span class="news-tag" style="background: rgba(27, 122, 36, 0.2); border-color: #27ae60; color: #2ecc71; font-size: 0.75rem; font-weight: 600;">🖥️ Mode Démo (Local)</span>
            ${hasKeys ? `
                <button id="btn-toggle-demo-mode" class="btn-small-medieval" style="font-size: 0.7rem; padding: 4px 10px; margin-top: 5px;">
                    <i class="fas fa-cloud"></i> Activer le Mode Cloud (Supabase)
                </button>
            ` : ''}
        `;
    }
}

// Bind toggle demo mode event
document.addEventListener("click", (e) => {
    const btn = e.target.closest("#btn-toggle-demo-mode");
    if (btn) {
        const currentlyForced = localStorage.getItem("rosee_force_demo") === "true";
        if (currentlyForced) {
            localStorage.removeItem("rosee_force_demo");
            showToast("Bascule vers le mode Cloud (Supabase)...");
        } else {
            localStorage.setItem("rosee_force_demo", "true");
            showToast("Bascule vers le mode Démo (Local)...");
        }
        setTimeout(() => {
            window.location.reload();
        }, 800);
    }
});

// ==========================================================
// AVATAR BORDERS & GALLERY DRAWER LOGIC
// ==========================================================

const RANK_ORDER = [
    "P'tite Rosette",
    "Bâtisseur de Fortune",
    "Veilleur Solidaire",
    "Rouletteur",
    "RosEvent",
    "Rosy Diamond",
    "Meneuse"
];

function getFrameClassByRank(rankName) {
    const classes = {
        "Meneuse": "frame-style-meneuse",
        "Rosy Diamond": "frame-style-rosydiamond",
        "RosEvent": "frame-style-rosevent",
        "Rouletteur": "frame-style-rouletteur",
        "Veilleur Solidaire": "frame-style-veilleur",
        "Bâtisseur de Fortune": "frame-style-batisseur",
        "P'tite Rosette": "frame-style-rosette"
    };
    return classes[rankName] || "frame-style-none";
}

function isFrameUnlocked(frameRank, userRank) {
    const frameIndex = RANK_ORDER.indexOf(frameRank);
    const userIndex = RANK_ORDER.indexOf(userRank);
    if (frameIndex === -1) return false;
    if (userIndex === -1) return frameRank === "P'tite Rosette";
    return userIndex >= frameIndex;
}

function updateProfileAvatarFrame() {
    const container = document.getElementById("profile-avatar-container");
    if (!container || !currentUserProfile) return;

    // Remove any existing frame classes
    container.className = "honoured-avatar-frame";
    
    // Determine equipped frame
    const equippedFrame = localStorage.getItem(`rosee_equipped_frame_${currentUserProfile.id}`) || currentUserProfile.rank;
    const frameClass = getFrameClassByRank(equippedFrame);
    if (frameClass !== "frame-style-none") {
        container.classList.add(frameClass);
    }
}

function renderFramesShowcase() {
    const container = document.getElementById("frames-list-container");
    if (!container || !currentUserProfile) return;

    container.innerHTML = "";
    
    // Ranks ordered from highest to lowest in list
    const listRanks = [...RANK_ORDER].reverse();
    const equippedFrame = localStorage.getItem(`rosee_equipped_frame_${currentUserProfile.id}`) || currentUserProfile.rank;

    listRanks.forEach(rank => {
        const isUnlocked = isFrameUnlocked(rank, currentUserProfile.rank);
        const frameClass = getFrameClassByRank(rank);
        const isEquipped = (equippedFrame === rank);
        
        const card = document.createElement("div");
        card.className = `frame-item-card ${isEquipped ? 'equipped' : ''}`;
        
        let statusBadgeClass = "locked";
        let statusBadgeText = "Verrouillé";
        if (isEquipped) {
            statusBadgeClass = "active";
            statusBadgeText = "Équipé";
        } else if (isUnlocked) {
            statusBadgeClass = "unlocked";
            statusBadgeText = "Débloqué";
        }
        
        let actionBtnHTML = "";
        if (isEquipped) {
            actionBtnHTML = `<button class="btn-equip-frame equipped" disabled>Actif</button>`;
        } else if (isUnlocked) {
            actionBtnHTML = `<button class="btn-equip-frame unlocked" data-frame-rank="${rank}">Équiper</button>`;
        } else {
            actionBtnHTML = `<button class="btn-equip-frame locked" disabled>Bloqué</button>`;
        }

        const rankTitles = {
            "Meneuse": "Bordure Royale de la Meneuse",
            "Rosy Diamond": "Bordure Éclatante Rosy Diamond",
            "RosEvent": "Bordure de Fête RosEvent",
            "Rouletteur": "Bordure Magique du Rouletteur",
            "Veilleur Solidaire": "Bordure du Veilleur Solidaire",
            "Bâtisseur de Fortune": "Bordure du Bâtisseur de Fortune",
            "P'tite Rosette": "Bordure Rose de la P'tite Rosette"
        };
        const title = rankTitles[rank] || rank;

        card.innerHTML = `
            <div class="frame-preview-box ${frameClass}">
                <img class="frame-preview-img" src="${currentUserProfile.avatar_url || 'assets/guild_crest.png'}" alt="Aperçu">
            </div>
            <div class="frame-item-info">
                <h4 class="frame-item-title">${title}</h4>
                <p class="frame-item-req">Requis : Rang <strong>${rank}</strong></p>
                <span class="frame-status-badge ${statusBadgeClass}">${statusBadgeText}</span>
            </div>
            <div class="frame-item-action">
                ${actionBtnHTML}
            </div>
        `;
        container.appendChild(card);
    });

    // Add click listeners to "Équiper" buttons
    container.querySelectorAll(".btn-equip-frame.unlocked").forEach(btn => {
        btn.addEventListener("click", () => {
            const chosenRank = btn.getAttribute("data-frame-rank");
            localStorage.setItem(`rosee_equipped_frame_${currentUserProfile.id}`, chosenRank);
            showToast("Bordure d'avatar mise à jour ! 🎨");
            
            renderFramesShowcase();
            updateProfileAvatarFrame();
            loadMembers();
        });
    });
}

function initFramesShowcaseDrawer() {
    // We use event delegation on document for the open button since the profile DOM might load asynchronously
    document.addEventListener("click", (e) => {
        const btnOpen = e.target.closest("#btn-open-frames-showcase");
        if (btnOpen) {
            if (!currentUserProfile) {
                showToast("Veuillez vous connecter pour voir vos bordures d'avatar !", "error");
                return;
            }
            const drawer = document.getElementById("frames-showcase-drawer");
            const overlay = document.getElementById("drawer-overlay");
            if (drawer && overlay) {
                drawer.classList.add("active");
                overlay.classList.add("active");
                renderFramesShowcase();
            }
        }
    });

    const closeDrawer = () => {
        const drawer = document.getElementById("frames-showcase-drawer");
        const overlay = document.getElementById("drawer-overlay");
        if (drawer && overlay) {
            drawer.classList.remove("active");
            overlay.classList.remove("active");
        }
    };

    // Close buttons and overlay listeners
    document.addEventListener("click", (e) => {
        if (e.target.closest("#btn-close-frames-showcase") || e.target === document.getElementById("drawer-overlay")) {
            closeDrawer();
        }
    });
}
