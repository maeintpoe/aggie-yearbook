const React = require("react");
const Input = require("./Input"); // Desktop done
const Results = require("./Results"); // Desktop/Tablet/mobile
const Viewer = require("./Viewer"); // Desktop done
const ReactDOM = require("react-dom");
const Router = require("react-router-dom");
const Route = require("react-router-dom").Route;
const IndexRoute = require("react-router-dom").IndexRoute;

/*Thinking about displaying the content based on user's choice */



const Content = function(props) {

  return (
    <div className="content">
      <div id="studentLogin">
        <img
          src="https://cdn.glitch.com/24a99245-0567-4854-a2c5-6e9a5a71cbdd%2FstudentCenter.jpg?v=1591233514492"
          alt="UC Davis Student Community Center"
        />
        <a href="/auth/google" className="loginButton">
          Student Login
        </a>
      </div>
      <div id="viewerLogin">
        <img
          src="https://cdn.glitch.com/24a99245-0567-4854-a2c5-6e9a5a71cbdd%2FwelcomeCenter.jpg?v=1591233385133"
          alt="UC Davis Welcome Center"
        />
        <a onClick={() => window.location = "/results"} className="loginButton">
          Viewer Login
        </a>
      </div>
    </div>
  );
};

module.exports = Content;
