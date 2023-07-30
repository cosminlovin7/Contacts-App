Auth TOKEN : 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

If you experience problems while trying to start the PageAdmin container, regarding permissions, use this:
> sudo chown -R 5050:5050 pgadmin

In order to run the back-end application:
> docker-compose up --build -d