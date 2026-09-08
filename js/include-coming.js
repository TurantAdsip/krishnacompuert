// Header
fetch("../includes/header.html")
    .then(res => res.text())
    .then(data => {
        const header = document.getElementById("header");
        if (header) header.innerHTML = data;
    });

// Coming Soon
fetch("../includes/coming-soon.html")
    .then(res => res.text())
    .then(data => {
        const comingSoon = document.getElementById("coming-soon");
        if (comingSoon) comingSoon.innerHTML = data;
    });

// Footer
fetch("../includes/footer.html")
    .then(res => res.text())
    .then(data => {
        const footer = document.getElementById("footer");
        if (footer) footer.innerHTML = data;
    });