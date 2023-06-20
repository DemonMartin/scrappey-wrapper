const Scrappey = require('.');

// Replace 'YOUR_API_KEY' with your Scrappey API key
const apiKey = '';

// Create an instance of Scrappey
const scrappey = new Scrappey(apiKey);

async function runTest() {
    try {
        // Create a session
        console.log("Creating sessionId.")
        const session = await scrappey.createSession();
        console.log(session);

        // Make a GET request
        const getRequestOptions = {
            url: 'https://reqres.in/api/users',
            sessionId: session.session,
        };
        const getRequestResult = await scrappey.getRequest(getRequestOptions);
        console.log('GET Request Result:', getRequestResult);

        // Make a POST request
        const postData = { username: 'user123', password: 'pass456' };
        const postRequestOptions = {
            url: 'https://reqres.in/api/users',
            postData,
            sessionId: session.session,
        };
        const postRequestResult = await scrappey.postRequest(postRequestOptions);
        console.log('POST Request Result:', postRequestResult);

        // Destroy the session
        await scrappey.destroySession(session.session);
        console.log('Session destroyed.');
    } catch (error) {
        console.error(error);
    }
}

runTest();
