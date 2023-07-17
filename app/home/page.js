"use client";

import React, { Component } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { collection, query, where, getDocs } from "firebase/firestore";

import { loadFromLocalStorage } from "@/localStorage";

import { db } from "../page";

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
      filter: {
        text: "",
      },
      recipes: [],
      modal: {
        show: false,
        data: {
          id: "",
          name: "",
          description: "",
          icon: "",
          theme: "",
        },
      },
    };

    this.db = db;

    this.auth = loadFromLocalStorage("auth");

    this.loadRecipes = this.loadRecipes.bind(this);
    this.getRecipeList = this.getRecipeList.bind(this);
    this.updateFilterText = this.updateFilterText.bind(this);
    this.toggleRecipeModal = this.toggleRecipeModal.bind(this);
  }

  componentDidMount() {
    const toastID = toast.loading("Fetching your recipes");
    this.loadRecipes(toastID);
  }

  async loadRecipes(toastID = null) {
    if (!toastID) toast.loading("Fetching your recipes");

    let userID = this.auth.user.uid;
    let { recipes } = this.state;

    recipes = [];

    let q = query(collection(this.db, "recipes"), where("user", "==", userID));

    let recipeDoc = await getDocs(q);

    recipeDoc.forEach((recipe) =>
      recipes.push({ id: recipe.id, ...recipe.data() })
    );

    this.setState({ ...this.state, recipes }, () => toast.dismiss(toastID));
  }

  updateFilterText(e) {
    let { filter } = this.state;
    filter.text = e.target.value;
    this.setState({ ...this.state, filter });
  }

  toggleRecipeModal(show) {
    let { modal } = this.state;

    modal.show = show;
    modal.data = JSON.parse(JSON.stringify(RECIPE_DUMMY_DATA));

    this.setState({ ...this.state, modal });
  }

  getRecipeList() {
    let { filter, recipes } = this.state;
    return recipes.filter((recipe) => recipe.name.includes(filter.text));
  }

  render() {
    return (
      <div>
        <div className="d-flex align-items-center justify-content-center">
          <div className="me-1 w-50">
            <InputGroup>
              <FormControl
                placeholder="Filter"
                value={this.state.filter.text}
                onChange={this.updateFilterText}
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
              onClick={() => this.toggleRecipeModal(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
              <span className="ms-1">Add New Recipe</span>
            </Button>
          </div>
        </div>
        <br />
        <div>
          <RecipeList recipes={this.getRecipeList()} />
        </div>
        <RecipeModal
          show={this.state.modal.show}
          recipe={this.state.modal.data}
          fetch={this.loadRecipes}
          toggle={this.toggleRecipeModal}
        />
      </div>
    );
  }
}
