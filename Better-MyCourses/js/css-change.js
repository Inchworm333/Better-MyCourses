let cust = document.querySelector("body > custom-style style");

cust.innerText = "html { --d2l-branding-primary-color: #00FF00; }";

let homeLink = document.querySelector('d2l-navigation-link-image');

homeLink.style.setProperty('filter', 'invert(1)');
