window.addEventListener("load",function(){

	prod_sel = localStorage.getItem("cos_virutal");


	if (prod_sel){
		var vect_ids=prod_sel.split(",");
		fetch("/produse_cos", {		

			method: "POST",
			headers:{'Content-Type': 'application/json'},
			
			mode: 'cors',		
			cache: 'default',
			body: JSON.stringify({
				ids_prod: vect_ids

			})
		})
		.then(function(rasp){ console.log(rasp); x=rasp.json(); console.log(x); return x})
		.then(function(objson) {

			var vect_ids=prod_sel.split(",");

			var i = 1;
			console.log(objson);
			for (let prod of objson){

				let article = document.createElement("article");
				article.classList.add("cost-virtual");

				var h2 = document.createElement("h2");
				h2.innerHTML = prod.nume;

				var p111 = document.createElement("p");
				p111.innerHTML = "Cantitate: " + (-vect_ids[i]).toString();
				var p = document.createElement("p");
				p.innerHTML = "Pret: " + prod.pret;
				var p1 = document.createElement("p");
				p1.innerHTML = "Descriere: " + prod.descriere;
				var p2 = document.createElement("p");
				p2.innerHTML = "Tip produs: " + prod.tip_produs;
				var p3 = document.createElement("p");
				p3.innerHTML = "Categorie: " + prod.categorie;
				var p4 = document.createElement("p");
				p4.innerHTML = "Producator: " + prod.producator;

				var buton_stergere = document.createElement("button")
				buton_stergere.innerHTML = "Sterge acest produs"
				buton_stergere.value = prod.id;

				buton_stergere.onclick = function () {
					var poz = vect_ids.indexOf(this.value);
					vect_ids.splice(poz, 2);
					localStorage.setItem("cos_virutal", vect_ids.join(","));
					location.reload();
				}

				let img = document.createElement("img");
				img.src = prod.imagine;

				article.appendChild(h2);
				article.appendChild(img);
				article.appendChild(buton_stergere);
				article.appendChild(p111);
				article.appendChild(p);
				article.appendChild(p1);
				article.appendChild(p2);
				article.appendChild(p3);
				article.appendChild(p4);

				document.getElementsByTagName("main")[0].insertBefore(article, document.getElementById("cumpara"));
				i += 2;
				/* TO DO


				pentru fiecare produs, creăm un articol in care afisam imaginea si cateva date precum:
				- nume, pret, imagine, si alte caracteristici

				

				*/
			}
	
		}
		).catch(function(err){console.log(err)});




		document.getElementById("cumpara").onclick=function(){
			var vect_ids=localStorage.getItem("cos_virutal").split(",");
			fetch("/cumpara", {		
	
				method: "POST",
				headers:{'Content-Type': 'application/json'},
				
				mode: 'cors',		
				cache: 'default',
				body: JSON.stringify({
					ids_prod: vect_ids
				})
			})
			.then(function(rasp){ console.log(rasp); return rasp.text()})
			.then(function(raspunsText) {
		   
				console.log(raspunsText);
				
				let p=document.createElement("p");
				p.innerHTML=raspunsText;
				document.getElementsByTagName("main")[0].innerHTML="";
				document.getElementsByTagName("main")[0].appendChild(p)
				if(!raspunsText.includes("nu sunteti logat"))
					localStorage.removeItem("produse_selectate");
		   
			}
			).catch(function(err){console.log(err)});
		}

	}
	else{
		document.getElementsByTagName("main")[0].innerHTML="<p>Nu aveti nimic in cos!</p>";
	}
	
	
});