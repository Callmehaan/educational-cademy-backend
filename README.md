# Educational Academy Backend Project
It’s an API-based backend project with __[Express](https://expressjs.com/)__ library and __[Mongoose](https://mongoosejs.com/)__ ODM and __MVC arcitecture__ that includes almost everything a website academy needs.

## Entities
In this project, we have __14 entities__ with every details that could be helpful such as auth, user, course, comment, category, order and etc. All entities have a Model that designed by Mongoose. As you expect, we have __14 Contollers__ for every routes.

## Middlewares
Three middlewares are there. We have _auth.js_ for authenticating routes that need to be authenticated. We have _isAdmin.js_ as __role guard__ for our project and in the other hand,  _joiValidator.js_ is our validator middleware that takes __validator schema__ and check if our entry data is correct or not.

## Utils
In this directory we just have our _uploader_. I used __[Multer](https://www.npmjs.com/package/multer)__ as uploader.

## Validators
I wrote two validator for _register_ and _courses_ for now.

## Packages
Here all package I used for this project :
  - [express](https://expressjs.com/),
  - [mongoose](https://mongoosejs.com/), 
  - [bcrypt](https://www.npmjs.com/package/bcrypt), 
  - [body-parser](https://npmjs.com/package/body-parser), 
  - [cors](https://www.npmjs.com/package/cors),
  - [dotenv](https://www.npmjs.com/package/dotenv),  
  - [joi](https://www.npmjs.com/package/joi), 
  - [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), 
  - [multer](https://www.npmjs.com/package/multer), 
  - [nodemailer](https://www.npmjs.com/package/nodemailer), 
  - [nodemon](https://www.npmjs.com/package/nodemon), 
