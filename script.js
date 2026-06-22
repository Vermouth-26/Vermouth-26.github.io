const TARGET_DATE = new Date("2026-09-19T00:30:00").getTime(); // Cambia esta fecha cuando tengas la definitiva

document.addEventListener("DOMContentLoaded", () => {
    // --- Countdown & Lock Logic ---
    const now = new Date().getTime();
    const isLocked = now < TARGET_DATE;

    // 1. Update 5to Año blocks in index.html and Vermouth26-5to.html
    const lockedContents = document.querySelectorAll(".locked-fallback");
    const unlockedContents = document.querySelectorAll(".unlocked-real");

    if (isLocked) {
        unlockedContents.forEach(el => el.classList.add("hidden"));
        lockedContents.forEach(el => el.classList.remove("hidden"));
    } else {
        lockedContents.forEach(el => el.classList.add("hidden"));
        unlockedContents.forEach(el => el.classList.remove("hidden"));
    }

    // Block clicking the 5to link completely if locked on index
    const link5to = document.getElementById("link-5to");
    if (link5to && isLocked) {
        link5to.addEventListener("click", (e) => {
            e.preventDefault();
            alert("🔒 Acceso Restringido. Espera hasta la fecha límite para descubrir el 5to Año.");
        });
    }

    // 2. Countdown Timer Logic
    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minsEl = document.getElementById("cd-mins");
    const secsEl = document.getElementById("cd-secs");

    if (daysEl) {
        const updateCountdown = () => {
            const currentTime = new Date().getTime();
            const distance = TARGET_DATE - currentTime;

            if (distance < 0) {
                daysEl.innerText = "00";
                hoursEl.innerText = "00";
                minsEl.innerText = "00";
                secsEl.innerText = "00";
                // Optionally reload to unlock if exactly passing
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            daysEl.innerText = days.toString().padStart(2, '0');
            hoursEl.innerText = hours.toString().padStart(2, '0');
            minsEl.innerText = minutes.toString().padStart(2, '0');
            secsEl.innerText = seconds.toString().padStart(2, '0');
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    // --- Carousel Logic ---
    const track = document.getElementById("track");
    if (track) {
        const images = Array.from(track.children);
        let index = 0;
        let interval;

        function getImageWidth() {
            if (images.length === 0) return 0;
            const img = images[0];
            const style = window.getComputedStyle(img);
            const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);
            return img.offsetWidth + margin;
        }

        function updateCarousel() {
            const container = document.querySelector(".carousel");
            if (!container) return;
            
            const imageWidth = getImageWidth();
            const containerWidth = container.offsetWidth;

            images.forEach(img => img.classList.remove("active"));
            
            if (images[index]) {
                images[index].classList.add("active");
            }

            const offset = (containerWidth / 2) - (imageWidth / 2) - (index * imageWidth);
            track.style.transform = `translateX(${offset}px)`;
        }

        function nextSlide() {
            index++;
            if (index >= images.length) index = 0;
            updateCarousel();
        }

        function prevSlide() {
            index--;
            if (index < 0) index = images.length - 1;
            updateCarousel();
        }

        function startAutoplay() {
            interval = setInterval(nextSlide, 3000);
        }

        function stopAutoplay() {
            clearInterval(interval);
        }

        const nextBtn = document.querySelector(".next");
        const prevBtn = document.querySelector(".prev");

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                nextSlide();
                stopAutoplay();
                startAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                prevSlide();
                stopAutoplay();
                startAutoplay();
            });
        }

        track.addEventListener("touchstart", stopAutoplay, {passive: true});
        track.addEventListener("touchend", startAutoplay);
        track.addEventListener("mouseenter", stopAutoplay);
        track.addEventListener("mouseleave", startAutoplay);

        window.addEventListener("resize", updateCarousel);

        setTimeout(() => {
            updateCarousel();
            startAutoplay();
        }, 100);
    }
});
