// Shared script: footer year on every page, and the orbiting-stars easter egg
// on the home page (click the profile photo).

document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
});

(function () {
    const toggle = document.getElementById("starToggle");
    const blackHole = document.getElementById("blackHole");
    if (!toggle || !blackHole) return;

    const hint = document.getElementById("starHint");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
        if (hint) hint.hidden = true;
        toggle.disabled = true;
        toggle.style.cursor = "default";
        return;
    }

    const NUM_STARS = 7;
    const COLORS = ["red", "orange", "gold", "green", "blue", "indigo", "violet"];
    const G = 0.05;                // star-to-star attraction
    const BLACK_HOLE_RADIUS = 50;  // px from the centre
    const STEP_MS = 30;            // one physics step, as in the original animation

    let stars = [];
    let frameId = null;
    let lastTime = 0;
    let carry = 0;
    let holeTimer = null;

    function centre() {
        // Read every frame so the orbits follow window resizes.
        return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

    function createStar(radius, angle) {
        const el = document.createElement("div");
        el.className = "star";
        el.textContent = "★";
        el.setAttribute("aria-hidden", "true");

        const mass = Math.random() * 2 + 1;
        const size = mass * 20;
        el.style.fontSize = size + "px";
        el.style.color = COLORS[Math.floor(Math.random() * COLORS.length)];

        const speed = Math.sqrt(500 / (radius * radius * radius));
        const star = {
            el: el,
            size: size,
            mass: mass,
            radius: radius,
            angle: angle,
            vr: Math.cos(angle) * speed,  // change in radius per step
            va: Math.sin(angle) * speed   // change in angle per step
        };

        // Clicking a star nudges it away from where it was clicked.
        el.addEventListener("click", function (event) {
            const rect = el.getBoundingClientRect();
            const dx = event.clientX - rect.left - rect.width / 2;
            const dy = event.clientY - rect.top - rect.height / 2;
            const a = Math.atan2(dy, dx);
            star.vr += 0.02 * Math.cos(a);
            star.va += 0.02 * Math.sin(a);
        });

        document.body.appendChild(el);
        stars.push(star);
    }

    function applyGravity() {
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const a = stars[i];
                const b = stars[j];
                const dx = b.radius * Math.cos(b.angle) - a.radius * Math.cos(a.angle);
                const dy = b.radius * Math.sin(b.angle) - a.radius * Math.sin(a.angle);
                const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
                const force = (G * a.mass * b.mass) / (dist * dist + 0.1);
                const fx = (force * dx) / dist;
                const fy = (force * dy) / dist;
                a.vr += fx / a.mass;
                a.va += fy / a.mass;
                b.vr -= fx / b.mass;
                b.va -= fy / b.mass;
            }
        }
    }

    function showBlackHole() {
        blackHole.classList.add("is-visible");
        clearTimeout(holeTimer);
        holeTimer = setTimeout(function () {
            blackHole.classList.remove("is-visible");
        }, 1000);
    }

    function step() {
        applyGravity();
        for (let i = stars.length - 1; i >= 0; i--) {
            const star = stars[i];
            star.radius += star.vr;
            star.angle += star.va;
            if (Math.abs(star.radius) < BLACK_HOLE_RADIUS) {
                showBlackHole();
                star.el.remove();
                stars.splice(i, 1);
            }
        }
    }

    function draw() {
        const c = centre();
        stars.forEach(function (star) {
            const x = c.x + star.radius * Math.cos(star.angle) - star.size / 2;
            const y = c.y + star.radius * Math.sin(star.angle) - star.size / 2;
            star.el.style.transform = "translate(" + x + "px, " + y + "px)";
        });
    }

    function frame(now) {
        carry += Math.min(now - lastTime, 200);
        lastTime = now;
        while (carry >= STEP_MS) {
            step();
            carry -= STEP_MS;
        }
        draw();
        frameId = requestAnimationFrame(frame);
    }

    function start() {
        for (let i = 0; i < NUM_STARS; i++) {
            createStar(100 + i * 50, Math.PI / 4);
        }
        draw();
        lastTime = performance.now();
        carry = 0;
        frameId = requestAnimationFrame(frame);
        toggle.setAttribute("aria-pressed", "true");
        if (hint) hint.style.visibility = "hidden";  // keeps its space so the layout does not jump
    }

    function stop() {
        cancelAnimationFrame(frameId);
        frameId = null;
        stars.forEach(function (star) { star.el.remove(); });
        stars = [];
        blackHole.classList.remove("is-visible");
        toggle.setAttribute("aria-pressed", "false");
    }

    toggle.addEventListener("click", function () {
        if (frameId === null) start(); else stop();
    });
})();
