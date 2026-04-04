function setLang(lang) {
    document.querySelectorAll("[data-sv]").forEach(el => {
        el.textContent = el.getAttribute("data-" + lang);
    });
}