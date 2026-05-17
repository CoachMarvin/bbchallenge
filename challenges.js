// Start-Daten für die Liste
const alleChallenges = [
	{ titel: "100 schnelle Hampelmänner", beschreibung: "Mache 100 Hampelmänner soschnell du kannst!" },
	{ titel: "Liegestütz-König", beschreibung: "Wie viele saubere Liegestütze schaffst du in einer Minute?" }
];

const listeContainer = document.getElementById('challenges-liste');
const deineTelefonnummer = "49015755821997"; //Telefonnumer für Einsendungen

//Challenges auf der Seite zeichnen
function challengesAnzeigen() {
	if (!listeContainer) return;
	listeContainer.innerHTML = "";
	
	alleChallenges.forEach(challenge => {
		const textFürWhatsApp = encodeURIComponent(`Hi Coach! Ich habe die Challenge "${challenge.titel}" absolviert. Hier ist mein Video:`);
		const whatsappURL = `https://wa.me/${deineTelefonnummer}?text=${textFürWhatsApp}`;
		
		const karteHTML = `
			<div class="challenge-card">
				<h3>${challenge.titel}</h3>
				<p>${challenge.beschreibung}</p>
				<a href="${whatsappURL}" target="_blank" class="btn-login-nav btn-whatsapp">Video auf Whatsapp senden</a>
			</div>
		`;
		listeContainer.innerHTML += karteHTML;
	});
}

//Sofort beim Laden ausführen
challengesAnzeigen();

//Admin-Schutz
const aktuellEingeloggt = localStorage.getItem('angemeldeterUser');
const adminForm = document.getElementById('challenge-admin-form');

if (aktuellEingeloggt && aktuellEingeloggt.toLowerCase() === "admin") {
	if (adminForm) {
		adminForm.style.setProperty('display', 'flex', 'important');
	}
}

//Neue Challenge hinzufügen
const btnErstellen = document.getElementById('btn-challenge-erstellen');
if (btnErstellen) {
	btnErstellen.addEventListener('click', () => {
		const titelInput = document.getElementById('challenge-titel').value.trim();
		const beschreibungsInput = document.getElementById('challenge-beschreibung').value.trim();
		
		if (titelInput !== "" && beschreibungsInput !== "") {
			alleChallenges.push({
				titel: titelInput,
				beschreibung: beschreibungsInput
			});
			
			//Felder leeren und Liste neu Laden
			document.getElementById('challenge-titel').value = "";
			document.getElementById('challenge-beschreibung').value = "";
			challengesAnzeigen();
		}
	});
}