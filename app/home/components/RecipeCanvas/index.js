import React, { Component } from "react";
import {
  Offcanvas,
  Row,
  Col,
  Button,
  ButtonGroup,
  Form,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { toast } from "react-hot-toast";
import { addDoc, setDoc, deleteDoc, doc, collection } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFilePen, faPlus } from "@fortawesome/free-solid-svg-icons";

import { db } from "@/app/page";

import style from "./style.module.css";

// const INGREDIENT_SECTION_DUMMY_DATA = {
//   id: "",
//   section: "",
//   ingredients: [],
// };

const INGREDIENT_AMOUNT_UNITS = [
  "ml",
  "l",
  "gm",
  "kg",
  "lbs",
  "oz",
  "fl oz",
  "teaspoon",
  "tablespoon",
  "count",
];

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
        ingredients: [],
      },
      newSectionModal: {
        show: false,
        progress: false,
        data: {
          section: "",
        },
      },
      editIngredientModal: {
        show: false,
        progress: false,
        data: {
          section: "",
          index: "",
          ingredient: "",
          amount: "",
          unit: "",
        },
      },
      addIngredientData: {},
    };

    this.addNewSection = this.addNewSection.bind(this);
    this.addIngredient = this.addIngredient.bind(this);
    this.deleteIngredient = this.deleteIngredient.bind(this);
    this.showNewSectionModal = this.showNewSectionModal.bind(this);
    this.hideNewSectionModal = this.hideNewSectionModal.bind(this);
    this.resetNewSectionModal = this.resetNewSectionModal.bind(this);
    this.showEditIngredientModal = this.showEditIngredientModal.bind(this);
    this.hideEditIngredientModal = this.hideEditIngredientModal.bind(this);
    this.resetEditIngredientModal = this.resetEditIngredientModal.bind(this);
    this.submitEditIngredientForm = this.submitEditIngredientForm.bind(this);
  }

  componentDidUpdate() {
    let { show, recipe, addIngredientData } = this.state;

    if (show !== this.props.show)
      this.setState({ ...this.state, show: this.props.show });

    if (recipe !== this.props.recipe) {
      this.props.recipe.ingredients.forEach(
        (section) =>
          (addIngredientData[section.id] = {
            section: section.id,
            ingredient: "",
            amount: "",
            unit: "",
          })
      );

      this.setState({
        ...this.state,
        recipe: this.props.recipe,
        addIngredientData,
      });
    }
  }

  async addNewSection(e) {
    e.preventDefault();

    let { recipe, newSectionModal } = this.state;
    newSectionModal.progress = true;
    this.setState({ ...this.state, newSectionModal });

    try {
      let data = {
        section: newSectionModal.data.section,
        ingredients: [],
      };

      await addDoc(collection(db, "recipes", recipe.id, "sections"), data);

      await this.props.fetch();
      this.props.updateCanvasData(this.state.recipe.id);
      this.hideNewSectionModal();
      toast.success("New Section Added!");
    } catch (err) {
      console.log("ERR", err);
      toast.error("Something went wrong. Please try again");
    }
    newSectionModal.progress = false;
    this.setState({ ...this.state, newSectionModal });
  }

  deleteSection(section) {
    swal({
      title: "Are you sure to delete this section?",
      text: "This action cannot be undone!",
      icon: "warning",
      dangerMode: true,
      buttons: {
        confirm: {
          text: "Yes, Delete",
          visible: true,
          value: true,
        },
        cancel: {
          text: "No, Cancel",
          visible: true,
          value: false,
        },
      },
    }).then(async (value) => {
      if (value) {
        let { recipe } = this.state;

        const toastID = toast.loading("Deleting");
        try {
          await deleteDoc(
            doc(db, "recipes", recipe.id, "sections", section.id)
          );

          await this.props.fetch();
          this.props.updateCanvasData(this.state.recipe.id);
          // setTimeout(() => this.props.updateCanvasData(recipe.id), 1500);
          toast.success("Section Deleted", { id: toastID });
        } catch (err) {
          console.log("ERR", err);
          toast.error("Something went wrong. Please try again", {
            id: toastID,
          });
        }
      }
    });
  }

  showNewSectionModal() {
    let { newSectionModal } = this.state;
    newSectionModal.show = true;
    this.setState({ ...this.state, newSectionModal });
  }

  hideNewSectionModal() {
    let { newSectionModal } = this.state;
    newSectionModal.show = false;
    this.setState({ ...this.state, newSectionModal });
  }

  resetNewSectionModal() {
    let { newSectionModal } = this.state;
    newSectionModal.data.section = "";
    this.setState({ ...this.state, newSectionModal });
  }

  showEditIngredientModal(data) {
    let { editIngredientModal } = this.state;
    editIngredientModal.show = true;
    editIngredientModal.data = data;
    this.setState({ ...this.state, editIngredientModal });
  }

  hideEditIngredientModal() {
    let { editIngredientModal } = this.state;
    editIngredientModal.show = false;
    this.setState({ ...this.state, editIngredientModal });
  }

  resetEditIngredientModal() {
    let { editIngredientModal } = this.state;
    editIngredientModal.show = false;
    editIngredientModal.progress = false;
    editIngredientModal.data = {
      section: "",
      index: "",
      ingredient: "",
      amount: "",
      unit: "",
    };
    this.setState({ ...this.state, editIngredientModal });
  }

  async addIngredient(section) {
    let { addIngredientData, recipe } = this.state;

    const toastID = toast.loading("Adding ingredient...");

    try {
      let data = {
        ingredient: addIngredientData[section.id].ingredient,
        amount: addIngredientData[section.id].amount,
        unit: addIngredientData[section.id].unit,
      };

      if (!data.ingredient) {
        toast.error("Enter ingredient!", { id: toastID });
      } else if (!data.amount) {
        toast.error("Enter ingredient amount!", { id: toastID });
      } else if (!data.unit) {
        toast.error("Select ingredient amount unit!", { id: toastID });
      } else {
        section.ingredients.push(data);

        await setDoc(
          doc(db, "recipes", recipe.id, "sections", section.id),
          section
        );

        await this.props.fetch();
        this.props.updateCanvasData(recipe.id);
        toast.success("New Ingredient Added!", { id: toastID });
      }
    } catch (err) {
      console.log("ERROR", err);
      toast.error("Something went wrong. Please try again", { id: toastID });
    }
  }

  deleteIngredient(section, ingredientIndex) {
    swal({
      title: "Are you sure to remove this ingredient?",
      text: "This action cannot be undone!",
      icon: "warning",
      dangerMode: true,
      buttons: {
        confirm: {
          text: "Yes, Remove",
          value: true,
          visible: true,
        },
        cancel: {
          text: "No, Let it be",
          value: false,
          visible: true,
        },
      },
    }).then(async (value) => {
      if (value) {
        const toastID = toast.loading("Removing ingredient...");

        let { recipe } = this.state;

        try {
          let data = JSON.parse(JSON.stringify(section));
          data.ingredients.splice(ingredientIndex, 1);
          delete data["id"];

          await setDoc(
            doc(db, "recipes", recipe.id, "sections", section.id),
            data
          );

          await this.props.fetch();
          this.props.updateCanvasData(recipe.id);
          toast.success("Ingredient Removed!", { id: toastID });
        } catch (err) {
          console.log("ERR", err);
          toast.error("Something went wrong. Please try again", {
            id: toastID,
          });
        }
      }
    });
  }

  async submitEditIngredientForm(e) {
    e.preventDefault();

    let { editIngredientModal, recipe } = this.state;
    editIngredientModal.progress = true;
    this.setState({ ...this.state, editIngredientModal });

    try {
      let { data } = editIngredientModal;

      let ingData = { ...data };
      delete ingData["section"];
      delete ingData["index"];

      let ingList = JSON.parse(JSON.stringify(recipe.ingredients));
      ingList[data.index] = ingData;

      await setDoc(doc(db, "recipes", recipe.id, "sections", data.section.id), {
        section: data.section.section,
        ingredients: ingList,
      });

      await this.props.fetch();
      this.props.updateCanvasData(this.state.recipe.id);
      this.hideEditIngredientModal();
      toast.success("Ingredient Updated!");
    } catch (err) {
      console.log("ERR", err);
      toast.error("Something went wrong. Please try again");
    }

    editIngredientModal.progress = false;
    this.setState({ ...this.state, editIngredientModal });
  }

  getEmptyMessage = () => {
    if (this.state.recipe.ingredients.length === 0) {
      return (
        <React.Fragment>
          <div className="text-center text-muted">
            <small>Add section to continue</small>
            <br />
            <br />
            <small>
              <small>
                Maybe,
                <br />
                <i>A section for sauce?</i>
                <br />
                <i>A section for gravy?</i>
                <br />
                <i>A section for main-course?</i>
              </small>
            </small>
          </div>
        </React.Fragment>
      );
    }
  };

  getIngredients = (section) =>
    section.ingredients.map((ingredient, index) => (
      <React.Fragment key={index}>
        <div className={style.ingredient}>
          <div>{ingredient.ingredient}</div>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              {ingredient.amount} {ingredient.unit}
            </div>
            <div className="ms-5">
              <ButtonGroup>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() =>
                    this.showEditIngredientModal({
                      section: section,
                      index: index,
                      ingredient: ingredient.ingredient,
                      amount: ingredient.amount,
                      unit: ingredient.unit,
                    })
                  }
                >
                  <FontAwesomeIcon icon={faFilePen} />
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => this.deleteIngredient(section, index)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </ButtonGroup>
            </div>
          </div>
        </div>
      </React.Fragment>
    ));

  render() {
    return (
      <React.Fragment>
        <Offcanvas
          show={this.state.show}
          onHide={() => this.props.toggle(false, this.props.recipe)}
          onExited={() => {
            this.props.fetch();
            this.props.toggle(false, {
              id: "",
              name: "",
              description: "",
              image: "",
              ingredients: [],
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
              <Col md={4}>
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
                    onClick={() =>
                      this.props.deleteRecipe(this.state.recipe.id)
                    }
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
                <hr />
                <small>Notes work in progress</small>
              </Col>
              <Col>
                <div className={style.ingredientsbox}>
                  <div className="text-center">
                    <h5>Ingredients</h5>
                  </div>
                  <hr />
                  {this.getEmptyMessage()}
                  {this.state.recipe.ingredients.map((section, index) => (
                    <React.Fragment key={index}>
                      <div className={style.ingredientsectionbox}>
                        <div className="d-flex align-items-center justify-content-between">
                          <span className={style.ingredientsectiontitle}>
                            {section.section}
                          </span>
                          <div className="d-flex align-items-center justify-content-between">
                            <InputGroup className="m-1">
                              <Form.Control
                                size="sm"
                                placeholder="Ingredient"
                                className={style.ingredientinput}
                                value={
                                  this.state.addIngredientData[section.id]
                                    .ingredient
                                }
                                onChange={(e) => {
                                  let { addIngredientData } = this.state;
                                  addIngredientData[section.id].ingredient =
                                    e.target.value;
                                  this.setState({
                                    ...this.state,
                                    addIngredientData,
                                  });
                                }}
                              />
                              <Form.Control
                                size="sm"
                                placeholder="Amount"
                                type="number"
                                min="0"
                                step="0.01"
                                className={style.ingredientamountinput}
                                value={
                                  this.state.addIngredientData[section.id]
                                    .amount
                                }
                                onChange={(e) => {
                                  let { addIngredientData } = this.state;
                                  addIngredientData[section.id].amount =
                                    e.target.value;
                                  this.setState({
                                    ...this.state,
                                    addIngredientData,
                                  });
                                }}
                              />
                              <Form.Select
                                size="sm"
                                defaultValue={""}
                                className={style.ingredientunitinput}
                                value={
                                  this.state.addIngredientData[section.id].unit
                                }
                                onChange={(e) => {
                                  let { addIngredientData } = this.state;
                                  addIngredientData[section.id].unit =
                                    e.target.value;
                                  this.setState({
                                    ...this.state,
                                    addIngredientData,
                                  });
                                }}
                              >
                                <option value="" disabled={true}>
                                  Unit
                                </option>
                                {INGREDIENT_AMOUNT_UNITS.map((unit) => (
                                  <option value={unit}>{unit}</option>
                                ))}
                              </Form.Select>
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => this.addIngredient(section)}
                              >
                                <FontAwesomeIcon icon={faPlus} />
                              </Button>
                            </InputGroup>
                            <Button
                              className="m-1"
                              size="sm"
                              variant="danger"
                              onClick={() => this.deleteSection(section)}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </div>
                        <br />
                        {section.ingredients.length === 0 ? (
                          <div className={style.ingredientslist}>
                            <div className="text-center text-muted p-3">
                              <small>Start by adding ingredients</small>
                            </div>
                          </div>
                        ) : (
                          this.getIngredients(section)
                        )}
                      </div>
                    </React.Fragment>
                  ))}
                  <br />
                  <div className="text-center">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={this.showNewSectionModal}
                    >
                      <FontAwesomeIcon icon={faPlus} className="me-1" />
                      New Section
                    </Button>
                  </div>
                  <br />
                </div>
              </Col>
            </Row>
          </Offcanvas.Body>
        </Offcanvas>

        <Modal
          backdrop="static"
          keyboard={false}
          show={this.state.newSectionModal.show}
          onHide={this.hideNewSectionModal}
          onExited={this.resetNewSectionModal}
          centered={true}
        >
          <Modal.Body>
            <Form onSubmit={this.addNewSection}>
              <Form.Label>New Section</Form.Label>
              <Form.Control
                size="sm"
                placeholder="New Section Name"
                value={this.state.newSectionModal.data.section}
                onChange={(e) => {
                  let { newSectionModal } = this.state;
                  newSectionModal.data.section = e.target.value;
                  this.setState({ ...this.state, newSectionModal });
                }}
                required={true}
              />
              <br />
              <div className="text-center">
                <Button
                  type="submit"
                  size="sm"
                  variant="success"
                  className="m-1"
                  disabled={this.state.newSectionModal.progress}
                >
                  {this.state.newSectionModal.progress ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Add"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={this.hideNewSectionModal}
                  className="m-1"
                  disabled={this.state.newSectionModal.progress}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>

        <Modal
          backdrop="static"
          keyboard={false}
          show={this.state.editIngredientModal.show}
          onHide={this.hideEditIngredientModal}
          onExited={this.resetEditIngredientModal}
          centered={true}
        >
          <Modal.Body>
            <Form onSubmit={this.submitEditIngredientForm}>
              <Form.Group>
                <Form.Label>Ingredient</Form.Label>
                <Form.Control
                  placeholder="Ingredient Name"
                  value={this.state.editIngredientModal.data.ingredient}
                  onChange={(e) => {
                    let { editIngredientModal } = this.state;
                    editIngredientModal.data.ingredient = e.target.value;
                    this.setState({ ...this.state, editIngredientModal });
                  }}
                  required={true}
                />
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Ingredient Amount"
                  value={this.state.editIngredientModal.data.amount}
                  onChange={(e) => {
                    let { editIngredientModal } = this.state;
                    editIngredientModal.data.amount = e.target.value;
                    this.setState({ ...this.state, editIngredientModal });
                  }}
                  required={true}
                />
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label>Unit</Form.Label>
                <Form.Select
                  placeholder="Ingredient Unit"
                  defaultValue={""}
                  value={this.state.editIngredientModal.data.unit}
                  onChange={(e) => {
                    let { editIngredientModal } = this.state;
                    editIngredientModal.data.unit = e.target.value;
                    this.setState({ ...this.state, editIngredientModal });
                  }}
                  required={true}
                >
                  <option value="" disabled={true}>
                    Unit
                  </option>
                  {INGREDIENT_AMOUNT_UNITS.map((unit) => (
                    <option value={unit}>{unit}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <br />
              <div className="text-center">
                <Button
                  type="submit"
                  size="sm"
                  variant="success"
                  className="m-1"
                  disabled={this.state.editIngredientModal.progress}
                >
                  {this.state.editIngredientModal.progress ? (
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={this.hideEditIngredientModal}
                  className="m-1"
                  disabled={this.state.editIngredientModal.progress}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}
