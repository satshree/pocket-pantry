import React, { Component } from "react";
import {
  Offcanvas,
  Row,
  Col,
  Button,
  Form,
  Modal,
  InputGroup,
} from "react-bootstrap";
import { toast } from "react-hot-toast";
import {
  addDoc,
  deleteDoc,
  getDoc,
  doc,
  query,
  collection,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFilePen, faPlus } from "@fortawesome/free-solid-svg-icons";

import { db } from "@/app/page";

import style from "./style.module.css";

// const INGREDIENT_SECTION_DUMMY_DATA = {
//   id: "",
//   section: "",
//   ingredients: [],
// };

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
    };

    this.addNewSection = this.addNewSection.bind(this);
    this.showNewSectionModal = this.showNewSectionModal.bind(this);
    this.hideNewSectionModal = this.hideNewSectionModal.bind(this);
    this.resetNewSectionModal = this.resetNewSectionModal.bind(this);
  }

  componentDidUpdate() {
    let { show, recipe } = this.state;

    if (show !== this.props.show)
      this.setState({ ...this.state, show: this.props.show });

    if (recipe !== this.props.recipe)
      this.setState({ ...this.state, recipe: this.props.recipe });
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

      this.props.fetch();
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

          this.props.fetch();
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

  getSections = () => {
    let { recipe } = this.state;

    if (recipe.ingredients.length === 0) {
      return (
        <div className="text-center h-100 text-muted">
          <small>Add section to continue</small>
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
      );
    } else {
      return recipe.ingredients.map((section, index) => (
        <div className={style.ingredientsectionbox} key={index}>
          <div className="d-flex align-items-center justify-content-between">
            <span className={style.ingredientsectiontitle}>
              {section.section}
            </span>
            <div className="d-flex align-items-center justify-content-between">
              <InputGroup className="m-1">
                <Form.Control size="sm" placeholder="Ingredient" />
                <Form.Control size="sm" placeholder="Amount" />
                <Form.Select size="sm">
                  <option disabled={true} selected={true}>
                    Unit
                  </option>
                  <option value="ml">ml</option>
                  <option value="l">l</option>
                  <option value="gm">gm</option>
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                  <option value="oz">oz</option>
                  <option value="fl oz">fl oz</option>
                </Form.Select>
                <Button size="sm" variant="primary">
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
            <div>
              <div className="text-center text-muted">
                <small>Start by adding ingredients</small>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      ));
    }
  };

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
                <div className="text-center">
                  <h5>Ingredients</h5>
                  <hr />
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
                {this.getSections()}
              </div>
            </Col>
          </Row>
        </Offcanvas.Body>

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
                    <div class="spinner-border spinner-border-sm" role="status">
                      <span class="visually-hidden">Loading...</span>
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
      </Offcanvas>
    );
  }
}
