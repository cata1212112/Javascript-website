window.addEventListener("DOMContentLoaded", function () {
   checkBanner();
});

function setCookie(nume, valoare, timpExp, path= "/") {
    d = new Date();
    d.setTime(d.getTime() + timpExp);
    document.cookie = `${nume}=${valoare}; expires=${d.toUTCString()}; path=${path}`;
}

function getCookie(nume) {
    var line = document.cookie.split(";");
    for (let c of line) {
        c = c.trim();
        if (c.startsWith(nume+"=")) {
            console.log("daaaaaaa")
            return c.substring(nume.length + 1);
        }
    }
    return null;
}

function deleteCookie(nume) {
    setCookie(nume, "", 0);
}

function checkBanner() {
    console.log(getCookie("acceptat_banner"))
    if (getCookie("acceptat_banner") != null) {
        console.log("bun")
        document.getElementById("aici_banner").style.display = "none";
    } else {
        document.getElementById("aici_banner").style.display = "block";

        document.getElementById("ok_ccokies").onclick = function () {
            setCookie("acceptat_banner", "", 10 * 1000);
            document.getElementById("aici_banner").style.display = "none";
        }
    }
}