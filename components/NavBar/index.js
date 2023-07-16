"use client";

import React, { Component, createRef } from "react";
import Link from "next/link";
import Dropdown from "react-bootstrap/Dropdown";

import { loadFromLocalStorage } from "@/localStorage";

import style from "./style.module.css";

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
          <h4>Pantry</h4>
        </div>
        <div>
          <small>Work in Progress</small>
        </div>
        <div>
          <Link href={"/"} className="next-router-link" ref={this.homeRouter} />
          <Dropdown>
            <Dropdown.Toggle variant="text" id="dropdown-basic">
              {this.state.user.displayName}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as="button" onClick={this.logOut}>
                Log Out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    );
  }
}
