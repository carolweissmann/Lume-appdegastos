// ─── Referências ───────────────────────────────────
const splash = document.getElementById('screen-splash');
const login  = document.getElementById('screen-login');

// ─── Navegação splash → login ──────────────────────
function goToLogin() {
    splash.classList.add('is-offscreen-left');
    login.classList.remove('is-offscreen-right');
}

document.getElementById('js-continue').addEventListener('click', goToLogin);
document.getElementById('js-skip').addEventListener('click', goToLogin);

// ─── Toggle visibilidade da senha ──────────────────
const pwdInput = document.getElementById('js-pwd');
const eyeBtn   = document.getElementById('js-eye');

eyBtn.addEventListener('click', () => {
    const show = pwdInput.type === 'password';
    pwdInput.type = show ? 'text' : 'password';
    eyeBtn.style.color = show ? 'var(--orange)' : '';
});

// ─── Login → Dashboard (próxima tela) ─────────────
document.getElementById('js-login').addEventListener('click', () => {
    // TODO: criar screen-dashboard e navegar aqui
    console.log('→ ir para o Dashboard');
});
