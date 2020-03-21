import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/firebase-firestore'

// Your web app's Firebase configuration
const config = {
    apiKey: "AIzaSyAh7Uzbs4hf6wG8XnChWu5Teklx7dFxQDE",
    authDomain: "recomendap.firebaseapp.com",
    databaseURL: "https://recomendap.firebaseio.com",
    projectId: "recomendap",
    storageBucket: "recomendap.appspot.com",
    messagingSenderId: "179207870667",
    appId: "1:179207870667:web:951c91860c6a5a410b634e",
    measurementId: "G-SJZCHRBXYQ"
};

class Firebase {
	constructor() {
		app.initializeApp(config)
		this.auth = app.auth()
		this.db = app.firestore()
	}

	login(email, password) {
		return this.auth.signInWithEmailAndPassword(email, password)
	}

	logout() {
		return this.auth.signOut()
	}

	async register(name, email, password) {
		await this.auth.createUserWithEmailAndPassword(email, password)
		return this.auth.currentUser.updateProfile({
			displayName: name
		})
	}

	addQuote(quote) {
		if(!this.auth.currentUser) {
			return alert('Not authorized')
		}

		return this.db.doc(`users_codedamn_video/${this.auth.currentUser.uid}`).set({
			quote
		})
	}

	isInitialized() {
		return new Promise(resolve => {
			this.auth.onAuthStateChanged(resolve)
		})
	}

	getCurrentUsername() {
		return this.auth.currentUser && this.auth.currentUser.displayName
	}

	async getCurrentUserQuote() {
		const quote = await this.db.doc(`users_codedamn_video/${this.auth.currentUser.uid}`).get()
		return quote.get('quote')
	}
}

export default new Firebase()