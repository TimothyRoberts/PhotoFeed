import React, { Component } from "react";
import { Link, Route, Switch } from "react-router-dom";
import axios from "axios";

// Assigns response data from db to image cards
const Image = props => (
  <div>
    <div className="uk-card uk-card-default uk-flex uk-flex-center uk-flex-middle">
      <div className="uk-inline" uk-scrollspy="target: > div; cls:uk-animation-fade; delay: 50">
        <div className="uk-text-center">
          <div className="uk-inline-clip uk-transition-toggle" tabIndex="0" uk-lightbox = "true">
            <a href={props.image.image_URL} data-caption={props.image.image_description}>
              <img src={props.image.image_URL} />
            </a>
              <div className="uk-transition-slide-bottom uk-position-bottom uk-overlay uk-overlay-default">
                <h4> {props.image.image_title} </h4>
                <p> {props.image.image_description}</p>
              </div>
          </div>
          <Link to={`/userList/${props.image.userId}`}>User {props.image.userId}</Link>
        </div>
      </div>
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
        if (this._isMounted) {
          this.setState({ uploads: response.data });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  render() {
    // for each upload object, produce an Image component
    const uploadList = this.state.uploads.map((currentImage, i) => (
      <Image
        key={i}
        image={currentImage}
      />
    ));

    return (
      <div className="uk-padding uk-child-width-1-2@s uk-child-width-1-3@m" uk-grid="masonry: true">
        {uploadList}
      </div>
    );
  }
}
