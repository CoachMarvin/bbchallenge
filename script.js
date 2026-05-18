//Firebase Module direkt aus dem Internet laden
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, onSnapshot, orderBy, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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

const podiumContainer = document.querySelector('.podium-container');
const listeContainer = document.querySelector('.liste-container');

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


//Admin Bereich




//Admin Formular Logik

const spielerSelect = document.getElementById('admin-spieler-select');
const btnPunkteBuchen = document.getElementById('btn-punkte-buchen');
const btnSpielerAnlegen = document.getElementById('btn-spieler-anlegen');

// Spieler dynamisch ins Dropdown laden
onSnapshot(query(collection(db, "leaderboard"), orderBy("spielerName", "asc")), (snapshot) => {
	if (spielerSelect) {
		spielerSelect.innerHTML = '<option value="">-- Spieler auswählen --</option>';
		
		snapshot.forEach((docSnapshot) => {
			const spielerId = docSnapshot.id;
			const spielerDaten = docSnapshot.data();
			
			const option = document.createElement('option');
			option.value = spielerId;
			option.textContent = `${spielerDaten.spielerName} (Aktuell: ${spielerDaten.punkte})`;
			spielerSelect.appendChild(option);
		});
	}
});

//Neuen Spieler registrieren
if (btnSpielerAnlegen) {
	btnSpielerAnlegen.addEventListener('click', async () => {
		const neuerName = document.getElementById('admin-neu-name').value.trim();
		
		if (!neuerName) {
			alert("Bitte gib einen Namen ein!");
			return;
		}
		
		try {
			await addDoc(collection(db, "leaderboard"), {
				spielerName: neuerName,
				punkte: 0,
				erstelltAm: new Date()
			});
			
			document.getElementById('admin-neu-name').value = "";
			alert(`${neuerName} erfolgreich im System registriert!`);
		} catch (error) {
			console.error("Fehler beim Spieler anlegen:", error);
			alert("Fehler: Du musst als Admin eingeloggt sein!");
		}
	});
}

//Punkte draufrechnen + Historie speichern
if (btnPunkteBuchen) {
	btnPunkteBuchen.addEventListener('click', async () => {
		const ausgewaehlteId = spielerSelect.value;
		const punkteDazuInput = document.getElementById('admin-punkte-add').value;
		const punkteDazu = parseInt(punkteDazuInput);
		
		if (!ausgewaehlteId || isNaN(punkteDazu)) {
			alert("Bitte Spieler auswählen und gültige Punkte eintragen!");
			return;
		}
		
		try {
			const gewaehlteOption = spielerSelect.options[spielerSelect.selectedIndex];
			const vollerText = gewaehlteOption.textContent;
			const spielerName = collerText.split(' (')[0];
			
			const spielerRef = doc(db, "leaderboard", ausgewaehlteId);
			
			//Holt die aktuelle Zahl zur Berechnung
			const aktuellerStand = parseInt(vollerText.match(/\d+/)[0]) || 0;
			const neuerStand = aktuellerStand + punkteDazu;
			
			//In Firebase den Gesamtstand erhöhen
			await updateDoc(spielerRef, {
				punkte: neuerStand
			});
			
			//Fürs Monats Ranking
			await addDoc(collection(db, "punkte_historie"), {
				spielerId: ausgewaehlteId,
				spielerName: spielerName,
				punkteGegeben: punkteDazu,
				gebuchtAm: new Date()
			});
			
			document.getElementById('admin-punkte-add').value = "";
			alert(`Erfolgreich! ${punkteDazu} Punkte auf das Konto von ${spielerName} gebucht.`);
		} catch (error) {
			console.error("Fehler beim Punkte buchen:", error);
			alert("Fehler beim Buchen. Bist du einmmgeloggt?");
		}
	});
}

//prüfen ob Admin eingeloggt
const auth = getAuth(app);
const adminForm = document.getElementById('admin-eintrag-form');
const authBereich = document.getElementById('nav-auth-bereich');

onAuthStateChanged(auth, (user) => {
	if (user) {
		console.log("Hintergrund-Check: Admin ist eingeloggt!");
		
		if (adminForm){
			adminForm.style.display = "flex";
		}
		
		if (authBereich) {
			authBereich.innerHTML = `
				<a href="profil.html" class="btn-login-nav" style="background-color: #e50914; border-color: #e50914;">Admin-Modus aktiv</a>
			`;
		}
	} else {
		console.log("Hintergrund-Check: Kein Admin eingeloggt.");
		
		if (adminForm) {
			adminForm.style.display = "none";
		}
		
		if (authBereich) {
			authBereich.innerHTML = `
				<a href="login.html" class="btn-login-nav">Admin Login</a>
			`;
		}
	}
});