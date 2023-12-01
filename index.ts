import { Builder, By, Capabilities, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome";
import firefox from "selenium-webdriver/firefox";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// Helpful debug function
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadMemberFile() {
    let options = new firefox.Options()
        .addArguments("--headless") // Comment when testing locally
        .setPreference("browser.download.dir", process.env.DOWNLOAD_LOCATION)
        .setPreference("browser.download.folderList", 2)
        .setPreference(
            "browser.helperApps.neverAsk.saveToDisk",
            "application/csv" // Only download CSV files
        )
        .setPreference("pdfjs.disabled", true); // disable the built-in PDF viewer

    const driver = await new Builder()
        .forBrowser("firefox")
        .setFirefoxOptions(options)
        .build();

    try {
        // Navigate to Google
        await driver.get("https://pr01.allunited.nl/");
        // Find the login input fields
        const systemnameInput = await driver.findElement(By.id("id-33-265"));
        const usernameInput = await driver.findElement(By.id("id-33-30"));
        const passwordInput = await driver.findElement(By.id("id-33-32"));

        // Fill in the login input fields
        systemnameInput.sendKeys(process.env.SYSTEMNAME ?? "");
        usernameInput.sendKeys(process.env.USERNAME ?? "");
        passwordInput.sendKeys(process.env.PASSWORD ?? "");

        // Submit the login form
        const loginForm = await driver.findElement(By.id("form33"));
        const loginButton = await driver.findElement(By.css("input[type='submit'][value='Inloggen']"));
        loginButton.click();

        // Wait for the next page to load
        await driver.wait(until.stalenessOf(loginForm));

        // Home page
        // Open "relaties" sub menu
        const relatiesMenu = await driver.findElement(By.css("ul#backofficeMenu li:first-child a"));
        await relatiesMenu.click();

        const homeForm = await driver.findElement(By.id("form17020"));

        // Click on the "Selectie wizard" link
        const selectieWizardLink = await driver.findElement(By.linkText("Selectie wizard"));
        selectieWizardLink.click();
        await driver.wait(until.stalenessOf(homeForm));

        // Selectie wizard page
        const wizardForm = await driver.findElement(By.id("form16494"));

        // Click on the "Alle Leden" link
        const buttonElement = await driver.findElement(By.css("tbody tr:nth-child(3) td:nth-child(2) input"));
        buttonElement.click();

        // Wait for the next page to load
        await driver.wait(until.stalenessOf(wizardForm));

        // Create file for download
        const createFile = await driver.findElement(By.css("input[type='submit'][value='Bestand']"));
        createFile.click();

        // Wait for download link to appear
        await driver.wait(until.elementLocated(By.id('systemMessageBlock')));

        // Find the download link element
        const downloadLink = await driver.findElement(By.css("a.upload-file"));

        // Simulate a click on the download link
        await driver.executeScript("arguments[0].click();", downloadLink);


    } finally {
        // Quit the WebDriver instance
        await driver.quit();
    }
}

downloadMemberFile();