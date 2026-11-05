
// =====================================
// 1. CHRONOMETRE
// =====================================

let secondes = 0;
let interval = null;

const affichage = document.getElementById("temps");

function afficherTemps() {

    const minutes = Math.floor(secondes / 60);
    const resteSecondes = secondes % 60;

    affichage.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(resteSecondes).padStart(2, "0");

}

document.getElementById("demarrer").addEventListener("click", function() {

    if (interval !== null) return;

    interval = setInterval(function() {
        secondes++;
        afficherTemps();
    }, 1000);

});

document.getElementById("pause").addEventListener("click", function() {

    clearInterval(interval);
    interval = null;

});

function reinitialiserChrono() {

    clearInterval(interval);
    interval = null;
    secondes = 0;

    afficherTemps();

}


// =====================================
// 2. SCORES ET HISTORIQUES
// =====================================

let score1 = 0;
let score2 = 0;

let historique1 = [];
let historique2 = [];

const affichageScore1 = document.getElementById("score1");
const affichageScore2 = document.getElementById("score2");

function actualiserScores() {

    affichageScore1.textContent = score1;
    affichageScore2.textContent = score2;

}


// =====================================
// 3. BAREMES DE POINTS
// =====================================

let bareme = [1, 10, 100];

let mode = "classique";

function afficherBoutonsScore() {

    const conteneurs = [
        document.getElementById("boutonsScore1"),
        document.getElementById("boutonsScore2")
    ];

    conteneurs.forEach(function(conteneur, index) {

        const equipe = index + 1;

        conteneur.innerHTML = "";

        bareme.forEach(function(points, i) {

            const bouton = document.createElement("button");

            bouton.textContent = "+" + points;

            bouton.classList.add("point");

            if (mode === "classique") {
                bouton.classList.add("point-" + points);
            } else {
                bouton.classList.add("point-personnalise-" + (i + 1));
            }

            bouton.addEventListener("click", function() {

                ajouterPoints(equipe, points);

            });

            conteneur.appendChild(bouton);

        });

    });

}


// =====================================
// 4. AJOUTER DES POINTS
// =====================================

function ajouterPoints(equipe, points) {

    if (equipe === 1) {

        historique1.push(score1);
        score1 += points;

    } else {

        historique2.push(score2);
        score2 += points;

    }

    actualiserScores();

}


// =====================================
// 5. ANNULER LES ACTIONS
// =====================================

document.getElementById("annuler1").addEventListener("click", function() {

    if (historique1.length === 0) return;

    score1 = historique1.pop();

    actualiserScores();

});

document.getElementById("annuler2").addEventListener("click", function() {

    if (historique2.length === 0) return;

    score2 = historique2.pop();

    actualiserScores();

});


// =====================================
// 6. CHOISIR LE MODE CLASSIQUE
// =====================================

const boutonClassique = document.getElementById("modeClassique");
const boutonPersonnalise = document.getElementById("modePersonnalise");

const personnalisation = document.getElementById("personnalisation");

boutonClassique.addEventListener("click", function() {

    mode = "classique";

    bareme = [1, 10, 100];

    boutonClassique.classList.add("active");
    boutonPersonnalise.classList.remove("active");

    personnalisation.classList.remove("active");

    afficherBoutonsScore();

});


// =====================================
// 7. CHOISIR LE MODE PERSONNALISE
// =====================================

boutonPersonnalise.addEventListener("click", function() {

    boutonPersonnalise.classList.add("active");
    boutonClassique.classList.remove("active");

    personnalisation.classList.add("active");

});


// =====================================
// 8. VALIDER LE BAREME PERSONNALISE
// =====================================

document.getElementById("validerBareme").addEventListener("click", function() {

    const valeurs = [
        document.getElementById("pointCustom1").value,
        document.getElementById("pointCustom2").value,
        document.getElementById("pointCustom3").value
    ];

    const nouveauxPoints = valeurs
        .filter(function(valeur) {
            return valeur.trim() !== "";
        })
        .map(Number);

    const message = document.getElementById("messageBareme");

    if (nouveauxPoints.length === 0) {

        message.textContent = "Choisis au moins une valeur.";
        message.style.color = "#E53935";

        return;

    }

    const valeursInvalides = nouveauxPoints.some(function(valeur) {
        return !Number.isSafeInteger(valeur) || valeur < 1;
    });

    if (valeursInvalides) {

        message.textContent = "Les valeurs doivent être des nombres entiers positifs.";
        message.style.color = "#E53935";

        return;

    }

    const doublons = new Set(nouveauxPoints).size !== nouveauxPoints.length;

    if (doublons) {

        message.textContent = "Choisis des valeurs différentes.";
        message.style.color = "#E53935";

        return;

    }

    mode = "personnalise";
    bareme = nouveauxPoints;

    boutonClassique.classList.remove("active");
    boutonPersonnalise.classList.add("active");

    afficherBoutonsScore();

    message.textContent = "Barème appliqué avec succès !";
    message.style.color = "#20834b";

});


// =====================================
// 9. NOUVEAU MATCH
// =====================================

document.getElementById("resetMatch").addEventListener("click", function() {

    const confirmation = confirm(
        "Démarrer un nouveau match ?\n\nLe chronomètre et les deux scores seront remis à zéro."
    );

    if (!confirmation) return;

    reinitialiserChrono();

    score1 = 0;
    score2 = 0;

    historique1 = [];
    historique2 = [];

    actualiserScores();

});


// =====================================
// 10. CHOIX DES MAILLOTS
// =====================================

const boutonsMaillot = document.querySelectorAll(".maillot");
const palettes = document.querySelectorAll(".palette");

boutonsMaillot.forEach(function(maillot) {

    maillot.addEventListener("click", function() {

        const equipe = maillot.dataset.jersey;
        const palette = document.getElementById("palette" + equipe);

        palette.classList.toggle("active");

    });

});


// =====================================
// 11. APPLIQUER UNE COULEUR
// =====================================

palettes.forEach(function(palette) {

    const boutonsCouleur = palette.querySelectorAll("button");

    boutonsCouleur.forEach(function(bouton) {

        bouton.style.backgroundColor = bouton.dataset.color;

        bouton.addEventListener("click", function() {

            const equipe = palette.id.replace("palette", "");
            const couleur = bouton.dataset.color;

            const maillot = document.getElementById("maillot" + equipe);

            maillot.style.backgroundColor = couleur;

            palette.classList.remove("active");

        });

    });

});


// =====================================
// 12. FERMER LES PALETTES
// =====================================

document.addEventListener("click", function(event) {

    if (!event.target.closest(".choix-maillot")) {

        palettes.forEach(function(palette) {
            palette.classList.remove("active");
        });

    }

});


// =====================================
// 13. INITIALISATION
// =====================================

afficherBoutonsScore();
actualiserScores();
afficherTemps();
