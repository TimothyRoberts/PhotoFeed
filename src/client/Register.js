import React, { Component } from 'react';
import axios from 'axios';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email : '',
      password: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleInputChange(event) {
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  onSubmit(event) {
    event.preventDefault();
    axios.post('/api/register', this.state)
      .then(res => {
        if (res.status === 200) {
          this.props.history.push('/');
        } else {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch(err => {
        console.error(err);
        alert('Error registering in please try again');
      });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <h1>Register Below!</h1>
        <hr />
        <div className="uk-margin">
          <input className="uk-input uk-form-width-medium"
            type="email"
            name="email"
            placeholder="Enter email"
            value={this.state.email}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <div className="uk-margin">
          <input className="uk-input uk-form-width-medium"
            type="password"
            name="password"
            placeholder="Enter password"
            value={this.state.password}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <div className="uk-margin">
          <input className="uk-button uk-button-default" type="submit" value="Submit"/>
        </div>
      </form>
    );
  }
}
