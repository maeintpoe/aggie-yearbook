const React = require("react");
const ReactDOM = require("react-dom");
const Route = require("react-router-dom").Route;
//const IndexRoute = require("react-router-dom").IndexRoute;
const BrowserRouter = require("react-router-dom").BrowserRouter;
const hashHistory = require("react-router-dom").hashHistory;
const createBrowserHistory = require("history").createBrowserHistory;

/* Import Components */
const Switch = require("react-router-dom").Switch;
const Page = require("./Page");
const Content = require("./Content");
const Input = require("./Input"); // Desktop done
const Results = require("./Results"); // Desktop/Tablet/mobile
const Viewer = require("./Viewer"); // Desktop done
const history = createBrowserHistory();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter history={history}>
      <Switch>
        <Route exact path="/input" component={Input} />
        <Route exact path="/results/:userId" component={Viewer} />
        <Route exact path="/results" component={Results} />
        <Route exact path="/" component={Page} />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("main")
);
