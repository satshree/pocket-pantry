import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";

import RecipeCard from "../RecipeCard";

// const dummy = {
//   name: "hello",
//   description: "heeheheheheheh",
//   icon: "23efw3few4t",
// };

export default class RecipeList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // recipes: [dummy, dummy, dummy],
      recipes: [],
    };
  }

  componentDidUpdate() {
    let { recipes } = this.state;

    if (recipes !== this.props.recipes)
      this.setState({ ...this.state, recipes: this.props.recipes });
  }

  emptyRecipe = () => (
    <div className="text-center text-muted p-5">
      No Recipes. Add your recipe to begin.
    </div>
  );

  allRecipe = () => (
    <Row>
      {this.state.recipes.map((recipe, index) => (
        <Col md={4} className="mb-3" key={index}>
          <RecipeCard
            recipe={recipe}
            deleteRecipe={this.props.deleteRecipe}
            toggleCanvas={this.props.toggleCanvas}
            toggleModal={this.props.toggleModal}
          />
        </Col>
      ))}
    </Row>
  );

  render() {
    return (
      <div>
        {this.state.recipes.length === 0
          ? this.emptyRecipe()
          : this.allRecipe()}
      </div>
    );
  }
}
