const Scrappey = require('.');
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path")
// Replace 'YOUR_API_KEY' with your Scrappey API key
const apiKey = '';
const showData = false;

// Most error types look like this:
// testMethod-region-errorIdentifier
// Examples: 
// test-client-get_request
// advancedtest-server-get_request

function getQueryString(object) {
    //console.log("getQueryString Method was called.")
    const queryString = Object.keys(object)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(object[key]))
        .join('&');


    //console.log(`getQueryString Method returned: ${queryString}`)
    return queryString;
}

function saveError(error, type = "undefined") {
    if (!fs.existsSync(path.join(__dirname, "errors"))) {
        fs.mkdirSync(path.join(__dirname, "errors"));
    }

    const errorId = crypto.randomUUID().slice(-5);
    const errorDate = Date.now();

    let errorObject;

    if (typeof error === "string") {
        errorObject = {
            type,
            errorId,
            errorDate,
            message: error
        };
    } else {
        errorObject = {
            type,
            errorId,
            errorDate,
            name: error.name,
            message: error.message,
            stack: error.stack
        };
    }

    const fileName = `${errorDate}-${errorId}.json`;
    fs.writeFileSync(path.join(__dirname, 'errors', fileName), JSON.stringify(errorObject, null, 2));
    console.log(`[~] Saved Error to: ./errors/${fileName}`);
    return errorObject;
}


async function runTest() {

    // Create an instance of Scrappey
    const scrappey = new Scrappey(apiKey, false);
    console.log("[test] [✅] Successfully created Scrappey Class.")

    try {
        let sessionId = `testSession-${crypto.randomUUID().slice(-5)}`;
        try {
            console.log("[test] [~] Create Session")
            const sessionRequest = await scrappey.createSession();
            console.log(`[test] [✅-client] Successfully created Session.`)
            if (typeof sessionRequest?.error !== "undefined") {
                console.log(`[test] [❌] Failed Creating Session.`)
                saveError(
                    JSON.stringify(sessionRequest, null, 2),
                    "test-server-create_session"
                )
            } else {
                const { session } = sessionRequest;
                console.log("[test] [✅-server] Created Session: " + session)
                sessionId = session;
            }

            if (showData) console.log(sessionRequest);
        } catch (error) {
            console.log("[test] [❌-client] Failed Creating Session")
            saveError(error, "test-client-create_session");
        }

        try {
            // Make a GET request
            console.log("[test] [~] Get Request")
            const getRequestResult = await scrappey.getRequest({
                url: 'https://reqres.in/api/users',
                session: sessionId
            });
            console.log(`[test] [✅-client] Successfully got Request.`)
            if (showData) console.log(getRequestResult);

            if (typeof getRequestResult?.error !== "undefined") {
                console.log(`[test] [❌-server] Failed Getting Request.`)
                saveError(
                    JSON.stringify(getRequestResult, null, 2),
                    "test-server-get_request"
                )
            } else {
                if (!scrappey.isJSON(getRequestResult.solution.innerText)) {
                    console.log(`[test] [❌-server] Failed Getting Request. Response is not JSON.`)
                    saveError(
                        JSON.stringify(getRequestResult, null, 2),
                        "test-server-get_request"
                    )
                } else if (getRequestResult.solution.innerText.includes("george.bluth@reqres.in")) {
                    console.log(`[test] [✅-server] Successfully got Request.`)
                } else {
                    console.log(`[test] [❌-server] Failed Getting Request. Response does not contain the correct data.`)
                    saveError(
                        JSON.stringify(getRequestResult, null, 2),
                        "test-server-get_request"
                    )
                }
            }
        } catch (error) {
            console.log("[test] [❌-client] Failed Getting Request")
            saveError(error, "test-client-get_request");
        }

        try {
            // Make a POST request using FormData
            console.log("[test] [~] Post Request (FormData)")
            const postFormData = { username: 'user123', password: 'pass456' };
            const postRequestResult = await scrappey.postRequest({
                url: 'https://reqres.in/api/users',
                postData: getQueryString(postFormData), // The getQueryString Method will convert the Object to FormData. This will automatically be sent with the application/x-www-form-urlencoded header.
                session: sessionId
            });
            console.log(`[test] [✅-client] Successfully posted Request (FormData).`)
            if (showData) console.log(postRequestResult);

            if (typeof postRequestResult?.error !== "undefined") {
                console.log(`[test] [❌-server] Failed Posting Request (FormData).`)
                saveError(
                    JSON.stringify(postRequestResult, null, 2),
                    "test-server-post_request_formdata"
                )
            } else {
                if (!scrappey.isJSON(postRequestResult.solution.innerText)) {
                    console.log(`[test] [❌-server] Failed Posting Request (FormData). Response is not JSON.`)
                    saveError(
                        JSON.stringify(postRequestResult, null, 2),
                        "test-server-post_request_formdata"
                    )
                } else if (postRequestResult.solution.innerText.includes("user123")) {
                    console.log(`[test] [✅-server] Successfully posted Request (FormData).`)
                } else {
                    console.log(`[test] [❌-server] Failed Posting Request (FormData). Response does not contain the correct data.`)
                    saveError(
                        JSON.stringify(postRequestResult, null, 2),
                        "test-server-post_request_formdata"
                    )
                }
            }


        } catch (error) {
            console.log("[test] [❌-client] Failed Posting Request (FormData).")
            saveError(error, "test-post_request_formdata");
        }

        try {
            // If you dont want to use formData, scrappey also supports pure JSON requests.
            console.log("[test] [~] Post Request (JSON)")
            const postDataJson = JSON.stringify({ email: "email@email.com", password: "password" })
            const postRequestResultJson = await scrappey.postRequest({
                url: "https://reqres.in/api/users",
                postData: postDataJson,
                customHeaders: {
                    'Content-Type': 'application/json', // This is optional, the wrapper should automatically add this if it detects JSON data.
                },
                session: sessionId
            });
            console.log(`[test] [✅-client] Successfully posted Request (JSON).`)
            if (showData) console.log(postRequestResultJson);

            if (typeof postRequestResultJson?.error !== "undefined") {
                console.log(`[test] [❌-server] Failed Posting Request (JSON).`)
                saveError(
                    JSON.stringify(postRequestResultJson, null, 2),
                    "test-server-post_request_json"
                )
            } else {
                if (!scrappey.isJSON(postRequestResultJson.solution.innerText)) {
                    console.log(`[test] [❌-server] Failed Posting Request (JSON). Response is not JSON.`)
                    saveError(
                        JSON.stringify(postRequestResultJson, null, 2),
                        "test-server-post_request_json"
                    )
                } else if (postRequestResultJson.solution.innerText.includes("email@email.com")) {
                    console.log(`[test] [✅-server] Successfully posted Request (JSON).`)
                } else {
                    console.log(`[test] [❌-server] Failed Posting Request (JSON). Response does not contain the correct data.`)
                    saveError(
                        JSON.stringify(postRequestResultJson, null, 2),
                        "test-server-post_request_json"
                    )
                }
            }
        } catch (error) {
            console.log("[test] [❌-client] Failed Posting Request (JSON).")
            saveError(error, "test-post_request_json");
        }

        // ! Important ! Either formData or JSON needs to be used.

        try {
            // Destroy the session
            console.log('[test] [~] Session Destruction')
            const destroySession = await scrappey.destroySession(sessionId);
            console.log(`[test] [✅-client] Successfully destroyed Session.`)
            if (showData) console.log(destroySession);

            if (typeof destroySession?.error !== "undefined") {
                console.log(`[test] [❌-server] Failed Destroying Session.`)
                saveError(
                    JSON.stringify(destroySession, null, 2),
                    "test-server-destroy_session"
                )
            }
        } catch (error) {
            console.log("[test] [❌-client] Failed Destroying Session.")
            saveError(error, "test-destroy_session");
        }

        console.log("[test] All tests have been now executed.")
    } catch (error) {
        console.error(
            "[test] [❌] An error has occured while running the tests."
        );
        saveError(error, "test");
    }
}

async function advancedTests() {
    // soon
}

runTest();
advancedTests();