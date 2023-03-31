const webpage = require('webpage');
const urls = ['src/test/index.html'];

async function runTests() {
    for (const url of urls) {
        console.log(`Loading: ${url}`);
        const page = await new Promise((resolve, reject) => {
            const page = webpage.create();
            page.onLoadFinished = status => {
                if (status === 'success') resolve(page);
                else reject(new Error(`Failed to load: ${url}`));
            };
            page.open(url);
        });

        try {
            const results = await evaluateTestResults(page);
            printTestResults(results);
            if (results.passed === 0 || results.failed + results.errored > 0) {
                console.error('Tests failed.');
                process.exit(1);
            }
        } catch (error) {
            console.error(error);
            process.exit(1);
        } finally {
            page.close();
        }
    }
    console.log('All tests completed successfully.');
    process.exit(0);
}

async function evaluateTestResults(page) {
    return await page.evaluate(() => {
        const passed = Math.max(0, document.querySelectorAll('.pass').length - 1);
        const resultHeader = document.querySelector('#wru strong');
        return {
            total: `${passed} tests (${resultHeader ? resultHeader.textContent.replace(/\D/g, '') : 'no'} assertions)`,
            passed: passed,
            failed: Math.max(0, document.querySelectorAll('.fail').length - 1),
            errored: Math.max(0, document.querySelectorAll('.error').length - 1)
        };
    });
}

function printTestResults(results) {
    console.log('- - - - - - - - - -');
    console.log(`total:   ${results.total}`);
    console.log('- - - - - - - - - -');
    console.log(`passed:  ${results.passed}`);
    console.log(`failed:  ${results.failed}`);
    console.log(`errored: ${results.errored}`);
    console.log('- - - - - - - - - -');
}

runTests();
