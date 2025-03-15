import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const logResponse = (testName, action, response) => {
    console.log(`[${testName}] Success: ${action}`, response.data);
};

const handleError = (testName, action, error) => {
    console.error(`[${testName}] Error: ${action}`, error.response ? error.response.data : error.message);
};

const testApi = async () => {
    console.log("Starting API Test...");

    let tokenA, tokenB;
    let authHeaderA, authHeaderB;
    let createdContacts = [];

    try {
        console.log("[Test 1] Registering User A");
        const userA = {email: "userA@example.com", password: "password123"};
        const registerUserA = await axios.post(`${BASE_URL}/auth/register`, userA);
        logResponse("Test 1", "Register User A", registerUserA);
    } catch (error) {
        if (error.response && error.response.status === 409) {
            console.log("[Test 1] Success: Email already registered (expected behavior).");
        } else {
            handleError("Test 1", "Register User A", error);
        }
    }

    try {
        console.log("[Test 2] Registering User B");
        const userB = {email: "userB@example.com", password: "password456"};
        const registerUserB = await axios.post(`${BASE_URL}/auth/register`, userB);
        logResponse("Test 2", "Register User B", registerUserB);
    } catch (error) {
        if (error.response && error.response.status === 409) {
            console.log("[Test 2] Success: Email already registered (expected behavior).");
        } else {
            handleError("Test 2", "Register User B", error);
        }
    }

    try {
        console.log("[Test 3] Logging in User A");
        const userA = {email: "userA@example.com", password: "password123"};
        const loginUserA = await axios.post(`${BASE_URL}/auth/login`, userA);
        logResponse("Test 3", "Login User A", loginUserA);
        tokenA = loginUserA.data.token;
        authHeaderA = {headers: {Authorization: `Bearer ${tokenA}`}};
    } catch (error) {
        handleError("Test 3", "Login User A", error);
    }

    try {
        console.log("[Test 3.1] Fetching current user details");
        const getCurrentUserRes = await axios.get(`${BASE_URL}/auth/current`, authHeaderA);
        logResponse("Test 3.1", "Get Current User", getCurrentUserRes);

        const {email, subscription, ...extraFields} = getCurrentUserRes.data;
        if (email && subscription && Object.keys(extraFields).length === 0) {
            console.log("[Test 3.1] Success: Correct current user response format.");
        } else {
            console.error("[Test 3.1] Error: Response contains extra fields:", getCurrentUserRes.data);
        }
    } catch (error) {
        handleError("Test 3.1", "Get Current User", error);
    }

    try {
        console.log("[Test 4] Logging in User B");
        const userB = {email: "userB@example.com", password: "password456"};
        const loginUserB = await axios.post(`${BASE_URL}/auth/login`, userB);
        logResponse("Test 4", "Login User B", loginUserB);
        tokenB = loginUserB.data.token;
        authHeaderB = {headers: {Authorization: `Bearer ${tokenB}`}};
    } catch (error) {
        handleError("Test 4", "Login User B", error);
    }

    try {
        console.log("[Test 5] Creating Contacts for User A");
        const contacts = [
            {name: "Alice", email: "alice@example.com", phone: "(123) 456-7890"},
            {name: "Bob", email: "bob@example.com", phone: "(987) 654-3210"}
        ];

        for (const contact of contacts) {
            const createRes = await axios.post(`${BASE_URL}/contacts`, contact, authHeaderA);
            logResponse("Test 5", "Create Contact", createRes);
            createdContacts.push(createRes.data.id);
        }
    } catch (error) {
        handleError("Test 5", "Create Contact", error);
    }

    try {
        console.log("[Test 5.1] Updating Contact Favorite Status");
        const contactToUpdate = createdContacts[1];
        const updateFavorite = {favorite: true};

        const updateFavoriteRes = await axios.patch(
            `${BASE_URL}/contacts/${contactToUpdate}/favorite`,
            updateFavorite,
            authHeaderA
        );
        logResponse("Test 5.1", "Update Contact Favorite Status", updateFavoriteRes);
    } catch (error) {
        handleError("Test 5.1", "Update Contact Favorite Status", error);
    }

    try {
        console.log("[Test 6] Getting all contacts for User A");
        const getAllUserA = await axios.get(`${BASE_URL}/contacts`, authHeaderA);
        logResponse("Test 6", "Get All Contacts (User A)", getAllUserA);
    } catch (error) {
        handleError("Test 6", "Get All Contacts (User A)", error);
    }

    try {
        console.log("[Test 7] Trying to get a contact of User A by ID as User B");

        const contactId = createdContacts[0];

        const response = await axios.get(`${BASE_URL}/contacts/${contactId}`, authHeaderB);

        handleError("Test 7", "Unexpected Success: Retrieved User A's Contact as User B", {
            response: {data: response.data, status: response.status}
        });
    } catch (error) {
        if (error.response) {
            if (error.response.status === 401) {
                console.log("[Test 7] Success: Unauthorized access to User A's contact correctly denied.");
            } else if (error.response.status === 404) {
                console.log("[Test 7] Success: Contact not found for User B (correct behavior).");
            } else {
                handleError("Test 7", "Get Contact by ID (User B, Should Fail)", error);
            }
        } else {
            handleError("Test 7", "Unexpected Error Fetching Contact by ID", error);
        }
    }

    try {
        console.log("[Test 8] Testing Pagination");
        const getPaginatedContacts = await axios.get(`${BASE_URL}/contacts?page=1&limit=1`, authHeaderA);
        logResponse("Test 8", "Paginated Contacts (User A, limit=1)", getPaginatedContacts);
    } catch (error) {
        handleError("Test 8", "Paginated Contacts (User A, limit=1)", error);
    }

    try {
        console.log("[Test 9] Testing Favorite Filtering");
        const getFavoriteContacts = await axios.get(`${BASE_URL}/contacts?favorite=true`, authHeaderA);
        logResponse("Test 9", "Favorite Contacts (User A)", getFavoriteContacts);
    } catch (error) {
        handleError("Test 9", "Favorite Contacts (User A)", error);
    }

    try {
        console.log("[Test 10] Updating a Contact");
        const contactToUpdate = createdContacts[0];
        const updateData = {name: "Alice Updated"};
        const updateRes = await axios.put(`${BASE_URL}/contacts/${contactToUpdate}`, updateData, authHeaderA);
        logResponse("Test 10", "Update Contact", updateRes);
    } catch (error) {
        handleError("Test 10", "Update Contact", error);
    }

    try {
        console.log("[Test 11] Verifying Updated Contact");
        const contactToUpdate = createdContacts[0];
        const verifyUpdateRes = await axios.get(`${BASE_URL}/contacts/${contactToUpdate}`, authHeaderA);
        logResponse("Test 11", "Verify Updated Contact", verifyUpdateRes);
    } catch (error) {
        handleError("Test 11", "Verify Updated Contact", error);
    }

    try {
        console.log("[Test 12] Deleting a Contact");
        const contactToDelete = createdContacts[1];
        const deleteRes = await axios.delete(`${BASE_URL}/contacts/${contactToDelete}`, authHeaderA);
        logResponse("Test 12", "Delete Contact", deleteRes);
    } catch (error) {
        handleError("Test 12", "Delete Contact", error);
    }

    try {
        console.log("[Test 13] Verifying Deletion (should fail)");
        const contactToDelete = createdContacts[1];

        const response = await axios.get(`${BASE_URL}/contacts/${contactToDelete}`, authHeaderA);

        handleError("Test 13", "Unexpected Success: Contact Still Exists", {
            response: {data: response.data, status: response.status}
        });
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.log("[Test 13] Success: Contact correctly not found after deletion.");
        } else {
            handleError("Test 13", "Verify Contact Deletion (Should Fail)", error);
        }
    }

    try {
        console.log("[Test 14] Updating Subscription");
        const updateSubscription = await axios.patch(
            `${BASE_URL}/auth/subscription`,
            {subscription: "pro"},
            authHeaderA
        );
        logResponse("Test 14", "Update Subscription (User A)", updateSubscription);
    } catch (error) {
        handleError("Test 14", "Update Subscription (User A)", error);
    }

    try {
        console.log("[Test 15] Logging out User A");
        await axios.post(`${BASE_URL}/auth/logout`, {}, authHeaderA);
        console.log("[Test 15] Success: Logout User A");
    } catch (error) {
        handleError("Test 15", "Logout User A", error);
    }

    try {
        console.log("[Test 16] Verifying User A Cannot Access Contacts After Logout");

        const response = await axios.get(`${BASE_URL}/contacts`, authHeaderA);

        handleError("Test 16", "Unexpected Success: Access Granted After Logout", {
            response: {data: response.data, status: response.status}
        });
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("[Test 16] Success: Access correctly denied after logout.");
        } else {
            handleError("Test 16", "Access Contacts After Logout (Should Fail)", error);
        }
    }

    try {
        console.log("[Test 17] Logging in with an unregistered email");
        const fakeUser = {email: "unregistered@example.com", password: "password123"};
        await axios.post(`${BASE_URL}/auth/login`, fakeUser);
        handleError("Test 17", "Unexpected Success: Logged in with an unregistered email", {});
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log("[Test 17] Success: Unauthorized access for unregistered email.");
        } else {
            handleError("Test 17", "Login with unregistered email", error);
        }
    }

    console.log("API Test Completed");
};

(async () => {
    await testApi();
})();
