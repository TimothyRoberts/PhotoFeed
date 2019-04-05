import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Image = props => (
  <div>
    <h1> {props.image.image_title} </h1>
    <img src={props.image.image_URL} />
    <h2> {props.image.image_description}</h2>

    <Link to={"/edit/" + props.image._id}>Edit</Link>
  </div>
);

export default class uploadsList extends Component {
  constructor(props) {
    super(props);
    this.state = { uploads: [] };

    // used to ensure setState will not be called on this component if it is unmounted
    this._isMounted = false;

    this.imageList = this.imageList.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    console.log(this.props.match.params.id);
    axios
      .get(`/api/uploads/${this.props.match.params.id}`)
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

  componentWillUnmount() {
    // component is being unmounted, ensure setState cannot be run, i.e. when the async axios calls resolve
    this._isMounted = false;
  }

  imageList() {
    return this.state.uploads.map(function(currentImage, i) {
      return <Image image={currentImage} key={i} />;
    });
  }

  render() {
    return <div>{this.imageList()}</div>;
  }
}
