window.addEventListener("load", function () {
    let articole = document.getElementsByClassName("factura");
    var v_articole = Array.from(articole);
    v_articole.sort(function (a, b) {
        let data_a = Date.parse(a.getElementsByClassName("data")[0].innerHTML);
        let data_b = Date.parse(b.getElementsByClassName("data")[0].innerHTML);

        let nume_a = a.getElementsByClassName("nume")[0].innerHTML;
        let nume_b = b.getElementsByClassName("nume")[0].innerHTML;

        let prenume_a = a.getElementsByClassName("prenume")[0].innerHTML;
        let prenume_b = b.getElementsByClassName("prenume")[0].innerHTML;

        if (data_a === data_b) {
            if (nume_a === nume_b) {
                return (prenume_a - prenume_b)
            } else {
                return nume_a - nume_b;
            }
        } else {
            return data_a - data_b;
        }
    });

    for (let art of v_articole) {
        art.parentNode.appendChild(art);
    }
})