import React, { Component } from "react";

import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import style from "./style.module.css";

export default class RecipeCard extends Component {
  render() {
    return (
      <div className={style.recipecard}>
        <Card>
          <Card.Header>
            <div className="d-flex align-items-center justify-content-between w-100">
              <Card.Title>{this.props.recipe.name}</Card.Title>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => this.props.deleteRecipe(this.props.recipe.id)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            <div>{this.props.recipe.description}</div>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
