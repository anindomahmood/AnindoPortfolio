// =========================================================
// workspace.js: private Workspace page (Quick notes · Calculator · Print Studio)
// All data is saved in this browser (localStorage), nowhere else.
// =========================================================
(function () {
    'use strict';

    const KEY = 'anindo-workspace-v1';
    const $ = (id) => document.getElementById(id);
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const pad = (n) => String(n).padStart(2, '0');
    const dayKey = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    const todayKey = () => dayKey(new Date());

    // ---------- Storage ----------
    function seed() {
        return {
            tasks: [
                { id: uid(), text: 'Revise heart-disease manuscript, section 4', tag: 'high', done: false },
                { id: uid(), text: 'Run cross-validation on maternal-health data', tag: 'research', done: false },
                { id: uid(), text: 'Shortlist MSc programs', tag: 'personal', done: false }
            ],
            events: [],
            notes: [
                { id: uid(), title: 'Reviewer feedback', text: 'Add precision, recall, F1 and ROC-AUC; explain the train/test split.', cat: 'research', at: Date.now() },
                { id: uid(), title: 'Thesis direction', text: 'Explainable ML for healthcare, or LLMs for software engineering?', cat: 'ideas', at: Date.now() }
            ],
            track: [
                { id: uid(), title: 'AI/ML undergraduate thesis', col: 0 },
                { id: uid(), title: 'Maternal health risk prediction', col: 1 },
                { id: uid(), title: 'Heart disease comparative study', col: 2 },
                { id: uid(), title: 'EcoSense · IEEE ICRPSET-2026', col: 3 }
            ],
            reading: [],
            habits: [
                { id: uid(), name: 'Code 1 hour', color: '#5EEAD4' },
                { id: uid(), name: 'Read a paper', color: '#FBBF24' },
                { id: uid(), name: 'Football / exercise', color: '#93C5FD' }
            ],
            habitChecks: {},
            links: [
                { id: uid(), name: 'GitHub', url: 'https://github.com/anindomahmood' },
                { id: uid(), name: 'Google Colab', url: 'https://colab.research.google.com' },
                { id: uid(), name: 'Kaggle', url: 'https://www.kaggle.com' },
                { id: uid(), name: 'Overleaf', url: 'https://www.overleaf.com' },
                { id: uid(), name: 'Live portfolio', url: 'https://anindomahmood.runasp.net' }
            ],
            focusLog: {},
            activity: {}
        };
    }

    let S;
    try { S = JSON.parse(localStorage.getItem(KEY)) || seed(); } catch (e) { S = seed(); }
    const base = seed();
    Object.keys(base).forEach((k) => { if (S[k] === undefined) S[k] = base[k]; });

    function save() {
        try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Could not save (storage is full or blocked).'); }
    }

    let toastTimer;
    function toast(msg) {
        let t = document.querySelector('.ws-toast');
        if (!t) { t = document.createElement('div'); t.className = 'ws-toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
        t.textContent = msg;
        t.hidden = false;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => { t.hidden = true; }, 2600);
    }

    // ---------- Daily motivation line (a new one each day) ----------
    const LINES = [
        'Let’s make today count.',
        'Today is a great day to make progress.',
        'Start small, finish strong today.',
        'One focused hour can change your whole day.',
        'Your research is moving forward. Keep going.',
        'Make today’s work something you are proud of.',
        'Every task you finish today builds your future.',
        'You are closer to your goals than yesterday.',
        'Pick one important thing and get it done.',
        'Show up, focus, and let the results follow.',
        'Today, aim for progress, not perfection.',
        'Keep learning. Every day makes you sharper.',
        'Your next breakthrough starts with today’s work.',
        'Stay focused. Great things are being built here.',
        'A productive day starts right now.',
        'Turn today’s ideas into real progress.',
        'You have what it takes. Let’s get to work.',
        'Finish one thing today that moves you forward.',
        'Keep building. Your hard work is adding up.',
        'Fresh day, fresh energy. Let’s begin.',
        'Do the work today that your future self will thank you for.'
    ];
    function renderHead() {
        const now = new Date();
        const dayNumber = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
        $('wsQuote').textContent = LINES[dayNumber % LINES.length];
        $('wsDate').textContent = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    }

    // ---------- Quick notes ----------
    let noteCat = 'all', noteQuery = '', editingId = null;
    const CAT_NAMES = { research: 'Research', class: 'Class', ideas: 'Ideas' };

    function renderNotes() {
        const q = noteQuery.toLowerCase();
        const list = S.notes
            .filter((n) => noteCat === 'all' || n.cat === noteCat)
            .filter((n) => !q || (n.title + ' ' + n.text).toLowerCase().includes(q))
            .sort((a, b) => b.at - a.at);
        $('noteCount').textContent = S.notes.length + (S.notes.length === 1 ? ' note' : ' notes');
        $('noteList').innerHTML = list.length ? list.map((n) => `
            <div class="ws-note" data-id="${n.id}" tabindex="0" role="button" aria-label="Edit note ${esc(n.title || 'Untitled')}">
                <div class="ws-note-top">
                    <span class="ws-note-cat ${n.cat}">${CAT_NAMES[n.cat] || 'Note'} · ${new Date(n.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    <span class="ws-note-actions">
                        <button type="button" class="ws-pdf" aria-label="Export this note as PDF" title="Export as PDF">PDF</button>
                        <button type="button" class="ws-del" aria-label="Delete note">✕</button>
                    </span>
                </div>
                <div class="ws-note-title">${esc(n.title || 'Untitled')}</div>
                ${n.text ? `<div class="ws-note-text">${esc(n.text)}</div>` : ''}
            </div>`).join('')
            : `<div class="ws-empty">${S.notes.length ? 'No notes match.' : 'No notes yet. Write your first one above.'}</div>`;
        if (typeof fillDocNotes === 'function') fillDocNotes();
    }
    function growNote() { const t = $('noteText'); t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }
    function resetComposer() {
        editingId = null;
        $('noteTitle').value = ''; $('noteText').value = ''; growNote();
        $('noteSave').textContent = 'Save note';
        $('noteCancel').hidden = true;
        $('noteForm').classList.remove('editing');
    }
    function editNote(id) {
        const n = S.notes.find((x) => x.id === id); if (!n) return;
        editingId = id;
        $('noteTitle').value = n.title; $('noteText').value = n.text; setCat(n.cat); growNote();
        $('noteSave').textContent = 'Update note';
        $('noteCancel').hidden = false;
        $('noteForm').classList.add('editing');
        $('noteText').focus();
    }

    $('noteText').addEventListener('input', growNote);
    $('noteSearch').addEventListener('input', (e) => { noteQuery = e.target.value.trim(); renderNotes(); });
    $('noteFilter').addEventListener('click', (e) => {
        const b = e.target.closest('[data-cat]'); if (!b) return;
        noteCat = b.dataset.cat;
        document.querySelectorAll('#noteFilter .ws-chip').forEach((c) => c.classList.toggle('is-active', c === b));
        renderNotes();
    });
    $('noteForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const title = $('noteTitle').value.trim(), text = $('noteText').value.trim(), cat = $('noteCat').value;
        if (!title && !text) return;
        if (editingId) {
            const n = S.notes.find((x) => x.id === editingId);
            if (n) Object.assign(n, { title, text, cat, at: Date.now() });
        } else {
            S.notes.push({ id: uid(), title, text, cat, at: Date.now() });
        }
        save(); resetComposer(); renderNotes();
    });
    $('noteCancel').addEventListener('click', resetComposer);
    $('noteList').addEventListener('click', (e) => {
        const card = e.target.closest('.ws-note'); if (!card) return;
        if (e.target.closest('.ws-pdf')) { exportNote(card.dataset.id); return; }
        if (e.target.closest('.ws-del')) {
            S.notes = S.notes.filter((x) => x.id !== card.dataset.id);
            if (editingId === card.dataset.id) resetComposer();
            save(); renderNotes(); return;
        }
        editNote(card.dataset.id);
    });
    $('noteList').addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('ws-note')) { e.preventDefault(); editNote(e.target.dataset.id); }
    });

    // ---------- Category picker ----------
    const catMenu = $('catMenu'), catBtn = $('catBtn');
    function setCat(v) {
        if (!CAT_NAMES[v]) v = 'research';
        $('noteCat').value = v;
        $('catLabel').textContent = CAT_NAMES[v];
        $('catDot').className = 'ws-dot ' + v;
        catMenu.querySelectorAll('[data-val]').forEach((b) => b.setAttribute('aria-selected', b.dataset.val === v ? 'true' : 'false'));
    }
    function openCat(open) {
        catMenu.hidden = !open;
        catBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) (catMenu.querySelector('[aria-selected="true"]') || catMenu.querySelector('[data-val]')).focus();
    }
    catBtn.addEventListener('click', () => openCat(catMenu.hidden));
    catMenu.addEventListener('click', (e) => {
        const b = e.target.closest('[data-val]'); if (!b) return;
        setCat(b.dataset.val); openCat(false); catBtn.focus();
    });
    catMenu.addEventListener('keydown', (e) => {
        const items = [...catMenu.querySelectorAll('[data-val]')], i = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
        else if (e.key === 'Escape') { openCat(false); catBtn.focus(); }
    });
    document.addEventListener('click', (e) => { if (!catMenu.hidden && !e.target.closest('#catPicker')) openCat(false); });
    setCat($('noteCat').value);

    // ---------- Calculator ----------
    let expr = '', ans = null, justEvaluated = false;
    const OPS = '+−×÷';

    function evaluate(src) {
        let i = 0;
        const peek = () => src[i];
        function number() {
            let s = '';
            while (i < src.length && /[0-9.]/.test(src[i])) s += src[i++];
            if (!s || s === '.' || (s.match(/\./g) || []).length > 1) throw new Error('bad number');
            return parseFloat(s);
        }
        function primary() {
            const c = peek();
            if (c === '(') { i++; const v = expr0(); if (peek() === ')') i++; return v; }
            if (c === 'π') { i++; return Math.PI; }
            if (c === '√') { i++; const v = primary(); if (v < 0) throw new Error('neg sqrt'); return Math.sqrt(v); }
            if (c === 'A') { i += 3; if (ans === null) throw new Error('no ans'); return ans; }  // "ANS"
            return number();
        }
        function postfix() {
            let v = primary();
            while (peek() === '²' || peek() === '%') { v = peek() === '²' ? v * v : v / 100; i++; }
            return v;
        }
        function unary() {
            if (peek() === '−') { i++; return -unary(); }
            if (peek() === '+') { i++; return unary(); }
            return postfix();
        }
        function term() {
            let v = unary();
            while (peek() === '×' || peek() === '÷' || peek() === '(' || peek() === 'π' || peek() === '√') {
                const op = (peek() === '×' || peek() === '÷') ? src[i++] : '×';   // implicit multiply, e.g. 2π
                const r = unary();
                if (op === '÷' && r === 0) throw new Error('div0');
                v = op === '×' ? v * r : v / r;
            }
            return v;
        }
        function expr0() {
            let v = term();
            while (peek() === '+' || peek() === '−') { const op = src[i++]; const r = term(); v = op === '+' ? v + r : v - r; }
            return v;
        }
        const out = expr0();
        if (i < src.length) throw new Error('trailing');
        if (!isFinite(out)) throw new Error('inf');
        return out;
    }
    const fmt = (n) => {
        const r = Math.round(n * 1e10) / 1e10;
        return Math.abs(r) >= 1e12 ? r.toExponential(6) : String(r);
    };
    function renderCalc(result) {
        $('calcExpr').innerHTML = expr ? esc(expr) : '&nbsp;';
        if (result !== undefined) $('calcResult').textContent = result;
        else if (expr) { try { $('calcResult').textContent = fmt(evaluate(expr)); } catch (e) { } }
        else $('calcResult').textContent = '0';
    }
    function press(k) {
        if (k === 'AC') { expr = ''; justEvaluated = false; renderCalc('0'); return; }
        if (k === '⌫') { expr = expr.endsWith('ANS') ? expr.slice(0, -3) : expr.slice(0, -1); renderCalc(); return; }
        if (k === '=') {
            if (!expr) return;
            try {
                const v = evaluate(expr);
                $('calcHistory').textContent = expr + ' = ' + fmt(v);
                ans = v; expr = fmt(v); justEvaluated = true;
                renderCalc(fmt(v)); $('calcExpr').innerHTML = '&nbsp;';
            } catch (e) { renderCalc('Error'); }
            return;
        }
        if (k === '±') {
            if (/^−\(.*\)$/.test(expr)) expr = expr.slice(2, -1); else if (expr) expr = '−(' + expr + ')';
            renderCalc(); return;
        }
        if (k === '()') {
            const open = (expr.match(/\(/g) || []).length, close = (expr.match(/\)/g) || []).length;
            const last = expr.slice(-1);
            k = (open > close && /[0-9)π²%S]/.test(last)) ? ')' : '(';
        }
        if (justEvaluated) {
            if (/[0-9.(π√]/.test(k)) expr = '';      // start a new calculation
            justEvaluated = false;
        }
        if (OPS.includes(k) && OPS.includes(expr.slice(-1))) expr = expr.slice(0, -1);   // replace operator
        if (OPS.includes(k) && !expr && k !== '−') { if (ans === null) return; expr = 'ANS'; }
        expr += k;
        renderCalc();
    }
    document.querySelectorAll('.calc-key').forEach((b) => b.addEventListener('click', () => press(b.dataset.k)));
    document.querySelectorAll('[data-calc-mode]').forEach((b) => b.addEventListener('click', () => {
        document.querySelectorAll('[data-calc-mode]').forEach((x) => x.classList.toggle('is-active', x === b));
        $('calcSci').hidden = b.dataset.calcMode !== 'sci';
    }));

    // ---------- Print Studio ----------
    let tpl = 'lined';
    const TPL_NAMES = { lined: 'Lined page', blank: 'Fresh page' };
    const sheet = $('printSheet');
    document.body.appendChild(sheet);   // must be a direct child of <body> for printing

    document.querySelectorAll('[data-tpl]').forEach((b) => b.addEventListener('click', () => {
        tpl = b.dataset.tpl;
        document.querySelectorAll('[data-tpl]').forEach((x) => {
            const on = x === b;
            x.classList.toggle('is-active', on);
            x.setAttribute('aria-checked', on ? 'true' : 'false');
        });
    }));

    // Content picker: blank page, all notes, or one saved note (click to choose)
    const ICON_PAGE = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5"/></svg>';
    const ICON_STACK = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 3 8l9 5 9-5z"/><path d="m3 13 9 5 9-5"/></svg>';
    const ICON_NOTE = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16M4 10h16M4 15h10"/></svg>';
    const DEFAULT_TITLE = 'Research notes';

    function docItem(value, icon, name, sub) {
        const on = $('docNote').value === value;
        return `<button type="button" class="doc-item" role="option" data-doc="${value}" aria-selected="${on}" tabindex="${on ? 0 : -1}">
            <span class="doc-ico">${icon}</span>
            <span class="doc-txt"><span class="doc-name">${esc(name)}</span><span class="doc-sub">${sub}</span></span>
        </button>`;
    }
    function fillDocNotes() {
        const box = $('docPick'); if (!box) return;
        const notes = S.notes.slice().sort((a, b) => b.at - a.at);
        if ($('docNote').value && $('docNote').value !== '__all' && !notes.some((n) => n.id === $('docNote').value)) $('docNote').value = '';
        if ($('docNote').value === '__all' && notes.length < 2) $('docNote').value = '';
        let html = docItem('', ICON_PAGE, 'Blank page', 'Write by hand');
        if (notes.length > 1) html += docItem('__all', ICON_STACK, 'All notes', notes.length + ' notes in one PDF');
        if (notes.length) html += '<div class="doc-sep" role="presentation"></div>';
        html += notes.map((n) => docItem(n.id, ICON_NOTE, n.title || (n.text || 'Untitled').slice(0, 50),
            `<i class="ws-dot ${n.cat}"></i>${CAT_NAMES[n.cat] || 'Note'} · ${new Date(n.at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`)).join('');
        box.innerHTML = html;
        $('docPickCount').textContent = notes.length ? notes.length + (notes.length === 1 ? ' saved note' : ' saved notes') : 'No saved notes yet';
    }
    function selectDoc(v) {
        $('docNote').value = v;
        if (v === '__all') $('docTitle').value = 'My notes';
        else if (v) { const n = S.notes.find((x) => x.id === v); if (n) $('docTitle').value = n.title || 'Note'; }
        else $('docTitle').value = DEFAULT_TITLE;
        fillDocNotes();
    }
    $('docPick').addEventListener('click', (e) => { const b = e.target.closest('[data-doc]'); if (b) { selectDoc(b.dataset.doc); $('docPick').querySelector('[aria-selected="true"]').focus(); } });
    $('docPick').addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
        e.preventDefault();
        const items = [...$('docPick').querySelectorAll('[data-doc]')];
        const i = items.indexOf(document.activeElement);
        const next = items[e.key === 'ArrowDown' ? Math.min(i + 1, items.length - 1) : Math.max(i - 1, 0)];
        selectDoc(next.dataset.doc);
        $('docPick').querySelector('[aria-selected="true"]').focus();
    });

    function chosenNotes() {
        const v = $('docNote').value;
        if (!v) return [];
        if (v === '__all') return S.notes.slice().sort((a, b) => b.at - a.at);
        const n = S.notes.find((x) => x.id === v);
        return n ? [n] : [];
    }

    // Page setup for note content: real page margins on every page, page numbers at the bottom
    function setPageStyle(contentMode) {
        let st = $('psPageStyle');
        if (!st) { st = document.createElement('style'); st.id = 'psPageStyle'; }
        document.body.appendChild(st);   // keep it last so its page rules always win
        if (!contentMode) { st.textContent = '@media print { @page { size: A4; margin: 0; } }'; return; }
        const box = 'font-family: "JetBrains Mono", monospace; font-size: 8.5pt; color: #64748B;';
        st.textContent = '@media print { @page { size: A4; margin: 16mm 18mm 16mm;'
            + ' @bottom-left { content: "anindomahmood.runasp.net"; ' + box + ' }'
            + ($('docPage').checked ? ' @bottom-right { content: "Page " counter(page) " of " counter(pages); ' + box + ' }' : '')
            + ' } }';
    }

    function buildSheet() {
        const notes = chosenNotes();
        const contentMode = notes.length > 0;
        $('psTitle').textContent = $('docTitle').value.trim() || TPL_NAMES[tpl];
        $('psDate').textContent = $('docDate').checked ? new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
        $('psType').textContent = TPL_NAMES[tpl] + ' · A4';
        $('psPage').textContent = $('docPage').checked ? 'Page 1 of 1' : '';
        $('psBody').className = 'ps-body' + (tpl === 'lined' ? ' lined' : '');
        if (!contentMode) $('psBody').innerHTML = '';
        else if (notes.length === 1) $('psBody').innerHTML = `<div class="ps-text">${esc(notes[0].text || '')}</div>`;
        else $('psBody').innerHTML = notes.map((n) => `<section class="ps-note"><h2>${esc(n.title || 'Untitled')}</h2><div class="ps-text">${esc(n.text || '')}</div></section>`).join('');
        document.body.classList.toggle('ps-content', contentMode);
        setPageStyle(contentMode);
    }
    function printSheet() {
        buildSheet();
        document.body.classList.add('printing');
        window.print();
    }
    window.addEventListener('afterprint', () => document.body.classList.remove('printing', 'ps-content'));
    $('docPdf').addEventListener('click', () => { toast('Choose “Save as PDF” as the printer.'); setTimeout(printSheet, 350); });
    $('docPrint').addEventListener('click', printSheet);

    // "PDF" button on a saved note
    function exportNote(id) {
        const n = S.notes.find((x) => x.id === id); if (!n) return;
        selectDoc(id);
        toast('Choose “Save as PDF” as the printer.');
        setTimeout(printSheet, 350);
    }
    fillDocNotes();

    // ---------- Backup ----------
    $('wsExport').addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'workspace-backup-' + todayKey() + '.json';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
    $('wsImportBtn').addEventListener('click', () => $('wsImport').click());
    $('wsImport').addEventListener('change', (e) => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const data = JSON.parse(reader.result);
                if (!data || !Array.isArray(data.tasks)) throw new Error('bad');
                S = Object.assign(seed(), data); save(); renderAll(); toast('Backup imported.');
            } catch (err) { toast('That file is not a workspace backup.'); }
        };
        reader.readAsText(file);
        e.target.value = '';
    });

    // ---------- Start ----------
    function renderAll() { renderHead(); renderNotes(); renderCalc(); }
    renderAll();
    setInterval(renderHead, 60000);
})();
