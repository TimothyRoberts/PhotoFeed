import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


const Image = props => (
  <div>
    <div className="uk-card uk-card-default uk-flex uk-flex-center uk-flex-middle">
      <div className="uk-inline" uk-scrollspy="target: > div; cls:uk-animation-fade; delay: 500">
        <div className="uk-text-center">
          <div className="uk-inline-clip uk-transition-toggle" tabIndex="0">
              <img src={props.image.image_URL} />
              <div className="uk-transition-slide-bottom uk-position-bottom uk-overlay uk-overlay-default">
                <h3> {props.image.image_title} </h3>
                <p> {props.image.image_description}</p>
              </div>
          </div>
        </div>
      </div>
    </div>
    <div uk-lightbox = "true">
      <a className="uk-button uk-button-default" href={props.image.image_URL} data-caption="Caption">View Image</a>
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
      return <div> <Image key={i} image={currentImage} /> </div>;
    });
  }
}
