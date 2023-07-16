"use client";

import React, { Component } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import RecipeList from "./components/RecipeList";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: {
        text: "",
      },
      recipes: [],
    };

    this.updateSearchText = this.updateSearchText.bind(this);
  }

  updateSearchText(e) {
    let { search } = this.state;
    search.text = e.target.value;
    this.setState({ ...this.state, search });
  }

  render() {
    return (
      <div>
        <div className="d-flex align-items-center justify-content-center">
          <div className="me-1 w-50">
            <InputGroup>
              <FormControl
                placeholder="Search"
                value={this.state.search.text}
                onChange={this.updateSearchText}
                required={true}
              />
              {/* <Button variant="primary" type="submit">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </Button> */}
            </InputGroup>
          </div>
          <div className="ms-1">
            <Button size="sm" variant="primary">
              <FontAwesomeIcon icon={faPlus} />
              <span className="ms-1">Add New Recipe</span>
            </Button>
          </div>
        </div>
        <br />
        <div>
          <RecipeList recipes={this.state.recipes} />
        </div>
      </div>
    );
  }
}
