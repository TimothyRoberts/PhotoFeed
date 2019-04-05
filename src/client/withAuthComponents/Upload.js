import React, { Component } from "react";
import axios from "axios";

export default class Upload extends Component {
  constructor(props) {
    super(props);

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeImageURL = this.onChangeImageURL.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      image_title: "",
      image_description: "",
      image_priority: "",
      image_URL: "",
      userId: this.props.match.params.id
    };
  }

  onChangeTitle(e) {
    this.setState({
      image_title: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      image_description: e.target.value
    });
  }

  onChangeImageURL(e) {
    this.setState({
      image_URL: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();

    console.log("Form submitted:");
    console.log(`Image Title: ${this.state.image_title}`);
    console.log(`Image Description: ${this.state.image_description}`);
    console.log(`Image URL: ${this.state.image_URL}`);
    console.log(`User ID: ${this.props.match.params.id}`);

    const newImage = {
      image_title: this.state.image_title,
      image_description: this.state.image_description,
      image_URL: this.state.image_URL,
      userId: this.state.userId
    };

    axios.post("/api/uploads", newImage).then(res => {
      console.log(res.data);
      this.props.history.push("/list");
    });

    this.setState({
      image_title: "",
      image_description: "",
      image_URL: ""
    });
  }

  render() {
    // console.log(this.props);
    return (
      <div style={{ marginTop: 20 }}>
        <h3>Create New Image</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Title: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.image_title}
              onChange={this.onChangeTitle}
            />
          </div>
          <div className="form-group">
            <label>Description: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.image_description}
              onChange={this.onChangeDescription}
            />
          </div>
          <div className="form-group">
            <label>Image URL: </label>
            <input
              type="text"
              className="form-control"
              value={this.state.image_URL}
              onChange={this.onChangeImageURL}
            />
          </div>

          <div className="form-group">
            <input
              type="submit"
              value="Upload Image"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
    );
  }
}
