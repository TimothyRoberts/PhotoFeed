import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


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
                <h3> {props.image.image_title} </h3>
                <p> {props.image.image_description}</p>
              </div>
          </div>
          <Link to={`/edit/${props.image._id}`}>Edit</Link>
        </div>
      </div>
    </div>
  </div>
);



export default class UploadsList extends Component {
  constructor(props) {
    super(props);
    this.state = { uploads: [] };

    // If unmounted, cannot setState
    this._isMounted = false;

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

  render() {
    // for each upload object, produce an Upload component
    const uploadList = this.state.uploads.map((currentImage, i) => (
      <Image
        key={i}
        image={currentImage}
      />
    ));

    return (
      <div className="uk-margin-top">
        <h2 className="uk-text-center">View and Edit your Images</h2>
        <hr />
        <div className="uk-padding uk-child-width-1-2@s uk-child-width-1-3@m" uk-grid="masonry: true" uk-scrollspy="cls: uk-animation-fade; target: > div > .uk-card; delay: 100; ">
          {uploadList}
        </div>
      </div>
    );
  }
}
