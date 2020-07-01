const React = require("react");
const { useEffect, useState } = require("react");
const get = require("axios");
//const Table = require("semantic-ui-react");
const {
  AppBar,
  Toolbar,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Typography,
  Divider,
  TextField
} = require("@material-ui/core");
const { makeStyles, fade } = require("@material-ui/styles");
const SearchIcon = require("@material-ui/icons").Search;
const Header = require("./Header");

const axios = require("axios");

// are we gonna use makestyles

const useStyles = makeStyles(theme => ({
  resultsContainer: {
    paddingTop: "5%",
    paddingLeft: "5%",
    paddingRight: "5%",
    fontFamily: "Montserrat"
  },
  cardMedia: {
    margin: "auto"
    // marginTop: "20px"
  },
  cardContent: {
    textAlign: "center",
    paddingBottom: "12px"
  },
  searchContainer: {
    display: "flex",
    backgroundColor: "rgba(255, 255, 255, 0.95)", //fade(theme.palette.common.white, 0.15),
    paddingLeft: "20px",
    paddingRight: "20px",
    marginTop: "5px",
    marginBottom: "5px",
    fontFamily: "Montserrat"
    // width: "100%"
  },
  searchIcon: {
    alignSelf: "flex-end",
    marginBottom: "5px",
    color: "black"
  },
  searchInput: {
    width: "100%", //"200px",
    margin: "5px",
    fontFamily: "Montserrat",
    backgroundColor:
      "linear-gradient(90deg, #022851, rgb(0, 142, 170), rgb(108, 202, 152), rgb(255, 191, 0))"
  },
  searchBorder: {
    background:
      "linear-gradient(90deg, #022851, rgb(0, 142, 170), rgb(108, 202, 152), rgb(255, 191, 0))"
  },
  fonts: {
    fontFamily: "Montserrat",
    paddingTop: "5px"
  },
  fontz: {
    fontFamily: "Montserrat",
    paddingTop: "10px"
  },
  fancyFont: {
    fontFamily: "Montserrat",
    fontWeight: "500"
  },
  cardMedia: {
    height: "200px"
    // width:"130px"
  },
  cards: {
    margin: "0% 7.5% 5% 7.5%"
  }
}));

const Results = function(props) {
  console.log("props: ", props);

  const { history } = props;
  console.log("history: ", history);
  const classes = useStyles();
  const [graduateData, setGraduateData] = useState({});
  const [filter, setFilter] = useState("");
  console.log("location.pathname: ", location.pathname);

  useEffect(() => {
    axios.get("/getLoad").then(function(response) {
      console.log("data retrieved from server, response: ", response);
      const { data } = response;
      const newGraduateData = {};

      data.forEach((graduate, index) => {
        console.log("in useEffect, graduate: ", graduate);
        newGraduateData[index + 1] = {
          rowId: graduate.rowId,
          firstname: graduate.firstname,
          lastname: graduate.lastname,
          name: graduate.name,
          firstmajor: graduate.firstmajor,
          lastmajor: graduate.lastmajor,
          namemajor: graduate.namemajor,
          major: graduate.major,
          gender: graduate.gender,
          image: graduate.image
        };
      });
      setGraduateData(newGraduateData);
    });
  }, []);

  const getGraduateCard = graduateId => {
    console.log("inside Results, graduateId: ", graduateId);
    console.log(
      "inside getGraduateCard, graduateData[gradateId]: ",
      graduateData[graduateId]
    ); 
    const {
      rowId,
      bio,
      firstname,
      lastname,
      firstmajor,
      lastmajor,
      name,
      namemajor,
      major,
      gender,
      image
    } = graduateData[graduateId];

    return (
      <Grid item xs={12} sm={4}>
        <Card onClick={() => history.push(`/results/${rowId}`)} className={classes.cards}>
          <CardMedia className={classes.cardMedia} image={image} />
          <CardContent className={classes.cardContent}>
            <Typography variant="h5" className={classes.fancyFont}>
              {firstname} {lastname}
            </Typography>
            <Divider variant="middle" />

            <Typography className={classes.fontz}>{major}</Typography>
            <Typography className={classes.fonts}>{gender}</Typography>
          </CardContent>
        </Card>
      </Grid>
    );
  };

  const handleSearchChange = e => {
    setFilter(e.target.value);
  };

  return (
    <div>
      <AppBar position="static" className={classes.searchBorder}>
        <Header />
        <div className={classes.searchContainer}>
          <SearchIcon className={classes.searchIcon} />
          <TextField
            className={classes.searchInput}
            onChange={handleSearchChange}
            label="Search Graduate Here by {name} or {major}"
            variant="standard"
          />
        </div>
      </AppBar>
      {graduateData ? (
        <Grid container spacing={12} className={classes.resultsContainer}>
          {Object.keys(graduateData).map(
            graduateId =>
              (graduateData[graduateId].firstname
                .toLowerCase()
                .includes(filter.toLowerCase()) ||
                graduateData[graduateId].lastname
                  .toLowerCase()
                  .includes(filter.toLowerCase()) ||
                graduateData[graduateId].major
                  .toLowerCase()
                  .includes(filter.toLowerCase()) ||
                graduateData[graduateId].name
                  .toLowerCase()
                  .includes(filter.toLowerCase()) ||
                graduateData[graduateId].firstmajor
                  .toLowerCase()
                  .includes(filter.toLowerCase()) ||
                graduateData[graduateId].lastmajor
                  .toLowerCase()
                  .includes(filter.toLowerCase()) ||
               graduateData[graduateId].namemajor
                  .toLowerCase()
                  .includes(filter.toLowerCase())) &&
              getGraduateCard(graduateId)
          )}
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

module.exports = Results;
