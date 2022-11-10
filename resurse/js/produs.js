window.addEventListener("load",   function() {
    prod = document.getElementsByClassName("val-nume")[0];
    setCookie("produs", prod.innerText, 10000000000);
})