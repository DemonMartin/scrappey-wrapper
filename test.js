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
        // This all under the same session ID, so you don't need to pass cookies again
        const postData = { username: 'user123', password: 'pass456' };
        const postRequestOptions = {
            url: 'https://reqres.in/api/users',
            postData,
            sessionId: session.session,
        };
        const postRequestResult = await scrappey.postRequest(postRequestOptions);
        console.log('POST Request Result:', postRequestResult);

        // Make a JSON post request
        const postDataJson = JSON.stringify({ email: "email@email.com", password: "password"})
        const postRequestOptionsJson = {
            url: "https://backend.scrappey.com/api/auth/login",
            postDataJson,
            customHeaders: {
                'Content-Type': 'application/json',
            },
            sessionId: session.session,
        };
        const postRequestResultJson = await scrappey.postRequest(postRequestOptionsJson);
        console.log('POST Request Result:', postRequestResultJson);

        // Destroy the session
        await scrappey.destroySession(session.session);
        console.log('Session destroyed.');
    } catch (error) {
        console.error(error);
    }
}

runTest();
