// =====================================
// COMPTEUR EPS - SCRIPT COMPLET
// =====================================

let secondes = 0;
let interval = null;
let matchTermine = false;
let matchEnregistre = false;

let bareme = [];
let couleursBareme = {};
let penalitesActives = false;
let pointsPenalite = 0;

const CLE_HISTORIQUE = "compteurEPS_historique";

let equipes = {
  1: {
    score: 0,
    penalites: 0,
    couleur: "#E53935",
    nom: "Équipe A",
    historiqueActions: [],
    compteurs: {}
  },
  2: {
    score: 0,
    penalites: 0,
    couleur: "#2869c5",
    nom: "Équipe B",
    historiqueActions: [],
    compteurs: {}
  }
};

const affichageTemps = document.getElementById("temps");
const boutonDemarrer = document.getElementById("demarrer");
const boutonPause = document.getElementById("pause");
const boutonFinMatch = document.getElementById("finMatch");
const boutonNouveauMatch = document.getElementById("resetMatch");
const messageMatch = document.getElementById("messageMatch");

// =====================================
// CHRONOMETRE
// =====================================

function afficherTemps() {
  const minutes = Math.floor(secondes / 60);
  const resteSecondes = secondes % 60;

  affichageTemps.textContent =
    String(minutes).padStart(2, "0") + ":" +
    String(resteSecondes).padStart(2, "0");
}

function demarrerChronometre() {
  if (matchTermine || interval !== null) return;

  interval = setInterval(() => {
    secondes++;
    afficherTemps();
  }, 1000);

  messageMatch.textContent = "Match en cours.";
  boutonDemarrer.disabled = true;
}

function mettreEnPause() {
  if (interval !== null) {
    clearInterval(interval);
    interval = null;
  }

  if (!matchTermine) {
    boutonDemarrer.disabled = false;
    messageMatch.textContent = "Chronomètre en pause.";
  }
}

boutonDemarrer.addEventListener("click", demarrerChronometre);
boutonPause.addEventListener("click", mettreEnPause);

// =====================================
// CONFIGURATION DU BAREME
// =====================================

const activerPenalites = document.getElementById("activerPenalites");
const reglagePenalite = document.getElementById("reglagePenalite");

activerPenalites.addEventListener("change", () => {
  reglagePenalite.hidden = !activerPenalites.checked;
});

document.getElementById("validerBareme").addEventListener("click", () => {
  const valeurs = [
    {
      valeur: document.getElementById("pointCustom1").value,
      couleur: document.getElementById("couleurCustom1").value
    },
    {
      valeur: document.getElementById("pointCustom2").value,
      couleur: document.getElementById("couleurCustom2").value
    },
    {
      valeur: document.getElementById("pointCustom3").value,
      couleur: document.getElementById("couleurCustom3").value
    }
  ];

  const selection = valeurs
    .filter(item => item.valeur !== "")
    .map(item => ({
      valeur: Number(item.valeur),
      couleur: item.couleur
    }));

  const message = document.getElementById("messageBareme");

  if (selection.length === 0) {
    message.textContent = "Choisis au moins une valeur de points.";
    return;
  }

  if (selection.some(item =>
    !Number.isInteger(item.valeur) || item.valeur < 1
  )) {
    message.textContent =
      "Les valeurs doivent être des nombres entiers positifs.";
    return;
  }

  const valeursUniques = selection.map(item => item.valeur);

  if (new Set(valeursUniques).size !== valeursUniques.length) {
    message.textContent = "Chaque valeur de points doit être différente.";
    return;
  }

  selection.sort((a, b) => a.valeur - b.valeur);

  bareme = selection.map(item => item.valeur);
  couleursBareme = {};

  selection.forEach(item => {
    couleursBareme[item.valeur] = item.couleur;
  });

  penalitesActives = activerPenalites.checked;

  pointsPenalite = penalitesActives
    ? Math.max(0, Number(document.getElementById("pointsPenalite").value) || 0)
    : 0;

  message.textContent = "";

  document.getElementById("configurationContenu").hidden = true;
  document.getElementById("resumeBareme").hidden = false;

  let resume = "Barème : " + bareme.join(" / ");

  if (penalitesActives) {
    resume += " points — Pénalité : −" + pointsPenalite + " point(s)";
  }

  document.getElementById("texteResumeBareme").textContent = resume;

  afficherBoutonsScore();
  afficherPenalites();
});

document.getElementById("modifierBareme").addEventListener("click", () => {
  if (matchTermine) return;

  document.getElementById("configurationContenu").hidden = false;
  document.getElementById("resumeBareme").hidden = true;
});

// =====================================
// AFFICHAGE DES BOUTONS DE SCORE
// =====================================

function afficherBoutonsScore() {
  [1, 2].forEach(numero => {
    const conteneur = document.getElementById("boutonsScore" + numero);
    conteneur.innerHTML = "";

    equipes[numero].compteurs = {};

    bareme.forEach(valeur => {
      equipes[numero].compteurs[valeur] = 0;
    });

    bareme.forEach(valeur => {
      const couleur = couleursBareme[valeur];

      const bloc = document.createElement("div");
      bloc.className = "bloc-point";

      const bouton = document.createElement("button");
      bouton.className = "point point-couleur-" + couleur;
      bouton.textContent = "+" + valeur;

      bouton.addEventListener("click", () => {
        ajouterPoints(numero, valeur);
      });

      const pastille = document.createElement("span");
      pastille.className = "pastille-compteur point-couleur-" + couleur;
      pastille.id = "compteur-" + numero + "-" + valeur;
      pastille.textContent = "0";

      bloc.append(bouton, pastille);
      conteneur.appendChild(bloc);
    });

    conteneur.style.gridTemplateColumns =
      `repeat(${bareme.length}, minmax(0, 1fr))`;
  });
}

function actualiserCompteurs(numero) {
  bareme.forEach(valeur => {
    const compteur = document.getElementById(
      "compteur-" + numero + "-" + valeur
    );

    if (compteur) {
      compteur.textContent = equipes[numero].compteurs[valeur] || 0;
    }
  });
}

// =====================================
// GESTION DES SCORES
// =====================================

function ajouterPoints(numero, valeur) {
  if (matchTermine) return;

  const equipe = equipes[numero];

  equipe.score += valeur;
  equipe.compteurs[valeur] = (equipe.compteurs[valeur] || 0) + 1;

  equipe.historiqueActions.push({
    type: "points",
    valeur: valeur
  });

  actualiserEquipe(numero);
}

function ajouterPenalite(numero) {
  if (matchTermine || !penalitesActives) return;

  const equipe = equipes[numero];

  equipe.score -= pointsPenalite;
  equipe.penalites++;

  equipe.historiqueActions.push({
    type: "penalite",
    valeur: pointsPenalite
  });

  actualiserEquipe(numero);
}

function annulerAction(numero) {
  if (matchTermine) return;

  const equipe = equipes[numero];

  if (equipe.historiqueActions.length === 0) return;

  const derniereAction = equipe.historiqueActions.pop();

  if (derniereAction.type === "points") {
    equipe.score -= derniereAction.valeur;
    equipe.compteurs[derniereAction.valeur]--;
  }

  if (derniereAction.type === "penalite") {
    equipe.score += derniereAction.valeur;
    equipe.penalites--;
  }

  actualiserEquipe(numero);
}

function actualiserEquipe(numero) {
  const equipe = equipes[numero];

  document.getElementById("score" + numero).textContent = equipe.score;
  document.getElementById("compteurPenalites" + numero).textContent =
    equipe.penalites;

  actualiserCompteurs(numero);
}

document.getElementById("annuler1").addEventListener("click", () => {
  annulerAction(1);
});

document.getElementById("annuler2").addEventListener("click", () => {
  annulerAction(2);
});

document.getElementById("penalite1").addEventListener("click", () => {
  ajouterPenalite(1);
});

document.getElementById("penalite2").addEventListener("click", () => {
  ajouterPenalite(2);
});

function afficherPenalites() {
  document.getElementById("zonePenalite1").hidden = !penalitesActives;
  document.getElementById("zonePenalite2").hidden = !penalitesActives;
}

// =====================================
// NOM DES EQUIPES
// =====================================

[1, 2].forEach(numero => {
  document.getElementById("nomEquipe" + numero)
    .addEventListener("click", () => {
      if (matchTermine) return;

      const nouveauNom = prompt(
        "Modifier le nom de l'équipe :",
        equipes[numero].nom
      );

      if (nouveauNom === null) return;

      const nom = nouveauNom.trim();

      if (nom !== "") {
        equipes[numero].nom = nom;
        document.getElementById("nomEquipe" + numero).textContent = nom;
      }
    });
});

// =====================================
// COULEURS DES MAILLOTS
// =====================================

[1, 2].forEach(numero => {
  document.getElementById("ouvrirPalette" + numero)
    .addEventListener("click", () => {
      if (matchTermine) return;

      document.getElementById("palette" + numero)
        .classList.toggle("active");
    });
});

document.querySelectorAll(".palette button").forEach(bouton => {
  bouton.addEventListener("click", () => {
    if (matchTermine) return;

    const numero = Number(bouton.dataset.team);
    const couleur = bouton.dataset.color;

    equipes[numero].couleur = couleur;

    document.getElementById("maillot" + numero)
      .style.setProperty("--couleur-maillot", couleur);

    document.getElementById("palette" + numero)
      .classList.remove("active");
  });
});

// =====================================
// FIN DU MATCH
// =====================================

function terminerMatch() {
  if (matchTermine || matchEnregistre) return;

  if (bareme.length === 0) {
    messageMatch.textContent =
      "Configure d'abord le barème avant de terminer le match.";
    return;
  }

  mettreEnPause();

  matchTermine = true;
  matchEnregistre = true;

  const maintenant = new Date();

  const match = {
    date: maintenant.toLocaleDateString("fr-FR"),
    heure: maintenant.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit"
    }),
    duree: affichageTemps.textContent,

    equipe1: {
      nom: equipes[1].nom,
      score: equipes[1].score,
      couleur: equipes[1].couleur,
      penalites: equipes[1].penalites,
      compteurs: { ...equipes[1].compteurs }
    },

    equipe2: {
      nom: equipes[2].nom,
      score: equipes[2].score,
      couleur: equipes[2].couleur,
      penalites: equipes[2].penalites,
      compteurs: { ...equipes[2].compteurs }
    },

    bareme: [...bareme],
    couleursBareme: { ...couleursBareme },
    pointsPenalite: pointsPenalite
  };

  const historique = recupererHistorique();
  historique.unshift(match);

  sauvegarderHistorique(historique);
  afficherHistorique();

  messageMatch.textContent =
    "Match terminé et enregistré dans l'historique.";

  boutonFinMatch.disabled = true;
  boutonNouveauMatch.disabled = false;

  verrouillerMatch();
}

boutonFinMatch.addEventListener("click", terminerMatch);

// =====================================
// VERROUILLAGE APRES FIN DU MATCH
// =====================================

function verrouillerMatch() {
  document.querySelectorAll(
    ".point, .penalite, .annuler-equipe, .maillot, .nom-equipe-modifiable, #validerBareme, #modifierBareme"
  ).forEach(bouton => {
    bouton.disabled = true;
  });

  document.querySelectorAll(".palette").forEach(palette => {
    palette.classList.remove("active");
  });

  boutonDemarrer.disabled = true;
  boutonPause.disabled = true;
  boutonFinMatch.disabled = true;
}

// =====================================
// NOUVEAU MATCH
// =====================================

function nouveauMatch() {
  if (!matchTermine) return;

  secondes = 0;
  afficherTemps();

  matchTermine = false;
  matchEnregistre = false;

  [1, 2].forEach(numero => {
    equipes[numero].score = 0;
    equipes[numero].penalites = 0;
    equipes[numero].historiqueActions = [];

    Object.keys(equipes[numero].compteurs).forEach(valeur => {
      equipes[numero].compteurs[valeur] = 0;
    });

    actualiserEquipe(numero);

    document.getElementById("nomEquipe" + numero).textContent =
      equipes[numero].nom;
  });

  document.querySelectorAll(
    ".point, .penalite, .annuler-equipe, .maillot, .nom-equipe-modifiable, #validerBareme, #modifierBareme"
  ).forEach(bouton => {
    bouton.disabled = false;
  });

  boutonDemarrer.disabled = false;
  boutonPause.disabled = false;
  boutonFinMatch.disabled = false;
  boutonNouveauMatch.disabled = true;

  messageMatch.textContent = "Nouveau match prêt.";
}

boutonNouveauMatch.addEventListener("click", nouveauMatch);

// =====================================
// HISTORIQUE DES MATCHS
// =====================================

function recupererHistorique() {
  try {
    return JSON.parse(localStorage.getItem(CLE_HISTORIQUE)) || [];
  } catch (erreur) {
    return [];
  }
}

function sauvegarderHistorique(historique) {
  localStorage.setItem(CLE_HISTORIQUE, JSON.stringify(historique));
}

function afficherHistorique() {
  const conteneur = document.getElementById("historiqueMatchs");
  const historique = recupererHistorique();

  conteneur.innerHTML = "";

  if (historique.length === 0) {
    conteneur.innerHTML =
      '<p class="historique-vide">Aucun match enregistré pour le moment.</p>';
    return;
  }

  historique.forEach((match, index) => {
    const carte = document.createElement("div");
    carte.className = "resultat-match";

    const entete = document.createElement("div");
    entete.className = "resultat-match-entete";

    const numero = document.createElement("strong");
    numero.className = "numero-match";
    numero.textContent = "MATCH " + (historique.length - index);

    const date = document.createElement("span");
    date.className = "date-match";
    date.textContent = match.date + " à " + match.heure;

    entete.append(numero, date);

    const scores = document.createElement("div");
    scores.className = "resultat-score";

    function creerCarteEquipe(equipe) {
      const bloc = document.createElement("div");
      bloc.className = "resultat-equipe";

      const barreCouleur = document.createElement("span");
      barreCouleur.className = "historique-barre-couleur";
      barreCouleur.style.backgroundColor = equipe.couleur || "#203d58";

      const contenu = document.createElement("div");
      contenu.className = "historique-contenu-equipe";

      const nom = document.createElement("div");
      nom.className = "historique-nom-equipe";
      nom.textContent = equipe.nom;

      const score = document.createElement("strong");
      score.className = "historique-score";
      score.textContent = equipe.score;

      const titrePoints = document.createElement("span");
      titrePoints.className = "titre-points";
      titrePoints.textContent = "DÉTAIL DES POINTS";

      const points = document.createElement("div");
      points.className = "historique-pastilles";

      match.bareme.forEach((valeur, i) => {
        const couleur = (match.couleursBareme || {})[valeur]
          || ["vert", "bleu", "orange"][i]
          || "vert";

        const pastille = document.createElement("div");
        pastille.className = "historique-pastille pastille-" + couleur;

        const type = document.createElement("strong");
        type.className = "pastille-type";
        type.textContent = valeur + (valeur === 1 ? " pt" : " pts");

        const nombre = document.createElement("span");
        nombre.className = "pastille-nombre";

        const repetitions = (equipe.compteurs || {})[valeur] || 0;
        nombre.textContent = "× " + repetitions;

        pastille.append(type, nombre);
        points.appendChild(pastille);
      });

      const penalite = document.createElement("div");
      penalite.className = "historique-pastille pastille-penalite";

      const typePenalite = document.createElement("strong");
      typePenalite.className = "pastille-type";
      typePenalite.textContent = "Pén.";

      const nombrePenalites = document.createElement("span");
      nombrePenalites.className = "pastille-nombre";
      nombrePenalites.textContent = "× " + equipe.penalites;

      penalite.append(typePenalite, nombrePenalites);
      points.appendChild(penalite);

      contenu.append(nom, score, titrePoints, points);
      bloc.append(barreCouleur, contenu);

      return bloc;
    }

    scores.append(
      creerCarteEquipe(match.equipe1),
      creerCarteEquipe(match.equipe2)
    );

    const details = document.createElement("div");
    details.className = "resultat-detail";

    const duree = document.createElement("span");
    duree.textContent = "⏱ Durée : " + match.duree;

    details.appendChild(duree);

    const pied = document.createElement("div");
    pied.className = "resultat-match-pied";

    const supprimer = document.createElement("button");
    supprimer.className = "btn-supprimer-match";
    supprimer.textContent = "Supprimer";
    supprimer.addEventListener("click", () => supprimerMatch(index));

    pied.appendChild(supprimer);

    carte.append(entete, scores, details, pied);
    conteneur.appendChild(carte);
  });
}

function supprimerMatch(index) {
  if (!confirm("Supprimer définitivement ce match de l'historique ?")) {
    return;
  }

  const historique = recupererHistorique();
  historique.splice(index, 1);

  sauvegarderHistorique(historique);
  afficherHistorique();
}

document.getElementById("effacerHistorique").addEventListener("click", () => {
  const historique = recupererHistorique();

  if (historique.length === 0) return;

  if (!confirm("Veux-tu vraiment supprimer tout l'historique des matchs ?")) {
    return;
  }

  sauvegarderHistorique([]);
  afficherHistorique();
});

// =====================================
// INITIALISATION
// =====================================

afficherTemps();
afficherHistorique();
afficherPenalites();

document.getElementById("maillot1")
  .style.setProperty("--couleur-maillot", equipes[1].couleur);

document.getElementById("maillot2")
  .style.setProperty("--couleur-maillot", equipes[2].couleur);
