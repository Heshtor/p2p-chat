const chatInputLobby = document.querySelector(".server .panely-kontejner .lobby.chat.panel .inputButton input");
const btnOdeslatZpravuLobby = document.querySelector(".server .panely-kontejner .lobby.chat.panel .inputButton .btnOdeslatZpravu");

btnOdeslatZpravuLobby.addEventListener("click", function () {
    const zprava = chatInputLobby.value.trim(); // uloží zprávu bez zbytečných mezer z inputu
    chatInputLobby.value = ""; // vymaže input zprávy

    if (zprava !== "") // pokud je ve zprávě nějaký znak
    {
        if (zprava.startsWith("/kick "))
        {
            if (jsemAdmin()) // pokud jsi adminem
            {
                const jmeno = zprava.substring(6).trim();
                var id = najitKlientaPodleJmena(jmeno);

                if (id !== null)
                {
                    vyhoditKlienta(id);
                }
                else
                {
                    alert("Uživatel se jménem " + jmeno + " neexistuje!");
                }
            }
            else
            {
                alert("Na tuto akci nemáš práva!");
            }
        }
        else if (zprava.startsWith("/admin "))
        {
            if (jsemAdmin()) // pokud jsi adminem
            {
                const jmeno = zprava.substring(7).trim();
                var id = najitKlientaPodleJmena(jmeno);

                if (id !== null)
                {
                    predatAdmina(id);
                }
                else
                {
                    alert("Uživatel se jménem " + jmeno + " neexistuje!");
                }
            }
            else
            {
                alert("Na tuto akci nemáš práva!");
            }
        }
        else
        {
            const cas = ziskatAktualniCas();
            zobrazZpravu("<strong>Ty</strong>: " + zprava, cas, "own-message"); // zobrazí zprávu jako vlastní poslanou
        
            // DATA, KTERÁ SE ODEŠLOU VŠEM KLIENTŮM NA SERVERU
            const dataToSend = {
                type: "zprava",
                zprava: zprava,
                cas: cas
            };
        
            // POŠLE DATA VŠEM PŘIPOJENÝM KLIENTŮM
            //poslatVsemKlientum(dataToSend);
        }
    }
});


// BYL ZMÁČKNUT ENTER NA KLÁVESNICI
chatInputLobby.addEventListener("keypress", function (event) {
    if (event.key === "Enter")
    {
        btnOdeslatZpravuLobby.click(); // aktivuje kliknutí na tlačítko poslat zprávu
    }
});


// ZÍSKÁ AKTUÁLNÍ ČAS
function ziskatAktualniCas()
{
    // aktuální čas
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds}`;

    return currentTime;
}


const chatBox = document.querySelector(".server .panely-kontejner .lobby.chat.panel > .zpravy");

// VYTVOŘÍ A ZOBRAZÍ ZPRÁVU V CHATBOXU
function zobrazZpravu(zprava, cas, typZpravy)
{
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container", typZpravy);

    const messageElement = document.createElement("div");
    messageElement.innerHTML = zprava;
    messageElement.title = cas;
    messageElement.classList.add("message");

    messageContainer.appendChild(messageElement);
    chatBox.appendChild(messageContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}






/* **************************************************************************************************************************************************************** */
// PO NAČTENÍ STRÁNKY
document.addEventListener("DOMContentLoaded", (event) => {
    //vytvoritDatabazi();
    kontrolaPerformance();
});




const pametHTML = document.querySelector(".server .panely-kontejner .menu .vertikalni > .pamet");
function vypisInfoOPameti()
{
    setInterval(() => {
        pametHTML.querySelector(".celkova").textContent = (performance.memory.totalJSHeapSize / (1024 * 1024)).toFixed(2) + " MB";
        pametHTML.querySelector(".pouzita").textContent = (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2) + " MB";
        pametHTML.querySelector(".limit").textContent = (performance.memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(2) + " MB";
    }, 1000);
}


function kontrolaPerformance()
{
    if (performance && performance.memory)
    {
        vypisInfoOPameti();
    }
    else
    {
        pametHTML.style.display = "none";
    }
}





// VYTVOŘÍ NĚKOLIKA MÍSTNÝ KÓD SKLÁDAJÍCÍ SE Z PÍSMEN A ČÍSEL
function vygenerovatKod(delka)
{
    const pismena = "abcdefghijklmnopqrstuvwxyz";
    const cisla = "0123456789";
    const vsechnyZnaky = pismena + cisla;

    let kod = "";

    // začátek kódu s písmenem
    const randomPismeno = pismena.charAt(Math.floor(Math.random() * pismena.length));
    kod += randomPismeno;

    // zbytek kódu (čísla a další písmena)
    for (let i = 1; i < delka; i++) {
        const randomIndex = Math.floor(Math.random() * vsechnyZnaky.length);
        kod += vsechnyZnaky.charAt(randomIndex);
    }

    return kod;
}











/* **************************************************************************************************************************************************************** */
const jmenoInput = document.querySelector(".server .panely-kontejner .vrchniPanel .inputButton input");
const btnPrihlasitSe = document.querySelector(".server .panely-kontejner .vrchniPanel .inputButton .btnPrihlasitSe");


// KLIKNUTÍ NA TLAČÍTKO PŘIHLÁSIT SE
btnPrihlasitSe.addEventListener("click", async function () {
    const jmeno = jmenoInput.value.trim(); // uloží jméno bez zbytečných mezer z inputu

    if (kontrolaJmena(jmeno)) // pokud je jméno v pořádku
    {
        const result = await vytvoritPeer();
        console.log(result);
        await pripojitSe(mujPeer, "admin12345");
    }
});


// ZKONTROLUJE JMÉNO
var userName = "";
function kontrolaJmena(jmeno)
{
    if (jmeno === "") // pokud nebyl zadán žádný znak
    {
        alert("Jméno nebylo vyplněno.");
        return false;
    }
    const regex = /^[A-Za-z0-9_ \-ÁáČčĎďÉéĚěÍíŇňÓóŘřŠšŤťÚúŮůÝýŽž]+$/;
    if (!regex.test(jmeno)) // pokud jméno obsahuje nepovolené znaky
    {
        alert("Jméno obsahuje nepovolené znaky!");
        return false;
    }
    if (jmeno.length > 20) // pokud jméno obsahuje hodně znaků
    {
        alert("Jméno obsahuje více než 20 znaků!");
        return false;
    }

    userName = jmeno;
    return true;
}
/* **************************************************************************************************************************************************************** */


// VYTVOŘÍ SE MŮJ PEER
var mujPeer;
function vytvoritPeer()
{
    return new Promise((resolve, reject) => {
        // VYGENERUJE ID KLIENTA
        let kod = vygenerovatKod(6); // vygeneruje ID klienta
        mujPeer = new Peer(kod); // vytvoří peer klienta

        // PO ÚSPĚŠNÉM VYTVOŘENÍ PEERU
        mujPeer.on('open', (id) => {
            // ZPRÁVA - PEER BYL ÚSPĚŠNĚ VYTVOŘEN
            //const zprava = "Peer byl úspěšně vytvořen!"; // vytvoří zprávu
            //zobrazZpravu(zprava, ziskatAktualniCas(), "server-message"); // zobrazí zprávu

            console.log("TVŮJ PEER BYL ÚSPĚŠNĚ VYTVOŘEN! - " + id);

            resolve(true);
        });

        // POKUD NASTANE NĚJAKÁ CHYBA
        mujPeer.on('error', (error) => {
            console.log("CHYBA V PEERU: " + error);

            reject(error);
        });
    });
}


// VYTVOŘÍ SE ADMIN PEER
var adminPeer;
function vytvoritAdmina()
{
    adminPeer = new Peer("admin12345"); // vytvoří peer admina

    // PO ÚSPĚŠNÉM VYTVOŘENÍ PEERU
    adminPeer.on('open', () => {
        console.log("ADMIN PEER BYL ÚSPĚŠNĚ VYTVOŘEN!");
    });
}


var pripojeniKlienti = [];
var mojePripojeni = [];

// PŘIPOJENÍ NA ADMINA CELÉHO SERVERU
function pripojitSe(peer, id)
{
    return new Promise((resolve, reject) => {
        const customMetadata = {userName: userName, hesloServeru: "12345CosToJankuCosToSned"}; // metadata o klientovi pro připojení k serveru
        var connection = peer.connect(id, {metadata: customMetadata});

        var uspesnePripojen = false;
        // POKUD SE PODAŘÍ PŘIPOJIT
        connection.on('open', () => {
            mojePripojeni.push(connection); // uloží připojení do mých připojení
    
            console.log("ÚSPĚŠNĚ JSEM SE PŘIPOJIL NA: " + id);
            uspesnePripojen = true;

            resolve();
        });
    
        // POKUD NASTANE NĚJAKÁ CHYBA
        connection.on('error', (error) => {
            // ZPRÁVA - NASTALA CHYBA
            //const zprava = "CHYBA: " + error; // vytvoří zprávu
            //zobrazZpravu(zprava, ziskatAktualniCas(), "server-message"); // zobrazí zprávu
    
            console.log("CHYBA V PŘIPOJENÍ: " + error);

            reject();
        });
    
        // POKUD JSEM SE ODPOJIL NEBO SE NĚKDO ODE MĚ ODPOJIL
        connection.on('close', () => {
            console.log("ODPOJIL JSEM SE NEBO SE ODE MĚ ODPOJIL: " + id);
        });
    });
}




function poslouchatServer(peer)
{
    pripojeniKlienti = [];
    mojePripojeni = [];

    
    // POSLOUCHÁ NOVÁ PŘIPOJENÍ
    peer.on('connection', function(newConn) {
        var jmenoKlienta = "";
        var idKlienta = newConn.peer;
        if (newConn.metadata && newConn.metadata.userName)
        {
            jmenoKlienta = newConn.metadata.userName; // uloží jméno nově připojeného klienta
        }


        // KONTROLA PŘIPOJENÍ


        // PO ÚSPĚŠNÉM PŘIPOJENÍ NOVÉHO KLIENTA K SERVERU
        newConn.on('open', () => {
            pripojeniKlienti.push(newConn); // uloží připojeného klienta do připojených klientů na můj peer

            console.log("PŘIPOJIL SE NA MĚ: " + jmenoKlienta);
            pripojitSe(adminPeer, idKlienta);
        });


        // PO PŘIJETÍ DAT OD NĚKTERÉHO PŘIPOJENÉHO KLIENTA
        newConn.on('data', (data) => {

        });


        // PO ODPOJENÍ NĚKTERÉHO KLIENTA ZE SERVERU
        newConn.on('close', () => {
            console.log("ODPOJIL SE ODE MĚ: " + jmenoKlienta);
        });
    });


    // PO USLYŠENÍ PŘÍCHOZÍHO HOVORU
    peer.on("call", (call) => {
        //zvednoutHovor(call);
        console.log("VOLÁ MI: " + jmenoKlienta);
    });
}



