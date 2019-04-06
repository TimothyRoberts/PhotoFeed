import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


const Image = props => (
  <div className="uk-card uk-card-body">
    <div>
    <h1> {props.image.image_title} </h1>
    <img src={props.image.image_URL} />
    <h2> {props.image.image_description}</h2>

    <Link to={"/edit/" + props.image._id}>Edit</Link>
    </div>
  </div>
);

export default class Home extends Component {
  constructor() {
    super();
    this.state = { uploads: [] };
  }


  componentDidMount() {
    this._isMounted = true;
    axios
      .get("/api/uploads")
      .then(response => {
        console.log(response.data);
        if (this._isMounted) {
          this.setState({ uploads: response.data });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }


  render() {
    console.log(this.props);

    return this.state.uploads.map(function(currentImage, i) {
      return <Image image={currentImage} key={i} />;
    });
  }
}
