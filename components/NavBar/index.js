"use client";

import React, { Component, createRef } from "react";
import Link from "next/link";

import { loadFromLocalStorage } from "@/localStorage";

import style from "./style.module.css";

export default class NavBar extends Component {
  constructor() {
    super();

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
    location.reload(true);
  }

  render() {
    return (
      <div className={style.navbar}>
        <div></div>
        <div>
          {this.state.user.displayName}
          <Link href={"/"} className="next-router-link" ref={this.homeRouter} />
          <button onClick={this.logOut}>logout</button>
        </div>
      </div>
    );
  }
}
