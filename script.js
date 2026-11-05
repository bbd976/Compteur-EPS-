
/* =====================================
   1. CHRONOMETRE
===================================== */

let secondes = 0;
let interval = null;
let matchTermine = false;

const affichageTemps = document.getElementById("temps");

function afficherTemps() {
    const minutes = Math.floor(secondes / 60);
    const reste = secondes % 60;

    affichageTemps.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(reste).padStart(2, "0");
}

document.getElementById("demarrer").addEventListener("click", function () {
    if (interval !== null || matchTermine) return;

    interval = setInterval(function () {
        secondes++;
        afficherTemps();
    }, 1000);
});

document.getElementById("pause").addEventListener("click", function () {
    clearInterval(interval);
    interval = null;
});

function reinitialiserChrono() {
    clearInterval(interval);
    interval = null;
    secondes = 0;
    afficherTemps();
}


/* =====================================
   2. SCORES ET PENALITES
===================================== */

const equipes = {
    1: {
        score: 0,
        penalites: 0,
        historique: [],
        couleur: "#E53935",
        typeIdentite: "couleur",
        texte: ""
    },
    2: {
        score: 0,
        penalites: 0,
        historique: [],
        couleur: "#E53935",
        typeIdentite: "couleur",
        texte: ""
    }
};

function actualiserEquipe(numero) {
    const equipe = equipes[numero];

    document.getElementById("score" + numero).textContent = equipe.score;
    document.getElementById("compteurPenalites" + numero).textContent =
        equipe.penalites;
}

function actualiserScores() {
    actualiserEquipe(1);
    actualiserEquipe(2);
}


/* =====================================
   3. IDENTITE DES EQUIPES
===================================== */

function obtenirIdentite(numero) {
    const equipe = equipes[numero];

    if (equipe.typeIdentite === "texte") {
        const texte = document.getElementById("texteEquipe" + numero).value.trim();
        return {
            type: "texte",
            nom: texte || "Équipe " + numero,
            couleur: null
        };
    }

    return {
        type: "couleur",
        nom: "Maillot",
        couleur: equipe.couleur
    };
}

function actualiserIdentite(numero) {
    const equipe = equipes[numero];
    const champ = document.getElementById("texteEquipe" + numero);
    const maillot = document.querySelector(
        '.maillot[data-jersey="' + numero + '"]'
    );

    document.querySelectorAll(
        '.type-identite[data-team="' + numero + '"]'
    ).forEach(function (bouton) {
        bouton.classList.toggle(
            "active",
            bouton.dataset.type === equipe.typeIdentite
        );
    });

    champ.classList.toggle("active", equipe.typeIdentite === "texte");
    maillot.style.display = equipe.typeIdentite === "couleur" ? "grid" : "none";

    const nom = document.getElementById("nomEquipe" + numero);

    if (equipe.typeIdentite === "texte") {
        nom.textContent = champ.value.trim() || "Équipe " + numero;
    } else {
        nom.textContent = "Équipe " + numero;
    }
}

document.querySelectorAll(".type-identite").forEach(function (bouton) {
    bouton.addEventListener("click", function () {
        const numero = Number(bouton.dataset.team);
        equipes[numero].typeIdentite = bouton.dataset.type;
        actualiserIdentite(numero);
    });
});

[1, 2].forEach(function (numero) {
    document.getElementById("texteEquipe" + numero)
        .addEventListener("input", function () {
            actualiserIdentite(numero);
        });
});


/* =====================================
   4. BAREME
===================================== */

let bareme = [1, 10, 100];
let mode = "classique";
let penalitesActives = false;
let pointsPenalite = 1;

const boutonClassique = document.getElementById("modeClassique");
const boutonPersonnalise = document.getElementById("modePersonnalise");
const personnalisation = document.getElementById("personnalisation");

function afficherBoutonsScore() {
    [1, 2].forEach(function (numero) {
        const conteneur = document.getElementById("boutonsScore" + numero);
        conteneur.innerHTML = "";

        bareme.forEach(function (points, index) {
            const bouton = document.createElement("button");
            bouton.textContent = "+" + points;
            bouton.classList.add("point");

            if (mode === "classique") {
                bouton.classList.add("point-" + points);
            } else {
                bouton.classList.add("point-personnalise-" + (index + 1));
            }

            bouton.addEventListener("click", function () {
                ajouterPoints(numero, points);
            });

            conteneur.appendChild(bouton);
        });

        const zonePenalite = document.getElementById("zonePenalite" + numero);
        const boutonPenalite = document.getElementById("penalite" + numero);

        zonePenalite.classList.toggle("active", penalitesActives);
        boutonPenalite.textContent = "−" + pointsPenalite + " Pénalité";
    });
}

boutonClassique.addEventListener("click", function () {
    mode = "classique";
    bareme = [1, 10, 100];
    penalitesActives = false;

    boutonClassique.classList.add("active");
    boutonPersonnalise.classList.remove("active");
    personnalisation.classList.remove("active");

    afficherBoutonsScore();
});

boutonPersonnalise.addEventListener("click", function () {
    personnalisation.classList.add("active");
    boutonPersonnalise.classList.add("active");
    boutonClassique.classList.remove("active");
});


/* =====================================
   5. CONFIGURATION PERSONNALISEE
===================================== */

document.getElementById("activerPenalites").addEventListener("change", function () {
    document.getElementById("reglagePenalite")
        .classList.toggle("active", this.checked);
});

document.getElementById("validerBareme").addEventListener("click", function () {
    const message = document.getElementById("messageBareme");

    const valeurs = [
        document.getElementById("pointCustom1").value,
        document.getElementById("pointCustom2").value,
        document.getElementById("pointCustom3").value
    ];

    const nouveauxPoints = valeurs
        .filter(function (valeur) {
            return valeur.trim() !== "";
        })
        .map(Number);

    if (nouveauxPoints.length === 0) {
        message.textContent = "Choisis au moins une valeur de score.";
        message.style.color = "#E53935";
        return;
    }

    const invalides = nouveauxPoints.some(function (valeur) {
        return !Number.isSafeInteger(valeur) || valeur < 1;
    });

    if (invalides) {
        message.textContent = "Les scores doivent être des entiers positifs.";
        message.style.color = "#E53935";
        return;
    }

    if (new Set(nouveauxPoints).size !== nouveauxPoints.length) {
        message.textContent = "Les valeurs doivent être différentes.";
        message.style.color = "#E53935";
        return;
    }

    const penalites = document.getElementById("activerPenalites").checked;
    const valeurPenalite = Number(
        document.getElementById("pointsPenalite").value
    );

    if (penalites && (
        !Number.isSafeInteger(valeurPenalite) || valeurPenalite < 0
    )) {
        message.textContent = "La pénalité doit être un entier positif ou égal à 0.";
        message.style.color = "#E53935";
        return;
    }

    bareme = nouveauxPoints;
    mode = "personnalise";
    penalitesActives = penalites;
    pointsPenalite = penalites ? valeurPenalite : 0;

    boutonClassique.classList.remove("active");
    boutonPersonnalise.classList.add("active");

    afficherBoutonsScore();

    message.textContent = "Barème appliqué avec succès !";
    message.style.color = "#20834b";
});


/* =====================================
   6. AJOUT DE POINTS ET PENALITES
===================================== */

function ajouterPoints(numero, points) {
    if (matchTermine) return;

    const equipe = equipes[numero];

    equipe.historique.push({
        scoreAvant: equipe.score,
        penalitesAvant: equipe.penalites
    });

    equipe.score += points;
    actualiserEquipe(numero);
}

function ajouterPenalite(numero) {
    if (matchTermine || !penalitesActives) return;

    const equipe = equipes[numero];

    equipe.historique.push({
        scoreAvant: equipe.score,
        penalitesAvant: equipe.penalites
    });

    equipe.score = Math.max(0, equipe.score - pointsPenalite);
    equipe.penalites++;

    actualiserEquipe(numero);
}

document.getElementById("penalite1").addEventListener("click", function () {
    ajouterPenalite(1);
});

document.getElementById("penalite2").addEventListener("click", function () {
    ajouterPenalite(2);
});


/* =====================================
   7. ANNULATION
===================================== */

function annulerAction(numero) {
    const equipe = equipes[numero];

    if (equipe.historique.length === 0 || matchTermine) return;

    const derniereAction = equipe.historique.pop();

    equipe.score = derniereAction.scoreAvant;
    equipe.penalites = derniereAction.penalitesAvant;

    actualiserEquipe(numero);
}

document.getElementById("annuler1").addEventListener("click", function () {
    annulerAction(1);
});

document.getElementById("annuler2").addEventListener("click", function () {
    annulerAction(2);
});


/* =====================================
   8. IDENTITE POUR L'HISTORIQUE
===================================== */

function capturerIdentite(numero) {
    const identite = obtenirIdentite(numero);

    return {
        type: identite.type,
        nom: identite.nom,
        couleur: identite.couleur
    };
}


/* =====================================
   9. HISTORIQUE DES MATCHS
===================================== */

let historiqueMatchs = [];

try {
    historiqueMatchs = JSON.parse(
        localStorage.getItem("compteurEPSHistorique")
    ) || [];
} catch (erreur) {
    historiqueMatchs = [];
}

function sauvegarderHistorique() {
    localStorage.setItem(
        "compteurEPSHistorique",
        JSON.stringify(historiqueMatchs)
    );
}

function afficherHistorique() {
    const conteneur = document.getElementById("historiqueMatchs");
    conteneur.innerHTML = "";

    if (historiqueMatchs.length === 0) {
        conteneur.innerHTML =
            '<p class="historique-vide">Aucun match enregistré pour le moment.</p>';
        return;
    }

    historiqueMatchs.forEach(function (match, index) {
        const carte = document.createElement("article");
        carte.className = "match-historique";

        const entete = document.createElement("div");
        entete.className = "match-historique-entete";

        const titre = document.createElement("span");
        titre.textContent = "MATCH N°" + (historiqueMatchs.length - index);

        const date = document.createElement("span");
        date.className = "match-date";
        date.textContent = match.date;

        entete.append(titre, date);

        const resultat = document.createElement("div");
        resultat.className = "match-resultat";

        function creerEquipeHistorique(donnees, penalites, aligner) {
            const bloc = document.createElement("div");
            bloc.className = "match-equipe";

            const identite = document.createElement("div");
            identite.className = "match-identite";

            if (donnees.type === "couleur") {
                const pastille = document.createElement("span");
                pastille.className = "match-couleur";
                pastille.style.backgroundColor = donnees.couleur;
                identite.appendChild(pastille);
                identite.appendChild(document.createTextNode(donnees.nom));
            } else {
                identite.textContent = donnees.nom;
            }

            const detail = document.createElement("small");
            detail.textContent = penalites + " pénalité(s)";

            bloc.append(identite, detail);
            return bloc;
        }

        const equipe1 = creerEquipeHistorique(
            match.equipe1.identite,
            match.equipe1.penalites
        );

        const score = document.createElement("strong");
        score.className = "match-score";
        score.textContent =
            match.equipe1.score + " - " + match.equipe2.score;

        const equipe2 = creerEquipeHistorique(
            match.equipe2.identite,
            match.equipe2.penalites
        );

        resultat.append(equipe1, score, equipe2);

        const infos = document.createElement("div");
        infos.className = "match-infos";

        const duree = document.createElement("span");
        duree.textContent = "Durée : " + match.duree;

        const vainqueur = document.createElement("span");

        if (match.equipe1.score > match.equipe2.score) {
            vainqueur.textContent = "Victoire " + match.equipe1.identite.nom;
        } else if (match.equipe2.score > match.equipe1.score) {
            vainqueur.textContent = "Victoire " + match.equipe2.identite.nom;
        } else {
            vainqueur.textContent = "Match nul";
        }

        infos.append(vainqueur, duree);

        const supprimer = document.createElement("button");
        supprimer.className = "btn-supprimer-match";
        supprimer.textContent = "Supprimer ce match";

        supprimer.addEventListener("click", function () {
            if (!confirm("Supprimer définitivement ce match de l'historique ?")) {
                return;
            }

            historiqueMatchs.splice(index, 1);
            sauvegarderHistorique();
            afficherHistorique();
        });

        carte.append(entete, resultat, infos, supprimer);
        conteneur.appendChild(carte);
    });
}


/* =====================================
   10. FIN DU MATCH
===================================== */

document.getElementById("finMatch").addEventListener("click", function () {
    if (matchTermine) return;

    if (!confirm("Terminer le match et enregistrer le résultat ?")) return;

    clearInterval(interval);
    interval = null;
    matchTermine = true;

    const minutes = Math.floor(secondes / 60);
    const reste = secondes % 60;
    const duree = String(minutes).padStart(2, "0") + ":" +
        String(reste).padStart(2, "0");

    const date = new Date().toLocaleString("fr-FR");

    historiqueMatchs.unshift({
        date: date,
        duree: duree,
        equipe1: {
            identite: capturerIdentite(1),
            score: equipes[1].score,
            penalites: equipes[1].penalites
        },
        equipe2: {
            identite: capturerIdentite(2),
            score: equipes[2].score,
            penalites: equipes[2].penalites
        }
    });

    sauvegarderHistorique();
    afficherHistorique();

    document.getElementById("resetMatch").disabled = false;
    document.getElementById("finMatch").disabled = true;
    document.getElementById("messageMatch").textContent =
        "Match terminé. Tu peux démarrer un nouveau match.";
});


/* =====================================
   11. NOUVEAU MATCH
===================================== */

document.getElementById("resetMatch").addEventListener("click", function () {
    if (!matchTermine) return;

    if (!confirm("Démarrer un nouveau match ? Les scores et le chrono seront remis à zéro.")) {
        return;
    }

    reinitialiserChrono();

    [1, 2].forEach(function (numero) {
        equipes[numero].score = 0;
        equipes[numero].penalites = 0;
        equipes[numero].historique = [];
        actualiserEquipe(numero);
    });

    matchTermine = false;

    document.getElementById("resetMatch").disabled = true;
    document.getElementById("finMatch").disabled = false;
    document.getElementById("messageMatch").textContent = "";
});


/* =====================================
   12. CHOIX DES MAILLOTS
===================================== */

const palettes = document.querySelectorAll(".palette");

document.querySelectorAll(".maillot").forEach(function (bouton) {
    bouton.addEventListener("click", function () {
        const numero = Number(bouton.dataset.jersey);

        if (equipes[numero].typeIdentite !== "couleur") return;

        document.getElementById("palette" + numero)
            .classList.toggle("active");
    });
});

palettes.forEach(function (palette) {
    const numero = Number(palette.id.replace("palette", ""));

    palette.querySelectorAll("button").forEach(function (bouton) {
        bouton.style.backgroundColor = bouton.dataset.color;

        bouton.addEventListener("click", function () {
            equipes[numero].couleur = bouton.dataset.color;

            document.getElementById("maillot" + numero).style.backgroundColor =
                bouton.dataset.color;

            palette.classList.remove("active");
        });
    });
});

document.addEventListener("click", function (event) {
    if (!event.target.closest(".identite-equipe")) {
        palettes.forEach(function (palette) {
            palette.classList.remove("active");
        });
    }
});


/* =====================================
   13. EFFACER TOUT L'HISTORIQUE
===================================== */

document.getElementById("effacerHistorique").addEventListener("click", function () {
    if (!confirm("Effacer tout l'historique des matchs ?")) return;

    historiqueMatchs = [];
    sauvegarderHistorique();
    afficherHistorique();
});


/* =====================================
   14. INITIALISATION
===================================== */

[1, 2].forEach(function (numero) {
    document.getElementById("maillot" + numero).style.backgroundColor =
        equipes[numero].couleur;

    actualiserIdentite(numero);
});

afficherBoutonsScore();
actualiserScores();
afficherTemps();
afficherHistorique();
