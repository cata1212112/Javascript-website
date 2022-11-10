window.addEventListener("load",  function () {
    var buton = document.getElementsByClassName("btn_tema");
    for (let btn of buton) {
        btn.onclick = function () {
            localStorage.setItem("tema", btn.value);
            document.body.classList.remove("light");
            document.body.classList.remove("dark");
            document.body.classList.remove("party");
            document.body.classList.add(btn.value);

            fetch("/tema", {
                method: "POST",
                headers:{'Content-Type': 'application/json'},

                mode:'cors',
                cache:'default',
                body: JSON.stringify( {
                    value:btn.value
                })
            });
        }
    }
});