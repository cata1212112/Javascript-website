window.addEventListener("DOMContentLoaded", function () {
    var text = getCookie("produs")
    let unde_inserez = document.getElementById("prezentare");
    let unde_inserez_ = document.getElementById("container");
    console.log(unde_inserez_)
    var elem = document.getElementById("ultimul_prod");
    if (!elem) {
        elem = document.createElement("p");
        elem.setAttribute("id", "ultimul_prod")
        document.getElementsByTagName("main")[0].insertBefore(elem, unde_inserez_);
    }
    var prod = getCookie("produs");
    if (prod != null) {
        elem.innerHTML = "Ultimul produs accesat este: " + prod;
    } else {
        elem.innerHTML = "";
    }
});