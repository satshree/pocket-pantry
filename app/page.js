"use client";
import Image from "next/image";
import Link from "next/link";
// import Head from "next/head";

import bbq from "../assets/img/bbq.svg";
import google from "../assets/icons/google.png";

export default function Home() {
  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
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
          <button className="btn btn-block btn-outline-primary">
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
