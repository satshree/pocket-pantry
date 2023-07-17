"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
// import Head from "next/head";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import toast from "react-hot-toast";

import { saveToLocalStorage, loadFromLocalStorage } from "@/localStorage";

import bbq from "../assets/img/bbq.svg";
import google from "../assets/icons/google.png";

// FIREBASE
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const homePageURL = "/home";

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export default function Home() {
  const homeRouterLink = useRef();

  function routeHome() {
    if (homeRouterLink.current) {
      homeRouterLink.current.click();
    } else {
      useRouter().push(homePageURL);
    }
  }

  function signIn() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);

        appAuth = {
          token: credential.accessToken,
          user: result.user,
        };

        saveToLocalStorage("auth", appAuth);
        // toast.success("Login successful");
        routeHome();
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...

        console.log("ERROR", errorCode);
        console.log("ERROR", errorMessage);

        toast.error(errorMessage);
      });
  }

  let appAuth = loadFromLocalStorage("auth");

  if (appAuth) {
    routeHome();
  }

  const provider = new GoogleAuthProvider();
  const auth = getAuth(app);

  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <Link
        href={homePageURL}
        className="next-router-link"
        ref={homeRouterLink}
      />
      <div className="text-center">
        <h2>Pocket Pantry</h2>
        <div>A simple recipe organizer</div>
        <br />
        <br />
        <div>
          <Image src={bbq.src} height={200} width={200} alt="Cook Barbeque" />
        </div>
        <br />
        <br />
        <div>
          <button
            className="btn btn-block btn-outline-primary"
            onClick={signIn}
          >
            <div className="w-100 d-flex align-items-center justify-content-between">
              <Image src={google.src} height={20} width={20} alt="Google" />
              <div className="ms-2">Continue with Google</div>
            </div>
          </button>
        </div>
        <br />
        <br />
        <small>
          Made by
          <Link
            href="https://satshree.com.np"
            style={{ marginLeft: "5px" }}
            target="_blank"
          >
            Satshree Shrestha
          </Link>
        </small>
      </div>
    </div>
  );
}
