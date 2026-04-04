// LANGUAGE
function setLang(lang) {
    document.querySelectorAll('[data-sv]').forEach(function (el) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return;
        var val = el.getAttribute('data-' + lang);
        if (val) el.textContent = val;
    });

    document.querySelectorAll('select option[data-sv]').forEach(function (opt) {
        var val = opt.getAttribute('data-' + lang);
        if (val) opt.textContent = val;
    });

    document.getElementById('btnSV').classList.toggle('active', lang === 'sv');
    document.getElementById('btnEN').classList.toggle('active', lang === 'en');
    document.documentElement.lang = lang;
    window._lang = lang;
}

document.getElementById('btnSV').addEventListener('click', function () { setLang('sv'); });
document.getElementById('btnEN').addEventListener('click', function () { setLang('en'); });
setLang('sv');


// MODEL PICKER
var selectedVariant = '';

document.querySelectorAll('.modelCard').forEach(function (card) {
    card.addEventListener('click', function () {
        document.querySelectorAll('.modelCard').forEach(function (c) { c.classList.remove('selected'); });
        card.classList.add('selected');
        selectedVariant = card.getAttribute('data-variant');
        document.getElementById('variant').value = selectedVariant;
        // clear error
        document.getElementById('err-variant').classList.remove('show');
        document.querySelector('.modelPicker').classList.remove('error');
    });
});


// VALIDATION HELPERS
function showErr(id, show) {
    var msg = document.getElementById('err-' + id);
    var field = document.getElementById(id);
    if (msg) msg.classList.toggle('show', show);
    if (field) field.classList.toggle('error', show);
}

['fname', 'lname', 'email', 'phone', 'org', 'country', 'qty'].forEach(function (id) {
    var field = document.getElementById(id);
    if (field) {
        field.addEventListener('input', function () { showErr(id, false); });
        field.addEventListener('change', function () { showErr(id, false); });
    }
});

document.getElementById('terms').addEventListener('change', function () { showErr('terms', false); });


// FORM SUBMIT
document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();

    var valid = true;

    var checks = [
        { id: 'fname', test: function (v) { return v.trim().length > 0; } },
        { id: 'lname', test: function (v) { return v.trim().length > 0; } },
        { id: 'email', test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); } },
        { id: 'phone', test: function (v) { return v.trim().length >= 7; } },
        { id: 'org', test: function (v) { return v.trim().length > 0; } },
        { id: 'country', test: function (v) { return v !== ''; } },
        { id: 'qty', test: function (v) { return parseInt(v) >= 1; } }
    ];

    checks.forEach(function (c) {
        var val = document.getElementById(c.id).value;
        var ok = c.test(val);
        showErr(c.id, !ok);
        if (!ok) valid = false;
    });

    // variant check
    if (!selectedVariant) {
        document.getElementById('err-variant').classList.add('show');
        document.querySelector('.modelPicker').classList.add('error');
        valid = false;
    }

    var termsOk = document.getElementById('terms').checked;
    showErr('terms', !termsOk);
    if (!termsOk) valid = false;

    if (valid) {
        var firstName = document.getElementById('fname').value.trim();
        var lastName = document.getElementById('lname').value.trim();
        var email = document.getElementById('email').value.trim();
        var phone = document.getElementById('phone').value.trim();
        var org = document.getElementById('org').value.trim();
        var country = document.getElementById('country').value;
        var qty = parseInt(document.getElementById('qty').value);
        var message = document.getElementById('message').value.trim();
        var orderNum = 'GRP-' + Date.now().toString().slice(-6);
        var today = new Date().toLocaleDateString('sv-SE');

        var pricesSEK = {
            'JAS 39A': 331000000,
            'JAS 39B': 331000000,
            'JAS 39C': 473000000,
            'JAS 39D': 473000000,
            'JAS 39E': 804000000,
            'JAS 39F': 804000000
        };

        var unitPrice = pricesSEK[selectedVariant] || 0;
        var total = unitPrice * qty;

        function formatSEK(n) {
            return n.toLocaleString('sv-SE') + ' SEK';
        }

        var bill = document.createElement('div');
        bill.id = 'billCard';
        bill.style.maxWidth = '700px';
        bill.style.margin = '50px auto';
        bill.style.padding = '0 20px 60px';

        bill.innerHTML =
            '<div style="background:white;border-radius:12px;box-shadow:0 6px 18px rgba(0,0,0,0.1);overflow:hidden;">' +

                '<div style="background:#0b1f3a;color:white;padding:32px 40px;display:flex;justify-content:space-between;align-items:center;">' +
                    '<div>' +
                        '<div style="font-size:1.6rem;font-weight:bold;letter-spacing:0.08em;">SAAB</div>' +
                        '<div style="font-size:0.8rem;opacity:0.6;margin-top:2px;">JAS 39 Gripen Defence Systems</div>' +
                    '</div>' +
                    '<div style="text-align:right;">' +
                        '<div style="font-size:0.75rem;opacity:0.6;text-transform:uppercase;letter-spacing:0.05em;">Orderbekräftelse</div>' +
                        '<div style="font-size:1.1rem;font-weight:bold;color:#4a9eff;margin-top:2px;">' + orderNum + '</div>' +
                        '<div style="font-size:0.78rem;opacity:0.5;margin-top:2px;">' + today + '</div>' +
                    '</div>' +
                '</div>' +

                '<div style="background:#1a7a4a;color:white;padding:12px 40px;font-size:0.85rem;display:flex;align-items:center;gap:10px;">' +
                    '<span style="font-size:1.1rem;">&#10003;</span>' +
                    '<span>Forfragan mottagen - Saabs forsvarsteam aterkommerinom 48 timmar.</span>' +
                '</div>' +

                '<div style="padding:36px 40px;">' +

                    '<div style="margin-bottom:28px;">' +
                        '<div style="font-size:0.7rem;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin-bottom:12px;">Kundinformation</div>' +
                        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">' +
                            '<div><div style="font-size:0.75rem;color:#aaa;">Namn</div><div style="font-size:0.95rem;font-weight:bold;color:#0b1f3a;">' + firstName + ' ' + lastName + '</div></div>' +
                            '<div><div style="font-size:0.75rem;color:#aaa;">Organisation</div><div style="font-size:0.95rem;font-weight:bold;color:#0b1f3a;">' + org + '</div></div>' +
                            '<div><div style="font-size:0.75rem;color:#aaa;">E-post</div><div style="font-size:0.95rem;color:#1c1c1c;">' + email + '</div></div>' +
                            '<div><div style="font-size:0.75rem;color:#aaa;">Telefon</div><div style="font-size:0.95rem;color:#1c1c1c;">' + phone + '</div></div>' +
                            '<div><div style="font-size:0.75rem;color:#aaa;">Land / Livré</div><div style="font-size:0.95rem;font-weight:bold;color:#0b1f3a;">' + country + '</div></div>' +
                        '</div>' +
                    '</div>' +

                    '<hr style="border:none;border-top:1px solid #eee;margin:0 0 28px;">' +

                    '<div style="margin-bottom:28px;">' +
                        '<div style="font-size:0.7rem;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin-bottom:12px;">Orderdetaljer</div>' +
                        '<table style="width:100%;border-collapse:collapse;font-size:0.9rem;">' +
                            '<thead>' +
                                '<tr style="border-bottom:2px solid #0b1f3a;">' +
                                    '<th style="text-align:left;padding:8px 0;color:#0b1f3a;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em;">Produkt</th>' +
                                    '<th style="text-align:center;padding:8px 0;color:#0b1f3a;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em;">Antal</th>' +
                                    '<th style="text-align:right;padding:8px 0;color:#0b1f3a;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em;">Enhetspris</th>' +
                                    '<th style="text-align:right;padding:8px 0;color:#0b1f3a;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.05em;">Totalt</th>' +
                                '</tr>' +
                            '</thead>' +
                            '<tbody>' +
                                '<tr style="border-bottom:1px solid #eee;">' +
                                    '<td style="padding:14px 0;">' +
                                        '<div style="font-weight:bold;color:#0b1f3a;">' + selectedVariant + '</div>' +
                                        '<div style="font-size:0.75rem;color:#aaa;">Stridsflygplan · Livré: ' + country + '</div>' +
                                    '</td>' +
                                    '<td style="text-align:center;padding:14px 0;font-weight:bold;">' + qty + ' st</td>' +
                                    '<td style="text-align:right;padding:14px 0;">' + formatSEK(unitPrice) + '</td>' +
                                    '<td style="text-align:right;padding:14px 0;font-weight:bold;">' + formatSEK(total) + '</td>' +
                                '</tr>' +
                            '</tbody>' +
                        '</table>' +
                    '</div>' +

                    '<div style="background:#eef2f6;border-radius:8px;padding:16px 20px;display:flex;justify-content:space-between;align-items:center;margin-bottom:' + (message ? '28px' : '0') + ';">' +
                        '<div>' +
                            '<div style="font-size:0.85rem;color:#555;">Estimerat ordervärde</div>' +
                            '<div style="font-size:0.72rem;color:#aaa;margin-top:2px;">Baserat på marknadspris april 2026 (~9,46 SEK/USD)</div>' +
                        '</div>' +
                        '<span style="font-size:1.3rem;font-weight:bold;color:#0b1f3a;">' + formatSEK(total) + '</span>' +
                    '</div>' +

                    (message ?
                        '<div style="margin-top:28px;">' +
                            '<div style="font-size:0.7rem;font-weight:bold;text-transform:uppercase;letter-spacing:0.1em;color:#888;margin-bottom:8px;">Meddelande</div>' +
                            '<div style="background:#fafbfd;border:1px solid #eee;border-radius:6px;padding:14px;font-size:0.9rem;color:#555;line-height:1.5;">' + message + '</div>' +
                        '</div>'
                    : '') +

                '</div>' +

                '<div style="background:#f5f7fa;border-top:1px solid #eee;padding:18px 40px;display:flex;justify-content:space-between;align-items:center;">' +
                    '<span style="font-size:0.75rem;color:#aaa;">Saab AB · www.saab.com</span>' +
                    '<span style="font-size:0.75rem;color:#aaa;">Ref: ' + orderNum + '</span>' +
                '</div>' +

            '</div>';

        document.querySelector('.formCard').style.display = 'none';
        document.getElementById('thankYou').style.display = 'none';
        document.querySelector('main').after(bill);
        bill.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});