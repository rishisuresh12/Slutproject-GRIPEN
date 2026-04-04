 // LANGUAGE
 function setLang(lang) {
    document.querySelectorAll('[data-sv]').forEach(function(el) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
        var val = el.getAttribute('data-' + lang);
        if (val) el.textContent = val;
    });
    document.getElementById('btnSV').classList.toggle('active', lang === 'sv');
    document.getElementById('btnEN').classList.toggle('active', lang === 'en');
    document.documentElement.lang = lang;
    window._lang = lang;
}
document.getElementById('btnSV').addEventListener('click', function() { setLang('sv'); });
document.getElementById('btnEN').addEventListener('click', function() { setLang('en'); });
setLang('sv');

// TABS
document.querySelectorAll('.tabBtn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var target = btn.getAttribute('data-target');
        document.querySelectorAll('.variantPanel').forEach(function(p) { p.classList.remove('active'); });
        document.querySelectorAll('.tabBtn').forEach(function(b) { b.classList.remove('active'); });
        document.getElementById('panel-' + target).classList.add('active');
        btn.classList.add('active');
    });
});

// SLIDESHOW
var slideIndexes = { '39A': 0, '39B': 0, '39C': 0, '39D': 0, '39E': 0, '39F': 0 };

function updateSlideshow(v, index) {
    var slides = document.querySelectorAll('#ss-' + v + ' .slide');
    var total = slides.length;
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    slideIndexes[v] = index;
    slides.forEach(function(s, i) { s.classList.toggle('active', i === index); });
    document.querySelectorAll('#dots-' + v + ' .dot').forEach(function(d, i) { d.classList.toggle('active', i === index); });
    var counter = document.getElementById('counter-' + v);
    if (counter) counter.textContent = (index + 1) + ' / ' + total;
}

document.querySelectorAll('.slideNav').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var v = btn.getAttribute('data-v');
        var dir = btn.classList.contains('prev') ? -1 : 1;
        updateSlideshow(v, slideIndexes[v] + dir);
    });
});

document.querySelectorAll('.dot').forEach(function(dot) {
    dot.addEventListener('click', function() {
        updateSlideshow(dot.getAttribute('data-v'), parseInt(dot.getAttribute('data-i')));
    });
});