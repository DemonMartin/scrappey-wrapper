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
            headers: {
                'Content-Type': 'application/json', // Optional. To avoid issues please still add if you send JSON Data.
            },
            session,
            // customHeaders: {
            //     "auth": "token"
            // },
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

function getQueryString(object) {
    const queryString

 = Object.keys(object)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(object[key]))
        .join('&');
    return queryString;
}
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