"use client";

import React, { Component } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  // faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  collection,
  query,
  doc,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import swal from "sweetalert";

import { loadFromLocalStorage } from "@/localStorage";

import { db } from "../page";

import RecipeList from "./components/RecipeList";
import RecipeModal from "./components/RecipeModal";
import RecipeCanvas from "./components/RecipeCanvas";

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
      canvas: {
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
    this.deleteRecipe = this.deleteRecipe.bind(this);
    this.getRecipeList = this.getRecipeList.bind(this);
    this.updateFilterText = this.updateFilterText.bind(this);
    this.toggleRecipeModal = this.toggleRecipeModal.bind(this);
    this.toggleRecipeCanvas = this.toggleRecipeCanvas.bind(this);
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

  toggleRecipeCanvas(show, data) {
    let { canvas } = this.state;

    canvas.show = show;
    data
      ? (canvas.data = data)
      : (canvas.data = JSON.parse(JSON.stringify(RECIPE_DUMMY_DATA)));

    this.setState({ ...this.state, canvas });
  }

  getRecipeList() {
    let { filter, recipes } = this.state;
    return recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(filter.text.toLowerCase())
    );
  }

  deleteRecipe(id) {
    swal({
      title: "Are you sure you want to delete this recipe?",
      text: "This action cannot be undone!",
      icon: "warning",
      dangerMode: true,
      buttons: {
        confirm: {
          text: "Yes, Delete this recipe",
          value: true,
          visible: true,
        },
        cancel: {
          text: "No, cancel",
          value: false,
          visible: true,
        },
      },
    }).then(async (value) => {
      if (value) {
        const deleteToastID = toast.loading("Deleting...");
        try {
          await deleteDoc(doc(this.db, "recipes", id));
          toast.success("Recipe deleted");

          this.loadRecipes();
        } catch (err) {
          console.log("ERROR", err);
          toast.error("Something went wrong. Please try again.");
        }
        toast.dismiss(deleteToastID);
      }
    });
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
          <RecipeList
            recipes={this.getRecipeList()}
            deleteRecipe={this.deleteRecipe}
            loadRecipes={this.loadRecipes}
            toggleCanvas={this.toggleRecipeCanvas}
          />
        </div>
        <RecipeModal
          show={this.state.modal.show}
          recipe={this.state.modal.data}
          fetch={this.loadRecipes}
          toggle={this.toggleRecipeModal}
        />
        <RecipeCanvas
          show={this.state.canvas.show}
          recipe={this.state.canvas.data}
          fetch={this.loadRecipes}
          toggle={this.toggleRecipeCanvas}
        />
      </div>
    );
  }
}
