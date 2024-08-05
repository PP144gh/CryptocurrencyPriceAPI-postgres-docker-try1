# Price feed API alerts + database + docker assessment try #1

This was a technical assessment in an interview process I was in. With time I improved it until I was satisfied with it. It is a basic front-end in React that is connect to a backend using expres.js. The backend queries a cryptocurrency price API. In the front-end one introduces the needed inputs  - Pair, Fetch Interval and Price Oscillation Trigger - and presses start. The alerts that are generated are shown in the frontend and stored in a postgres database.

## setup instructions:

have docker installed.

### in root:

docker-compose up --build

### to acess frontend in browser: 

http://localhost:3000/ 

## execution instructions

In the browser fill the input fields (Pair, Fetch Interval and Price Oscillation Trigger) and press start. 

Example inputs:

ETH-USD 5000 0.01

The alerts will show in the Alerts list, and added to a database. You can check the database entries doing:

docker exec -it cryptocurrencypriceapi-postgres-docker-try1_db_1 psql -U postgres -d eventLogger

SELECT * FROM price_data;
