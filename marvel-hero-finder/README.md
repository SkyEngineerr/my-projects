Node.js & Passport Login
This is a user login and registration app using Node.js, Express, Passport, Mongoose, EJS and some other packages.


npm i express bcryptjs passport passport-local express-ejs-layouts mongoose connect-flash express-session
npm i -D nodemon
npm i dotenv

Version: 2.0.0
Usage
$ npm install
$ npm start
# Or run with Nodemon
$ npm run dev

# Visit http://localhost:5000
MongoDB
Open "config/keys.js" and add your MongoDB URI, local or Atlas


                ===HEROKU===
git init
git add .
git commit -m 'Initial commit'
heroku create
heroku git:remote -a morning-citadel-44849
git push heroku master
heroku open
