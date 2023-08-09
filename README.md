If you experience problems while trying to start the PageAdmin container, regarding permissions, use this:
> sudo chown -R 5050:5050 pgadmin

In order to run the back-end application:
> docker-compose up --build -d

In order to run the client application:
> npm install
> npm start
