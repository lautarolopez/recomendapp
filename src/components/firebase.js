import firebase from "firebase";
import app from "firebase/app";
import "firebase/auth";
import "firebase/firebase-firestore";

// Your web app's Firebase configuration
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  async loginWithGoogle() {
    let user;
    const provider = new firebase.auth.GoogleAuthProvider();
    await firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        user = result.user;
      })
      .catch(function (error) {});
    return user;
  }

  async loginWithFacebook() {
    let user;
    const provider = new firebase.auth.FacebookAuthProvider();
    await firebase
      .auth()
      .signInWithPopup(provider)
      .then(function (result) {
        user = result.user;
      })
      .catch(async function (error) {
        if (error.code === "auth/account-exists-with-different-credential") {
          let email = error.email;
          await firebase
            .auth()
            .fetchSignInMethodsForEmail(email)
            .then(async function (methods) {
              if (methods.includes("google.com")) {
                const provider = new firebase.auth.GoogleAuthProvider();
                await firebase
                  .auth()
                  .signInWithPopup(provider)
                  .then(function (result) {
                    user = result.user;
                  })
                  .catch(function (error) {
                    throw error;
                  });
              } else if (methods.includes("password")) {
                alert("Ingresa con tu correo y contraseña");
              }
            });
        }
      });
    return user;
  }

  showConfig() {
    console.log(config);
  }

  logout() {
    return this.auth.signOut();
  }

  async register(name, email, password) {
    await this.auth.createUserWithEmailAndPassword(email, password);
    return this.auth.currentUser.updateProfile({
      displayName: name,
    });
  }

  isInitialized() {
    return new Promise((resolve) => {
      this.auth.onAuthStateChanged(resolve);
    });
  }

  getCurrentUsername() {
    return this.auth.currentUser && this.auth.currentUser.displayName;
  }

  getCurrentUserId() {
    return this.auth.currentUser && this.auth.currentUser.uid;
  }

  getCurrentUserPhoto() {
    return this.auth.currentUser && this.auth.currentUser.photoURL;
  }

  async getUserAvatarWithId(id) {
    let aux;
    let user = this.db.collection("users").doc(id);
    await user.get().then((userDB) => {
      if (userDB.exists) {
        aux = userDB.data().photoURL;
      }
    });
    return aux;
  }

  async getUserDisplayNameWithId(id) {
    let aux;
    let user = this.db.collection("users").doc(id);
    await user.get().then((userDB) => {
      if (userDB.exists) {
        aux = userDB.data().displayName;
      }
    });
    return aux;
  }

  addNewUserToDatabase(photoURL, displayName) {
    if (this.auth.currentUser) {
      var user = this.db.collection("users").doc(this.auth.currentUser.uid);
      user.get().then((userDB) => {
        if (!userDB.exists) {
          this.db.collection("users").doc(this.auth.currentUser.uid).set({
            movies: [],
            series: [],
            photoURL: photoURL,
            displayName: displayName,
          });
        }
      });
    }
  }

  storeNewItemWithId(id, type) {
    let user = this.db.collection("users").doc(this.auth.currentUser.uid);
    user.get().then((userDB) => {
      if (userDB.exists) {
        let aux = userDB.data();
        if (type === "movies") {
          if (!aux.movies.includes(id)) {
            aux.movies.push(id);
          }
        } else if (type === "series") {
          if (!aux.series.includes(id)) {
            aux.series.push(id);
          }
        }
        this.db.collection("users").doc(this.auth.currentUser.uid).set(aux);
      }
    });
  }

  storeNewItem(item) {
    let user = this.db.collection("users").doc(this.auth.currentUser.uid);
    user.get().then((userDB) => {
      if (userDB.exists) {
        let aux = userDB.data();
        if (item.title) {
          if (!aux.movies.includes(item.id)) {
            aux.movies.push(item.id);
          }
        } else if (item.name) {
          if (!aux.series.includes(item.id)) {
            aux.series.push(item.id);
          }
        }
        this.db.collection("users").doc(this.auth.currentUser.uid).set(aux);
      }
    });
  }

  async userRecommendations() {
    let aux = [];
    let recommendations = this.db
      .collection("users")
      .doc(this.auth.currentUser.uid)
      .collection("recommendations");
    await recommendations.get().then((snapshot) => {
      snapshot.forEach((doc) => {
        aux.push({
          id: doc.id,
          data: doc.data(),
        });
      });
    });
    return aux;
  }

  async getUserLists(id) {
    let aux = {
      movies: [],
      series: [],
    };
    let user = this.db.collection("users").doc(id);
    await user.get().then((userDB) => {
      if (userDB.exists) {
        aux.movies = userDB.data().movies;
        aux.series = userDB.data().series;
      }
    });
    return aux;
  }

  removeItemFromList(itemId) {
    let user = this.db.collection("users").doc(this.auth.currentUser.uid);
    user.get().then((userDB) => {
      if (userDB.exists) {
        let aux = userDB.data();
        if (aux.movies.includes(itemId)) {
          aux.movies = aux.movies.filter((item) => {
            return item !== itemId;
          });
        } else if (aux.series.includes(itemId)) {
          aux.series = aux.series.filter((item) => {
            return item !== itemId;
          });
        }
        this.db.collection("users").doc(this.auth.currentUser.uid).set(aux);
      }
    });
  }
}

export default new Firebase();
