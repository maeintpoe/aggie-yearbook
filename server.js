// We need many modules

// some of the ones we have used before
const express = require("express");
const bodyParser = require("body-parser");
const assets = require("./assets");
const fs = require("fs");
const sql = require("sqlite3").verbose(); // we'll need this later
const multer = require("multer");
const FormData = require("form-data");
const url = require("url");

// and some new ones related to doing the login process
const passport = require("passport");
// There are other strategies, including Facebook and Spotify
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// Start setting up the Server pipeline
const app = express();
const appRouter = express.Router();

console.log("setting up pipeline");

// Some modules related to cookies, which indicate that the user
// is logged in
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

let storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, __dirname + "/images");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
// let upload = multer({dest: __dirname+"/assets"});
let upload = multer({ storage: storage });

let googleId = "";

// Serve static files out of public directory
app.use(express.static("public"));

// Also serve static files out of /images
app.use("/images", express.static("images"));

//======================== BUILDING DATABASE ===============================
// This creates an interface to the file if it already exists, and makes the
// file if it does not.
const yearbookDB = new sql.Database("yearbook.db");

// Actual table creation; only runs if "shoppingList.db" is not found or empty
// Does the database table exist?
let cmd =
  " SELECT name FROM sqlite_master WHERE type='table' AND name='YearbookTable' ";
yearbookDB.get(cmd, function(err, val) {
  console.log(err, val);
  if (val == undefined) {
    console.log("No database file - creating one");
    createYearbookDB();
  } else {
    console.log("Database file found");
  }
});

function createYearbookDB() {
  // explicitly declaring the rowIdNum protects rowids from changing if the
  // table is compacted; not an issue here, but good practice
  const cmd =
    "CREATE TABLE YearbookTable ( rowId TEXT PRIMARY KEY UNIQUE, bio TEXT, image TEXT, firstname TEXT, lastname TEXT, name TEXT, firstmajor TEXT, lastmajor TEXT, namemajor TEXT, major TEXT, gender TEXT)";
  yearbookDB.run(cmd, function(err, val) {
    if (err) {
      console.log("Database creation failure", err.message);
    } else {
      console.log("Created database");
    }
  });
}
//======================== End of Database creation ===========================

app.post("/upload", upload.single("newImage"), function(request, response) {
  console.log("upload post request called in server");
  console.log(
    "Recieved SERVER SIDE",
    request.file.originalname,
    request.file.size,
    "bytes"
  );
  if (request.file) {
    const filename = "/images/" + request.file.originalname;
    console.log(
      "accesible: http://ecs162.org:3000/images/mwpoe/" +
        request.file.originalname
    );
    sendMediaStore(filename, request, response);
  } else throw "error";
});

// function called when the button is pushed
// handles the upload to the media storage API
function sendMediaStore(filename, serverRequest, serverResponse) {
  let apiKey = process.env.ECS162KEY;
  if (apiKey === undefined) {
    serverResponse.status(400);
    serverResponse.send("No API key provided");
  } else {
    // we'll send the image from the server in a FormData object
    let form = new FormData();

    // we can stick other stuff in there too, like the apiKey
    form.append("apiKey", apiKey);
    // stick the image into the formdata object
    form.append("storeImage", fs.createReadStream(__dirname + filename));
    // and send it off to this URL
    form.submit("http://ecs162.org:3000/fileUploadToAPI", function(
      err,
      APIres
    ) {
      // did we get a response from the API server at all?
      if (APIres) {
        // OK we did
        console.log("API response status", APIres.statusCode);
        // the body arrives in chunks - how gruesome!
        // this is the kind stream handling that the body-parser
        // module handles for us in Express.
        let body = "";
        APIres.on("data", chunk => {
          body += chunk;
        });
        APIres.on("end", () => {
          // now we have the whole body
          if (APIres.statusCode != 200) {
            serverResponse.status(400); // bad request
            serverResponse.send(" Media server says: " + body);
          } else {
            serverResponse.status(200);
            console.log("upload body: ", body);
            //serverResponse.send(body);
          }

          // removing image file from images/
          let url = __dirname + filename;
          console.log("SERVER SIDE (url to remove):", url);
          fs.unlink(url, function(err) {
            if (err) throw err;
            console.log("file:", filename, "deleted!");
          });
          serverResponse.end(serverRequest.file.originalname);
        });
      } else {
        // didn't get APIres at all
        serverResponse.status(500); // internal server error
        serverResponse.send("Media server seems to be down.");
      }
    });
  }
  // must end the response (similar to assn2 solution for POST request handling)
  serverResponse.end(serverRequest.file.originalname);
}

app.use(bodyParser.json());
// gets JSON data into req.body
app.post("/saveDisplay", function(req, res, next) {
  console.log("Server recieved ", req.body);
 
  // image, color, font, message
  let bio = req.body.bio;
  let image = req.body.image;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let name = req.body.name;
  let firstmajor = req.body.firstmajor;
  let lastmajor = req.body.lastmajor;
  let namemajor = req.body.namemajor;
  let major = req.body.major;
  let gender = req.body.gender;
  let rowid = googleId; //googleId from right when they logged in
  
  console.log(
    "new rowid",
    rowid,
    ", bio:",
    bio,
    ", image:",
    image,
    ", firstname:",
    firstname,
    ", lastname:",
    lastname,
    ", name:",
    name,
    ", major:",
    major,
    ", first and major:",
    firstmajor, 
    ", last and major: ",
    lastmajor,
    ", name and major: ",
    namemajor,
    ", gender:",
    gender
  );
  
  // put new item into database
  cmd =
    "INSERT INTO YearbookTable (rowId, bio, image, firstname, lastname, name, firstmajor, lastmajor, namemajor, major, gender) VALUES (?,?,?,?,?,?,?,?,?,?,?) "; // change the table names
  yearbookDB.run(
    cmd,
    rowid,
    bio,
    image,
    firstname,
    lastname,
    name,
    firstmajor,
    lastmajor,
    namemajor,
    major,
    gender,
    function(err) {
      if (err) {
        console.log("DB insert error", err.message);
        //next(); // pass control to the next handler
      } else {
        //let newId = this.lastID; // the rowid of last inserted item
        console.log("Got new item, inserted with rowID: " + rowid);
        let data = {
          id: rowid
        };
        console.log(JSON.stringify(data));
        res.send(rowid);
      }
    }
  ); // callback, postcardDB.run
}); // callback, app.post


function handleYearbookTable1(request, response, next) {
  console.log("inside (GENERAL) handleYearbookTable");

  let r = request._parsedOriginalUrl.pathname.replace("/getLoad/", "");

  if (r.length != 22) {
    //request from /results
    let cmd = "SELECT * FROM YearbookTable";
    yearbookDB.all(cmd, function(err, data) {
      //get needed search
      if (err) {
        console.log("Database reading error", err.message);
        next();
      } else {
        // send shopping list to browser in HTTP response body as JSON
        response.json(data);
      }
    });
  }
}
  
function handleYearbookTable2(request, response, next) { //from viewer
  console.log("inside Specific Handler");

  let r = request._parsedOriginalUrl.pathname.replace("/getLoad2/", "");

    cmd = "SELECT * FROM YearbookTable WHERE rowId = ?";
    yearbookDB.get(cmd, r, function(err, data) {
      //get needed search
      if (err) {
        console.log("Database reading error", err.message);
        next();
      } else {
        // send shopping list to browser in HTTP response body as JSON
        response.json(data);
      }
    });
}

app.get("/getLoad2/:id", handleYearbookTable2);
app.get("/getLoad", handleYearbookTable1); //to retieve whole yearbook


function deleteYearbookEntry(request, response, next) {
 console.log("inside deleteYearbookEntry");

  let r = request._parsedOriginalUrl.pathname.replace("/updateProfile/", "");

  cmd = "DELETE FROM YearbookTable WHERE rowId = ?";
  yearbookDB.get(cmd, r, function(err, res) {
    if(err){
      console.log("Database deletion error", err.message);
    } else{
      console.log("Deletion success");
      response.json("success");
    }
  })
  
}

app.get("/updateProfile/:id", deleteYearbookEntry);

app.get("/getGoogleId/", function(req,res) {  //To check if user is on their own viewer page
    console.log("inside server /getGoogleId/", req._parsedOriginalUrl.pathname)
  console.log("googleId: ", googleId);
  res.json(googleId); //return the currently saved googe id
  
})

// Setup passport, passing it information about what we want to do
passport.use(
  new GoogleStrategy(
    // object containing data to be sent to Google to kick off the login process
    // the process.env values come from the key.env file of your app
    // They won't be found unless you have put in a client ID and secret for
    // the project you set up at Google
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://different-luck-dresser.glitch.me/auth/accepted", // info I changed
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo", // where to go for info
      scope: ["profile", "email"] // the information we will ask for from Google
    },
    // function to call to once login is accomplished, to get info about user from Google;
    // it is defined down below.
    gotProfile
  )
);

// take HTTP message body and put it as a string into req.body
app.use(bodyParser.urlencoded({ extended: true }));

// puts cookies into req.cookies
app.use(cookieParser());

// Prof Amenta's hack
// pipeline stage that echos the url and shows the cookies, for debugging.
app.use("/", printIncomingRequest);

// Now some stages that decrypt and use cookies

// express handles decryption of cooikes, storage of data about the session,
// and deletes cookies when they expire
app.use(
  expressSession({
    secret: "bananaBread", // a random string used for encryption of cookies
    maxAge: 6 * 60 * 60 * 1000, // Cookie time out - six hours in milliseconds
    // setting these to default values to prevent warning messages
    resave: true,
    saveUninitialized: false,
    // make a named session cookie; makes one called "connect.sid" as well
    name: "ecs162-session-cookie"
  })
);

// Initializes request object for further handling by passport
app.use(passport.initialize());

// If there is a valid cookie, will call passport.deserializeUser()
// which is defined below.  We can use this to get user data out of
// a user database table, if we make one.
// Does nothing if there is no cookie
app.use(passport.session());

// currently not used
// using this route, we can clear the cookie and close the session
app.get('/logoff',
  function(req, res) {
    // clear both the public and the named session cookie
    res.clearCookie('google-passport-example');
    res.clearCookie('ecs162-session-cookie');
    googleId="";
    res.redirect('/');
  }
);

// The usual pipeline stages

// Public files are still serverd as usual out of /public
app.get("/*", express.static("public"));

// special case for base URL, goes to index.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});


app.get("/input", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/results", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});
app.get("/results/*", function(req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

// Glitch assests directory
app.use("/assets", assets);

// stage to serve files from /user, only works if user in logged in

// If user data is populated (by deserializeUser) and the
// session cookie is present, get files out
// of /user using a static server.
// Otherwise, user is redirected to public splash page (/index) by
// requireLogin (defined below)
app.get('/user/*', requireUser, requireLogin, express.static('.'));

// Now the pipeline stages that handle the login process itself

// Handler for url that starts off login with Google.
// The app (in public/index.html) links to here (note not an AJAX request!)
// Kicks off login process by telling Browser to redirect to Google.
//app.get('/auth/google', alreadyLoggedIn);                                //      <------------------ /auth/google
app.get('/auth/google', alreadyLoggedIn, passport.authenticate('google'));           
// The first time its called, passport.authenticate sends 302
// response (redirect) to the Browser
// with fancy redirect URL that Browser will send to Google,
// containing request for profile, and
// using this app's client ID string to identify the app trying to log in.
// The Browser passes this on to Google, which brings up the login screen.

// Google redirects here after user successfully logs in.
// This second call to "passport.authenticate" will issue Server's own HTTPS
// request to Google to access the user's profile information with the
// temporary key we got from Google.
// After that, it calls gotProfile, so we can, for instance, store the profile in
// a user database table.
// Then it will call passport.serializeUser, also defined below.
// Then it either sends a response to Google redirecting to the /setcookie endpoint, below
// or, if failure, it goes back to the public splash page.
app.get('/auth/accepted', 
  passport.authenticate('google', 
    { successRedirect: '/setcookie', failureRedirect: '/' }
  )
);

// One more time! a cookie is set before redirecting
// to the protected homepage
// this route uses two middleware functions.
// requireUser is defined below; it makes sure req.user is defined
// the second one makes a public cookie called
// google-passport-example
app.get('/setcookie', requireUser,
  function(req, res) {
    // if(req.get('Referrer') && req.get('Referrer').indexOf("google.com")!=-1){
      // mark the birth of this cookie
  
      // set a public cookie; the session cookie was already set by Passport
      res.cookie('google-passport-example', new Date());
     // res.redirect('/user/hello.html');
      res.redirect('/input');
    //} else {
    //   res.redirect('/');
    //}
  }
);

// custom 404 page (not a very good one...)
// last item in pipeline, sends a response to any request that gets here

app.all("*", function(request, response) {
  response.status(404); // the code for "not found"
  response.send("This is not the droid you are looking for");
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});


// Some functions called by the handlers in the pipeline above


// Function for debugging. Just prints the incoming URL, and calls next.
// Never sends response back. 
function printIncomingRequest (req, res, next) {
    console.log("Serving",req.url);
    if (req.cookies) {
      console.log("cookies",req.cookies)
    }
    next();
}



// function that handles response from Google containint the profiles information. 
// It is called by Passport after the second time passport.authenticate
// is called (in /auth/accepted/)
function gotProfile(accessToken, refreshToken, profile, done) {
    //console.log("Google profile",profile);
    console.log("Google Id: ", profile.id);
    
    // here is a good place to check if user is in DB,
    // and to store him in DB if not already there. 
    // Second arg to "done" will be passed into serializeUser,
    // should be key to get user out of database.
    googleId = profile.id; //temporarily save the user google id to use as rowId when submit id clicked
    let dbRowID = profile.id;  // temporary! Should be the real unique
    // key for db Row for this user in DB table.
    // Note: cannot be zero, has to be something that evaluates to
    // True.  

    done(null, dbRowID); 
}


// Part of Server's sesssion set-up.  
// The second operand of "done" becomes the input to deserializeUser
// on every subsequent HTTP request with this session's cookie. 
// For instance, if there was some specific profile information, or
// some user history with this Website we pull out of the user table
// using dbRowID.  But for now we'll just pass out the dbRowID itself.
passport.serializeUser((dbRowID, done) => {
    console.log("SerializeUser. Input is",dbRowID);
    done(null, dbRowID);
});

// Called by passport.session pipeline stage on every HTTP request with
// a current session cookie (so, while user is logged in)
// This time, 
// whatever we pass in the "done" callback goes into the req.user property
// and can be grabbed from there by other middleware functions
passport.deserializeUser((dbRowID, done) => {
    console.log("deserializeUser. rowID is:", dbRowID);
    let cmd = "SELECT * FROM YearbookTable WHERE rowId = ?";
    let userData ={userData:""};
    yearbookDB.get(cmd, dbRowID, function(err, data) {
      //get needed search
      if (data == undefined || err) {
        console.log("DeserializeUser: Couldn't find user in database");
      } else {
        // send yearbook table to browser in HTTP response body as JSON
        console.log("DeserializeUser: found user in database");
        console.log("here's their data: ", data);
        userData = {userData: data};  
        
      }
    });
    // here is a good place to look up user data in database using
    // dbRowID. Put whatever you want into an object. It ends up
    // as the property "user" of the "req" object. 
    // let userData = {userData: "maybe data from db row goes here"};
    done(null, userData);
});



// https://piazza.com/class/k8eo96o9a0w1xn?cid=1216
function alreadyLoggedIn(req, res, next) {
  if(req.user) {
    // logged in
    console.log("user is already logged in!");
    console.log("req.user: ", req.user);
    googleId = req.user.rowId; //access rowid 
    res.redirect('/results');
  } else {
    // not logged in
    console.log("user hasn't logged in yet");
    //res.redirect('/auth/google');
    ///passport.authenticate("google")
    next();
  }
}

function requireUser (req, res, next) {
  console.log("require user",req.user)
  if (!req.user) {
    res.redirect('/');
  } else {
    console.log("user is",req.user);
    next();
  }
};

function requireLogin (req, res, next) {
  console.log("checking:",req.cookies);
  if (!req.cookies['ecs162-session-cookie']) {
    res.redirect('/');
  } else {
    next();
  }
};


