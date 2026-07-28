let bossMaxHp = 100;
let bossHp = bossMaxHp;
let playerHp = 100;
let playerMana = 100;
let difficulty = 'easy';

const bossHpFill = document.getElementById('boss-hp-fill');
const bossEl = document.getElementById('boss');
const titanDialogue = document.getElementById('titan-dialogue');
const playerHpFill = document.getElementById('player-hp');
const playerManaFill = document.getElementById('player-mana');
const hpLabel = document.getElementById('hp-label');
const manaLabel = document.getElementById('mana-label');
const victoryScreen = document.getElementById('victory-screen');

const titanLines = [
    { hp: 80, text: "You dare enter my molten domain?" },
    { hp: 60, text: "The core trembles with your defiance..." },
    { hp: 40, text: "You will be buried in magma." },
    { hp: 20, text: "My flames... they weaken..." },
    { hp: 5,  text: "No... this cannot be..." }
];

function updateBossHp() {
    const percent = Math.max(0, (bossHp / bossMaxHp) * 100);
    bossHpFill.style.width = percent + "%";

    bossEl.classList.remove('phase2', 'phase3');
    if (percent <= 60 && percent > 20) bossEl.classList.add('phase2');
    if (percent <= 20) bossEl.classList.add('phase3');

    const line = titanLines.find(l => percent <= l.hp);
    if (line) titanDialogue.innerText = line.text;

    if (percent <= 20) {
        document.body.classList.add('quake');
    } else {
        document.body.classList.remove('quake');
    }

    if (percent <= 0) {
        bossHp = 0;
        showVictory();
    }
}

function updatePlayerHud() {
    playerHp = Math.max(0, playerHp);
    playerMana = Math.max(0, playerMana);
    playerHpFill.style.width = playerHp + "%";
    playerManaFill.style.width = playerMana + "%";
    hpLabel.innerText = Math.round(playerHp) + "%";
    manaLabel.innerText = Math.round(playerMana) + "%";
}

function showVictory() {
    victoryScreen.classList.add('active');
}

function resetGame() {
    bossMaxHp = 100;
    bossHp = bossMaxHp;
    playerHp = 100;
    playerMana = 100;
    updateBossHp();
    updatePlayerHud();
    victoryScreen.classList.remove('active');
    document.body.classList.remove('quake');
}

const diffButtons = document.querySelectorAll('#difficulty button');
diffButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        diffButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        difficulty = btn.dataset.mode;

        if (difficulty === 'easy') bossMaxHp = 80;
        if (difficulty === 'normal') bossMaxHp = 100;
        if (difficulty === 'hard') bossMaxHp = 140;

        bossHp = bossMaxHp;
        updateBossHp();
    });
});

window.addEventListener('scroll', () => {
    const maxScroll = document.body.scrollHeight - window.innerHeight || 1;
    const progress = window.scrollY / maxScroll;

    bossHp = bossMaxHp * (1 - progress);
    updateBossHp();

    if (difficulty === 'hard') {
        playerHp = 100 - progress * 40;
        updatePlayerHud();
    }
});

document.getElementById('arena').addEventListener('click', (e) => {
    if (bossHp <= 0) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const fb = document.createElement('div');
    fb.classList.add('fireball');
    fb.style.left = (e.clientX - rect.left) + 'px';
    fb.style.top = (e.clientY - rect.top) + 'px';
    e.currentTarget.appendChild(fb);
    setTimeout(() => fb.remove(), 600);

    let dmg = 5;
    if (difficulty === 'easy') dmg = 8;
    if (difficulty === 'normal') dmg = 6;
    if (difficulty === 'hard') dmg = 4;

    if (playerMana > 0) {
        bossHp -= dmg;
        playerMana -= 3;
        updateBossHp();
        updatePlayerHud();
    }
});

document.getElementById('reset-btn').addEventListener('click', () => {
    resetGame();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

updateBossHp();
updatePlayerHud();
