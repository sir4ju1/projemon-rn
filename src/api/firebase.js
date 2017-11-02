import firebase from 'firebase'

const config = {
  apiKey: "AIzaSyA_PkgNA3gTzteEV_3R_M4h8AzRXMbhbFk",
  authDomain: "tfs-explorer.firebaseapp.com",
  databaseURL: "https://tfs-explorer.firebaseio.com",
  projectId: "tfs-explorer",
  storageBucket: "tfs-explorer.appspot.com",
  // messagingSenderId: "706104839734"
}

firebase.initializeApp(config)

export default firebase
