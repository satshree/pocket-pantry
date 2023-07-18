import React, { Component } from "react";

import { Modal, Form, Button } from "react-bootstrap";
import toast from "react-hot-toast";
import { addDoc, setDoc, collection, doc } from "firebase/firestore";

import { db } from "@/app/page";
import { loadFromLocalStorage } from "@/localStorage";

export default class RecipeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      progress: false,
      recipe: {
        name: "",
        description: "",
        icon: "",
        theme: "",
      },
    };

    this.formSubmit = this.formSubmit.bind(this);
  }

  componentDidUpdate() {
    let { show, recipe } = this.state;

    if (show !== this.props.show)
      this.setState({ ...this.state, show: this.props.show });

    if (recipe !== this.props.recipe)
      this.setState({ ...this.state, recipe: this.props.recipe });
  }

  async formSubmit(e) {
    e.preventDefault();

    let { recipe } = this.state;

    this.setState({ ...this.state, progress: true });
    const toastID = toast.loading(
      this.props.edit ? "Updating the recipe..." : "Adding new recipe ..."
    );

    let userID = loadFromLocalStorage("auth").user.uid;
    try {
      let recipeID = recipe["id"];
      delete recipe["id"];

      if (this.props.edit) {
        await setDoc(doc(db, "recipes", recipeID), {
          ...recipe,
          user: userID,
        });
      } else {
        await addDoc(collection(db, "recipes"), {
          ...recipe,
          user: userID,
        });
      }

      toast.success(this.props.edit ? "Recipe updated!" : "New recipe added!", {
        id: toastID,
      });

      this.setState({ ...this.state, progress: false });

      const fetchToastID = toast.loading("Fetching your recipes");
      this.props.fetch(fetchToastID);

      this.props.toggle(false);
    } catch (err) {
      console.log("ERROR", err);
      this.setState({ ...this.state, progress: false });

      toast.error("Something went wrong. Please try again", {
        id: toastID,
      });
    }
  }

  render() {
    return (
      <Modal
        size="lg"
        backdrop="static"
        keyboard={false}
        show={this.state.show}
        onHide={() =>
          this.props.toggle(false, this.props.edit ? this.state.recipe : null)
        }
        onExited={() => this.props.toggle(false, null)}
        centered={true}
      >
        <Modal.Header closeButton={!this.state.progress}>
          <Modal.Title>
            {this.props.edit ? "Edit Recipe" : "Add New Recipe"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.formSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                Name<span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                placeholder="Recipe Name"
                value={this.state.recipe.name}
                onChange={(e) => {
                  let { recipe } = this.state;
                  recipe.name = e.target.value;
                  this.setState({ ...this.state, recipe });
                }}
                required={true}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                placeholder="Recipe Description"
                value={this.state.recipe.description}
                onChange={(e) => {
                  let { recipe } = this.state;
                  recipe.description = e.target.value;
                  this.setState({ ...this.state, recipe });
                }}
                rows={3}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Icon</Form.Label>
              <Form.Control placeholder="Work in Progress" disabled={true} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Theme</Form.Label>
              <Form.Control placeholder="Work in Progress" disabled={true} />
            </Form.Group>
            <hr />
            <div className="text-center">
              <Button
                type="submit"
                variant="success"
                className="w-100"
                disabled={this.state.progress}
              >
                {this.state.progress ? (
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                ) : this.props.edit ? (
                  "Save changes"
                ) : (
                  "Add"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
