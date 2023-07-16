import React, { Component } from "react";

import { Modal, Form, Button } from "react-bootstrap";
import toast from "react-hot-toast";

export default class RecipeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      add: false,
      recipe: {
        id: "",
        name: "",
        description: "",
        icon: "",
        theme: "",
      },
    };

    this.addFormSubmit = this.addFormSubmit.bind(this);
  }

  componentDidUpdate() {
    let { show, add, recipe } = this.state;

    if (show !== this.props.show)
      this.setState({ ...this.state, show: this.props.show });

    if (add !== this.props.add)
      this.setState({ ...this.state, add: this.props.add });

    if (recipe !== this.props.recipe)
      this.setState({ ...this.state, recipe: this.props.recipe });
  }

  addFormSubmit(e) {
    e.preventDefault();

    toast.success("Shaka Laka Boom Boooom");
  }

  addForm = () => (
    <Form onSubmit={this.addFormSubmit}>
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
        <Button type="submit" variant="success" className="w-100">
          Add
        </Button>
      </div>
    </Form>
  );

  recipeDetail = () => <div></div>;

  render() {
    return (
      <Modal
        size="lg"
        backdrop="static"
        keyboard={false}
        show={this.state.show}
        onHide={() => this.props.toggle(false, false, null)}
      >
        <Modal.Header onClo closeButton={true}>
          <Modal.Title>
            {this.state.add ? "Add New Recipe" : this.state.recipe.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.state.add ? this.addForm() : this.recipeDetail()}
        </Modal.Body>
      </Modal>
    );
  }
}
