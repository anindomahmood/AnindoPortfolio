// =========================================================
// robot.js: Eco, the draggable research robot.
//  - drag it with the mouse (or finger) inside its stage
//  - its eyes follow your cursor
//  - click it (without dragging) for the next research fact
//  - it waves every 7 seconds
// =========================================================
(function () {
    'use strict';

    const stage = document.getElementById('robotStage');
    if (!stage) return;

    const robot = document.getElementById('robot');
    const btn = document.getElementById('robotBtn');
    const eyes = document.getElementById('robotEyes');
    const mouth = document.getElementById('robotMouth');
    const arm = document.getElementById('robotArm');
    const bubble = document.getElementById('robotBubble');
    const coords = document.getElementById('robotCoords');
    const glow = document.getElementById('robotGlow');

    const facts = window.robotFacts || ['Hi! I am Eco.'];
    const MOUTH_NORMAL = 'M90 95 Q100 100 110 95';
    const MOUTH_HAPPY = 'M88 96 Q100 104 112 96';

    // Robot position in % of the stage
    let x = 50, y = 56;
    let factIndex = 0;
    let drag = null;      // info about the current drag, or null
    let waving = false;

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

    function toPercent(e) {
        const r = stage.getBoundingClientRect();
        return {
            x: (e.clientX - r.left) / r.width * 100,
            y: (e.clientY - r.top) / r.height * 100,
            w: r.width,
            h: r.height
        };
    }

    function render(tilt) {
        robot.style.left = x + '%';
        robot.style.top = y + '%';
        robot.style.setProperty('--tilt', (tilt || 0) + 'deg');
        glow.style.setProperty('--gx', x + '%');
        glow.style.setProperty('--gy', y + '%');
        coords.textContent = 'x ' + Math.round(x) + ' · y ' + Math.round(y);
    }

    function lookAt(dx, dy) {
        eyes.setAttribute('transform', 'translate(' + clamp(dx, -9, 9).toFixed(1) + ' ' + clamp(dy, -6, 6).toFixed(1) + ')');
    }

    function say(text) { bubble.textContent = text; }

    // ----- Drag start -----
    btn.addEventListener('pointerdown', function (e) {
        const p = toPercent(e);
        drag = { ox: p.x - x, oy: p.y - y, sx: e.clientX, sy: e.clientY, moved: false, lastX: p.x };
        stage.setPointerCapture(e.pointerId);
        robot.classList.add('is-dragging');
        stage.classList.add('is-dragging');
        robot.style.setProperty('--scale', '1.06');
        mouth.setAttribute('d', MOUTH_HAPPY);
        e.preventDefault();
    });

    // ----- Move: drag, or just follow the cursor with the eyes -----
    stage.addEventListener('pointermove', function (e) {
        const p = toPercent(e);

        if (drag) {
            if (Math.abs(e.clientX - drag.sx) + Math.abs(e.clientY - drag.sy) > 4) {
                if (!drag.moved) say('Whee! Moving to a new dataset…');
                drag.moved = true;
            }
            const vx = p.x - drag.lastX;
            drag.lastX = p.x;
            x = clamp(p.x - drag.ox, 14, 86);
            y = clamp(p.y - drag.oy, 34, 74);
            render(clamp(vx * 3, -14, 14));
            lookAt(vx * 4, 0);
        } else {
            const dx = (p.x - x) / 100 * p.w;
            const dy = (p.y - (y - 6)) / 100 * p.h;
            const d = Math.max(1, Math.hypot(dx, dy));
            lookAt(dx / d * Math.min(9, d / 12), dy / d * Math.min(6, d / 12));
        }
    });

    // ----- Drag end (or click) -----
    function endDrag() {
        if (!drag) return;
        const clicked = !drag.moved;
        drag = null;
        robot.classList.remove('is-dragging');
        stage.classList.remove('is-dragging');
        robot.style.setProperty('--scale', '1');
        render(0);
        if (!waving) mouth.setAttribute('d', MOUTH_NORMAL);
        if (clicked) factIndex = (factIndex + 1) % facts.length;
        say(facts[factIndex]);
    }

    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('pointerleave', function () { if (!drag) lookAt(0, 0); });

    // Keyboard: Enter/Space shows the next fact, arrow keys move the robot
    btn.addEventListener('keydown', function (e) {
        const step = 4;
        if (e.key === 'ArrowLeft') x = clamp(x - step, 14, 86);
        else if (e.key === 'ArrowRight') x = clamp(x + step, 14, 86);
        else if (e.key === 'ArrowUp') y = clamp(y - step, 34, 74);
        else if (e.key === 'ArrowDown') y = clamp(y + step, 34, 74);
        else if (e.key === 'Enter' || e.key === ' ') {
            factIndex = (factIndex + 1) % facts.length;
            say(facts[factIndex]);
        } else return;
        e.preventDefault();
        render(0);
    });

    // ----- Wave every 7 seconds -----
    function wave() {
        if (drag) return;
        waving = true;
        arm.classList.remove('waving');
        void arm.getBoundingClientRect();    // restart the CSS animation
        arm.classList.add('waving');
        mouth.setAttribute('d', MOUTH_HAPPY);
        say('Hello! I am Eco. Welcome to my lab.');
        setTimeout(function () {
            waving = false;
            arm.classList.remove('waving');
            if (!drag) {
                mouth.setAttribute('d', MOUTH_NORMAL);
                say(facts[factIndex]);
            }
        }, 2200);
    }

    setTimeout(wave, 1500);
    setInterval(wave, 7000);

    render(0);
})();
