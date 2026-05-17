//Firebase Module direkt aus dem Internet laden
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
  
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const btnLogin = document.getElementById('btn-login');
const errorAnzeige = document.getElementById('login-fehler');

if (btnLogin) {
	btnLogin.addEventListener('click', async () => {
		const email = document.getElementById('login-username').value.trim();
		const passwort = document.getElementById('login-password').value;
		
		if (errorAnzeige) errorAnzeige.style.display = "none";
		
		if (!email || !passwort) {
			alert("Bitte gib E-Mail und Passwort ein!");
			return;
		}
		
		try {
			//Googles sicherer login
			const userCredential = await signInWithEmailAndPassword(auth, email, passwort);
			const user = userCredential.user;
			
			//Merken wer angemeldet ist
			localStorage.setItem('angemeldeterUser', user.email);
			
			//Weiterleitung zum Profil
			window.location.href = "profil.html";
		} catch (error) {
			console.error("Login-Fehler:", error.code);
			
			if (errorAnzeige) {
				errorAnzeige.style.display = "block";
			}
		}
	});
}