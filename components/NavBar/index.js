"use client";

import React, { Component, createRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  // Dropdown,
  Button,
} from "react-bootstrap/";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

import { loadFromLocalStorage } from "@/localStorage";

import style from "./style.module.css";

import logo from "@/assets/img/cooking.png";

export default class NavBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    };

    this.homeRouter = createRef();

    this.logOut = this.logOut.bind(this);
  }

  componentDidMount() {
    let authUser = loadFromLocalStorage("auth");
    if (authUser) {
      this.setState({ ...this.state, user: authUser.user });
    } else {
      this.homeRouter.current && this.homeRouter.current.click();
    }
  }

  logOut() {
    localStorage.removeItem("auth");
    this.homeRouter.current.click();
  }

  render() {
    return (
      <div className={style.navbar}>
        <div>
          <Image src={logo.src} height={50} width={50} alt="pantry" />
        </div>
        <div className="text-center">
          <h5 className={style.welcomenote}>
            Welcome to your Pantry, <span>{this.state.user.displayName}</span>
          </h5>
        </div>
        <div>
          <Link href={"/"} className="next-router-link" ref={this.homeRouter} />
          <Button variant="danger" size="sm" onClick={this.logOut}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            <span className="ms-2 hide-on-mobile">Log Out</span>
          </Button>
        </div>
      </div>
    );
  }
}
