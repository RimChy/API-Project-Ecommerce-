# API Project (Ecommerce)

## Objectives
To develop **API-based** websites to simulate the functionalities of e-commerce
services among different organisations.
## Description
In this project, we simulate the e-commerce functionalities among different
organisations. We consider **three** different organisations: _an e-commerce
organisation_, _a backend product supplier_ which supplies required products
to the e-commerce organisation and _a Bank_ to facilitate transactions between different
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
You can follow <a href="https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/">MongoDB Official documentation to install MongoDB</a> in your system. After installing, execute the command to start the MongoDB service:
```
sudo systemctl start mongod
```
or, ```sudo systemctl start mongodb``` if you installed MongoDB from the system repo. (This installation from Ubuntu system repo is NOT recommended by official Mongo docs, it's quite outdated for now. Reference: https://stackoverflow.com/questions/48092353/failed-to-start-mongod-service-unit-mongod-service-not-found#comment121861244_48092470)

## Downloading the project

Here's is the demonstration to download the project in the Home directory. 
```
cd
git clone https://github.com/RimChy/API-Project-Ecommerce-.git 
```
Now, <a href="https://github.com/RimChy/API-Project-Ecommerce-">this repository</a> will be downloaded. Open the _project folder_ and go to _'server'_ directory. Then install the following dependencies to finally run the project.
```
cd API-Project-Ecommerce-/server
npm install
npm i express ejs hbs body-parser bcryptjs jsonwebtoken alert multer mongoose fs promt uuid path dotenv morgan cors express-session express-fileupload --save
```
Inside "server" directory we will find app.js. Run app.js using node or <a href="https://www.npmjs.com/package/nodemon">nodemon</a>
```
node app.js
```
Note: If you face any error, make sure your node version >= 14.15.0 ,

## Run the project
Now visit http://localhost:7000/ and we are online. (Use https if you face any trouble).


## How to make the best out of this website

To get the full experience, we will add some products from **admin side** to complete the demonstration. 
### Admin Side
* Visit http://localhost:7000/admin-sign
* Username: admin@gmail.com
* Password: 123admin@
* Go to **Categories** tab to add a category.
* Then, go to **Products** tab to add a product, along with description and images of the product. 
* **Log out** from admin side.
* Finally visit: http://localhost:7000/ to see the products. 

### Supplier Side
* Visit http://localhost:7000/supplier to view the supplier page, including supplier's balance and dashboard.

### Optional

Hope the first time installation was successful.

Now every time we need to run the project, we just have to run the following commands.
```
cd API-Project-Ecommerce-/server
nodemon app.js
```
Now hit the URL: http://localhost:7000/ and we are online! 





