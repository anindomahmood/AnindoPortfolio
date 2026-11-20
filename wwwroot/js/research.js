// =========================================================
// research.js: research detail page
//  - pipeline stepper
//  - baseline comparison table
//  - copy BibTeX
// =========================================================
(function () {
    'use strict';

    function setActive(buttons, activeBtn) {
        buttons.forEach(function (b) {
            const on = b === activeBtn;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }

    // ----- Pipeline stepper -----
    const steps = Array.from(document.querySelectorAll('[data-step]'));
    const panels = Array.from(document.querySelectorAll('[data-step-panel]'));

    steps.forEach(function (btn) {
        btn.addEventListener('click', function () {
            setActive(steps, btn);
            panels.forEach(function (p) { p.hidden = p.dataset.stepPanel !== btn.dataset.step; });
        });
    });

    // ----- Baseline comparison -----
    const baseButtons = Array.from(document.querySelectorAll('[data-base]'));
    const rows = Array.from(document.querySelectorAll('.results-table tbody tr'));
    const baseName = document.getElementById('baseName');

    function updateTable(baseId) {
        const baseRow = rows.find(function (r) { return r.dataset.id === baseId; });
        if (!baseRow) return;
        const baseAcc = parseFloat(baseRow.dataset.acc);
        baseName.textContent = baseRow.dataset.name;

        rows.forEach(function (r) {
            const cell = r.querySelector('.delta');
            const isBase = r === baseRow;
            const d = Math.round((parseFloat(r.dataset.acc) - baseAcc) * 100) / 100;
            r.classList.toggle('is-base', isBase);
            cell.classList.remove('up', 'down');
            if (isBase) {
                cell.textContent = 'baseline';
            } else if (d > 0) {
                cell.textContent = '+' + d.toFixed(2);
                cell.classList.add('up');
            } else if (d < 0) {
                cell.textContent = '−' + Math.abs(d).toFixed(2);
                cell.classList.add('down');
            } else {
                cell.textContent = '±0.00';
            }
        });
    }

    baseButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            setActive(baseButtons, btn);
            updateTable(btn.dataset.base);
        });
    });

    if (baseButtons.length) updateTable('lr');

    // ----- Copy BibTeX -----
    const copyBtn = document.getElementById('copyBib');
    const bib = document.getElementById('bibtex');

    if (copyBtn && bib) {
        copyBtn.addEventListener('click', async function () {
            try {
                await navigator.clipboard.writeText(bib.textContent);
                copyBtn.textContent = 'Copied ✓';
            } catch (e) {
                copyBtn.textContent = 'Press Ctrl+C';
                const range = document.createRange();
                range.selectNodeContents(bib);
                const sel = window.getSelection();
                sel.removeAllRanges();
                sel.addRange(range);
            }
            setTimeout(function () { copyBtn.textContent = 'Copy BibTeX'; }, 1800);
        });
    }
})();
