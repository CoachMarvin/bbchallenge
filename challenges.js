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

const listeContainer = document.getElementById('challenges-liste');
const deineTelefonnummer = "4915755821997"; //Telefonnumer für Einsendungen

//Challenges live laden und anzeigen
async function cloudChallengesLaden () {
	if (!listeContainer) return;
	listeContainer.innerHTML = '<p class="loading-text">Lade Challenges aus der Cloud...</p>';
	
	try {
		const q = query(collection(db, "challenges"));
		const querySnapshot = await getDocs(q);
		
		listeContainer.innerHTML = "";
		
		if (querySnapshot.empty) {
			listeContainer.innerHTML = '<p class="empty-text">Noch keine Challenges in der Cloud. Erstelle deine erste!</p>';
			return;
		}
		
		querySnapshot.forEach((doc) => {
			const challenge = doc.data();
			
			const textFürWhatsApp = encodeURIComponent(`Hi Coach! Ich habe die Challenge "${challenge.titel}" absolviert. Hier ist mein Video:`);
			const whatsappURL = `https://wa.me/${deineTelefonnummer}?text=${textFürWhatsApp}`;
			
			//HTML Gerüst
			const karteHTML = `
				<div class="challenge-card">
					<h3>${challenge.titel}</h3>
					<p>${challenge.beschreibung}</p>
					<a href="${whatsappURL}" target="_blank" class="btn-login-nav btn-whatsapp">Video auf Whatsapp senden</a>
				</div>
			`;
			listeContainer.innerHTML += karteHTML;
		});
	} catch (fehler) {
		console.error("Fehler beim Laden der Challenges: ", fehler);
		listeContainer.innerHTML = '<p class="error-text">Fehler beim Laden der Live-Daten</p>';
	}
}

//Sofort Live-Daten laden
cloudChallengesLaden();

//Admin Schutz
const aktuellEingeloggt = localStorage.getItem('angemeldeterUser');
const adminForm = document.querySelector('#challenge-admin-form');

if (aktuellEingeloggt && aktuellEingeloggt.toLowerCase() === "admin") {
	if (adminForm) {
		adminForm.style.setProperty('display', 'flex', 'important');
	}
}

//Neue Challenge in die Cloud hochladen
const btnErstellen = document.getElementById('btn-challenge-erstellen');
if (btnErstellen) {
	btnErstellen.addEventListener('click', async () => {
		const titelInput = document.querySelector('#challenge-titel').value.trim();
		const beschreibungsInput = document.querySelector('#challenge-beschreibung').value.trim();
		
		if (titelInput !== "" && beschreibungsInput !== "") {
			btnErstellen.innerText = "Speichert...";
			btnErstellen.disabled = true;
			
			try {
				await addDoc(collection(db, "challenges"), {
					titel: titelInput,
					beschreibung: beschreibungsInput,
					erstelltAm: newDate()
				});
				
				//Felder leeren, aktualisieren und zurücksetzen
				document.querySelector('#challenge-titel').value = "";
				document.querySelector('#challenge-beschreibung').value = "";
				btnErstellen.innerText = "Erstellen";
				btnErstellen.diabled = false;
				
				cloudChallenges();
			} catch (fehler) {
				console.error("Fehler beim Speichern in der Cloud: ", fehler);
				alert("Fehler beim Speichern der Challenge!");
				btnErstellen.innerText = "Erstellen";
				btnErstellen.disabled = false;
			}
		}
	});
}