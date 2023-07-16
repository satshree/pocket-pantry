"use client";

import React, { Component } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import RecipeList from "./components/RecipeList";
import RecipeModal from "./components/RecipeModal";

const RECIPE_DUMMY_DATA = {
  id: "",
  name: "",
  description: "",
  icon: "",
  theme: "",
};

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: {
        text: "",
      },
      recipes: [],
      modal: {
        show: false,
        add: false,
        data: {
          id: "",
          name: "",
          description: "",
          icon: "",
          theme: "",
        },
      },
    };

    this.updateSearchText = this.updateSearchText.bind(this);
    this.toggleRecipeModal = this.toggleRecipeModal.bind(this);
  }

  updateSearchText(e) {
    let { search } = this.state;
    search.text = e.target.value;
    this.setState({ ...this.state, search });
  }

  toggleRecipeModal(show, add, data) {
    let { modal } = this.state;

    if (add) {
      toast("This is a work in progress.");
    }

    modal.show = show;
    modal.add = add;

    data
      ? (modal.recipe = data)
      : (modal.recipe = JSON.parse(JSON.stringify(RECIPE_DUMMY_DATA)));

    this.setState({ ...this.state, modal });
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
            <Button
              size="sm"
              variant="primary"
              onClick={() => this.toggleRecipeModal(true, true, null)}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span className="ms-1">Add New Recipe</span>
            </Button>
          </div>
        </div>
        <br />
        <div>
          <RecipeList recipes={this.state.recipes} />
        </div>
        <RecipeModal
          show={this.state.modal.show}
          add={this.state.modal.add}
          recipe={this.state.modal.data}
          toggle={this.toggleRecipeModal}
        />
      </div>
    );
  }
}
