import React, { Component } from "react";
import { Offcanvas, Row, Col, Button } from "react-bootstrap";
// import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFilePen } from "@fortawesome/free-solid-svg-icons";

import style from "./style.module.css";

export default class RecipeCanvas extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      recipe: {
        id: "",
        name: "",
        description: "",
        image: "",
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
          <Row className="h-100">
            <Col md={6}>
              <pre className={style.descriptionbox}>
                {this.state.recipe.description}
              </pre>
              <div className="text-center">
                <Button
                  className="m-1"
                  size="sm"
                  variant="outline-secondary"
                  onClick={() =>
                    this.props.toggleModal(true, this.state.recipe)
                  }
                >
                  <FontAwesomeIcon icon={faFilePen} />
                </Button>
                <Button
                  className="m-1"
                  size="sm"
                  variant="outline-danger"
                  onClick={() => this.props.deleteRecipe(this.state.recipe.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
              <hr />
              <small>Notes work in progress</small>
            </Col>
            <Col>
              <div className={style.ingredientsbox}>
                <small>Ingredients work in progress</small>
              </div>
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    );
  }
}
