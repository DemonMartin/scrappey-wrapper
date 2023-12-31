# OUTDATED, USE: https://www.npmjs.com/package/scrappey-wrapper
# 🤖 Scrappey Wrapper - Data Extraction Made Easy

Introducing Scrappey, your comprehensive website scraping solution provided by Scrappey.com. With Scrappey's powerful and user-friendly API, you can effortlessly retrieve data from websites, including those protected by Cloudflare. Join Scrappey today and revolutionize your data extraction process. 🚀

**Disclaimer: Please ensure that your web scraping activities comply with the website's terms of service and legal regulations. Scrappey is not responsible for any misuse or unethical use of the library. Use it responsibly and respect the website's policies.**

Website: [https://scrappey.com/](https://scrappey.com/?via=martin)
GitHub: [https://github.com/](https://github.com/DemonMartin/scrappey-wrapper)

## Topics

- [Installation](#installation)
- [Usage](#usage)
- [Example](#example)
- [License](#license)

## Installation

Use npm to install the Scrappey library. 💻

```shell
npm install scrappey
```

## Usage

Require the Scrappey library in your code. 📦

```javascript
const Scrappey = require('scrappey');
```

Create an instance of Scrappey by providing your Scrappey API key. 🔑

```javascript
const apiKey = 'YOUR_API_KEY';
const scrappey = new Scrappey(apiKey);
```

### Example

Here's an example of how to use Scrappey. 🚀

```javascript
const Scrappey = require('scrappey');

// Replace 'YOUR_API_KEY' with your Scrappey API key
const apiKey = 'YOUR_API_KEY';

// Create an instance of Scrappey
const scrappey = new Scrappey(apiKey);

function getQueryString(object) {
    const queryString = Object.keys(object)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(object[key]))
        .join('&');
    return queryString;
}

async function run() {
    try {
        // Create a session
        const sessionRequest = await scrappey.createSession();
        const { session } = sessionRequest;

        console.log('Created Session:', session);

        // Make a GET request
        const getRequestResult = await scrappey.getRequest({
            url: 'https://reqres.in/api/users',
            session,
        });
        console.log('GET Request Result:', getRequestResult);

        // Make a POST request using FormData
        const postFormData = { username: 'user123', password: 'pass456' };
        const postRequestResultForm = await scrappey.postRequest({
            url: 'https://reqres.in/api/users',
            postData: getQueryString(postFormData),
            session
        });
        console.log('POST Request Result (FormData):', postRequestResultForm);

        // Make a POST request using JSON data
        const postJsonData = { email: 'user@example.com', password: 'pass123' };
        const postRequestResultJson = await scrappey.postRequest({
            url: 'https://reqres.in/api/users',
            postData: JSON.stringify(postJsonData),
            customHeaders: {
                'Content-Type': 'application/json', // Optional. To avoid issues please still add if you send JSON Data.
                // 'auth': 'token'
            },
            session,
            // proxyCountry: "UnitedStates"
            // & more!
        });
        console.log('POST Request Result (JSON):', postRequestResultJson);

        // Manually destroy the session (automatically destroys after 4 minutes)
        await scrappey.destroySession(session);
        console.log('Session destroyed.');
    } catch (error) {
        console.error(error);
    }
}

run();
```

**Scrappey Wrapper Features:**

- Client-side error correction and handling
- Easy session management with session creation and destruction
- Support for GET and POST requests
- Support for both FormData and JSON data formats
- Customizable headers for requests
- Robust and user-friendly
- JSDocs supported

For more information, please visit the [official Scrappey documentation](https://wiki.scrappey.com/getting-started). 📚

## License

This project is licensed under the MIT License.

## Additional Tags

cloudflare anti bot bypass, cloudflare solver, scraper, scraping, cloudflare scraper, cloudflare turnstile solver, turnstile solver, data extraction, web scraping, website scraping, data scraping, scraping tool, API scraping, scraping solution, web data extraction, website data extraction, web scraping library, website scraping library, cloudflare bypass, scraping API, web scraping API, cloudflare protection, data scraping tool, scraping service, cloudflare challenge solver, web scraping solution, web scraping service, cloudflare scraping, cloudflare bot protection, scraping framework, scraping library, cloudflare bypass tool, cloudflare anti-bot, cloudflare protection bypass, cloudflare solver tool, web scraping tool, data extraction library, website scraping tool, cloudflare turnstile bypass, cloudflare anti-bot solver, turnstile solver tool, cloudflare scraping solution, website data scraper, cloudflare challenge bypass, web scraping framework, cloudflare challenge solver tool, web data scraping, data scraper, scraping data from websites, SEO, data mining, data harvesting, data crawling, web scraping software, website scraping tool, web scraping framework, data extraction tool, web data scraper, data scraping service, scraping automation, scraping tutorial, scraping code, scraping techniques, scraping best practices, scraping scripts, scraping tutorial, scraping examples, scraping challenges, scraping tricks, scraping tips, scraping tricks, scraping strategies, scraping methods, cloudflare protection bypass, cloudflare security bypass, web scraping Python, web scraping JavaScript, web scraping PHP, web scraping Ruby, web scraping Java, web scraping C#, web scraping Node.js, web scraping BeautifulSoup, web scraping Selenium, web scraping Scrapy, web scraping Puppeteer, web scraping requests, web scraping headless browser, web scraping dynamic content, web scraping AJAX, web scraping pagination, web scraping authentication, web scraping cookies, web scraping session management, web scraping data parsing, web scraping data cleaning, web scraping data analysis, web scraping data visualization, web scraping legal issues, web scraping ethics, web scraping compliance, web scraping regulations, web scraping IP blocking, web scraping anti-scraping measures, web scraping proxy, web scraping CAPTCHA solving, web scraping IP rotation, web scraping rate limiting, web scraping data privacy, web scraping consent, web scraping terms of service, web scraping robots.txt, web scraping data storage, web scraping database integration, web scraping data integration, web scraping API integration, web scraping data export, web scraping data processing, web scraping data transformation, web scraping data enrichment, web scraping data validation, web scraping error handling, web scraping scalability, web scraping performance optimization, web scraping distributed scraping, web scraping cloud-based scraping, web scraping serverless scraping, akamai, datadome, perimetex, shape, kasada, queue-it, incapsula.
