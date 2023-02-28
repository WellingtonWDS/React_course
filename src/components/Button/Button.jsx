import { Component } from "react";
import "./Button.css";

export class Button extends Component {
  render() {
    const { text, onClick, disabled } = this.props;

    return (
      <button onClick={onClick} disabled={disabled} className="button">
        {text}
      </button>
    );
  }
}
