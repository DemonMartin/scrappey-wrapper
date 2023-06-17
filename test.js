const Scrappey = require('.');

// Replace 'YOUR_API_KEY' with your Scrappey API key
const apiKey = '';

// Create an instance of Scrappey
const scrappey = new Scrappey(apiKey);

async function runTest() {
    try {
        // Create a session
        const session = await scrappey.createSession();

        console.log(session)

        // Make a GET request
        const getRequestResult = await scrappey.getRequest('https://reqres.in/api/users', session.session);
        console.log('GET Request Result:', getRequestResult);

        // Make a POST request
        const postData = { username: 'user123', password: 'pass456' };
        const postRequestResult = await scrappey.postRequest('https://reqres.in/api/users', postData, session.session);
        console.log('POST Request Result:', postRequestResult);

        // Destroy the session
        await scrappey.destroySession(session.session);
        console.log('Session destroyed.');
    } catch (error) {
        console.error(error);
    }
}

runTest();
