import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {  GoogleAuthProvider } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCNXOwfNudf-UnfJ2GdtumFJMlwZzr41vQ",
  authDomain: "jujuy-97b1b.firebaseapp.com",
  databaseURL: "https://jujuy-97b1b.firebaseio.com",
  projectId: "jujuy-97b1b",
  storageBucket: "jujuy-97b1b.appspot.com",
  messagingSenderId: "690023851944",
  appId: "1:690023851944:web:90088fd8bf16ab0f0cdf9d",
  measurementId: "G-ZJ9BE7NTNB",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
// Inicializar Analytics (solo si el entorno es un navegador)
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { app, analytics,provider };
