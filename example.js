const Scrappey = require('.');

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
