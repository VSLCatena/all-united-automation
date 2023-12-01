# Containerized All United Automation
This is a simple script that uses selenium to access data from All United for further automation.
It acts as an user because thats the only way to access the data.

## Selenium
Selenium is a tool that allows you to automate browser actions.
It is used in this project to access the data from All United.

## Get started
Be sure to have an env file with the properties visible in `env.example`.
After that be sure to `npm install` the packages.

### Run
```npm run start``` to run the script which is always headless (No browser).<br>
If you want to run it with a visible browser comment the headless option ```.addArguments("--headless") // Comment when testing locally```
inside `index.ts`.