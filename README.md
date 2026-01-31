# Assignment 1 - Automation Testing (IT3040)
**Student ID:** IT23821972  
**Option:** 1 (Singlish to Sinhala)

## Project Overview
This project automates the testing of [SwiftTranslator](https://www.swifttranslator.com/) using Playwright. It executes **34 test cases** covering Positive, Negative, and Boundary scenarios.

### Key Features
* **Sequential Execution:** Runs tests one by one to prevent crashing the website.
* **Automatic Screenshots:** Captures a screenshot of the Input and Output for *every single test case*.
* **HTML Report Integration:** Screenshots are embedded directly into the test report for easy viewing.
* **Robustness:** Uses dynamic waiting to ensure translation is complete before capturing evidence.

## Prerequisites
* Node.js installed
* VS Code installed

## Installation
1.  Open the project folder in VS Code.
2.  Open the terminal (`Ctrl + ~`).
3.  Install the required dependencies:
    ```bash
    npm install
    ```

## How to Run the Tests
To execute all 34 test cases and generate screenshots:

1.  Run the test command:
    ```bash
    npx playwright test
    ```
2.  Wait for the tests to complete (approx. 1-2 minutes).

## Viewing the Results
### Option 1: View Screenshots in Folder
Navigate to the `screenshots/` folder in your project directory. Images are organized by category:
* `screenshots/1_Sentence_Structure/`
* `screenshots/2_Questions_Commands/`
* ...and so on.

### Option 2: View HTML Report (Recommended)
To see the results with attached screenshots in your browser:
```bash
npx playwright show-report