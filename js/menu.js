const btnMenu = document.querySelector(".server .panely-kontejner .menu > .btnMenu");
const horizontalniMenu = document.querySelector(".server .panely-kontejner .menu > .horizontalni");
const vsechnaVertikalniMenu = document.querySelectorAll(".server .panely-kontejner .menu > .vertikalni");

btnMenu.addEventListener("click", () => {
    if (horizontalniMenu.classList.contains("open"))
    {
        btnMenu.innerHTML = "<i class='bx bx-plus'></i>";

        // skryje horizontální menu
        horizontalniMenu.classList.remove("open");
        
        // odebere všem horizontálním tlačítkám selected
        horizontalniTlacitka.forEach(button => button.classList.remove("selected"));

        // skryje všechna vertikální menu
        vsechnaVertikalniMenu.forEach(menu => menu.classList.remove("open"));
    }
    else
    {
        btnMenu.innerHTML = "<i class='bx bx-minus'></i>";

        // zobrazí horizontální menu
        horizontalniMenu.classList.add("open");
    }
});



const horizontalniTlacitka = horizontalniMenu.querySelectorAll(":scope > .tlacitko");

horizontalniTlacitka.forEach((tlacitko, index) => {
    tlacitko.addEventListener("click", () => {
        // odebere všem ostatním tlačítkám selected
        horizontalniTlacitka.forEach(button => {
            if (button !== tlacitko)
            {
                button.classList.remove("selected");
            }
        });

        // zvolenému tlačítku udělá toggle selected
        tlacitko.classList.toggle("selected");

        // skryje všechna vertikální menu
        vsechnaVertikalniMenu.forEach(menu => menu.classList.remove("open"));

        // pokud bylo tlačítko právě zvoleno
        if (tlacitko.classList.contains("selected"))
        {
            // zobrazí vertikální menu na základě zvoleného horizontálního tlačítka
            const nazevVertikalnihoMenu = tlacitko.className.split(" ")[0];
            const vertikalniMenu = document.querySelector(`.server .panely-kontejner .menu .${nazevVertikalnihoMenu}.vertikalni`);
            vertikalniMenu.classList.toggle("open");
        }
    });
});



const panely = document.querySelectorAll(".server .panely-kontejner > .panel");
const vertikalniTlacitka = document.querySelectorAll(".server .panely-kontejner .menu .vertikalni > .tlacitko");

vertikalniTlacitka.forEach((tlacitko, index) => {
    tlacitko.addEventListener("click", () => {
        const nazevVertikalnihoMenu = tlacitko.closest(".vertikalni").className.split(" ")[0];

        if (nazevVertikalnihoMenu !== "nastaveni")
        {
            // odebere všem tlačítkám selected a zvolenému tlačítka dá selected
            vertikalniTlacitka.forEach(button => button.classList.remove("selected"));
            tlacitko.classList.add("selected");

            //skryje všechny panely
            panely.forEach(panel => panel.style.display = "none");

            // zobrazí panel na základě zvoleného vertikálního tlačítka
            const nazevVertikalnihoTlacitka = tlacitko.className.split(" ")[0];
            const panel = document.querySelector(`.server .panely-kontejner > .${nazevVertikalnihoMenu}.${nazevVertikalnihoTlacitka}.panel`);
            panel.style.display = "flex";
        }
        else // pokud bylo zvoleno tlačítko ve vertikálním menu nastavení
        {
            tlacitko.classList.toggle("zapnuto");
        }
    });
});
