const galleryData = [
    { id: 1, title: "Галактика Андромеды", description: "Ближайшая крупная галактика", category: "galaxy", tags: ["галактика"] },
    { id: 2, title: "Туманность Ориона", description: "Яркая диффузная туманность", category: "nebula", tags: ["туманность"] },
    { id: 3, title: "Юпитер", description: "Газовый гигант", category: "planet", tags: ["планета"] },
    { id: 4, title: "Туманность Кольцо", description: "Планетарная туманность", category: "nebula", tags: ["туманность"] },
    { id: 5, title: "Марс", description: "Красная планета", category: "planet", tags: ["планета"] },
    { id: 6, title: "Галактика Водоворот", description: "Спиральная галактика", category: "galaxy", tags: ["галактика"] },
    { id: 7, title: "Сатурн", description: "Планета с кольцами", category: "planet", tags: ["планета"] },
    { id: 8, title: "Туманность Киля", description: "Ярчайшая туманность", category: "nebula", tags: ["туманность"] }
];

const imageUrls = {
    1: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Andromeda_Galaxy_2025.png/960px-Andromeda_Galaxy_2025.png",
    2: "https://avatars.mds.yandex.net/get-mpic/11396862/2a0000018c29d5ddcba19c547b553b3bb6d7/orig",
    3: "https://avatars.mds.yandex.net/i?id=598950f30fc2fe388f60cc61be3ae24c_l-4366154-images-thumbs&n=13",
    4: "https://cdn.shazoo.ru/c1400x625/706006_Zv8iFYW_eye.jpg",
    5: "https://avatars.mds.yandex.net/i?id=c50ce2e9dac374396a29178fe5ab17d7_l-4478965-images-thumbs&n=13",
    6: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Messier51_sRGB.jpg/960px-Messier51_sRGB.jpg",
    7: "https://img.freepik.com/premium-photo/saturn-planet-isolated-transparent-background_995162-5557.jpg",
    8: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/NASA%E2%80%99s_Webb_Reveals_Cosmic_Cliffs%2C_Glittering_Landscape_of_Star_Birth.jpg/960px-NASA%E2%80%99s_Webb_Reveals_Cosmic_Cliffs%2C_Glittering_Landscape_of_Star_Birth.jpg"
};

let currentFilter = "all";
let currentView = "grid";
let likedItems = JSON.parse(localStorage.getItem('likedItems')) || {};

function getImageUrl(id) {
    return imageUrls[id];
}

function updateCounters() {
    const counterSpan = document.getElementById("image-counter");
    const likesSpan = document.getElementById("total-likes");
    if (counterSpan) {
        const filtered = currentFilter === "all" ? galleryData : galleryData.filter(i => i.category === currentFilter);
        counterSpan.textContent = filtered.length;
    }
    if (likesSpan) {
        likesSpan.textContent = Object.keys(likedItems).length;
    }
}

function showFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'floating-heart';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    document.body.appendChild(heart);
    setTimeout(() => {
        heart.style.transform = 'translateY(-60px) scale(1.5)';
        heart.style.opacity = '0';
    }, 10);
    setTimeout(() => heart.remove(), 600);
}

function toggleLike(id, btnElement) {
    const isLiked = likedItems[id] || false;
    if (isLiked) {
        delete likedItems[id];
    } else {
        likedItems[id] = true;
        const rect = btnElement.getBoundingClientRect();
        showFloatingHeart(rect.left + rect.width/2 - 12, rect.top - 10);
    }
    localStorage.setItem('likedItems', JSON.stringify(likedItems));
    
    const icon = btnElement.querySelector("i");
    if (likedItems[id]) {
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
        btnElement.classList.add("liked");
    } else {
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
        btnElement.classList.remove("liked");
    }
    updateCounters();
}

function openModal(imgUrl) {
    const modal = document.createElement("div");
    modal.className = "zoom-modal";
    modal.innerHTML = `
        <div class="zoom-modal-content">
            <span class="zoom-close">&times;</span>
            <img src="${imgUrl}" alt="Увеличенное изображение">
        </div>
    `;
    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";
    const closeModal = () => {
        modal.remove();
        document.body.style.overflow = "";
    };
    modal.querySelector(".zoom-close").onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
    document.addEventListener('keydown', function onKey(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', onKey);
        }
    });
}

function renderGallery() {
    const grid = document.getElementById("image-gallery");
    if (!grid) return;
    
    const filtered = currentFilter === "all" ? galleryData : galleryData.filter(item => item.category === currentFilter);
    grid.innerHTML = "";
    
    filtered.forEach(item => {
        const isLiked = likedItems[item.id] || false;
        const card = document.createElement("article");
        card.className = "image-card";
        card.innerHTML = `
            <div class="card-image">
                <img src="${getImageUrl(item.id)}" alt="${item.title}" class="gallery-img" loading="lazy">
                <div class="image-overlay">
                    <button class="like-btn ${isLiked ? 'liked' : ''}" data-id="${item.id}">
                        <i class="${isLiked ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
                    </button>
                    <button class="zoom-btn" data-img="${getImageUrl(item.id)}">
                        <i class="fas fa-expand"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <h3 class="image-title">${item.title}</h3>
                <div class="image-tags">
                    ${item.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>
                <p class="image-description">${item.description}</p>
            </div>
        `;
        grid.appendChild(card);
    });
    
    if (currentView === "list") {
        grid.classList.add("list-view");
    } else {
        grid.classList.remove("list-view");
    }
    
    document.querySelectorAll(".like-btn").forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            toggleLike(id, btn);
        };
    });
    
    document.querySelectorAll(".zoom-btn").forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            openModal(btn.dataset.img);
        };
    });
    
    updateCounters();
}

function setupFilters() {
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFilter = btn.dataset.filter;
            renderGallery();
        };
    });
}

function setupViewControls() {
    const gridBtn = document.getElementById("grid-view");
    const listBtn = document.getElementById("list-view");
    if (gridBtn) {
        gridBtn.onclick = () => {
            currentView = "grid";
            gridBtn.classList.add("active");
            listBtn.classList.remove("active");
            renderGallery();
        };
    }
    if (listBtn) {
        listBtn.onclick = () => {
            currentView = "list";
            listBtn.classList.add("active");
            gridBtn.classList.remove("active");
            renderGallery();
        };
    }
}

function updateYear() {
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function setupContactForm() {
    const form = document.getElementById("contactForm");
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const name = document.getElementById("name")?.value.trim();
            const email = document.getElementById("email")?.value.trim();
            const message = document.getElementById("message")?.value.trim();
            const consent = document.getElementById("consent")?.checked;
            if (!name) { alert("Введите имя!"); return; }
            if (!email || !email.includes("@")) { alert("Введите email!"); return; }
            if (!message) { alert("Введите сообщение!"); return; }
            if (!consent) { alert("Подтвердите согласие!"); return; }
            alert(`Спасибо, ${name}! Сообщение отправлено.`);
            form.reset();
        };
    }
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add("visible");
        });
    }, { threshold: 0.1 });
    document.querySelectorAll(".section-title, .about-card, .fact-card, .info-card, .form-card, .faq-item, .reasons-list li").forEach(el => {
        observer.observe(el);
    });
}

function setupParallax() {
    const layer = document.querySelector(".parallax-layer");
    if (layer) {
        document.onmousemove = (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            const moveX = (mouseX - 0.5) * 20;
            const moveY = (mouseY - 0.5) * 20;
            layer.style.transform = `translate(${moveX}px, ${moveY}px)`;
        };
    }
}

const facts = [
    "Свет от Солнца до Земли идёт 8 минут и 20 секунд.",
    "Один день на Венере длится дольше, чем один год.",
    "В космосе есть облако спирта — оно находится в созвездии Лебедя.",
    "Самая высокая гора в Солнечной системе — Олимп на Марсе (21 км).",
    "Космос полностью беззвучен, там нет воздуха для распространения звука.",
    "На МКС космонавты видят 16 рассветов и закатов за сутки.",
    "Вселенная состоит примерно из 100 миллиардов галактик."
];

function updateDailyFact() {
    const factElement = document.getElementById("daily-fact");
    if (factElement) {
        const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % facts.length;
        factElement.textContent = facts[dayIndex];
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("image-gallery")) {
        renderGallery();
        setupFilters();
        setupViewControls();
    }
    setupContactForm();
    setupScrollAnimations();
    setupParallax();
    updateYear();
    updateDailyFact();
});