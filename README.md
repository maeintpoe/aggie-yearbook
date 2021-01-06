# Yearbook Project (Team: The EventListeners)

## How to use our app
Navigate to: different-luck-dresser.glitch.me 

If you are a student, click the "Student Login" button to login with your UCDavis kerberos id and
password to proceed to the "input" page.  Here you will input the requested information and upload a
headshot.  If you would like to input your information at another time, you may log out by clicking
the "Log out" button in the upper-lefthand corner, which will take you back to the home/login page. 
Otherwise, once you click submit, you will then be redirected to your "results" page, which is your
individual graduate profile page containing the info and photo you submitted.  You can edit your
profile by clicking the "Update Profile" button. Otherwise, you can click "Back" to view the rest
of your fellow graduating students' profiles. 

If you are a relative or friend of a student, you will click the "Viewer Login" button, which will
take you to the "results" page containing previews of the graduating students' individual profiles. 
Here you can enter a student's name or major in the search bar to narrow down your search.  If you
click on a student's preview card, it will take you to their individual profile page where you can
learn more about that student.  Click "back" to view the rest of the graduating students' profiles.

## Design Choices

Our design choices were based off the original UC Davis website and branding for all of the pages.

In comparison to the mock-up, we implemented only one search bar and no buttons for the user
to search by first name, last name, and/or major. This way, users are able to see real-time filtering
rather than wait for the website to make api calls everytime they want to search up someone.

We implemented an "Update Profile" button that allows for the logged-in graduate to view and
edit their own profile if they find any errors or mispells in their original profile.

An intentional decision we made was to not include the questionnaire/survey portion of the
yearbook in since it was stated that it was optional.

It didn't seem right to include gender as a search parameter, so we only allowed searches by
first name, last name, and/or major (to also allow multiple parameter search). Instead, we included
preferred pronouns in the longer version of the graduate's info card as it is more appropriate.

## Tech used
Frontend: React, Material-ui

Backend: Node.js, Express.js, Passport.js

Database: sqlite3

## Authorship

Fullstack: Ma Eint Poe, Kody Nguyen

Implementing CSS: Kira Bender


