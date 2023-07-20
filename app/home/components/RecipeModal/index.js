import Image from "next/image";
import React, { Component } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import Dropzone from "react-dropzone";
import toast from "react-hot-toast";
import { addDoc, setDoc, collection, doc } from "firebase/firestore";

import { db } from "@/app/page";
import { loadFromLocalStorage } from "@/localStorage";

import style from "./style.module.css";

export default class RecipeModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      progress: false,
      recipe: {
        id: "",
        name: "",
        description: "",
        image: "",
      },
      uploadedImage: {
        name: "",
        b64: "",
        meta: null,
      },
    };

    this.formSubmit = this.formSubmit.bind(this);
    this.resetImage = this.resetImage.bind(this);
    this.uploadedImage = this.uploadedImage.bind(this);
  }

  componentDidUpdate() {
    let { show, recipe, uploadedImage } = this.state;

    if (show !== this.props.show)
      this.setState({ ...this.state, show: this.props.show });

    if (recipe !== this.props.recipe) {
      if (!recipe.image) {
        uploadedImage.b64 = this.props.recipe.image;
      }

      this.setState({
        ...this.state,
        recipe: this.props.recipe,
      });
    }
  }

  async formSubmit(e) {
    e.preventDefault();

    let { uploadedImage, recipe } = this.state;

    this.setState({ ...this.state, progress: true });
    const toastID = toast.loading(
      this.props.edit ? "Updating the recipe..." : "Adding new recipe ..."
    );

    let userID = loadFromLocalStorage("auth").user.uid;
    try {
      let recipeID = recipe["id"];
      delete recipe["id"];

      if (this.props.edit) {
        await setDoc(doc(db, "recipes", recipeID), {
          ...recipe,
          image: uploadedImage.b64,
          user: userID,
        });
      } else {
        await addDoc(collection(db, "recipes"), {
          ...recipe,
          image: uploadedImage.b64,
          user: userID,
        });
      }

      toast.success(this.props.edit ? "Recipe updated!" : "New recipe added!", {
        id: toastID,
      });

      this.setState({ ...this.state, progress: false });

      const fetchToastID = toast.loading("Fetching your recipes");
      this.props.fetch(fetchToastID);

      this.props.toggle(false);
    } catch (err) {
      console.log("ERROR", err);
      this.setState({ ...this.state, progress: false });

      toast.error("Something went wrong. Please try again", {
        id: toastID,
      });
    }
  }

  uploadedImage(file) {
    if (file[0].size > 150000) {
      toast("Image size too large! Try compressing it");
    } else if (file[0].type.indexOf("image") === -1) {
      toast("Please select only PNG or JPEG/JPG images");
    } else {
      let { uploadedImage, recipe } = this.state;

      let reader = new FileReader();
      reader.readAsDataURL(file[0]);

      reader.onprogress = () => {
        uploadedImage.name = "Please wait ...";
        this.setState({ ...this.state, uploadedImage });
      };

      reader.onload = () => {
        uploadedImage.name = file[0].name;
        uploadedImage.meta = file[0];
        uploadedImage.b64 = reader.result;

        recipe.image = reader.result;
        this.setState({ ...this.state, uploadedImage, recipe });
      };

      reader.onerror = (error) => {
        console.log("ERROR", error);
        toast.error("Something went wrong. Please try uploading again.");

        uploadedImage.name = "";
        this.setState({ ...this.state, uploadedImage });
      };
    }
  }

  resetImage() {
    let { uploadedImage } = this.state;

    uploadedImage.name = "";
    uploadedImage.b64 = "";
    uploadedImage.meta = null;

    this.setState({ ...this.state, uploadedImage });
  }

  render() {
    return (
      <Modal
        size="lg"
        backdrop="static"
        keyboard={false}
        show={this.state.show}
        onHide={() =>
          this.props.toggle(false, this.props.edit ? this.state.recipe : null)
        }
        onExited={() => {
          this.resetImage();
          this.props.toggle(false, null);
        }}
        centered={true}
      >
        <Modal.Header closeButton={!this.state.progress}>
          <Modal.Title>
            {this.props.edit ? "Edit Recipe" : "Add New Recipe"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={this.formSubmit}>
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
              <Form.Label>
                Image <small>(Optional)</small>
              </Form.Label>
              <Dropzone
                maxFiles={1}
                onDrop={(acceptedFiles) => this.uploadedImage(acceptedFiles)}
              >
                {({ getRootProps, getInputProps }) => (
                  <section className={style.filedropzone}>
                    <div
                      className="d-flex align-items-center justify-content-center w-100 h-100"
                      style={{ flexDirection: "column" }}
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      {this.state.uploadedImage.b64 ? (
                        <div className="mb-3">
                          <Image
                            src={this.state.uploadedImage.b64}
                            width={80}
                            height={80}
                            alt="image"
                          />
                        </div>
                      ) : null}
                      <small>Drag, drop or click to select image</small>
                    </div>
                  </section>
                )}
              </Dropzone>
              {this.state.uploadedImage.b64 ? (
                <div className="text-center">
                  <br />
                  <Button variant="text" size="sm" onClick={this.resetImage}>
                    <small>Remove Image</small>
                  </Button>
                </div>
              ) : null}
            </Form.Group>
            <hr />
            <div className="text-center">
              <Button
                type="submit"
                variant="success"
                className="w-100"
                disabled={this.state.progress}
              >
                {this.state.progress ? (
                  <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                ) : this.props.edit ? (
                  "Save changes"
                ) : (
                  "Add"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }
}
