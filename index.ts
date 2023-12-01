import { Builder, By, WebDriver, until } from "selenium-webdriver";
import firefox from "selenium-webdriver/firefox";
import dotenv from "dotenv";

dotenv.config();

async function createDriver(): Promise<WebDriver> {
    let options = new firefox.Options()
        .addArguments("--headless") // Comment when testing locally
        .setPreference("browser.download.dir", process.env.DOWNLOAD_LOCATION)
        .setPreference("browser.download.folderList", 2)
        .setPreference(
            "browser.helperApps.neverAsk.saveToDisk",
            "application/csv" // Only download CSV files
        )
        .setPreference("pdfjs.disabled", true); // disable the built-in PDF viewer

    return await new Builder()
        .forBrowser("firefox")
        .setFirefoxOptions(options)
        .build();
}

async function login(driver: WebDriver) {
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

    // Waits for the next page to load before returning
    await driver.wait(until.stalenessOf(loginForm));
}

async function navigateToAllMembersPage(driver: WebDriver) {
    // Open "relaties" sub menu in navbar
    const relatiesMenu = await driver.findElement(By.css("ul#backofficeMenu li:first-child a"));
    await relatiesMenu.click();

    // Getting element from homepage, so I know when new page is loaded.
    const homeForm = await driver.findElement(By.id("form17020"));

    // Click on the "Selectie wizard" link
    const selectieWizardLink = await driver.findElement(By.linkText("Selectie wizard"));
    selectieWizardLink.click();

    // Wait for the wizard page to load
    await driver.wait(until.stalenessOf(homeForm));

    // Getting element from wizard page, so I know when new page is loaded.
    const wizardForm = await driver.findElement(By.id("form16494"));

    // Click on the "Alle Leden" link
    const buttonElement = await driver.findElement(By.css("tbody tr:nth-child(3) td:nth-child(2) input"));
    buttonElement.click();

    // Wait for the "Alle Leden" page to load
    await driver.wait(until.stalenessOf(wizardForm));
}

async function downloadMemberFile(driver: WebDriver) {
    // First create the file
    const createFile = await driver.findElement(By.css("input[type='submit'][value='Bestand']"));
    createFile.click();

    // Wait for download link to appear
    await driver.wait(until.elementLocated(By.id('systemMessageBlock')));

    // Find the download link element
    const downloadLink = await driver.findElement(By.css("a.upload-file"));

    // Simulate a click on the download link to download to given DOWNLOAD_LOCATION
    await driver.executeScript("arguments[0].click();", downloadLink);
}

async function main() {
    let driver;
    try {
        // Create a new WebDriver instance
        driver = await createDriver();
        // Navigate to the all united website
        await driver.get("https://pr01.allunited.nl/");

        // Steps
        await login(driver);
        await navigateToAllMembersPage(driver);
        await downloadMemberFile(driver);
    } finally {
        // Quit the WebDriver instance
        await driver.quit();
    }
}

main();