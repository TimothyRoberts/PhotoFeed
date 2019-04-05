import React, { Component } from "react";
import axios from "axios";

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      message: "Home Page"
    };
  }

  componentDidMount() {
    // axios.get('/api/home')
    //   .then(response => this.setState({message: response.data}));
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <h1>Home</h1>
        <p>{this.state.message}</p>
      </div>
    );
  }
}
