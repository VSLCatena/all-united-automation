# Containerized All United Automation
This is a simple API that uses selenium to access data from All United for further automation.
It acts as an user because thats the only way to access the data.
All united does not have an API and uses PHP sessions.

## Selenium
Selenium is a tool that allows you to automate browser actions.
It is used in this project to access the data from All United.

## Get started
 - Create a `.env` file with the properties visible in `env.example`.
 - Run `npm install` to install the packages.
 - Run `docker compose up` to start the container.

## Cron
The cron is used to call the /synchronisation endpoint every day at midnight. <br>
The /health route can be used to check the health status of the API.

## Build
For local use ```npm run build``` to build the project.<br>
For docker use: <br>
```docker build -t vslcatena/synchronisation-api -f Dockerfile.prod .```