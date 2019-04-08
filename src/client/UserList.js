import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";


const Image = props => (
    <img src={props.image.image_URL} />
);

export default class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = { uploads: [] };

    // If unmounted wont setState
    this._isMounted = false;

    this.imageList = this.imageList.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    axios
      .get(`/api/uploads/${this.props.match.params.id}`)
      .then(response => {
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
    const userUploads = this.state.uploads.map(function(currentImage) {
      return <Image image={currentImage} />;
    });
  }

  render() {
    // for each upload object, produce an Upload component
    const uploadList = this.state.uploads.map((currentImage, i) => (
      <li key={i}><Image
        key={i}
        image={currentImage}
      /></li>
    ));

    return (
      <div className="uk-margin-top">
        <h2 className="uk-text-center">User {this.props.match.params.id}</h2>
        <hr />
        <div className="uk-container uk-container-xsmall">
          <div className="uk-position-relative uk-visible-toggle" tabIndex="-1" uk-slideshow="max-width: 100; min-width: 60">
            <ul className="uk-slideshow-items" uk-height-viewport="offset-top: true; offset-bottom: 08">{uploadList}</ul>
            <a className="uk-position-center-left uk-position-small uk-hidden-hover uk-dark" href="#" uk-slidenav-previous="true" uk-slideshow-item="previous"></a>
            <a className="uk-position-center-right uk-position-small uk-hidden-hover uk-dark" href="#" uk-slidenav-next="true" uk-slideshow-item="next"></a>
            <ul className="uk-slideshow-nav uk-dotnav uk-flex-center uk-margin"></ul>
          </div>
        </div>
      </div>
      );
  }
}
