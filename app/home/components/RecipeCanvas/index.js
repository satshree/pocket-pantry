import React, { Component } from "react";
import {
  Offcanvas,
  Row,
  Col,
  // Button
} from "react-bootstrap";
// import { toast } from "react-hot-toast";

export default class RecipeCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      recipe: {
        id: "",
        name: "",
        description: "",
        icon: "",
        theme: "",
      },
    };
  }

  componentDidUpdate() {
    let { show, recipe } = this.state;

    if (show !== this.props.show)
      this.setState({ ...this.state, show: this.props.show });

    if (recipe !== this.props.recipe)
      this.setState({ ...this.state, recipe: this.props.recipe });
  }

  render() {
    return (
      <Offcanvas
        show={this.state.show}
        onHide={() => this.props.toggle(false, this.props.recipe)}
        onExited={() => {
          this.props.toggle(false, {
            id: "",
            name: "",
            description: "",
            icon: "",
            theme: "",
          });
        }}
        style={{ height: "90%" }}
        placement="bottom"
      >
        <Offcanvas.Header closeButton={true}>
          <Offcanvas.Title>{this.state.recipe.name}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Row>
            <Col md={4}>
              <p>{this.state.recipe.description}</p>
              <hr />
              <small>Notes work in progress</small>
            </Col>
            <Col>
              <small>Ingredients work in progress</small>
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    );
  }
}
