//Firebase Module direkt aus dem Internet laden
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Exakte Firebase Konfiguration
const firebaseConfig = {
    apiKey: "AIzaSyCG-yi8KlJPlDvVTNJEoM3aTa-_O7jP9Rk",
    authDomain: "basketball-leaderboard-sieglar.firebaseapp.com",
    projectId: "basketball-leaderboard-sieglar",
    storageBucket: "basketball-leaderboard-sieglar.firebasestorage.app",
    messagingSenderId: "158682616904",
    appId: "1:158682616904:web:df76d3f6b67f3a7e35f47d",
    measurementId: "G-9DPK112PLB"
  };

//Firebase & Datenbank-Verbindung 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function liveRankingLaden() {
	const rankingQuery = query(collection(db, "leaderboard"), orderBy("punkte", "desc"));
	
	onSnapshot(rankingQuery, (snapshot) => {
		const alleSpieler = [];
		snapshot.forEach((doc) => {
		alleSpieler.push(doc.data());
	});
		//Podium befüllen
	const p1 = alleSpieler[0];
	const p2 = alleSpieler[1];
	const p3 = alleSpieler[2];
	
	if (p1 && p2 && p3) {
		podiumContainer.innerHTML = `
			<div class="podium-platz rank-2">
				<span class="spieler-name">${p2.name}</span>
				<div class="stufe">2</div>
				<span class="spieler-punkte">${p2.punkte}</span>
			</div>
			<div class="podium-platz rank-1">
				<span class="spieler-name">${p1.name}</span>
				<div class="stufe">1</div>
				<span class="spieler-punkte">${p1.punkte}</span>
			</div>
			<div class="podium-platz rank-3">
				<span class="spieler-name">${p3.name}</span>
				<div class="stufe">3</div>
				<span class="spieler-punkte">${p3.punkte}</span>
			</div>
		`;
	}
	
	if (listeContainer) {
		listeContainer.innerHTML = "";
		
		alleSpieler.forEach((spieler, index) => {
			if (index >= 3) {
				const platzierung = index + 1;
				const karteHTML = `
					<div class="player-card">
						<span class="liste-rank">${platzierung}</span>
						<span class="liste-name">${spieler.name}</span>
						<span class="liste-punkte">${spieler.punkte}</span>
					</div>
				`;
				listeContainer.innerHTML += karteHTML;
			}
		});
	}
});
}

liveRankingLaden();

//Den Button aktivieren
const btnSpeichern = document.getElementById('btn-speichern');

btnSpeichern.addEventListener('click', async () => {
	//Werte aus den Eingabefeldern holen
	const nameInput = document.getElementById('input-name');
	const punkteInput = document.getElementById('input-punkte');
	
	const name = nameInput.value.trim();
	
	const punkte = parseInt(punkteInput.value, 10);
	//Sicherheitsprüfung
	if (!name || isNaN(punkte)) {
		alert("Bitte gib einen gültigen Namen und Punkte ein!");
		return;
	}
	
	try {
		await addDoc(collection(db, "leaderboard"), {
			name: name,
			punkte: punkte,
			eingetragenAm: new Date()
		});
		
		nameInput.value = "";
		punkteInput.value ="";
		
		console.log("Spieler erfolgreich ins Leaderboard eingetragen!");
	} catch (fehler) {
		console.error("Fehler beim Speichern des Spielers:", fehler);
		alert("Fehler beim Eintragen ins Leaderboard!");
	}
});

//Admin Bereich
//Hintergrundprüfung wer angemeldet ist
const aktuellEingeloggt = localStorage.getItem('angemeldeterUser');
const authBereich = document.getElementById('nav-auth-bereich');

if (aktuellEingeloggt && aktuellEingeloggt.toLowerCase() === "admin") {
	const formContainer = document.querySelector('.form-container');
	if (formContainer) {
		//Formular als Admin anzeigen
		formContainer.style.display = "flex";
	}
	
	if (authBereich) {
		authBereich.innerHTML =`
			<a href="profil.html" class="btn-login-nav" style="background-color: #e50914; border-color: #e50914;">Admin-Modus aktiv.</a>
		`;
	}
	console.log("Admin-Modus über Login aktiv.");
	
} else if (aktuellEingeloggt) {
	if (authBereich) {
		authBereich.innerHTML = `
			<a href="profil.html" class="btn-login-nav">
				Angemeldet als ${aktuellEingeloggt} (Profil)
			</a>
		`;
	}
}