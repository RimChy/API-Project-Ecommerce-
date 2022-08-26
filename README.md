# API Project (Ecommerce)

## Objectives
To develop API-based websites to simulate the functionalities of e-commerce
services among different organisations.
## Description
In this project, we simulate the e-commerce functionalities among different
organisations. We consider three different organisations: an e-commerce
organisation, a backend product supplier which supplies required products
to the e-commerce organisation and a Bank to facilitate transactions between different
entities within this eco-system.

## Contributors: 

    * Rim Chowdhury (2017331032)                 * Muhid Hassan Risvy (2017331086)
    * Email: rimchy32@gmail.com                  * Email: hassan.risvy1@gmail.com
    * https://github.com/RimChy                  * https://github.com/Risvy  

### Prerequisites
* Git
* Curl
* Node.js 
* MongoDB

### Intalling Node.js

Install NVM (Node Version Manager):
```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
source ~/.bashrc
```
Make sure your node version >= 14.15.0
```
node --version
# v14.15.0
```

### Installing Git and Curl 
```
sudo apt install -y git curl
```

### Installing MongoDB
You can follow <a href="https://www.cherryservers.com/blog/how-to-install-and-start-using-mongodb-on-ubuntu-20-04">this tutorial to install MongoDB</a> in your system. After installing, execute the command to start the MongoDB service:
```
sudo systemctl start mongod
```

## Downloading the project

Here's is the demostration to download the project in the Home directory. 
```
cd
git clone https://github.com/RimChy/API-Project-Ecommerce-.git 
```
This is download <a href="https://github.com/RimChy/API-Project-Ecommerce-">this project</a> from GitHub. Now open the project folder and go to 'server' directory. Then install the following dependencies to run the project.
```
cd server
npm install
npm i express ejs hbs body-parser bcryptjs jsonwebtoken alert multer mongoose fs promt uuid path dotenv morgan cors express-session express-fileupload --save
```
Inside "server" directory we will find app.js. Run app.js using node or <a href="https://www.npmjs.com/package/nodemon">nodemon</a>
```
node app.js
```
## Run the project
Now visit http://localhost:7000/ and we are online. (Use https if you face any trouble).




