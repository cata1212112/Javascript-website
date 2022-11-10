const express = require("express");
const fs = require("fs");
const sharp = require("sharp");
const {Client} = require("pg");
const ejs = require("ejs");
const sass = require("sass");
const formidable = require("formidable");
const crypto= require('crypto');
const session= require('express-session');
const nodemailer= require('nodemailer');
const path= require('path');
const helmet = require('helmet');
const request = require('request')

const html_to_pdf = require('html-pdf-node');
const juice = require('juice');
const QRCode = require('qrcode');

const xmljs = require('xml-js');
const mongodb = require('mongodb');
const puppeteer = require('puppeteer');

const obGlobal = {obImagini:null, obErori:null};

var sirAlphaNum = "";
var sirAlphaNum2 = "";
var protocol = null;
var nume_domeniue = null;

var url = "mongodb+srv://cata:cata@cluster0.pqxra.mongodb.net/?retryWrites=true&w=majority";
clientMongo = mongodb.MongoClient;
bdMongo = null;
clientMongo.connect(url, function (err, bd) {
   if (err) console.log(err);
   else {
       console.log("conectat")
       bdMongo = bd.db("bd_site");
   }
});

var intervale = [[48, 57], [65, 90], [97, 122]];

var iouri_active = {};

foldere = ["temp", "poze_uploadate"];
for (let folder of foldere) {
    if (!fs.existsSync(path.join(__dirname, folder))) {
        fs.mkdirSync(path.join(__dirname, folder));
    }
}

for (let interval of intervale) {
    for (let x=interval[0]; x<=interval[1]; x++) {
        sirAlphaNum += String.fromCharCode(x);
    }
}

function genreazaToken(n) {
    let token = "";
    for (let i=0; i<n; i++) {
        token += sirAlphaNum[Math.floor(Math.random() * sirAlphaNum.length)];
    }
    return token;
}

var intervale2 = [[48, 57], [65, 90]];
for (let interval of intervale2) {
    for (let x=interval[0]; x<=interval[1]; x++) {
        sirAlphaNum2 += String.fromCharCode(x);
    }
}

function genreazaToken2(n) {
    let token = "";
    for (let i=0; i<n; i++) {
        token += sirAlphaNum2[Math.floor(Math.random() * sirAlphaNum2.length)];
    }
    return token;
}


if (process.env.SITE_ONLINE) {
    var client = new Client({
    database:"d8k60d03ujd94d",
    user:"qlkbfzvymhqonh",
    password:"76d059fd39a45f7b480e9bf461d9cd5a321d1382f224c39ae371220678e3976d",
    host:"ec2-23-20-224-166.compute-1.amazonaws.com",
    port:"5432",
    ssl : {
        rejectUnauthorized: false
    }
});

    protocol = "https://";
    nume_domeniue = "gentle-inlet-05943.herokuapp.com";
} else {
    protocol = "http://";
    nume_domeniue = "localhost:8080";
    var client = new Client({database: "bd_site", user: "cata", password: "cata", host: "localhost", port: "5432"});
   // console.log("ok");
}



client.connect();

app = express();
app.use(helmet.frameguard());

app.use(express.static(__dirname + '/public'));
app.use(["/produse_cos", "/cumpara", "/tema", "/distruge_sesiune"], express.json({limit:'2mb'}));
app.use("/contact", express.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.use("/resurse", express.static(__dirname + "/resurse"));
app.use("/poze_uploadate", express.static(__dirname + "/poze_uploadate"));
app.use("/produse", express.static(__dirname + "/produse"));
app.use("/temp", express.static(__dirname + "/temp"));

function getRandomInt(max) {
   return Math.floor(Math.random() * max);
}

incarcaEroareJSON();
creeazaImagini();

parolaServer = "tehniciWEB";

app.use(session({
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
}));

app.post("/inreg", function (req, res) {
   var formular = new formidable.IncomingForm();
   var cale_imgaine = "";
   var username;
   formular.parse(req, function (err, campuriText, campuriFisier) {
       var eroare = "";
       if (campuriText.username === "") {
           eroare += "Username necompletat. \n";
       }
       if (campuriText.prenume === "") {
           eroare += "Prenume necompletat. \n";
       }
       if (campuriText.parola === "") {
           eroare += "Parola necompletat. \n";
       }
       if (campuriText.rparola === "") {
           eroare += "Reintroducere parola necompletat. \n";
       }
       if (campuriText.nume === "") {
           eroare += "Nume necompletat. \n";
       }
       if (campuriText.email === "") {
           eroare += "Email necompletat. \n";
       }
       if (!campuriText.nume.match(new RegExp("^[A-Za-z -]+$"))) {
           eroare += "Numele nu corespunde patterului. \n";
       }
       if (!campuriText.prenume.match(new RegExp("^[A-Za-z -]+$"))) {
           eroare += "Prenumele nu corespunde patterului. \n";
       }
       if (!campuriText.username.match(new RegExp("^[A-Za-z_]+[0-9]*$"))) {
           eroare += "Username nu corespunde patterului. \n";
       }
       if (!campuriText.email.match(new RegExp("^[a-z0-9._%+-]*@[a-z]*.[a-z]{1,3}$"))) {
           eroare += "Emailul nu corespunde patternului. \n";
       }
       // queryUtiliz = `SELECT username FROM UTILIZATORI WHERE username = '${campuriText.username}'`;

       //console.log(eroare)
       if (eroare === "") {
           client.query("SELECT username FROM UTILIZATORI WHERE username = $1::text",[campuriText.username], function (err, rezUtil) {
              // console.log(err);
               if (rezUtil.rows.length != 0) {
                   eroare += "Username-ul mai exista. \n";

                   randeazaEroare(res, -1, "Eroare inregistarre",eroare, null);
               } else {
                   var token = genreazaToken2(4);
                   token += crypto.scryptSync(campuriText.username, nume_domeniue, 40).toString("hex");
                   for (let i=0; i<token.length; i++) {
                       if (!token[i].match(new RegExp("^[a-zA-z0-9]"))) {
                           token[i] = '0';
                       }
                   }
                  // console.log(token);
                   var parolaServer = genreazaToken(16);
                   var parolaCriptata = crypto.scryptSync(campuriText.parola, parolaServer, 64).toString("hex");

                   var token_stergere = genreazaToken(16);
                   var token_resetare = genreazaToken(16);

                   client.query("insert into utilizatori (username, nume, prenume, parola, email, culoare_chat, cod, ocupatie, saltstring, cale_poza, token_resetare_parola, token_sterge_cont) values ($1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text, $8::text, $9::text, $10::text, $11::text, $12::text)",
                       [campuriText.username, campuriText.nume, campuriText.prenume, parolaCriptata, campuriText.email, campuriText.culoare_chat, token,
                           campuriText.ocupatie, parolaServer, cale_imgaine, token_resetare, token_stergere],function (err, rezInserare) {

                      // console.log("Inregistrare eroare: \n");
                       console.log(err);
                       if (!err) {
                           res.render("pagini/inregistrare", {raspuns: "Datele au fost introduse."});
                           let link = protocol + nume_domeniue + "/confirmare/" + campuriText.username + "/" + token;
                           trimiteMail(campuriText.email, "Cont nou", `Bine ai venit in comunitatea noastra Barci Online.'`,
                               `<h1>Salut!</h1><p>Bine ai venit in comunitatea noastra Barci Online. Username-ul tau este  </p><p style='color:green;font-weight: bold;'>${campuriText.username}.</p>
                                                                                                                <a href='${link}'>Confirma contul</a>`, []);
                       } else {
                           res.render("pagini/inregistrare", {raspuns: "Eroare baza de date."});
                       }
                   });
               }
               res.render("pagini/inregistrare", {raspuns: "Datele au fost introduse."});
           });
       } else {
           randeazaEroare(res, -1, "Eroare inregistarre",eroare, null);
       }
   });
       formular.on("field", function (nume, val) {
           if (nume === "username") {
               username = val;
           }
       });
       cale = "/poze_uploadate"
       formular.on("fileBegin", function (nume, fisier) {
           caleUtil = path.join(__dirname, "poze_uploadate", username);
           cale = cale + "/" + username;
           if (!fs.existsSync(caleUtil)) {
               fs.mkdirSync(caleUtil);
           }
           cale = cale + "/poza.png";
           fisier.filepath = path.join(caleUtil, "poza.png");
       });
       formular.on("file", function (nume, fisier) {
           if (fisier.size === 0) {
               cale_imgaine = "/resurse/imagini/default.png";
           } else {
               cale_imgaine = cale;
           }
       });

});


app.get("/inregistrare", function (req, res) {
    res.render("pagini/inregistrare", {});
});

app.get("/confirmare/:username/:token", function (req, res) {
   let comanda_upd = `update utilizatori set confirmat_mail = true where cod='${req.params.token}'`;
  // console.log(comanda_upd);
   client.query(comanda_upd, function (err, rez) {
       if (err) {
           randeazaEroare(-1, "Eroare confirmare", "Incearca din nou", null);
       } else {
           res.render("pagini/confirmare");
       }
   });
});

app.get("/sterge_cnt/:tokensterge/:id/:email", function (req, res) {
    let comanda = `delete from accesari where user_id='${req.params.id}'`;
    client.query(comanda, function (err, rez) {
        if (err) console.log(err);
    });
    let comadna_stergere = `delete from utilizatori where id='${req.params.id}' and token_sterge_cont='${req.params.tokensterge}'`;
    client.query(comadna_stergere, function (err, rez) {
        if (err) console.log(err);
        else {
            trimiteMail(req.params.email, "Cont sters cu succes", "Ti-ai sters contul cu succes", "", []);
            res.render("pagini/confirmare");
        }
    })
})

app.get("/resetare_pass/:id/:oldparola/:newparola", function (req, res) {
    let comanda_update = `update utilizatori set parola='${req.params.newparola}' where id='${req.params.id}' and parola='${req.params.oldparola}'`
    client.query(comanda_update, function (err, rez) {
       if (err) console.log(err);
       res.render("pagini/confirmare");
    });
})

async function trimiteMail(email, subiect, mesajText, mesajHtml, atasamente=[]){
    var transp= nodemailer.createTransport({
        service: "gmail",
        secure: false,
        auth:{//date login
            user:"tehniciwebsite@gmail.com",
            pass:"ughijyqtzngsapys"
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    //genereaza html
    await transp.sendMail({
        from:"tehniciwebsite@gmail.com",
        to:email,
        subject:subiect,//"Te-ai inregistrat cu succes",
        text:mesajText, //"Username-ul tau este "+username
        html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
        attachments: atasamente
    })
   // console.log("trimis mail");
}

app.post("/produse_cos", function (req, res) {
   // console.log(req.body);

    if (req.body.ids_prod.length != 0) {
        let qery_sel = `select id, nume, descriere, pret, tip_produs, categorie, producator, imagine
                        from barci
                        where id in (${req.body.ids_prod.join(",")})`;

        client.query(qery_sel, function (err, rezQuer) {
            if (err) {
              //  console.log(err);
                res.send("Eroare");
            }
            res.send(rezQuer.rows);
        });
    } else {
        res.send("Vector vid.");
    }
});

var pun_tema = "";

app.post("/cumpara",function(req, res){
    if(!req.session.utilizator){
        res.write("Nu puteti cumpara daca nu sunteti logat!");res.end();
        return;
    }
    client.query("select id, nume, pret, tip_produs, categorie, imagine, producator from barci where id in ("+req.body.ids_prod+")", function(err,rez){

        let produse_trimite = rez.rows;
        for (let prd of produse_trimite) {
            console.log(prd.imagine)
            prd.imagine = prd.imagine.replace(/\\/g, "/");
            console.log(prd.imagine)
        }
        var cantitati = [];
        console.log(req.body.ids_prod)
        for (let prod of rez.rows) {
            var poz = req.body.ids_prod.indexOf(prod.id.toString());
            console.log(poz)
            cantitati.push(-req.body.ids_prod[poz + 1]);
        }
        let rezFactura=ejs.render(fs.readFileSync("views/pagini/factura.ejs").toString("utf8"),{utilizator:req.session.utilizator,produse:rez.rows, protocol:protocol, domeniu:nume_domeniue, cantitati:cantitati});
        console.log(rezFactura)
        let options = { format: 'A4', args: ['--no-sandbox', '--disable-extensions',  '--disable-setuid-sandbox'] };

        let file = { content: juice(rezFactura, {inlinePseudoElements:true}) };

        html_to_pdf.generatePdf(file, options).then(function(pdf) {
            if(!fs.existsSync("./facturi"))
                fs.mkdirSync("./facturi");
            var numefis="./facturi/test"+(new Date()).getTime()+".pdf";
            fs.writeFileSync(numefis,pdf);
            let mText=`Stimate ${req.session.utilizator.username}, aveți atașată factura.`;
            let mHtml=`<h1>Salut!</h1><p>${mText}</p>`;

            trimiteMail(req.session.utilizator.email,"Factura", mText, mHtml, [{
                filename: 'factura.pdf',
                content: fs.readFileSync(numefis)
            }]);
            res.write("Totu bine!");res.end();
            let produse_trimite = rez.rows;
            var cantitati = [];
            for (let prod of rez.rows) {
                var poz = req.body.ids_prod.indexOf(prod.id.toString());
                cantitati.push(-req.body.ids_prod[poz + 1]);
            }

            let factura= { data: new Date(), username: req.session.utilizator.username, produse : produse_trimite, nume :  req.session.utilizator.nume, prenume :  req.session.utilizator.prenume, cantitati:cantitati};
            bdMongo.collection("facturi").insertOne(factura, function(err, res) {
                if (err) console.log(err);
                else{
                    console.log("Am inserat factura in mongodb");
                    bdMongo.collection("facturi").find({}).toArray(function(err, result) {
                        if (err) console.log(err);
                        else console.log(result);
                    });
                }
            });
        });

    });

});

cale_qr="./resurse/imagini/qrcode";
QRCode.toFile(cale_qr + "/" + "qr_produse" + ".png", protocol+nume_domeniue + "/produse/");
if (fs.existsSync(cale_qr))
    fs.rmSync(cale_qr, {force:true, recursive:true});
fs.mkdirSync(cale_qr);
client.query("select id from barci", function(err, rez){
    for(let prod of rez.rows){
        let cale_prod=protocol+nume_domeniue+"/produs/"+prod.id;
        QRCode.toFile(cale_qr+"/"+prod.id+".png",cale_prod);
    }
});


app.post("/login", function (req, res) {
    var formular = new formidable.IncomingForm();
    formular.parse(req, function (err, campuriText, campuriFisier) {
        var serverpass = "";

        // var queryParolaServer = `SELECT saltstring FROM utilizatori WHERE username = '${campuriText.username}' AND confirmat_mail = true`;
        client.query("SELECT saltstring FROM utilizatori WHERE username = $1::text AND confirmat_mail = true",[campuriText.username] ,function (err, rezParola) {
            // console.log(rezParola.rows[0]);
           if (err || rezParola.rows[0] === undefined) {
               req.session.mesajLogin = "Login esuat";
               res.redirect("/index");
           }  else {
               serverpass = rezParola.rows[0].saltstring || "";
               var parolaCriptata = crypto.scryptSync(campuriText.parola, serverpass, 64).toString("hex");
               var querySelect = `SELECT * FROM utilizatori WHERE username = $1::text AND parola = $2::text and confirmat_mail = true`;
               client.query(querySelect, [campuriText.username, parolaCriptata],function (err, rezSelect) {
                   if (err) console.log(err);
                   else {
                       if (rezSelect.rows.length == 1) {
                          // console.log("Logat");
                          // console.log(rezSelect.rows[0]);
                           req.session.utilizator = {
                               id:rezSelect.rows[0].id,
                               nume:rezSelect.rows[0].nume,
                               prenume:rezSelect.rows[0].prenume,
                               username:rezSelect.rows[0].username,
                               email:rezSelect.rows[0].email,
                               rol:rezSelect.rows[0].rol,
                               ocupatie:rezSelect.rows[0].ocupatie,
                               culoare_chat:rezSelect.rows[0].culoare_chat,
                               poza:rezSelect.rows[0].cale_poza
                           }
                          // console.log(req.session.utilizator)
                           req.session.mesajLogin = ""
                           pun_tema = rezSelect.rows[0].tema;
                           res.redirect("/index");

                       } else {
                           // randeazaEroare(res, -1, "Login Esuat", "Mail neconfirmat sau parola gresita", null);
                           req.session.mesajLogin = "Login esuat";
                           res.redirect("/index");
                       }
                   }
               });
           }
        });

        // var querySelect = `SELECT * FROM utilizatori WHERE username = '${campuriText.username}' AND parola = '${parolaCriptata}' and confirmat_mail = true`;
    });
    // res.redirect("/index");
});


app.get("/logout", function (req, res) {
    req.session.destroy();
    res.locals.utilizator = null;
    res.render("pagini/logout");
});

var ipuri_active={};

app.get("/*", function (req, res, next) {
    luni = ["Ianuarie", "Februiarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
    client.query("SELECT culori FROM BARCI", function (err, rezCulori) {
        culori = []
        for (let vecCul of rezCulori.rows) {
            for (let culoare of vecCul.culori) {
                if (!culori.includes(culoare)) {
                    culori.push(culoare);
                }
            }
        }
        res.locals.culori = culori;
    });
    client.query("SELECT data_adaugare FROM BARCI", function (err, rezLuni) {
        luni_ptGlobals = []
        for (let data of rezLuni.rows) {
            var m = new Date(data.data_adaugare);
            var luna = m.getUTCMonth()
            if (!luni_ptGlobals.includes(luni[luna])) {
                luni_ptGlobals.push(luni[luna]);
            }
        }
        res.locals.Luni = luni_ptGlobals;
    });
    client.query("select * from unnest(enum_range(null::tipuri_barca))", function(err, rezCateg) {
        res.locals.tipuri = rezCateg.rows;
    });
    client.query("SELECT MIN(pret) FROM BARCI", function (err, minipret_){
        res.locals.minipret = minipret_.rows[0].min;
    });
    client.query("SELECT MAX(pret) FROM BARCI", function (err, maxipret_){
        res.locals.maxipret = maxipret_.rows[0].max;
    });
    client.query("select * from unnest(enum_range(null::categ_barca))", function(err, rezCateg) {
        res.locals.propGenereala = rezCateg.rows;
    });

    res.locals.utilizator = req.session.utilizator;
    res.locals.mesajLogin = req.session.mesajLogin;
    next();
});


//console.log(crypto.scryptSync("123", "afdF8RWl38Mpwvev", 64).toString("hex"));

app.get("/info-clienti", function (req, res) {
    res.render("pagini/info-clienti")
})

app.post("/profil", function (req, res) {
    var cale_imag = "";
   if (!req.session.utilizator) {
       console.log("adad");
       res.render("pagini/erorare", {text:"Nu sunteti logat"});
       return ;
   }
   var formular = new formidable.IncomingForm();
   formular.parse(req, function (err, campuriText, campuriFisier) {
       //console.log("In parsare");
      // console.log(cale_imag)
       var serverpass = "";
       var continut_email = "";
       client.query("SELECT saltstring FROM utilizatori WHERE username = $1::text AND confirmat_mail = true",[campuriText.username] ,function (err, rezParola) {
        console.log(cale_imag)
           if (err) {
               res.redirect("/index");
           } else {
               serverpass = rezParola.rows[0].saltstring;
               var parolaCriptata = crypto.scryptSync(campuriText.parola, serverpass, 64).toString("hex");
               client.query("UPDATE UTILIZATORI SET nume=$1::text, prenume=$2::text, email=$3::text, culoare_chat=$4::text, ocupatie=$6::text, cale_poza=$7::text WHERE parola=$5::text",
                   [campuriText.nume, campuriText.prenume, campuriText.email, campuriText.culoare_chat, parolaCriptata, campuriText.ocupatie, cale_imag], function (err, rez) {
                       if (err) {
                           //  console.log(err);
                           //  console.log("ADDDDDDDDDDDDDDDDDDDDDD");
                           res.render("pagini/eroare", {text: "Eroare baza de date."});
                           return;
                       }
                       if (rez.rowCount == 0) {
                           res.render("pagini/profil", {text: "Updateul nu s a realizat. parolaaa", utilizator : req.session.utilizator});
                           return;
                       }
                       if (req.session.utilizator.nume.toString() != campuriText.nume.toString()) {
                           continut_email += ("Numele nou este: " + campuriText.nume.toString() + "\n");
                       }
                       if (req.session.utilizator.prenume.toString() != campuriText.prenume.toString()) {
                           continut_email += ("Prenumele nou este: " + campuriText.prenume.toString() + "\n");
                       }
                       if (req.session.utilizator.culoare_chat.toString() != campuriText.culoare_chat.toString()) {
                           continut_email += ("Culoara noua a chat-ului este: " + campuriText.culoare_chat.toString() + "\n");
                       }
                       if (req.session.utilizator.ocupatie.toString() != campuriText.ocupatie.toString()) {
                           continut_email += ("Ocupatia noua este: " + campuriText.ocupatie.toString() + "\n");
                       }
                       req.session.utilizator.nume = campuriText.nume;
                       req.session.utilizator.prenume = campuriText.prenume;
                       req.session.utilizator.email = campuriText.email;
                       req.session.utilizator.culoare_chat = campuriText.culoare_chat;
                       req.session.utilizator.ocupatie = campuriText.ocupatie;
                       req.session.utilizator.poza = cale_imag;

                       if (continut_email != "") {
                           trimiteMail(campuriText.email, "Datele contului schimbate", continut_email, "", []);
                       }
                       res.redirect("/profil");
                   });
           }
       });
     //  console.log("Gata parsare");
   });

    cale = "/poze_uploadate"
    formular.on("field", function (nume, val) {
        if (nume === "username") {
            username = val;
        }
    });
    formular.on("fileBegin", function (nume, fisier) {
        console.log(nume)
        caleUtil = path.join(__dirname, "poze_uploadate", username);
        cale = cale + "/" + username;
        console.log(fisier.size);
        console.log(fisier)
        fisier.filepath = path.join(caleUtil, "poza.png");
        cale = cale + "/poza.png";
        cale_imag = cale;
    });
    formular.on("file", function (nume, fisier) {
        if (fisier.size === 0) {
            console.log("nu e imagine");
            cale_imag = cale;
        } else {
            console.log("Am pus poza");
            cale_imag = cale;
        }
        //console.log(cale_imag)
    });
});

function stergeAccesari() {

    queryDelete = "delete from accesari where now() - data_accesare >= interval '10 minutes'";
    client.query(queryDelete, function (err, rezDelete) {

    });
}

function sterge_inactivi() {
    query_cine_sunt = "select * from utilizatori where now() - data_adaugare >= interval '20 seconds' and confirmat_mail = false and trimis_mail_validare = true"
    client.query(query_cine_sunt, function (err, rez) {
        for (let usr of rez.rows) {
            trimiteMail(usr.email, "Ati fost sters", "Ati fost sters pentru ca nu v-ati validat contul");
        }
    })
    queryDelete = "delete from utilizatori where now() - data_adaugare >= interval '20 seconds' and confirmat_mail = false and trimis_mail_validare = true";
    client.query(queryDelete, function (err, rezDelete) {
        console.log(rezDelete);
    });
}

function trimitenotificare() {
    query_cui = "select id, email from utilizatori where confirmat_mail = false and now() - data_adaugare >= interval '10 seconds' and trimis_mail_validare = false";
    client.query(query_cui, function (err, rez) {
        if (err) {
            console.log(err);

        } else {
            if (rez.rowCount > 0) {
                for (let mail of rez.rows) {
                    trimiteMail(mail.email, "Confirma mailul", "Daca nu confirmati mail-ul o sa vi-l stergem peste 10 secunde");
                    query_pune_notificat = `update utilizatori
                                       set trimis_mail_validare = true
                                       where id = ${mail.id}`;
                    client.query(query_pune_notificat, function (err, rez) {
                        console.log(err);
                    }) ;
                }
            }
        }
    });
}

setInterval(trimitenotificare, 10 * 1000);
setInterval(sterge_inactivi, 20 * 1000);

app.post("/tema", function(req, res) {
    pun_tema = req.body.value;
 //   console.log(pun_tema);
    if (req.session.utilizator) {
        var query = "update utilizatori set tema = $1::text where username = $2::text";
        // var queyUpdate = `update utilizatori set tema = '${tema}' where username = '${}'`
        client.query(query, [pun_tema, req.session.utilizator.username], function (err, rezQuery) {
           // console.log("sdsdsd");
        });
    }
});


setInterval(stergeAccesari, 60 * 60 * 1000);

function getIP(req) {
    var ip = req.headers["x-forwaded-for"];

    if (ip) {
        let vec = ip.split(",");
        return vec[vec.length - 1];
    } else if (req.ip) {
        return req.ip;
    } else {
        return req.connection.remoteAddress;
    }
}

app.get("/*", function (req, res, next) {

    let ipReq=getIP(req);
    let ip_gasit=ipuri_active[ipReq+"|"+req.url];
    timp_curent=new Date();
    if(ip_gasit){

        if( (timp_curent-ip_gasit.data)< 5*1000) {//diferenta e in milisecunde; verific daca ultima accesare a fost pana in 10 secunde
            if (ip_gasit.nr>10){//mai mult de 10 cereri
                res.send("<h1>Prea multe cereri intr-un interval scurt. Ia te rog sa fii cuminte, da?!</h1>");
                ip_gasit.data=timp_curent
                return;
            }
            else{

                ip_gasit.data=timp_curent;
                ip_gasit.nr++;
            }
        }
        else{
            //console.log("Resetez: ", req.ip+"|"+req.url, timp_curent-ip_gasit.data)
            ip_gasit.data=timp_curent;
            ip_gasit.nr=1;//a trecut suficient timp de la ultima cerere; resetez
        }
    }
    else{
        ipuri_active[ipReq+"|"+req.url]={nr:1, data:timp_curent};
        //console.log("am adaugat ", req.ip+"|"+req.url);
        //console.log(ipuri_active);

    }

    var queryInsert = "insert into accesari(ip, user_id, pagina) values($1::text, $2 , $3::text)";
    if (req.session.utilizator) {
        client.query(queryInsert, [getIP(req), req.session.utilizator.id, req.url], function (err, rezQuery) {
            console.log(err);
        });
    }

    next();
});

app.get("/despre", function(req, res) {
    res.render("pagini/despre");
});

app.get("/profil", function(req, res) {
   // console.log(res.locals.utilizator)
    res.render("pagini/profil", {utilizator:res.locals.utilizator});
});

app.get("/useri", function(req, res) {
    if (req.session.utilizator.rol === "admin") {
        client.query("select * from utilizatori", function (err, rezUtil) {
            res.render("pagini/useri", {useri: rezUtil.rows});
        });
    } else {
        randeazaEroare(res, 403);
    }
});

app.get("/facturi", function(req, res) {
    if (req.session.utilizator.rol === "admin") {
        console.log("BUN")
        bdMongo.collection("facturi").find({}).toArray(function(err, result) {
            if (err) console.log(err);
            console.log(result)
            res.render("pagini/facturi", {facturi: result, protocol:protocol, domeniu:nume_domeniue});
        });
    } else {
        randeazaEroare(res, 403);
    }
});

app.get("/admin_prod", function(req, res) {
    if (req.session.utilizator.rol === "admin") {
        client.query("select * from barci", function (err, rezUtil) {
            res.render("pagini/admin_prod", {produse: rezUtil.rows});
        });
    } else {
        randeazaEroare(res, 403);
    }
});

app.post("/sterge_utiliz", function(req, res) {
    console.log("am intrat in matrice")
    var formular = new formidable.IncomingForm()
    formular.parse(req, function (err, campuriText, campuriFisier) {
        console.log(campuriText.email, campuriText.id_utiliz)
        var first_delete = `delete from accesari where user_id = '${campuriText.id_utiliz}'`;
        client.query(first_delete, function (err, rezQuery) {
            console.log(err);
        });
       var queryDelete = `delete from utilizatori where id = '${campuriText.id_utiliz}'`;
        client.query(queryDelete, function (err, rezQuery) {
            console.log(err);
          trimiteMail(campuriText.email, "Ai fost sters", "Cu sinceră părere de rău, vă anunțăm că ați fost șters! Adio", "", []);
          res.redirect("/useri");
       });
    });
});

app.post("/resetare_parola", function(req, res) {
    console.log("am intrat in matrice")
    var formular = new formidable.IncomingForm()
    formular.parse(req, function (err, campuriText, campuriFisier) {
        client.query("select parola, saltstring from utilizatori where id = $1", [campuriText.id], function (err, rez) {
            if (err) console.log(err);
            var newpass = campuriText.noua_parola;
            newpass = crypto.scryptSync(newpass, rez.rows[0].saltstring, 64).toString("hex");
            var link= protocol + nume_domeniue + "/resetare_pass/" + campuriText.id.toString() + "/" + rez.rows[0].parola + "/" + newpass;
            trimiteMail(campuriText.email, "Resetare parola", `Ti-ai resetat parola cu succes`,
                `<h1>Parola!</h1><p>Noua parola este:  </p><p style='color:green;font-weight: bold;'>${campuriText.noua_parola}</p>
                                                                                                                <a href='${link}'>Reseteaza parola</a>`, []);
            res.redirect("/profil")
        })
    });
});

app.post("/sterge_cont", function(req, res) {
    console.log("am intrat in matrice")
    var formular = new formidable.IncomingForm()
    formular.parse(req, function (err, campuriText, campuriFisier) {
        client.query("select token_sterge_cont, parola, saltstring from utilizatori where id = $1", [campuriText.id], function (err, rez) {
            if (rez.rows[0].parola === crypto.scryptSync(campuriText.parola, rez.rows[0].saltstring, 64).toString("hex")) {
                var link = protocol + nume_domeniue + "/sterge_cnt/" + rez.rows[0].token_sterge_cont + "/" + campuriText.id.toString() + "/" + campuriText.email;
                trimiteMail(campuriText.email, "Stergere cont", "Apasa pe linkul de mai jos pentru a-ti sterge contul", `<p style='color:green;font-weight: bold;'>${campuriText.noua_parola}</p>
                                                                                                                <a href='${link}'>Sterge Contul</a>`)
                res.redirect("/logout");
            } else {
                randeazaEroare(res, -1, "Ai introdus parola gresita" , "", []);
            }
        });
    });
});

app.post("/update_prod", function(req, res) {
    var formular = new formidable.IncomingForm()
    var cale_imag = "";
    formular.parse(req, function (err, campuriText, campuriFisier) {
      //  console.log(cale_imag)
        if (campuriText.prod_id === "") {
            var culorile = "";
            var cul = campuriText.culori.split(",");
            for (let c of cul) {
                culorile += `\"${c}\",`;
            }
            culorile = culorile.slice(0, -1);
            culorile = `{${culorile}}`;
           // console.log(culorile)
            client.query("INSERT INTO barci(nume, descriere, pret, viteza_maxima, tip_produs, categorie, producator, culori, suport_vasle, imagine) VALUES( $1::text, $2::text, $3, $4, $5, $6, $7::text, $8, $9, $10::text)"
                , [campuriText.prod_name, campuriText.descriere, campuriText.pret, campuriText.viteza, campuriText.marime, campuriText.categorie, campuriText.producator, culorile, campuriText.vasle, cale_imag], function (err, rezQ) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect("/admin_prod");
                    }
                });
        } else {
            var culorile = "";
            var cul = campuriText.culori.split(",");
            for (let c of cul) {
                culorile += `\"${c}\",`;
            }
            culorile = culorile.slice(0, -1);
            culorile = `{${culorile}}`;
            //console.log(culorile)
            if (cale_imag === "") {
                client.query("UPDATE barci SET nume=$1::text, descriere=$2::text, pret=$3, viteza_maxima=$4, tip_produs=$5, categorie=$6, producator=$7::text, culori=$8, suport_vasle=$9 where id=$10"
                    , [campuriText.prod_name, campuriText.descriere, campuriText.pret, campuriText.viteza, campuriText.marime, campuriText.categorie, campuriText.producator, culorile, campuriText.vasle, campuriText.prod_id], function (err, rezQ) {
                        if (err) {
                          // console.log(err);
                        } else {
                            res.redirect("/admin_prod");
                        }
                    });
            } else {
                client.query("UPDATE barci SET nume=$1::text, descriere=$2::text, pret=$3, viteza_maxima=$4, tip_produs=$5, categorie=$6, producator=$7::text, culori=$8, suport_vasle=$9, imagine=$11 where id=$10"
                    , [campuriText.prod_name, campuriText.descriere, campuriText.pret, campuriText.viteza, campuriText.marime, campuriText.categorie, campuriText.producator, culorile, campuriText.vasle, campuriText.prod_id, cale_imag], function (err, rezQ) {
                        if (err) {
                           // console.log(err);
                        } else {
                            res.redirect("/admin_prod");
                        }
                    });
            }
        }
    });

    formular.on("field", function (nume, val) {
    });
     var cale = "/produse"
    var nr = getRandomInt(2000000);
    formular.on("fileBegin", function (nume, fisier) {
        //console.log("Intrat")
         caleUtil = path.join(__dirname, "produse", nr.toString());
         cale = cale + "/" + nr.toString();
        // console.log(caleUtil);
         if (!fs.existsSync(caleUtil)) {
             try {
                 fs.mkdirSync(caleUtil, {recursive:true});

             }
             catch (e) {
                // console.log(e);
             }
         }
         cale = cale + "/poza.png";
        // console.log("Cale")
         fisier.filepath = path.join(caleUtil, "poza.png");
    });
    formular.on("file", function (nume, fisier) {
       // console.log("Am pus poza");
        cale_imag = cale;
        //console.log(cale_imag)
    });
});

app.get("/produse", function(req, res) {
    // console.log(res.locals.tipuri);
    luni = ["Ianuarie", "Februiarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie"];
    zi_saptamana = ["(Luni)", "(Marti)", "(Miercuri)", "(Joi)", "(Vineri)", "(Sambata)", "(Duminica)"];
    client.query("select * from unnest(enum_range(null::categ_barca))", function(err, rezCateg) {
        var str = req.query.tip;
        var resstr;
        if (str) {
            resstr = str.replace("_", " ");
        }
        var cond_where = (req.query.tip ? `categorie='${resstr}'` : "1=1");
        // console.log("select * from barci where " + cond_where);
        client.query("select * from barci where " + cond_where, function (err, rezQuery) {
          ///  console.log(rezQuery);
            for (let i = 0; i<rezQuery.rows.length; i++) {
                var m = new Date(rezQuery.rows[i].data_adaugare);
                rezQuery.rows[i].data_adaugare = m.getUTCDate() + "-" + luni[m.getUTCMonth()] + "-" + m.getUTCFullYear() + zi_saptamana[m.getDay()];
            }
            res.render("pagini/produse", {produse: rezQuery.rows, optiuni: rezCateg.rows});
        });
    });
});

app.get("/produs/:id", function(req, res) {
    client.query(`select * from barci where id = ${req.params.id}`, function(err, rezQuery) {
        // console.log(rezQuery);
        res.render("pagini/produs", {prod:rezQuery.rows[0]});
    });
});

app.get(["/", "/home", "/index"], function(req, res) {
    creeazaImagini();
      // console.log(rezQuery);
      ok = getRandomInt(2);
      nrimagini = 4;
      timp = 10;
      radical = 2;
      if (ok === 0) nrimagini = 4;
      else if (ok === 1) {
          nrimagini = 9;
          radical = 3;
          timp = 31;
      }
      else if (ok === 2) {
          nrimagini = 16;
          radical = 4;
          timp = 80;
      }
      let n = obImagini_2.imagini.length;
      for (let i = n-1; i>=nrimagini; i--) {

         obImagini_2.imagini.splice(i, 1);
      }

       genereaza_imagini_galerie_animata();


      queryAccesari = "select username, nume, prenume from utilizatori where id in (select distinct user_id from accesari where now() - data_accesare <= interval '5 minutes')";
      queryAccesari_inact = "select username, nume, prenume from utilizatori where id in (select distinct user_id from accesari where now() - data_accesare >= interval '5 minutes' and now() - data_accesare <= interval '10 minutes') and id not in (select id from utilizatori where id in (select distinct user_id from accesari where now() - data_accesare <= interval '5 minutes'))";
      useri_online_activ = [];
      useri_online_inactiv = [];
      client.query(queryAccesari, function (err, rezQuery) {
         useri = []
          if (err) {
             console.log(err);
         } else {
              useri_online_activ = rezQuery.rows;
              client.query(queryAccesari_inact, function (err, rezQuery) {
                  useri = []
                  if (err) {
                      console.log(err);
                  } else {
                      useri_online_inactiv = rezQuery.rows;
                      console.log(useri);

                      var evenimente=[]
                      var locatie="";

                      var ip = getIP(req)
                      console.log(ip.replace("::", ""))
                      console.log(ip)
                      var da = 'https://secure.geobytes.com/GetCityDetails?key=7c756203dbb38590a66e01a5a3e1ad96&fqcn=';
                      var query = 'https://secure.geobytes.com/GetCityDetails?key=7c756203dbb38590a66e01a5a3e1ad96&fqcn=' + getIP(req);
                      query = query.replace("::ffff:", "")
                      console.log(query.replace("::", ""));
                      console.log(query)
                      request(query,
                          function (error, response, body) {
                              if (error) {
                                  console.error('error:', error)
                              } else {
                                  var obiectLocatie = JSON.parse(body);
                                  console.log(obiectLocatie);
                                  locatie = obiectLocatie.geobytescountry + " " + obiectLocatie.geobytesregion
                                  var texteEvenimente=["Primul produs gratis", "Reduceri finale", "Barca la jumate de pret", "Barca mare", "Barca mica", "Barca colorata", "Barca necolorata"];
                                  dataCurenta=new Date();
                                  nrZile=[31,28,31,30,31,30,31,31,30,31,30,31];

                                  dataCurenta=new Date();
                                  anCurent=dataCurenta.getFullYear();
                                  lunaCurenta=dataCurenta.getMonth();
                                  if(anCurent%400==0 || (anCurent%4==0 && anCurent%100!=0)) nrZile=29;
                                  let nrZileCalendar=nrZile[lunaCurenta]
                                  anCurent=dataCurenta.getFullYear();
                                  lunaCurenta=dataCurenta.getMonth();
                                  primaZiLuna=new Date(anCurent, lunaCurenta, 1);
                                  ziSaptPrimaZiLuna=(primaZiLuna.getDay()-1+7)%7;

                                  ultimaZiLuna=new Date(anCurent, lunaCurenta, nrZileCalendar);
                                  penultimaZiLuna=new Date(anCurent, lunaCurenta, nrZileCalendar - 1);
                                  ziSaptUltimaZiLuna=(ultimaZiLuna.getDay()-1+7)%7;
                                  ziSaptPenUltimaZiLuna=(penultimaZiLuna.getDay()-1+7)%7;
                                  var puse = 0;
                                  if (ziSaptPrimaZiLuna === 1) {
                                      puse ++;
                                      evenimente.push({data: primaZiLuna, text: texteEvenimente[0]})
                                  }
                                  if (ziSaptPenUltimaZiLuna === 5 && ziSaptUltimaZiLuna === 6) {
                                      puse++;
                                      evenimente.push({data: ultimaZiLuna, text: texteEvenimente[1]})
                                      evenimente.push({data: penultimaZiLuna, text: texteEvenimente[1]})
                                  }
                                  for(i=2;i<7;i++){
                                      evenimente.push({data: new Date(dataCurenta.getFullYear(), dataCurenta.getMonth(), Math.ceil(Math.random()*27) ), text:texteEvenimente[i]});
                                  }
                                  console.log(evenimente)
                                  console.log("inainte",req.session.mesajLogin);

                                  res.render("pagini/index", {ip:getIP(req), imagini:obImagini.imagini, imganimata:obImagini_2.imagini, useri_activi:useri_online_activ, useri_incat:useri_online_inactiv, tema:pun_tema, evenimente: evenimente, locatie:locatie});
                              }
                          });
                  }
              });
          }
      });
});

app.get("/eroare", function (req, res) {
   randeazaEroare(res, 1, "Titlu schimbat");
});


app.get("/*.ejs", function (req, res) {
    randeazaEroare(res, 403);
});

app.get("/cos-virtual", function (req, res) {
    res.render("pagini/cos-virtual")
});

function genereaza_imagini_galerie_animata() {
    var buf = fs.readFileSync(__dirname + "/resurse/scss/galerie_animata.scss").toString("utf8");
    var culori = ["navy", "black", "purple", "grey"];
    var culoareAleatoare = culori[Math.floor(Math.random() * culori.length)];
    rezScss = ejs.render(buf, {culoare:culoareAleatoare, nrimag:nrimagini, radical:radical, timp:timp});
    fs.writeFileSync(__dirname + "/temp/galerie_animata.scss", rezScss);
    var caleScss = __dirname + "/temp/galerie_animata.scss";
    try {

        var rezCompilare = sass.compile(caleScss, {sourceMap: true});
        fs.writeFileSync(__dirname + "/temp/galerie_animata.css", rezCompilare.css);
        var caleCss = __dirname + "/temp/galerie_animata.css";
        // res.setHeader("Content-Type", "text/css");
        // res.sendFile(caleCss);
    }
    catch (err) {
        // console.log(err);
        // res.send("EROARE");
    }
}

var obImagini, obImagini_2;

function creeazaImagini() {
   var buf = fs.readFileSync(__dirname + "/resurse/json/galerie.json").toString("utf8");

   obImagini = JSON.parse(buf);
   obImagini_2 = JSON.parse(buf);


   // console.log(obImagini.imagini);
   let n = obImagini.imagini.length;
   let cnt = 0;
   for (let i = n-1; i>=0; i--) {
      var timp_img = obImagini.imagini[i].timp;
      [start, final] = timp_img.split('-');
      [start_a, start_b] = start.split(':');
      [final_a, final_b] = final.split(':');

      var now = new Date();
      var ora_curenta = parseInt(now.getHours(), 10);
      start_a = parseInt(start_a, 10);
      final_a = parseInt(final_a, 10);

      if (((start_a <= final_a && ora_curenta >= start_a && ora_curenta <= final_a) || (start_a > final_a && (ora_curenta >= start_a || ora_curenta <= final_a))) && cnt < 10) {
         cnt++;

         let nume_img, extensie;
         [nume_img, extensie] = obImagini.imagini[i].fisier.split(".");
         let dim_mic = 150;

         obImagini.imagini[i].mic = `${obImagini.cale_galerie}/mic/${nume_img}-${dim_mic}.webp`;

         let dim_mediu = 300;
         obImagini.imagini[i].mediu = `${obImagini.cale_galerie}/mediu/${nume_img}-${dim_mediu}.png`;

         obImagini.imagini[i].mare = `${obImagini.cale_galerie}/${obImagini.imagini[i].fisier}`;

         if (!fs.existsSync(obImagini.imagini[i].mic)) {
            sharp(__dirname + "/" + obImagini.imagini[i].mare).resize(dim_mic).toFile(__dirname + "/" + obImagini.imagini[i].mic);
         }

         if (!fs.existsSync(obImagini.imagini[i].mediu)) {
            sharp(__dirname + "/" + obImagini.imagini[i].mare).resize(dim_mediu).toFile(__dirname + "/" + obImagini.imagini[i].mediu);
         }
      } else {
         obImagini.imagini.splice(i, 1);
      }
   }

    for (let i = n-1; i>=0; i--) {
        let nume_img, extensie;
        [nume_img, extensie] = obImagini_2.imagini[i].fisier.split(".");
        let dim_mic = 150;

        obImagini_2.imagini[i].mic = `${obImagini_2.cale_galerie}/mic/${nume_img}-${dim_mic}.webp`;

        let dim_mediu = 300;
        obImagini_2.imagini[i].mediu = `${obImagini_2.cale_galerie}/mediu/${nume_img}-${dim_mediu}.png`;

        obImagini_2.imagini[i].mare = `${obImagini_2.cale_galerie}/${obImagini_2.imagini[i].fisier}`;

        if (!fs.existsSync(obImagini_2.imagini[i].mic)) {
            sharp(__dirname + "/" + obImagini_2.imagini[i].mare).resize(dim_mic).toFile(__dirname + "/" + obImagini_2.imagini[i].mic);
        }

        if (!fs.existsSync(obImagini_2.imagini[i].mediu)) {
            sharp(__dirname + "/" + obImagini_2.imagini[i].mare).resize(dim_mediu).toFile(__dirname + "/" + obImagini_2.imagini[i].mediu);
        }
    }
}

function incarcaEroareJSON() {
   var buf = fs.readFileSync(__dirname + "/resurse/json/erori.json").toString("utf8")

   obErori = JSON.parse(buf);
}

function randeazaEroare(res, identificator, titlu, text, imagine) {
   let eroare = obErori.erori.find(function (elem){
      return (identificator === elem.identificator);
   });
   titlu = titlu || (eroare && eroare.titlu) || "EROARE";
   text = text || (eroare && eroare.text) || "EROARE";
   imagine = imagine || (eroare && obErori.cale_baza + "/" + eroare.imagine) || "/resurse/imagini/imagini_erori/lucru.jpg";
   if (eroare) {
      if (eroare.status) {
         res.status(eroare.identificator).render("pagini/eroare_generala.ejs", {titlu:eroare.titlu, text:eroare.text, imagine:obErori.cale_baza + "/" + eroare.imagine});
      } else {
         res.render("pagini/eroare_generala.ejs", {titlu:titlu, text:text, imagine:imagine});
      }
   }else {
      // console.log(titlu, text);
       res.render("pagini/eroare_generala.ejs", {titlu:titlu, text:text, imagine:imagine});
   }
}

caleXMLMesaje="resurse/xml/contact.xml";
headerXML=`<?xml version="1.0" encoding="utf-8"?>`;
function creeazaXMlContactDacaNuExista(){
    if (!fs.existsSync(caleXMLMesaje)){
        let initXML={
            "declaration":{
                "attributes":{
                    "version": "1.0",
                    "encoding": "utf-8"
                }
            },
            "elements": [
                {
                    "type": "element",
                    "name":"contact",
                    "elements": [
                        {
                            "type": "element",
                            "name":"mesaje",
                            "elements":[]
                        }
                    ]
                }
            ]
        }
        let sirXml=xmljs.js2xml(initXML,{compact:false, spaces:4});//obtin sirul xml (cu taguri)
        console.log(sirXml);
        fs.writeFileSync(caleXMLMesaje,sirXml);
        return false; //l-a creat
    }
    return true; //nu l-a creat acum
}


function parseazaMesaje(){
    let existaInainte=creeazaXMlContactDacaNuExista();
    let mesajeXml=[];
    let obJson;
    if (existaInainte){
        let sirXML=fs.readFileSync(caleXMLMesaje, 'utf8');
        obJson=xmljs.xml2js(sirXML,{compact:false, spaces:4});


        let elementMesaje=obJson.elements[0].elements.find(function(el){
            return el.name=="mesaje"
        });
        let vectElementeMesaj=elementMesaje.elements?elementMesaje.elements:[];// conditie ? val_true: val_false
        console.log("Mesaje: ",obJson.elements[0].elements.find(function(el){
            return el.name=="mesaje"
        }))
        let mesajeXml=vectElementeMesaj.filter(function(el){return el.name=="mesaj"});
        return [obJson, elementMesaje,mesajeXml];
    }
    return [obJson,[],[]];
}


app.get("/contact", function(req, res){
    let obJson, elementMesaje, mesajeXml;
    [obJson, elementMesaje, mesajeXml] =parseazaMesaje();

    res.render("pagini/contact",{ utilizator:req.session.utilizator, mesaje:mesajeXml})
});

app.post("/contact", function(req, res){
    let obJson, elementMesaje, mesajeXml;
    [obJson, elementMesaje, mesajeXml] =parseazaMesaje();

    let u= req.session.utilizator?req.session.utilizator.username:"anonim";
    let mesajNou={
        type:"element",
        name:"mesaj",
        attributes:{
            username:u,
            data:new Date()
        },
        elements:[{type:"text", "text":req.body.mesaj}]
    };
    if(elementMesaje.elements)
        elementMesaje.elements.push(mesajNou);
    else
        elementMesaje.elements=[mesajNou];
    console.log(elementMesaje.elements);
    let sirXml=xmljs.js2xml(obJson,{compact:false, spaces:4});
    console.log("XML: ",sirXml);
    fs.writeFileSync("resurse/xml/contact.xml",sirXml);

    res.render("pagini/contact",{ utilizator:req.session.utilizator, mesaje:elementMesaje.elements})
});

var s_port = process.env.PORT || 8080;
app.listen(s_port);
