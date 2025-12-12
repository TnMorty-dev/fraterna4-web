/**
 * Discord OAuth2 Controller
 * Handles login, logout, and role verification
 */
(function () {
    'use strict';

    // Configuration - CONFIGURED FOR FRATERNA 4
    const CONFIG = {
        CLIENT_ID: '1271113233423532083',
        REDIRECT_URI: 'https://tnmorty-dev.github.io/fraterna4-web/callback.html',
        REQUIRED_ROLE_ID: '1449110610779312148',
        GUILD_ID: '1240583622214549515',
        // Server info - to be revealed when authorized
        SERVER_IP: 'Próximamente',
        MODS_ZIP_URL: '#',
        MODS_MEDIAFIRE_URL: '#'
    };

    const DISCORD_API = 'https://discord.com/api/v10';
    const OAUTH_URL = `https://discord.com/api/oauth2/authorize?client_id=${CONFIG.CLIENT_ID}&redirect_uri=${encodeURIComponent(CONFIG.REDIRECT_URI)}&response_type=token&scope=identify%20guilds.members.read`;

    class DiscordAuth {
        constructor() {
            this.user = null;
            this.hasAccess = false;
        }

        init() {
            this.checkStoredSession();
            this.setupEventListeners();
            this.updateUI();
        }

        checkStoredSession() {
            const stored = localStorage.getItem('discord_user');
            const token = localStorage.getItem('discord_token');
            const expiry = localStorage.getItem('discord_expiry');

            if (stored && token && expiry) {
                if (Date.now() < parseInt(expiry)) {
                    this.user = JSON.parse(stored);
                    this.hasAccess = localStorage.getItem('discord_access') === 'true';
                } else {
                    this.clearSession();
                }
            }
        }

        setupEventListeners() {
            const loginBtn = document.getElementById('discord-login-btn');
            const logoutBtn = document.getElementById('logout-btn');
            const copyIpBtn = document.getElementById('copy-ip-btn');

            if (loginBtn) {
                loginBtn.addEventListener('click', () => this.login());
            }
            if (logoutBtn) {
                logoutBtn.addEventListener('click', () => this.logout());
            }
            if (copyIpBtn) {
                copyIpBtn.addEventListener('click', () => this.copyIP());
            }
        }

        login() {
            window.location.href = OAUTH_URL;
        }

        logout() {
            this.clearSession();
            this.user = null;
            this.hasAccess = false;
            this.updateUI();
            showToast('Sesión cerrada');
        }

        clearSession() {
            localStorage.removeItem('discord_user');
            localStorage.removeItem('discord_token');
            localStorage.removeItem('discord_expiry');
            localStorage.removeItem('discord_access');
        }

        async handleCallback(accessToken, expiresIn) {
            try {
                // Get user info
                const userRes = await fetch(`${DISCORD_API}/users/@me`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });

                if (!userRes.ok) throw new Error('Failed to get user info');
                this.user = await userRes.json();

                // Store session
                localStorage.setItem('discord_user', JSON.stringify(this.user));
                localStorage.setItem('discord_token', accessToken);
                localStorage.setItem('discord_expiry', (Date.now() + expiresIn * 1000).toString());

                // Check role access (simplified - in production use backend)
                // For now, grant access to all authenticated users
                // In production, you'd verify roles via a backend API
                this.hasAccess = true;
                localStorage.setItem('discord_access', 'true');

                showToast(`¡Bienvenido, ${this.user.username}!`);
                this.updateUI();

            } catch (error) {
                console.error('Auth error:', error);
                showToast('Error al iniciar sesión');
                this.clearSession();
            }
        }

        updateUI() {
            const loginSection = document.getElementById('members-login');
            const contentSection = document.getElementById('members-content');
            const accessDenied = document.getElementById('access-denied');
            const fullAccess = document.getElementById('full-access');
            const userAvatar = document.getElementById('user-avatar');
            const userName = document.getElementById('user-name');
            const serverIp = document.getElementById('server-ip');
            const downloadPrimary = document.getElementById('download-primary');
            const downloadMediafire = document.getElementById('download-mediafire');

            if (this.user) {
                // User is logged in
                if (loginSection) loginSection.style.display = 'none';
                if (contentSection) contentSection.style.display = 'block';

                // Update user info
                if (userAvatar) {
                    const avatarUrl = this.user.avatar
                        ? `https://cdn.discordapp.com/avatars/${this.user.id}/${this.user.avatar}.png`
                        : `https://cdn.discordapp.com/embed/avatars/${parseInt(this.user.discriminator || '0') % 5}.png`;
                    userAvatar.src = avatarUrl;
                }
                if (userName) userName.textContent = this.user.global_name || this.user.username;

                if (this.hasAccess) {
                    // Has required role
                    if (accessDenied) accessDenied.style.display = 'none';
                    if (fullAccess) fullAccess.style.display = 'grid';
                    if (serverIp) serverIp.textContent = CONFIG.SERVER_IP;
                    if (downloadPrimary) downloadPrimary.href = CONFIG.MODS_ZIP_URL;
                    if (downloadMediafire) downloadMediafire.href = CONFIG.MODS_MEDIAFIRE_URL;
                } else {
                    // Logged in but no role
                    if (accessDenied) accessDenied.style.display = 'block';
                    if (fullAccess) fullAccess.style.display = 'none';
                }
            } else {
                // Not logged in
                if (loginSection) loginSection.style.display = 'block';
                if (contentSection) contentSection.style.display = 'none';
            }
        }

        copyIP() {
            const ip = CONFIG.SERVER_IP;
            navigator.clipboard.writeText(ip).then(() => {
                showToast('¡IP copiada!');
            }).catch(() => {
                showToast('Error al copiar');
            });
        }
    }

    // Toast notification helper
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
        window.discordAuth = new DiscordAuth();
        window.discordAuth.init();
    });

    // Export
    window.DiscordAuth = DiscordAuth;
    window.showToast = showToast;

})();
