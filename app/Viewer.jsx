// import queryString from 'query-string'
const React = require("react");
const { useEffect, useState } = require("react");
const {
  Typography,
  Link,
  CircularProgress,
  Button,
  List,
  ListItem,
  ListItemText
} = require("@material-ui/core");
const { makeStyles, fade } = require("@material-ui/styles");
const queryString = require("query-string");
const axios = require("axios");
const Header = require("./Header");
const Footer = require("./Footer");

const useStyles = makeStyles(theme => ({
  root: {
        fontFamily: "Montserrat"

  },
  info: {
    fontFamily: "Montserrat"
    // paddingBottom: "5px"
  },
  buttons: {
    backgroundColor: "white",
    fontFamily: "Montserrat"
  },
  imageViewer: {

  }
}));

const Viewer = function(props) {
  console.log("props: ", props);
  const { history } = props;
  const classes = useStyles();
  const [graduate, setGraduate] = useState(undefined);
  let id = location.pathname.replace("/results/", "");
  const back = function() {
    window.location = "/results";
  };

  let googleId = "";

  useEffect(() => {
    axios
      .get("/getGoogleId/")
      .then(function(response) {
        //go to the input page - probably redirect from server
        console.log("getGoogleId response: ", response.data);
        console.log("(VIEWER) id: ", id);
        googleId = response.data;

        if (googleId == id) {
          console.log("User currently viewing their own viewer page");
          document.getElementById("updateProfile").style.display = "flex";
        }
      })
      .catch(function(error) {
        console.log("error in retrieving googleId");
      });
  });

  useEffect(() => {
    axios
      .get("/getLoad2/" + id)
      .then(function(response) {
        console.log(
          "we're inside useEffect (Viewer). We just made a GET request and Succeeded"
        );
        const { data } = response;
        setGraduate(data);
      })
      .catch(function(error) {
        console.log(
          "we're inside useEffect (Viewer). We just made a GET request and FAILED"
        );
        setGraduate(false);
      });
  }, [id]);

  const updateProfile = function() {
    axios.get("/updateProfile/" + id).then(function(response) {
      console.log(
        "back from SERVER, we just deleted rowid:",
        id,
        "from the table"
      );
      document.getElementById("updateProfile").style.display = "none";
      // console.log("response: ", response);
      if (response.data == "success") {
        console.log("response == 'success'!");
        window.location = "/input";
      }
    });
  };

  const generateGraduateJSX = graduateId => {
    const { rowId, image, bio, firstname, lastname, major, gender } = graduate;
    return (
      <div>
                      <Header/>

      <div id="viewer">
        <Typography>
          <img
            src={image}
            alt="graduate image"
            id="image-viewer"
            className={classes.imageViewer}
          />
        </Typography>
        <div id="text-info-viewer" className={classes.textInfo}>
          <div id="name-viewer">
                    <ListItemText primary={firstname} secondary="First name" className={classes.info} />
                    <ListItemText primary={lastname} secondary="Last name" id="info" className={classes.info} />
          </div>
          <div id="other-info-viewer">
                       <ListItemText primary={gender} secondary="Preferred Pronouns" className={classes.info} />

                       <ListItemText primary={major} secondary="Major" className={classes.info} />

           <ListItemText primary={bio} secondary="Bio" className={classes.info} />
          </div>
        </div>
      </div>
        <Footer/>
        </div>
    );
  };

  return (
    <div>
      <div id="viewer-with-buttons">
      {graduate === undefined && <CircularProgress />}
      {graduate !== undefined && graduate && generateGraduateJSX(graduate)}
      {graduate === false && <Typography>Graduate Not Found</Typography>}
      {graduate !== undefined && (
        <div id="buttons-viewer">
          <Button
            variant="contained"
            onClick={() => (window.location = "/results")}
            id="back-viewer"
            className={classes.buttons}
          >
            Back
          </Button>
          <Button
            variant="contained"
            id="updateProfile"
            onClick={updateProfile}
            className={classes.buttons}
          >
            Update Profile 
          </Button>
        </div>
    
      )}
      </div>

    </div>
  );
};

module.exports = Viewer;
