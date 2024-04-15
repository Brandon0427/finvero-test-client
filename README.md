# Nest.js Backend Finvero Test Server

## Description

This software is a cutting-edge financial application crafted using React, aimed at revolutionizing your banking interactions. This application enables users to seamlessly engage with their diverse bank accounts and transactions through an intuitive interface (through Belvo APIs).

## Features

- **Unified Banking Experience**: Access and manage multiple bank accounts effortlessly from a centralized platform.
- **Transaction Management**: Clients can easily view, categorize, and track transactions across all linked accounts in real-time.
- **RESTful APIs:**: Implements RESTful APIs for seamless communication with server appl.
- **Interactive Dashboard**: Gain valuable insights into spending patterns, account balances, and financial trends with interactive visual representations.
- **Secure Authentication**: Robust authentication mechanisms and encryption techniques ensure the security of our clients' financial data.

## Technologies used

### Node.js

- React.js
- React Router Dom

### Typescript

- Procedural Programming Paradigm
- Object-Oriented Programming Paradigm

## Getting Started

1.  Open your preferred command line interface (CLI).

2.  Clone the project with:

* * *

>       git clone 'https://github.com/Brandon0427/finvero-test-client.git'

* * *
    
3.  Execute the following command to download all the dependencies and update the package-lock.json:
* * *

>       npm i

* * *
    
4.  Head to the root of the directory of this project and create a .env file.
    
5.  Inside the .env file add the following secrets (you must sustitute to the actual values):

*Server Credentials*
- FINVERO_TEST_SERVER=xxxxxxxxxx

## Launching the project

### Local Execution on Dev Encironment

1.  Run the initialization.
    *The original code of the server will execute on **localhost:3000***

* * *

>       npm run dev

* * *

2.  Register a New User and wait a few seconds for the environment creation.

3.  Enjoy the dashboard!

### Local Execution on Prod Environment

1.  Build the project.

* * *

>       npm run build

* * *

2.  Run the initialization.

* * *

>       npm run start

* * *

3.  Register a New User and wait a few seconds for the environment creation.

4.  Enjoy the dashboard!

## Updating the project

1.  Open your preferred Command Line Interface (CLI).
2.  Change to *main* branch of the project:

* * *

>       git checkout main

* * *

3.  Update the project with the latest changes on *main* or the most updated branch:

* * *

>       git pull origin main

* * *

4.  Create a **new branch** out of the *main* branch:

* * *

>       git checkout -b <new-branch-name>

* * *

5.  Hackerman time!
6.  Commit the changes locally with:

* * *

>       git add .
>       git commit -m "Hackerman changes made to the branch!"

* * *

7.  Push the changes of your **new branch** to the project:

* * *

>       git push -u origin <new-branch-name>

* * *

## Project status

Main branch of the project is fully developed as for the purpose of the projects

## Useful Information
- It is imperative that the app is running while also the finvero-server is running, else it won't work.
- This frontend was built with a previosly designed template (to achieve better UI/UX). However the only interactive routes (with its corresponding modules) for the test are: '/', '/login', '/register', '/dashboard'.
- You might need to update your env.js to your corresponding local environment settings.

## Sources

### Nest.js

- [README Syntax Documentation](https://github.com/ricval/Documentacion/blob/master/Markdown/daringfireball/syntax.md?plain=1)
