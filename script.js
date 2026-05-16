// Die Master Liste mit allen Spielern
const alleSpieler = [
	{ name: "Spieler 5", punkte: 120 },
	{ name: "Marvin", punkte: 500 },
	{ name: "Spieler 3", punkte: 200 },
	{ name: "Spieler 4", punkte: 600 },
	{ name: "Spieler 2", punkte: 350 },
	{ name: "Spieler 6", punkte: 95 },
	{ name: "Spieler 7", punkte: 70 }
];


//Die HTML aus der index greifen
const podiumContainer = document.querySelector('.podium-container');
const listeContainer = document.querySelector('.liste-container');

function rankingAnzeigen() {
	//Liste nach Punkten sortieren
	alleSpieler.sort((a, b) => b.punkte - a.punkte);
	
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
	
	//Untere Liste befüllen ab Platz 4
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
}

//Beim allerersten Laden der Seite die Maschine einmal starten
rankingAnzeigen();

//Den Button aktivieren
const btnSpeichern = document.getElementById('btn-speichern');

btnSpeichern.addEventListener('click', () => {
	//Werte aus den Eingabefeldern holen
	const nameInput = document.getElementById('input-name').value.trim();
	const punkteInput = document.getElementById('input-punkte').value;
	
	//Sicherheitsprüfung
	if (nameInput !== "" && punkteInput !=="") {
		const neuePunkte = parseInt(punkteInput);
		
		//Suche nach Namen, ignoriere groß und kleinschreibung
		const bestehenderSpieler = alleSpieler.find(
			spieler => spieler.name.toLowerCase() === nameInput.toLowerCase()
		);
		
		if (bestehenderSpieler) {
			bestehenderSpieler.punkte = neuePunkte;
		} else {
			alleSpieler.push({
				name: nameInput,
				punkte: neuePunkte
			});
		}
		
		//Eingabefelder wieder leer machen
		document.getElementById('input-name').value = "";
		document.getElementById('input-punkte').value = "";
		
		//Die Maschine neu sortieren und eintragen lassen
		rankingAnzeigen()
	}
});