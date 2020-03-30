import firebase from "firebase";
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

	async loginWithGoogle(){
		const provider = new firebase.auth.GoogleAuthProvider();
		await firebase.auth().signInWithPopup(provider).then(function(result) {
		  }).catch(function(error) {
			if (error.code === 'auth/account-exists-with-different-credential'){
				let pendingCred = error.credential;
				let email = error.email;
				this.auth.fetchSingInMethodsForEmail(email).then(function(methods){
					console.log(methods)
					console.log(pendingCred)
				})
			}
		  });
	}

	async loginWithFacebook(){
		const provider = new firebase.auth.FacebookAuthProvider();
		await firebase.auth().signInWithPopup(provider).then(function(result) {
			console.log(result)
		})
		.catch(async function(error) {
			if (error.code === 'auth/account-exists-with-different-credential'){
				let email = error.email;
				await firebase.auth().fetchSignInMethodsForEmail(email).then(async function(methods){
					if (methods.includes('google.com')){
						const provider = new firebase.auth.GoogleAuthProvider();
						await firebase.auth().signInWithPopup(provider).then(function(result) {
		  				}).catch(function(error) {
							  throw error;
						  })
					} else if (methods.includes('password')) {
							alert("Ingresa con tu correo y contraseña")
					}
		  		});
			}
		})
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

	isInitialized() {
		return new Promise(resolve => {
			this.auth.onAuthStateChanged(resolve)
		})
	}

	getCurrentUsername() {
		return this.auth.currentUser && this.auth.currentUser.displayName
	}

	addNewUserToDatabase(){
		if (this.auth.currentUser){
			var user = this.db.collection('users').doc(this.auth.currentUser.uid);
			user.get().then( userDB => {
								if (!userDB.exists) {
									this.db.collection('users').doc(this.auth.currentUser.uid).set({
										movies: [],
										series: []
									})
								}
							}
			)
		}
	}

	storeNewItem(item){
		let user = this.db.collection('users').doc(this.auth.currentUser.uid);
		user.get().then(userDB => {
							 if (userDB.exists) {
								let aux = userDB.data()
								if (item.title){
									if (!aux.movies.includes(item.id)){ 
										aux.movies.push(item.id)
									}	
								} else if (item.name) { 
									if (!aux.series.includes(item.id)){ 
										aux.series.push(item.id)
									}
								}
				 			 	this.db.collection('users').doc(this.auth.currentUser.uid).set(aux)
			 				 }
		 				}
						)
		
	}

	async getUserLists(id){
		let aux = {
			movies: [],
			series: []
		}
		let user = this.db.collection('users').doc(id);
		await user.get().then( userDB => {
							 if (userDB.exists) {
								 aux.movies = userDB.data().movies
								 aux.series = userDB.data().series
			 				 }
		 				}
						)
						return aux
		}


}

export default new Firebase()