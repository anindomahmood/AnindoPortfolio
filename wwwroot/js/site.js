// =========================================================
// site.js: theme switch, mobile menu, filters, focus picker,
// results chart, scroll reveal and number count-up.
// Plain JavaScript, no libraries.
// =========================================================
(function () {
    'use strict';

    const root = document.documentElement;

    // ---------- 1. Theme (dark / light) ----------
    const themeBtn = document.getElementById('themeBtn');

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        if (themeBtn) {
            const next = theme === 'light' ? 'dark' : 'light';
            themeBtn.setAttribute('aria-label', 'Switch to ' + next + ' theme');
            themeBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
        }
    }

    applyTheme(root.getAttribute('data-theme') || 'dark');

    if (themeBtn) {
        themeBtn.addEventListener('click', function () {
            const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(next);
            try { localStorage.setItem('theme', next); } catch (e) { /* storage blocked */ }
        });
    }

    // ---------- 2. Mobile menu ----------
    const menuBtn = document.getElementById('menuBtn');
    const navLinks = document.getElementById('navLinks');

    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', function () {
            const open = navLinks.classList.toggle('is-open');
            menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
            menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        });
        navLinks.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                navLinks.classList.remove('is-open');
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.setAttribute('aria-label', 'Open menu');
            });
        });
    }

    // Helper: mark one button in a group as active
    function setActive(buttons, activeBtn) {
        buttons.forEach(function (b) {
            const on = b === activeBtn;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }

    // ---------- 3. Filters (papers, projects, timeline) ----------
    const filterTargets = {
        papers: 'papers',
        projects: 'projects-list',
        timeline: 'timeline-list'
    };

    document.querySelectorAll('[data-filter-group]').forEach(function (group) {
        const list = document.getElementById(filterTargets[group.dataset.filterGroup]);
        if (!list) return;
        const buttons = Array.from(group.querySelectorAll('[data-filter]'));

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                setActive(buttons, btn);
                const value = btn.dataset.filter;
                Array.from(list.children).forEach(function (item) {
                    item.hidden = !(value === 'all' || item.dataset.key === value);
                });
            });
        });
    });

    // ---------- 4. Research focus picker ----------
    const focusButtons = Array.from(document.querySelectorAll('[data-focus-title]'));
    const focusTitle = document.getElementById('focusTitle');
    const focusBody = document.getElementById('focusBody');
    const focusLink = document.getElementById('focusLink');

    focusButtons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            setActive(focusButtons, btn);
            focusTitle.textContent = btn.dataset.focusTitle;
            focusBody.textContent = btn.dataset.focusBody;
            focusLink.textContent = btn.dataset.focusLink;
            [focusTitle, focusBody, focusLink].forEach(function (el) {
                el.classList.remove('fade-swap');
                void el.offsetWidth;            // restart the animation
                el.classList.add('fade-swap');
            });
        });
    });

    // ---------- 5. Results chart (heart disease models) ----------
    const dotRows = Array.from(document.querySelectorAll('.dot-row'));
    const modelName = document.getElementById('modelName');
    const modelAcc = document.getElementById('modelAcc');
    const modelNote = document.getElementById('modelNote');

    dotRows.forEach(function (row) {
        row.addEventListener('click', function () {
            setActive(dotRows, row);
            modelName.textContent = row.dataset.name;
            modelAcc.textContent = row.dataset.acc + '%';
            modelNote.textContent = row.dataset.note;
        });
    });

    // ---------- 6. Scroll reveal + count-up ----------
    function countUp(el) {
        const target = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || '0', 10);
        const start = performance.now();
        const duration = 1000;
        function tick(now) {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = (target * eased).toFixed(decimals);
            if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    const revealEls = document.querySelectorAll('.reveal, .dot-chart, .journey');
    const counters = document.querySelectorAll('[data-count]');

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                if (entry.target.dataset.count) countUp(entry.target);
                io.unobserve(entry.target);
            });
        }, { threshold: 0.15 });
        revealEls.forEach(function (el) { io.observe(el); });
        counters.forEach(function (el) { io.observe(el); });
    } else {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
})();
