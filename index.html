
/* =====================================
   1. CHRONOMETRE
===================================== */

let secondes = 0;
let intervalChrono = null;
let matchTermine = false;

const affichageTemps = document.getElementById("temps");

function afficherTemps() {
    const minutes = Math.floor(secondes / 60);
    const reste = secondes % 60;

    affichageTemps.textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(reste).padStart(2, "0");
}

function demarrerChrono() {
    if (intervalChrono !== null || matchTermine) return;

    intervalChrono = setInterval(() => {
        secondes++;
        afficherTemps();
    }, 1000);
}

function pauseChrono() {
    clearInterval(intervalChrono);
    intervalChrono = null;
}

document.getElementById("demarrer").addEventListener("click", demarrerChrono);
document.getElementById("pause").addEventListener("click", pauseChrono);


/* =====================================
   2. DONNEES DES EQUIPES
===================================== */

const equipes = {
    1: {
        score: 0,
        penalites: 0,
        actions: [],
        typeIdentite: "maillot",
        maillot: "rouge",
        nom: ""
    },
    2: {
        score: 0,
        penalites: 0,
        actions: [],
        typeIdentite: "maillot",
        maillot: "bleu",
        nom: ""
    }
};

let mode = "classique";
let baremePersonnalise = [];
let penalitesActives = false;
let pointsPenalite = 0;


/* =====================================
   3. CONFIGURATION DU BAREME
===================================== */

const boutonClassique = document.getElementById("modeClassique");
const boutonPersonnalise = document.getElementById("modePersonnalise");

const configurationPersonnalisee =
    document.getElementById("configurationPersonnalisee");

const resumeBareme = document.getElementById("resumeBareme");
const texteResumeBareme = document.getElementById("texteResumeBareme");
const reglagePenalite = document.getElementById("reglagePenalite");

function afficher(element, visible) {
    element.hidden = !visible;

    if (visible) {
        element.style.removeProperty("display");
    } else {
        element.style.setProperty("display", "none", "important");
    }
}


/* =====================================
   4. CHOIX DU MODE
===================================== */

boutonClassique.addEventListener("click", () => {

    if (matchTermine) return;

    mode = "classique";
    penalitesActives = false;

    document.getElementById("activerPenalites").checked = false;

    afficher(reglagePenalite, false);
    afficher(configurationPersonnalisee, false);
    afficher(resumeBareme, false);

    boutonClassique.classList.add("mode-actif");
    boutonPersonnalise.classList.remove("mode-actif");

    afficher(document.getElementById("zonePenalite1"), false);
    afficher(document.getElementById("zonePenalite2"), false);

    actualiserBoutonsScore();
});


boutonPersonnalise.addEventListener("click", () => {

    if (matchTermine) return;

    afficher(configurationPersonnalisee, true);
    afficher(resumeBareme, false);

    boutonPersonnalise.classList.add("mode-actif");
    boutonClassique.classList.remove("mode-actif");

});


/* =====================================
   5. REGLAGE DES PENALITES
===================================== */

document.getElementById("activerPenalites")
    .addEventListener("change", event => {

        afficher(reglagePenalite, event.target.checked);

    });


/* =====================================
   6. VALIDATION DU BAREME
===================================== */

document.getElementById("validerBareme").addEventListener("click", () => {

    if (matchTermine) return;

    const champs = [
        document.getElementById("pointCustom1"),
        document.getElementById("pointCustom2"),
        document.getElementById("pointCustom3")
    ];

    // On ignore les champs laissés vides
    const valeurs = champs
        .filter(champ => champ.value.trim() !== "")
        .map(champ => Number(champ.value));

    const message = document.getElementById("messageBareme");

    if (
        valeurs.length === 0 ||
        valeurs.some(valeur => !Number.isFinite(valeur) || valeur < 0)
    ) {
        message.textContent = "Saisis au moins une valeur valide.";
        return;
    }

    // Enregistrement du barème
    baremePersonnalise = valeurs;
    mode = "personnalise";

    // Enregistrement des pénalités
    penalitesActives =
        document.getElementById("activerPenalites").checked;

    const saisiePenalite =
        document.getElementById("pointsPenalite").value;

    pointsPenalite = penalitesActives
        ? Math.max(0, Number(saisiePenalite) || 0)
        : 0;

    // Création du résumé
    texteResumeBareme.textContent =
        "Barème : " +
        baremePersonnalise.map(valeur => "+" + valeur).join(" / ") +
        (penalitesActives
            ? " · Pénalité : -" + pointsPenalite
            : "");

    message.textContent = "";

    // Fermeture du panneau
    afficher(configurationPersonnalisee, false);

    // Affichage du résumé
    afficher(resumeBareme, true);

    boutonPersonnalise.classList.add("mode-actif");
    boutonClassique.classList.remove("mode-actif");

    // Affichage ou masquage des pénalités
    afficher(
        document.getElementById("zonePenalite1"),
        penalitesActives
    );

    afficher(
        document.getElementById("zonePenalite2"),
        penalitesActives
    );

    actualiserBoutonsScore();

});


/* =====================================
   7. MODIFIER LE BAREME
===================================== */

document.getElementById("modifierBareme").addEventListener("click", () => {

    if (matchTermine) return;

    afficher(configurationPersonnalisee, true);
    afficher(resumeBareme, false);

});


/* =====================================
   8. BOUTONS DE SCORE
===================================== */

function actualiserBoutonsScore() {

    [1, 2].forEach(numero => {

        const zone = document.getElementById("boutonsScore" + numero);

        zone.innerHTML = "";

        const valeurs = mode === "classique"
            ? [1, 10, 100]
            : baremePersonnalise;

        // Adaptation automatique au nombre de valeurs
        zone.style.gridTemplateColumns =
            "repeat(" + valeurs.length + ", minmax(0, 1fr))";

        valeurs.forEach(valeur => {

            const bouton = document.createElement("button");

            bouton.className = "point";
            bouton.textContent = "+" + valeur;

            bouton.addEventListener("click", () => {
                ajouterPoints(numero, valeur);
            });

            zone.appendChild(bouton);

        });

    });

}


/* =====================================
   9. GESTION DES SCORES
===================================== */

function afficherScore(numero) {

    document.getElementById("score" + numero).textContent =
        equipes[numero].score;

    document.getElementById("compteurPenalites" + numero).textContent =
        equipes[numero].penalites;

}


function ajouterPoints(numero, valeur) {

    if (matchTermine) return;

    const equipe = equipes[numero];

    equipe.actions.push({
        scoreAvant: equipe.score,
        penalitesAvant: equipe.penalites
    });

    equipe.score += valeur;

    afficherScore(numero);

}


/* =====================================
   10. PENALITES
===================================== */

function ajouterPenalite(numero) {

    if (matchTermine || !penalitesActives) return;

    const equipe = equipes[numero];

    equipe.actions.push({
        scoreAvant: equipe.score,
        penalitesAvant: equipe.penalites
    });

    // Le score peut désormais devenir négatif
    equipe.score = equipe.score - pointsPenalite;

    // Le compteur augmente même si le malus vaut zéro
    equipe.penalites++;

    afficherScore(numero);

}

document.getElementById("penalite1")
    .addEventListener("click", () => ajouterPenalite(1));

document.getElementById("penalite2")
    .addEventListener("click", () => ajouterPenalite(2));


/* =====================================
   11. ANNULATION DE LA DERNIERE ACTION
===================================== */

function annulerAction(numero) {

    if (matchTermine) return;

    const equipe = equipes[numero];

    if (equipe.actions.length === 0) return;

    const derniereAction = equipe.actions.pop();

    equipe.score = derniereAction.scoreAvant;
    equipe.penalites = derniereAction.penalitesAvant;

    afficherScore(numero);

}

document.getElementById("annuler1")
    .addEventListener("click", () => annulerAction(1));

document.getElementById("annuler2")
    .addEventListener("click", () => annulerAction(2));


/* =====================================
   12. MAILLOTS ET PALETTES
===================================== */

const couleursMaillots = {
    "rouge": "#ed3733",
    "vert-fonce": "#167447",
    "bleu": "#2676d4",
    "jaune": "#f2d329",
    "orange": "#ed9029",
    "noir": "#222222",
    "blanc": "#ffffff",
    "vert-clair": "#8bc34a"
};


function actualiserMaillot(numero) {

    const bouton = document.getElementById("ouvrirPalette" + numero);

    const couleur = couleursMaillots[equipes[numero].maillot];

    bouton.style.setProperty("--couleur-maillot", couleur);

    document.querySelectorAll(
        '.couleur[data-team="' + numero + '"]'
    ).forEach(element => {

        element.classList.toggle(
            "selectionne",
            element.dataset.color === equipes[numero].maillot
        );

    });

}


// Ouvrir ou fermer la palette en cliquant sur le maillot
[1, 2].forEach(numero => {

    const bouton = document.getElementById("ouvrirPalette" + numero);
    const palette = document.getElementById("palette" + numero);

    bouton.addEventListener("click", () => {

        if (matchTermine || equipes[numero].typeIdentite !== "maillot") {
            return;
        }

        const doitOuvrir = palette.hidden;

        // Fermer les deux palettes avant d'en ouvrir une
        [1, 2].forEach(n => {

            document.getElementById("palette" + n).hidden = true;

            document.getElementById("ouvrirPalette" + n)
                .setAttribute("aria-expanded", "false");

        });

        palette.hidden = !doitOuvrir;

        bouton.setAttribute(
            "aria-expanded",
            String(doitOuvrir)
        );

    });

});


// Choisir une couleur
document.querySelectorAll(".couleur").forEach(bouton => {

    bouton.addEventListener("click", () => {

        if (matchTermine) return;

        const numero = Number(bouton.dataset.team);
        const couleur = bouton.dataset.color;

        equipes[numero].maillot = couleur;

        // Changement immédiat du maillot
        actualiserMaillot(numero);

        // Fermeture de la palette
        document.getElementById("palette" + numero).hidden = true;

        document.getElementById("ouvrirPalette" + numero)
            .setAttribute("aria-expanded", "false");

    });

});


/* =====================================
   13. IDENTITE DES EQUIPES
===================================== */

function actualiserIdentite(numero) {

    const equipe = equipes[numero];

    document.getElementById("nomEquipe" + numero).textContent =
        equipe.typeIdentite === "texte"
            ? (equipe.nom.trim() || "Équipe " + numero)
            : "Équipe " + numero;

    document.getElementById("ouvrirPalette" + numero).hidden =
        equipe.typeIdentite !== "maillot";

    document.getElementById("texteEquipe" + numero).hidden =
        equipe.typeIdentite !== "texte";

    if (equipe.typeIdentite !== "maillot") {
        document.getElementById("palette" + numero).hidden = true;
    }

    actualiserMaillot(numero);

}


// Choix maillot ou texte
document.querySelectorAll(".type-identite").forEach(bouton => {

    bouton.addEventListener("click", () => {

        if (matchTermine) return;

        const numero = Number(bouton.dataset.team);
        const type = bouton.dataset.type;

        equipes[numero].typeIdentite = type;

        document.querySelectorAll(
            '.type-identite[data-team="' + numero + '"]'
        ).forEach(element => {
            element.classList.remove("actif");
        });

        bouton.classList.add("actif");

        actualiserIdentite(numero);

    });

});


// Saisie du nom de l'équipe ou du joueur
[1, 2].forEach(numero => {

    document.getElementById("texteEquipe" + numero)
        .addEventListener("input", event => {

            equipes[numero].nom = event.target.value;

            actualiserIdentite(numero);

        });

});


/* =====================================
   14. HISTORIQUE
===================================== */

const CLE_HISTORIQUE = "compteurEPSHistorique";

function chargerHistorique() {

    try {

        const sauvegarde = localStorage.getItem(CLE_HISTORIQUE);

        if (sauvegarde) {
            return JSON.parse(sauvegarde);
        }

        // Récupération éventuelle de l'ancien historique
        const ancien = localStorage.getItem("myoutilsEPS_historique");

        if (ancien) {

            const donnees = JSON.parse(ancien);

            if (Array.isArray(donnees)) {
                return donnees;
            }

        }

    } catch (erreur) {

        console.error("Erreur historique :", erreur);

    }

    return [];

}

let historiqueMatchs = chargerHistorique();


function sauvegarderHistorique() {

    localStorage.setItem(
        CLE_HISTORIQUE,
        JSON.stringify(historiqueMatchs)
    );

}


function nomIdentite(equipe, numero) {

    return equipe.typeIdentite === "texte"
        ? (equipe.nom.trim() || "Équipe " + numero)
        : "Maillot " + equipe.maillot;

}


/* =====================================
   15. FIN DU MATCH
===================================== */

function terminerMatch() {

    if (matchTermine) return;

    pauseChrono();
    matchTermine = true;

    const equipe1 = equipes[1];
    const equipe2 = equipes[2];

    let resultat = "Match nul";

    if (equipe1.score > equipe2.score) {
        resultat = "Victoire équipe 1";
    }

    if (equipe2.score > equipe1.score) {
        resultat = "Victoire équipe 2";
    }

    const match = {

        date: new Date().toLocaleString("fr-FR"),
        duree: affichageTemps.textContent,
        resultat: resultat,

        equipe1: {
            nom: nomIdentite(equipe1, 1),
            typeIdentite: equipe1.typeIdentite,
            maillot: equipe1.maillot,
            score: equipe1.score,
            penalites: equipe1.penalites
        },

        equipe2: {
            nom: nomIdentite(equipe2, 2),
            typeIdentite: equipe2.typeIdentite,
            maillot: equipe2.maillot,
            score: equipe2.score,
            penalites: equipe2.penalites
        }

    };

    historiqueMatchs.unshift(match);

    sauvegarderHistorique();
    afficherHistorique();

    document.getElementById("messageMatch").textContent = resultat;

    document.getElementById("finMatch").disabled = true;
    document.getElementById("resetMatch").disabled = false;

}

document.getElementById("finMatch")
    .addEventListener("click", terminerMatch);


/* =====================================
   16. AFFICHAGE DE L'HISTORIQUE
===================================== */

function afficherHistorique() {

    const zone = document.getElementById("historiqueMatchs");

    zone.innerHTML = "";

    if (historiqueMatchs.length === 0) {

        zone.textContent = "Aucun match enregistré pour le moment.";

        return;

    }

    historiqueMatchs.forEach((match, index) => {

        const bloc = document.createElement("div");
        bloc.className = "match-historique";

        const ligne = document.createElement("div");
        ligne.className = "ligne-resultat";

        const resultat = document.createElement("span");

        resultat.textContent =
            match.equipe1.nom + " " +
            match.equipe1.score + " - " +
            match.equipe2.score + " " +
            match.equipe2.nom;

        ligne.appendChild(resultat);
        bloc.appendChild(ligne);

        const details = document.createElement("div");
        details.className = "details-match";

        details.textContent =
            match.date +
            " · Durée : " + match.duree +
            " · Pénalités : " +
            (match.equipe1.penalites || 0) + " / " +
            (match.equipe2.penalites || 0) +
            " · " + match.resultat;

        bloc.appendChild(details);

        const supprimer = document.createElement("button");

        supprimer.className = "supprimer-match";
        supprimer.textContent = "Supprimer ce match";

        supprimer.addEventListener("click", () => {

            historiqueMatchs.splice(index, 1);

            sauvegarderHistorique();
            afficherHistorique();

        });

        bloc.appendChild(supprimer);
        zone.appendChild(bloc);

    });

}


/* =====================================
   17. EFFACER L'HISTORIQUE
===================================== */

document.getElementById("effacerHistorique")
    .addEventListener("click", () => {

        if (!confirm("Effacer tout l'historique des matchs ?")) {
            return;
        }

        historiqueMatchs = [];

        sauvegarderHistorique();
        afficherHistorique();

    });


/* =====================================
   18. NOUVEAU MATCH
===================================== */

document.getElementById("resetMatch").addEventListener("click", () => {

    if (!matchTermine) return;

    secondes = 0;
    afficherTemps();

    [1, 2].forEach(numero => {

        equipes[numero].score = 0;
        equipes[numero].penalites = 0;
        equipes[numero].actions = [];

        afficherScore(numero);

    });

    matchTermine = false;

    document.getElementById("messageMatch").textContent = "";

    document.getElementById("finMatch").disabled = false;
    document.getElementById("resetMatch").disabled = true;

});


/* =====================================
   19. INITIALISATION
===================================== */

[1, 2].forEach(numero => {

    actualiserIdentite(numero);
    afficherScore(numero);

});

afficherTemps();
actualiserBoutonsScore();
afficherHistorique();
