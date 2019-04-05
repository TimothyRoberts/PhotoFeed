import React, { Component } from "react";
import axios from "axios";

export default class EditImage extends Component {
  constructor(props) {
    super(props);

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeImageURL = this.onChangeImageURL.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.state = {
      image_title: "",
      image_description: "",
      image_URL: ""
    };
  }

  componentDidMount() {
    axios
      .get("/api/uploads/" + this.props.match.params.id)
      .then(response => {
        this.setState({
          image_title: response.data.image_title,
          image_description: response.data.image_description,
          image_URL: response.data.image_URL
        });
      })
      .catch(function(error) {
        console.log(error);
      });
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
    const obj = {
      _id: this.props.match.params.id,
      image_title: this.state.image_title,
      image_description: this.state.image_description,
      image_imageURL: this.state.image_URL
    };
    axios.put("/api/uploads/", obj).then(res => console.log(res.data));

    this.props.history.push("/list");
  }

  onDelete(e) {
    axios.delete("/api/uploads/" + this.props.match.params.id).then(res => {
      console.log(res.data);
      this.props.history.push("/list");
    });
  }

  render() {
    return (
      <div>
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

          <br />
          <div className="form-group">
            <input
              type="submit"
              value="Update Image"
              className="btn btn-primary"
            />

            <input
              type="submit"
              value="Delete Image"
              className="btn btn-primary"
              onClick={this.onDelete}
            />
          </div>
        </form>
      </div>
    );
  }
}
