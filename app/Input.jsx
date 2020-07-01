const React = require("react");
const Router = require("react-router-dom").Router;
const Link = require("react-router-dom").Link;
const Switch = require("react-router-dom");
const Route = require("react-router-dom");
const Viewer = require("./Viewer");
const Header = require("./Header");
const Footer = require("./Footer");

const Input = function() {
  const uploadImg = function() {
    // get the file with the file dialog box
    const selectedFile = document.querySelector("#imgUpload").files[0];
    // store it in a FormData object
    const formData = new FormData();
    formData.append("newImage", selectedFile, selectedFile.name);

    let button = document.querySelector(".btn");

    // build an HTTP request data structure
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload");
    xhr.onloadend = function(e) {
      // Get the server's response to the upload
      let url = "http://ecs162.org:3000/images/mwpoe/" + selectedFile.name;

      let newImage = document.querySelector("#cardImg");

      newImage.src =
        "https://different-luck-dresser.glitch.me/images/" + selectedFile.name;

      newImage.style.display = "block";
      document.querySelector(".image").classList.remove("upload");
      button.textContent = "Replace Image";
    };
    button.textContent = "Uploading...";
    // actually send the request
    xhr.send(formData);
    //   });
  };

  const submitClicked = () => {
    console.log("SubmitClicked Function entered!");
    let bio = document.querySelector("#bio-input");
    let img = document.querySelector("#cardImg");
    let parser = new URL(img.src);
    console.log("this is img.src:", img.src);
    let pic = parser.pathname.replace("/images/", "");
    console.log("this is what we parsed from img:", pic);
    let firstname = document.querySelector("#first-name");
    let lastname = document.querySelector("#last-name");
    let major = document.querySelector("#major");
    let gender = document.querySelector("#gender");
    //let id = c;
    // change Browser src to 162 storage
    img.src = "http://ecs162.org:3000/images/mwpoe/" + pic;

    let data = {
      // id: c,
      image: "http://ecs162.org:3000/images/mwpoe/" + pic,
      bio: bio.innerText,
      firstname: firstname.innerText,
      lastname: lastname.innerText,
      name: firstname.innerText + " " + lastname.innerText,
      firstmajor: firstname.innerText +  " " + major.value,
      lastmajor: lastname.innerText + " " + major.value,
      namemajor: firstname.innerText + " " + lastname.innerText + " " + major.value,
      major: major.value,
      gender: gender.value,
    };
    console.log("data: ", data);

    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/saveDisplay");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.onloadend = function(e) {
      //load the viwer page

      window.location.href = "/results/" + xmlhttp.responseText;
    };
    xmlhttp.send(JSON.stringify(data));
  };

  return (
    <div>
      <Header />
      <div id="topSection">
              <a href="logoff">
          <button className="centered" id="logoutButton">
            Log out
          </button>
        </a>
        </div>
      <div className="input">
          <div className="first-two">
            <div className="image upload">
              <img id="cardImg" alt="user uploaded img" />
              <form method="post" encType="multipart/form-data">
                <button className="btn">Upload Image</button>
                <input
                  id="imgUpload"
                  type="file"
                  accept="image/*"
                  name="photo"
                  onChange={uploadImg}
                />
              </form>
            </div>

            <div className="mid-column">
              <div className="name-wrap">
                <div
                  contentEditable="true"
                  placeholder="First Name"
                  className="name"
                  id="first-name"
                ></div>
                <div
                  contentEditable="true"
                  placeholder="Last Name"
                  className="name"
                  id="last-name"
                ></div>
              </div>

              <select id="major">
                <option value="default">Major</option>
                <option value="Aerospace Science and Engineering">
                  {" "}
                  Aerospace Science and Engineering
                </option>
                <option value="African American and African Studies">
                  African American and African Studies
                </option>
                <option value="Agricultural and Environmental Education">
                  Agricultural and Environmental Education
                </option>
                <option value="Animal Biology">Animal Biology</option>
                <option value="Animal Science">Animal Science</option>
                <option value="Animal Science and Management">
                  Animal Science and Management
                </option>
                <option value="Anthropology">Anthropology</option>
                <option value="Applied Chemistry">Applied Chemistry</option>
                <option value="Applied Mathematics">Applied Mathematics</option>
                <option value="Applied Physics">Applied Physics</option>
                <option value="Art History">Art History</option>
                <option value="Art Studio">Art Studio</option>
                <option value="Asian American Studies">
                  Asian American Studies
                </option>
                <option value="Atmospheric Science">Atmospheric Science</option>
                <option value="Biochemical Engineering">
                  Biochemical Engineering
                </option>
                <option value="Biochemistry and Molecular Biology">
                  Biochemistry and Molecular Biology
                </option>
                <option value="Biological Sciences">Biological Sciences</option>
                <option value="Biological Systems Engineering">
                  Biological Systems Engineering
                </option>
                <option value="Biomedical Engineering">
                  Biomedical Engineering
                </option>
                <option value="Biotechnology">Biotechnology</option>
                <option value="Cell Biology">Cell Biology</option>
                <option value="Chemical Engineering">
                  Chemical Engineering
                </option>
                <option value="Chemical Physics">Chemical Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Chicana/Chicano Studies">
                  Chicana/Chicano Studies
                </option>
                <option value="Chinese">Chinese</option>
                <option value="Cinema and Digital Media">
                  Cinema and Digital Media
                </option>
                <option value="Civil Engineering">Civil Engineering</option>
                <option value="Classical Civilization">
                  Classical Civilization
                </option>
                <option value="Clinical Nutrition">Clinical Nutrition</option>
                <option value="Cognitive Science">Cognitive Science</option>
                <option value="Communication">Communication</option>
                <option value="Community and Regional Development">
                  Community and Regional Development
                </option>
                <option value="Comparative Literature">
                  Comparative Literature
                </option>
                <option value="Computer Engineering">
                  Computer Engineering
                </option>
                <option value="Computer Science">Computer Science</option>
                <option value="Computer Science and Engineering">
                  Computer Science and Engineering
                </option>
                <option value="Design">Design</option>
                <option value="East Asian Studies">East Asian Studies</option>
                <option value="Ecological Management and Restoration">
                  Ecological Management and Restoration
                </option>
                <option value="Economics">Economics</option>
                <option value="Electrical Engineering">
                  Electrical Engineering
                </option>
                <option value="English">English</option>
                <option value="Entomology">Entomology</option>
                <option value="Environmental Engineering">
                  Environmental Engineering
                </option>
                <option value="Environmental Horticulture and Urban Forestry">
                  Environmental Horticulture and Urban Forestry
                </option>
                <option value="Environmental Policy Analysis and Planning">
                  Environmental Policy Analysis and Planning
                </option>
                <option value="Environmental Science and Management">
                  Environmental Science and Management
                </option>
                <option value="Environmental Toxicology">
                  Environmental Toxicology
                </option>
                <option value="Evolution, Ecology and Biodiversity">
                  Evolution, Ecology and Biodiversity
                </option>
                <option value="Food Science">Food Science</option>
                <option value="French">French</option>
                <option value="Gender, Sexuality and Women Studies">
                  Gender, Sexuality and Women Studies
                </option>
                <option value="Genetics and Genomics">
                  Genetics and Genomics
                </option>
                <option value="Geology">Geology</option>
                <option value="German">German</option>
                <option value="Global Disease Biology">
                  Global Disease Biology
                </option>
                <option value="History">History</option>
                <option value="Human Development">Human Development</option>
                <option value="Hydrology">Hydrology</option>
                <option value="International Agricultural Development">
                  International Agricultural Development
                </option>
                <option value="International Relations">
                  International Relations
                </option>
                <option value="Italian">Italian</option>
                <option value="Japanese">Japanese</option>
                <option value="Landscape Architecture">
                  Landscape Architecture
                </option>
                <option value="Linguistics">Linguistics</option>
                <option value="Managerial Economics">
                  Managerial Economics
                </option>
                <option value="Marine and Coastal Science—Coastal Environmental Processes or Marine Environmental Chemistry">
                  Marine and Coastal Science—Coastal Environmental Processes or
                  Marine Environmental Chemistry
                </option>
                <option value="Marine and Coastal Science—Marine Ecology and Organismal Biology">
                  Marine and Coastal Science—Marine Ecology and Organismal
                  Biology
                </option>
                <option value="Marine and Coastal Science—Oceans and the Earth System">
                  Marine and Coastal Science—Oceans and the Earth System
                </option>
                <option value="Materials Science and Engineering">
                  Materials Science and Engineering
                </option>
                <option value="Mathematical Analytics and Operations Research">
                  Mathematical Analytics and Operations Research
                </option>
                <option value="Mathematical and Scientific Computation">
                  Mathematical and Scientific Computation
                </option>
                <option value="Mathematics">Mathematics</option>
                <option value="Mechanical Engineering">
                  Mechanical Engineering
                </option>
                <option value="Medieval and Early Modern Studies">
                  Medieval and Early Modern Studies
                </option>
                <option value="Middle East/South Asia Studies">
                  Middle East/South Asia Studies
                </option>
                <option value="Molecular and Medical Microbiology (Formerly Microbiology)">
                  Molecular and Medical Microbiology (Formerly Microbiology)
                </option>
                <option value="Music">Music</option>
                <option value="Native American Studies">
                  Native American Studies
                </option>
                <option value="Neurobiology, Physiology and Behavior">
                  Neurobiology, Physiology and Behavior
                </option>
                <option value="Nutrition Science">Nutrition Science</option>
                <option value="Pharmaceutical Chemistry">
                  Pharmaceutical Chemistry
                </option>
                <option value="Philosophy">Philosophy</option>
                <option value="Physics">Physics</option>
                <option value="Plant Biology">Plant Biology</option>
                <option value="Plant Sciences">Plant Sciences</option>
                <option value="Political Science">Political Science</option>
                <option value="Political Science – Public Service">
                  Political Science – Public Service
                </option>
                <option value="Psychology">Psychology</option>
                <option value="Religious Studies">Religious Studies</option>
                <option value="Russian">Russian</option>
                <option value="Science and Technology Studies">
                  Science and Technology Studies
                </option>
                <option value="Sociology">Sociology</option>
                <option value="Sociology—Organizational Studies">
                  Sociology—Organizational Studies
                </option>
                <option value="Spanish">Spanish</option>
                <option value="Statistics">Statistics</option>
                <option value="Sustainable Agriculture and Food Systems">
                  Sustainable Agriculture and Food Systems
                </option>
                <option value="Sustainable Environmental Design">
                  Sustainable Environmental Design
                </option>
                <option value="Theatre and Dance">Theatre and Dance</option>
                <option value="Viticulture and Enology">
                  Viticulture and Enology
                </option>
                <option value="Wildlife, Fish and Conservation Biology">
                  Wildlife, Fish and Conservation Biology
                </option>
              </select>

              <div
                contentEditable="true"
                placeholder="Write a short bio"
                id="bio-input"
              ></div>
            </div>
          </div>
          <div className="extra-q">
            <select id="gender">
              <option value="Default">Preferred Pronouns</option>
              <option value="she/her/hers">she/her/hers</option>
              <option value="he/him/his">he/him/his</option>
              <option value="they/them/theirs">they/them/theirs</option>
              <option value="Decline to state">Decline to State</option>
            </select>

            <button id="submit" onClick={submitClicked}>
              Submit
            </button>
          </div>
      
      </div>
      <Footer />
    </div>
  );
};

module.exports = Input;
