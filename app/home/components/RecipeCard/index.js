import React, { Component } from "react";

import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFilePen } from "@fortawesome/free-solid-svg-icons";

import style from "./style.module.css";

export default class RecipeCard extends Component {
  render() {
    return (
      <div className={style.recipecard}>
        <Card>
          <Card.Header className={style.recipecardheader}>
            <div className="d-flex align-items-center justify-content-between w-100">
              <div
                className={`${style.recipecardbody} w-75`}
                onClick={() => this.props.toggleCanvas(true, this.props.recipe)}
              >
                <Card.Title>{this.props.recipe.name}</Card.Title>
              </div>
              <div className="btn-group">
                <Button
                  size="sm"
                  variant="outline-secondary"
                  onClick={() =>
                    this.props.toggleModal(true, this.props.recipe)
                  }
                >
                  <FontAwesomeIcon icon={faFilePen} />
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => this.props.deleteRecipe(this.props.recipe.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Body
            className={style.recipecardbody}
            onClick={() => this.props.toggleCanvas(true, this.props.recipe)}
          >
            <div>{this.props.recipe.description}</div>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
