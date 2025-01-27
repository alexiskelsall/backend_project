# Northcoders News API


## Setting up the enviroment variables:


Since .env.* files are ignored and not tracked in the repository, you must create them manually to run the project locally.


1. Install the `dotenv` package:
   ```bash
   npm install dotenv
   ```

2. Create a `.env` file in the root of the project directory and set the `PGDATABASE` environment variable to the desired database name (see setup.sql file):
   ```env
   PGDATABASE=nc_news
   ```

3. Run the application locally:
   ```bash
   npm start
   ```