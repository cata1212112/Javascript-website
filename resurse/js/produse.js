window.addEventListener("load",   function() {
    iduriProduse = localStorage.getItem("cos_virutal");
    if (iduriProduse) {
        iduriProduse = iduriProduse.split(",");
    } else {
        iduriProduse = []
    }
    for (let id of iduriProduse) {
        var ch = document.querySelector(`[value-${id}].select-cos`);
        if (ch) {
            ch.checked = true;
        }
    }

    document.getElementById("inp-pret_mini").onchange = function () {
        let infoRange = document.getElementById("infoRange_mini").innerHTML = " (" + this.value + ") ";
    }

    document.getElementById("inp-pret_maxi").onchange = function () {
        let infoRange = document.getElementById("infoRange_maxi").innerHTML = " (" + this.value + ") ";
    }


    document.getElementById("filtrare").onclick = function () {
        let textarea = document.getElementById("textarea").value;

         console.log(textarea);

        let buton_filtrare_nume = document.getElementById("inp_nume").value.toLowerCase();

        let butoane_radio = document.getElementsByName("gr_rad");
        for (let rad of butoane_radio) {
            if (rad.checked) {
                var valDimensiune = rad.value;
                break;
            }
        }

        let discount = document.getElementById("discount");
        let ok = 0;
        if (discount.checked) ok = 1;

        luni_alese = [];
        let luni = document.getElementById("luni_select");
        for (let luna of luni) {
            if (luna.selected) {
                luni_alese.push(luna.innerHTML);
            }
        }
        // console.log(luni_alese);

        let articole = document.getElementsByClassName("produs");

        var valPret_mini = parseFloat(document.getElementById('inp-pret_mini').value);

        var valPret_maxi = parseFloat(document.getElementById('inp-pret_maxi').value);

        if (valPret_mini > valPret_maxi) {
            alert("Pretul minim este mai mare decat pretul maxi");
        } else {

            var culoare_aleasa = document.getElementById("datalist").value;
            // console.log(culoare_aleasa);

            // console.log(valPret_mini, valPret_maxi);

            var valCategorie = document.getElementById('inp-categorie').value;

            for (let art of articole) {

                art.style.display = "none";
                let dimensiuneArt = art.getElementsByClassName("marime_val")[0].innerHTML.toLowerCase();

                if (ok === 0 || (ok === 1 && dimensiuneArt === "medie")) {

                    let numeArt = art.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase();

                    let descriereArt = art.getElementsByClassName("descriere_val")[0].innerHTML.toLowerCase();

                    let cond1 = (numeArt.startsWith(buton_filtrare_nume));

                    let VitezaArt = parseInt(art.getElementsByClassName("viteza_val")[0].innerHTML);

                    let PretArt = parseFloat(art.getElementsByClassName("val_pret")[0].innerHTML);

                    let CategorieArt = art.getElementsByClassName("val_categorie")[0].innerHTML;

                    let culori = art.getElementsByClassName("culori_val")[0].innerHTML.split(',');
                    // console.log(culori);

                    // console.log(dimensiuneArt, valDimensiune, dimensiuneArt === valDimensiune, dimensiuneArt.length, valDimensiune.length);
                    let cond2 = (dimensiuneArt.toLowerCase() === valDimensiune || valDimensiune === "toate");

                    // console.log(valPret_mini, valPret_maxi, PretArt, valPret_mini <= PretArt, PretArt <= valPret_maxi);
                    let cond3 = (valPret_mini <= PretArt && PretArt <= valPret_maxi);

                    let cond4 = (valCategorie === CategorieArt || valCategorie === "toate");

                    let cond5 = 0;

                    let cond6 = 0;

                    let cond7 = descriereArt.includes(textarea);

                    let LunaArt = art.getElementsByClassName("time_val")[0].innerHTML;
                    LunaArt = LunaArt.split('-');
                    LunaArt = LunaArt[1];

                    for (let lun of luni_alese) {
                        // console.log((lun === LunaArt) , lun, LunaArt);

                        if (lun === LunaArt) {
                            cond6 = 1;
                            break;
                        }
                    }

                    for (let x of culori) {
                        if (x === culoare_aleasa) {
                            cond5 = 1;
                        }
                    }
                    if (culoare_aleasa === "toate" || culoare_aleasa === "") cond5 = 1;
                    let condFinal = (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7);

                    if (condFinal) {
                        art.style.display = "block";
                    }
                }
            }
        }
    }

    document.getElementById("resetare").onclick = function () {
        let articole = document.getElementsByClassName("produs");

        for (let art of articole) {
            art.style.display = "block";
        }
        document.getElementById("inp_nume").value = "";

        let butoane_radio = document.getElementsByName("gr_rad");

        for (let rad of butoane_radio) {
            if (rad.value === "toate") {
                rad.checked = true;
                break;
            }
        }

        document.getElementById('inp-pret_mini').value = document.getElementById('inp-pret_mini').min;
        document.getElementById("infoRange_mini").innerHTML = " (" + document.getElementById('inp-pret_mini').value + ") ";

        document.getElementById('inp-pret_maxi').value = document.getElementById('inp-pret_maxi').max;
        document.getElementById("infoRange_maxi").innerHTML = " (" + document.getElementById('inp-pret_maxi').value + ") ";


        document.getElementById('inp-categorie').value = "toate";

        document.getElementById('datalist').value = "";

        let luni = document.getElementById("luni_select");
        for (let luna of luni) {
            luna.selected = true;
        }

        let discount = document.getElementById("discount");
        discount.checked = false;
    }

    document.getElementById("sortCrescNume").onclick = function () {
        let articole = document.getElementsByClassName("produs");
        var v_articole = Array.from(articole);
        v_articole.sort(function (a, b) {
            let pret_a = parseFloat(a.getElementsByClassName("val_pret")[0].innerHTML);
            let pret_b = parseFloat(b.getElementsByClassName("val_pret")[0].innerHTML);

            let nume_a = a.getElementsByClassName("val-nume")[0].innerHTML;
            let cnt_culori_a = a.getElementsByClassName("culori_val")[0].innerHTML;
            cnt_culori_a = cnt_culori_a.split(',')
            cnt_culori_a = cnt_culori_a.length;

            let cnt_culori_b = b.getElementsByClassName("culori_val")[0].innerHTML;
            cnt_culori_b = cnt_culori_b.split(',')
            cnt_culori_b = cnt_culori_b.length;

            if (pret_a === pret_b) {
                return cnt_culori_a - cnt_culori_b;
            } else {
                return (pret_a - pret_b);
            }
        });

        for (let art of v_articole) {
            art.parentNode.appendChild(art);
        }
    }


    document.getElementById("sortDescrescNume").onclick = function () {
        let articole = document.getElementsByClassName("produs");
        var v_articole = Array.from(articole);
        v_articole.sort(function (a, b) {
            let pret_a = parseFloat(a.getElementsByClassName("val_pret")[0].innerHTML);
            let pret_b = parseFloat(b.getElementsByClassName("val_pret")[0].innerHTML);

            let nume_a = a.getElementsByClassName("val-nume")[0].innerHTML;
            let cnt_culori_a = a.getElementsByClassName("culori_val")[0].innerHTML;
            cnt_culori_a = cnt_culori_a.split(',')
            cnt_culori_a = cnt_culori_a.length;

            let cnt_culori_b = b.getElementsByClassName("culori_val")[0].innerHTML;
            cnt_culori_b = cnt_culori_b.split(',')
            cnt_culori_b = cnt_culori_b.length;

            if (pret_a === pret_b) {
                return cnt_culori_b - cnt_culori_a;
            } else {
                return (pret_b - pret_a);
            }
        });

        for (let art of v_articole) {
            art.parentNode.appendChild(art);
        }
    }

    document.getElementById("calculare").onclick = function () {
        let p_vechi = document.getElementById("psuma");
        if (!p_vechi) {
            let suma = 0;
            let articole = document.getElementsByClassName("produs");

            for (let art of articole) {
                if (art.style.display !== "none") {
                    suma += parseFloat(art.getElementsByClassName("val_pret")[0].innerHTML);
                }
            }

            var p = document.createElement("p");
            p.innerHTML = suma;
            p.id = "psuma";
            var sectiune = document.getElementById("div_suma");
            sectiune.parentElement.insertBefore(p, sectiune.nextElementSibling);
            setTimeout(function () {
                let p_vechi = document.getElementById("psuma");
                if (p_vechi) {
                    p_vechi.remove();
                }
            }, 2000);
        }
    }

    window.onkeydown = function (e) {
        if (e.key === 'c' && e.altKey) {
            let p_vechi = document.getElementById("psuma");
            if (!p_vechi) {
                let suma = 0;
                let articole = document.getElementsByClassName("produs");

                for (let art of articole) {
                    if (art.style.display !== "none") {
                        suma += parseFloat(art.getElementsByClassName("val_pret")[0].innerHTML);
                    }
                }

                var p = document.createElement("p");
                p.innerHTML = suma;
                p.id = "psuma";
                var sectiune = document.getElementById("produse");
                sectiune.parentElement.insertBefore(p, sectiune);
                setTimeout(function () {
                    let p_vechi = document.getElementById("psuma");
                    if (p_vechi) {
                        p_vechi.remove();
                     }
                }, 2000);
            }

        }
    }

    var checkboxuri = document.getElementsByClassName("select_cos");

    iduriProduse = localStorage.getItem("cos_virutal");
    if (iduriProduse) {
        iduriProduse = iduriProduse.split(",");
    } else {
        iduriProduse = []
    }
    console.log(iduriProduse)
    for (let ch of checkboxuri) {
        console.log(ch.value)
          var poz = iduriProduse.indexOf(ch.value);
        if (poz != -1) {
            ch.checked = true;

            var cata_cant = "cate" + ch.value;
            var cantitatea = document.getElementById(cata_cant);
            cantitatea.selectedIndex = -iduriProduse[poz+1] - 1;
        }
    }

     for (let ch of checkboxuri) {
         ch.onchange = function () {

             iduriProduse = localStorage.getItem("cos_virutal");
             /// pt cantitate pun a|b inseamna id ul a e luat de b ori
             if (iduriProduse) {
                 iduriProduse = iduriProduse.split(",");
             } else {
                 iduriProduse = []
             }

             if (this.checked) {
                 var cata_cant = "cate" + this.value;
                 var cantitatea = document.getElementById(cata_cant);
                 cantitatea = cantitatea.options[cantitatea.selectedIndex].text;
                 console.log(localStorage.getItem("cos_virutal"));
                 cantitatea = parseInt(cantitatea);
                 iduriProduse.push(this.value);
                 iduriProduse.push(-cantitatea)
             } else {
                 var poz = iduriProduse.indexOf(this.value);
                 console.log(poz);
                 if (poz != -1) {
                     iduriProduse.splice(poz, 2);
                     var cata_cant = "cate" + this.value;
                     var cantitatea = document.getElementById(cata_cant);
                     cantitatea.selectedIndex = 0;
                 }
             }
             localStorage.setItem("cos_virutal", iduriProduse.join(","));
         }
     }
});