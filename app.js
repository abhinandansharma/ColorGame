(function () {
    'use strict';
    const BEST_KEY = 'colorgame.best';
    const grid = document.getElementById('grid');
    const valueEl = document.getElementById('value');
    const promptEl = document.getElementById('prompt');
    const messageEl = document.getElementById('message');
    const scoreEl = document.getElementById('score');
    const streakEl = document.getElementById('streak');
    const bestEl = document.getElementById('best');
    const livesEl = document.getElementById('lives');
    const newBtn = document.getElementById('new');

    const state = {
        level: 6,
        mode: 'rgb',
        colors: [],
        answer: null,
        lives: 3,
        score: 0,
        streak: 0,
        best: Number(safeGet(BEST_KEY)) || 0,
        locked: false,
    };

    function safeGet(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }
    function safeSet(k, v) { try { localStorage.setItem(k, String(v)); } catch (_) { /* ignore */ } }

    const rand = (n) => Math.floor(Math.random() * n);
    const randomColor = () => [rand(256), rand(256), rand(256)];
    const toRgb = (c) => `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
    const toHex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
    const label = (c) => (state.mode === 'hex' ? toHex(c) : toRgb(c));

    /** Build the 9 squares once; difficulty only hides the extras. */
    for (let i = 0; i < 9; i++) {
        const b = document.createElement('button');
        b.className = 'sq';
        b.type = 'button';
        b.dataset.index = i;
        b.dataset.key = i + 1;
        b.setAttribute('aria-label', `Square ${i + 1}`);
        b.addEventListener('click', () => guess(i));
        grid.appendChild(b);
    }
    const squares = Array.from(grid.children);

    function newRound() {
        state.colors = Array.from({ length: 9 }, randomColor);
        state.answer = rand(state.level);
        state.lives = 3;
        state.locked = false;
        document.body.classList.remove('win');
        grid.classList.remove('locked');
        grid.dataset.level = state.level;
        squares.forEach((sq, i) => {
            sq.className = 'sq';
            sq.style.setProperty('--c', toRgb(state.colors[i]));
        });
        valueEl.textContent = label(state.colors[state.answer]);
        promptEl.textContent = 'Which square is';
        setMessage('Pick a square, or press 1 to ' + state.level + '.');
        renderLives();
        newBtn.textContent = 'New colours';
    }

    function guess(i) {
        if (state.locked || i >= state.level) return;
        const sq = squares[i];
        if (sq.classList.contains('out')) return;
        if (i === state.answer) return win();
        state.lives -= 1;
        sq.classList.add('out');
        renderLives();
        if (state.lives === 0) return lose();
        const off = distance(state.colors[i], state.colors[state.answer]);
        setMessage(off > 250 ? 'Way off. ' + state.lives + ' left.' : off > 120 ? 'Not quite. ' + state.lives + ' left.' : 'Close. ' + state.lives + ' left.');
    }

    function win() {
        state.locked = true;
        grid.classList.add('locked');
        const c = state.colors[state.answer];
        const gained = state.lives === 3 ? 3 : state.lives === 2 ? 2 : 1;
        state.score += gained * (state.level / 3);
        state.streak += 1;
        if (state.streak > state.best) { state.best = state.streak; safeSet(BEST_KEY, state.best); }
        squares.forEach((sq) => { sq.classList.remove('out'); sq.style.setProperty('--c', toRgb(c)); });
        squares[state.answer].classList.add('hit');
        document.documentElement.style.setProperty('--hit', c.join(', '));
        document.body.classList.add('win');
        promptEl.textContent = 'Correct.';
        setMessage((state.lives === 3 ? 'First try. ' : '') + '+' + (gained * (state.level / 3)) + ' points. Enter for the next one.', true);
        newBtn.textContent = 'Next';
        renderStats();
    }

    function lose() {
        state.locked = true;
        grid.classList.add('locked');
        state.streak = 0;
        squares.forEach((sq, i) => { if (i !== state.answer) sq.classList.add('out'); });
        squares[state.answer].classList.add('hit');
        promptEl.textContent = 'It was this one:';
        setMessage('Streak reset. Enter to try another.');
        newBtn.textContent = 'Try again';
        renderStats();
    }

    function distance(a, b) { return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]); }
    function setMessage(text, good) { messageEl.textContent = text; messageEl.classList.toggle('good', !!good); }
    function renderStats() { scoreEl.textContent = state.score; streakEl.textContent = state.streak; bestEl.textContent = state.best; }
    function renderLives() { Array.from(livesEl.children).forEach((dot, i) => dot.classList.toggle('lost', i >= state.lives)); }

    document.querySelectorAll('[data-level]').forEach((btn) => {
        if (!btn.classList.contains('seg-btn')) return;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.seg-btn[data-level]').forEach((b) => { b.classList.remove('active'); b.removeAttribute('aria-selected'); });
            btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
            state.level = Number(btn.dataset.level);
            newRound();
        });
    });
    document.querySelectorAll('.seg-btn[data-mode]').forEach((btn) => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.seg-btn[data-mode]').forEach((b) => { b.classList.remove('active'); b.removeAttribute('aria-selected'); });
            btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
            state.mode = btn.dataset.mode;
            valueEl.textContent = label(state.colors[state.answer]);
        });
    });
    newBtn.addEventListener('click', newRound);
    document.addEventListener('keydown', (e) => {
        if (e.key >= '1' && e.key <= '9') guess(Number(e.key) - 1);
        else if (e.key === 'Enter' && state.locked) newRound();
        else if (e.key.toLowerCase() === 'n') newRound();
    });

    renderStats();
    newRound();
})();
