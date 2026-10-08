/* =====================================================
   EHAB & TOKA — WEDDING EXPERIENCE
   Vanilla JavaScript — GitHub Pages friendly
   ===================================================== */

"use strict";

/* ---------- 1. ELEMENTS ---------- */

const body = document.body;

const opening = document.getElementById("opening");
const openInvitationButton = document.getElementById("openInvitation");

const musicButton = document.getElementById("musicButton");
const weddingMusic = document.getElementById("weddingMusic");

const calendarDays = document.getElementById("calendarDays");
const calendarButton = document.getElementById("calendarButton");

const countdownMessage = document.getElementById("countdownMessage");

const hero = document.querySelector(".hero");
const heroImage = document.querySelector(".hero-image");

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;


/* ---------- 2. OPENING EXPERIENCE ---------- */

function openInvitation() {
    if (!opening || opening.classList.contains("is-opening")) {
        return;
    }

    opening.classList.add("is-opening");
    body.classList.remove("is-loading");

    // Let the opening animation finish before scrolling.
    window.setTimeout(() => {
        if (opening) {
            opening.style.display = "none";
        }

        if (hero) {
            hero.scrollIntoView({
                behavior: reducedMotion ? "auto" : "smooth",
                block: "start"
            });
        }
    }, reducedMotion ? 50 : 1100);

    // Music playback is allowed to be initiated by this user click.
    playMusic();
}

if (openInvitationButton) {
    openInvitationButton.addEventListener("click", openInvitation);
}


/* ---------- 3. MUSIC PLAYER ---------- */

function updateMusicButton(isPlaying) {
    if (!musicButton) {
        return;
    }

    musicButton.classList.toggle("playing", isPlaying);
    musicButton.setAttribute("aria-pressed", String(isPlaying));
    musicButton.setAttribute(
        "aria-label",
        isPlaying ? "Pause wedding music" : "Play wedding music"
    );
}

async function playMusic() {
    if (!weddingMusic || !musicButton) {
        return;
    }

    try {
        await weddingMusic.play();
        updateMusicButton(true);
    } catch (error) {
        // Browsers may block playback or the audio file may be unavailable.
        updateMusicButton(false);
        console.info(
            "Music could not start. Check music/wedding.mp3 or tap the music button.",
            error
        );
    }
}

function pauseMusic() {
    if (!weddingMusic) {
        return;
    }

    weddingMusic.pause();
    updateMusicButton(false);
}

if (musicButton && weddingMusic) {
    musicButton.addEventListener("click", () => {
        if (weddingMusic.paused) {
            playMusic();
        } else {
            pauseMusic();
        }
    });

    weddingMusic.addEventListener("play", () => {
        updateMusicButton(true);
    });

    weddingMusic.addEventListener("pause", () => {
        updateMusicButton(false);
    });

    weddingMusic.addEventListener("ended", () => {
        updateMusicButton(false);
    });

    weddingMusic.addEventListener("error", () => {
        updateMusicButton(false);
        console.warn("Could not load music/wedding.mp3.");
    });
}


/* ---------- 4. COUNTDOWN ---------- */

// The date is interpreted in the visitor's local time.
// Wedding time: October 15, 2026 at 8:00 PM.
const weddingDate = new Date(2026, 9, 15, 20, 0, 0).getTime();

const countdownElements = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds")
};

function padNumber(value) {
    return String(value).padStart(2, "0");
}

function updateCountdown() {
    const now = Date.now();
    const difference = weddingDate - now;

    if (difference <= 0) {
        Object.values(countdownElements).forEach((element) => {
            if (element) {
                element.textContent = "00";
            }
        });

        if (countdownMessage) {
            countdownMessage.textContent =
                "Today is our special day. Let the celebration begin!";
        }

        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );
    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );
    const seconds = Math.floor(
        (difference / 1000) % 60
    );

    if (countdownElements.days) {
        countdownElements.days.textContent = padNumber(days);
    }

    if (countdownElements.hours) {
        countdownElements.hours.textContent = padNumber(hours);
    }

    if (countdownElements.minutes) {
        countdownElements.minutes.textContent = padNumber(minutes);
    }

    if (countdownElements.seconds) {
        countdownElements.seconds.textContent = padNumber(seconds);
    }
}

updateCountdown();

window.setInterval(updateCountdown, 1000);


/* ---------- 5. OCTOBER 2026 CALENDAR ---------- */

function createCalendar() {
    if (!calendarDays || calendarDays.dataset.created === "true") {
        return;
    }

    calendarDays.dataset.created = "true";

    const year = 2026;
    const month = 9; // JavaScript months: January = 0.

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Convert Sunday-first indexing to Monday-first indexing.
    const mondayStart = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < mondayStart; i++) {
        const emptyCell = document.createElement("span");
        emptyCell.className = "empty";
        emptyCell.setAttribute("aria-hidden", "true");
        calendarDays.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("span");

        dayElement.textContent = String(day);

        if (day === 15) {
            dayElement.classList.add("wedding-day");
            dayElement.setAttribute("aria-label", "October 15, 2026 — Wedding Day");
            dayElement.setAttribute("title", "Wedding Day");
        } else {
            dayElement.setAttribute(
                "aria-label",
                `October ${day}, ${year}`
            );
        }

        calendarDays.appendChild(dayElement);
    }
}

createCalendar();


/* ---------- 6. ADD TO GOOGLE CALENDAR ---------- */

if (calendarButton) {
    calendarButton.addEventListener("click", () => {
        const title = "Ehab & Toka Wedding";

        // Google Calendar uses local/floating event times here.
        const start = "20261015T200000";
        const end = "20261015T230000";

        const location = "قاعة القصر - فندق القوات المسلحة";
        const details =
            "Wedding Invitation - Ehab & Toka\n" +
            "Thursday, October 15, 2026 at 8:00 PM.";

        const params = new URLSearchParams({
            action: "TEMPLATE",
            text: title,
            dates: `${start}/${end}`,
            location,
            details
        });

        const googleCalendarUrl =
            "https://calendar.google.com/calendar/render?" +
            params.toString();

        window.open(
            googleCalendarUrl,
            "_blank",
            "noopener,noreferrer"
        );
    });
}


/* ---------- 7. SCROLL REVEAL ---------- */

const revealElements = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
        element.classList.add("visible");
    });
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -45px 0px"
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}


/* ---------- 8. FLOATING GOLDEN PETALS ---------- */

function createFloatingPetals() {
    const container = document.getElementById("floatingPetals");

    if (!container || reducedMotion) {
        return;
    }

    // Keep the effect light on phones.
    const isSmallScreen = window.matchMedia("(max-width: 600px)").matches;
    const petalCount = isSmallScreen ? 8 : 15;

    for (let i = 0; i < petalCount; i++) {
        const petal = document.createElement("span");

        petal.className = "petal";
        petal.setAttribute("aria-hidden", "true");

        const left = Math.random() * 100;
        const delay = Math.random() * 14;
        const duration = 10 + Math.random() * 10;
        const drift = -35 + Math.random() * 70;
        const size = 5 + Math.random() * 6;

        petal.style.left = `${left}%`;
        petal.style.width = `${size}px`;
        petal.style.height = `${size * 1.4}px`;
        petal.style.setProperty("--fall-delay", `${delay}s`);
        petal.style.setProperty("--fall-duration", `${duration}s`);
        petal.style.setProperty("--drift", `${drift}px`);

        container.appendChild(petal);
    }
}

createFloatingPetals();


/* ---------- 9. SUBTLE HERO PARALLAX ---------- */

if (hero && heroImage && !reducedMotion) {
    let ticking = false;

    function updateHeroParallax() {
        const rect = hero.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Stop work when the hero is far outside the viewport.
        if (rect.bottom >= 0 && rect.top <= viewportHeight) {
            const progress = Math.max(
                -1,
                Math.min(1, (viewportHeight - rect.top) / (viewportHeight + rect.height) - 0.5)
            );

            const translateY = progress * 14;

            heroImage.style.transform =
                `scale(1.04) translate3d(0, ${translateY}px, 0)`;
        }

        ticking = false;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeroParallax);
                ticking = true;
            }
        },
        { passive: true }
    );

    window.addEventListener(
        "resize",
        () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeroParallax);
                ticking = true;
            }
        },
        { passive: true }
    );
}


/* ---------- 10. SAFETY: OPEN WITHOUT JS ANIMATION ---------- */

// If a script error happens before the opening button is used,
// the invitation can still be accessed through the button.
// Keep the page locked only while the opening screen is visible.
if (!opening) {
    body.classList.remove("is-loading");
}