import React, { Component } from "react";

import { Card } from "react-bootstrap";

import style from "./style.module.css";

export default class RecipeCard extends Component {
  render() {
    return (
      <div className={style.recipecard}>
        <Card>
          <Card.Header>
            <Card.Title>{this.props.recipe.name}</Card.Title>
          </Card.Header>
          <Card.Body>
            <div>{this.props.recipe.description}</div>
          </Card.Body>
        </Card>
      </div>
    );
  }
}
