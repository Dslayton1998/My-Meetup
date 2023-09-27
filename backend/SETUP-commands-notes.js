/*
                    ! Dependencies !
    ? npm init -y
        - Initializes server's "package.json"

    ? npm install ...
        - cookie-parser: parsing cookies from request
        - cors:  Cross-Origin Resource Sharing (C.O.R.S.)
        - csurf: Cross-Site Request Forgery (C.S.R.F)
        - dotenv: load environment variables into Node.js from a .env file
        - express - Express
        - express-async-errors - handling async route handlers
        - helmet - security middleware
        - jsonwebtoken - JWT
        - morgan - logging information about server requests/responses
        - per-env - use environment variables for starting app differently
        - sequelize@6 - Sequelize
        - sequelize-cli@6 - use sequelize in the command line
        - pg - use Postgres as the production environment database

    ? npm install -D
        - sqlite3 - SQLite3
        - dotenv-cli - use dotenv in the command line
        - nodemon - hot reload server backend files

* AFTER config setup, during sequelize setup
    ? npx sequelize init
    - ^ Initializes Sequelize to the db folder

* THEN after psql-setup...
    ? npx dotenv sequelize db:migrate
    - migrate the database to make sure you set everything up correctly.
*/
