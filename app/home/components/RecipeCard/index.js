import React, { Component, createRef } from "react";

import { Card } from "react-bootstrap";

import style from "./style.module.css";

import def from "@/assets/img/defaultimg.jpg";

export default class RecipeCard extends Component {
  constructor(props) {
    super(props);

    this.header = createRef();
  }

  componentDidMount() {
    if (this.header.current) {
      this.header.current.style.backgroundImage = `url(${
        this.props.recipe.image || def.src
      })`;
    }
  }

  componentDidUpdate() {
    if (this.header.current) {
      this.header.current.style.backgroundImage = `url(${
        this.props.recipe.image || def.src
      })`;
    }
  }

  getDescription = () => {
    let description = this.props.recipe.description;

    if (description.length < 100) {
      return description;
    } else {
      return `${description.slice(0, 100)}......`;
    }
  };
  render() {
    return (
      <div className={style.recipecard}>
        <Card className={style.card}>
          <Card.Header ref={this.header} className={style.recipecardheader}>
            <div
              className={style.tint}
              onClick={() => this.props.toggleCanvas(true, this.props.recipe)}
            />
            <div
              className="d-flex align-items-center justify-content-between w-100 h-100"
              onClick={() => this.props.toggleCanvas(true, this.props.recipe)}
              style={{ zIndex: 1 }}
            >
              <div
                className={`${style.recipecardbody} w-75`}
                style={{ zIndex: 1 }}
              >
                <Card.Title>{this.props.recipe.name}</Card.Title>
              </div>
              {/* <div className="btn-group">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    this.props.toggleModal(true, this.props.recipe)
                  }
                >
                  <FontAwesomeIcon icon={faFilePen} />
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => this.props.deleteRecipe(this.props.recipe.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div> */}
            </div>
          </Card.Header>
          <Card.Body
            className={style.recipecardbody}
            onClick={() => this.props.toggleCanvas(true, this.props.recipe)}
          >
            <small>{this.getDescription()}</small>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
