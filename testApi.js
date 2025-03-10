import axios from "axios";

const BASE_URL = "http://localhost:3000/api/contacts";

const logResponse = (action, response) => {
    console.log(`Success ${action}; Response:`, response.data);
};

const handleError = (action, error) => {
    console.error(`Error ${action}; Response:`, error.response ? error.response.data : error.message);
};

const testApi = async () => {
    try {
        const getAllRes = await axios.get(BASE_URL);
        logResponse("Get All Contacts", getAllRes);

        const newContact = {
            name: "Jane Doe", email: "jane.doe@example.com", phone: "(987) 654-3210"
        };
        const createRes = await axios.post(BASE_URL, newContact);
        logResponse("Create Contact", createRes);
        const createdContactId = createRes.data.id;

        const getOneRes = await axios.get(`${BASE_URL}/${createdContactId}`);
        logResponse("Get One Contact", getOneRes);

        const updateData = {name: "Jane Updated"};
        const updateRes = await axios.put(`${BASE_URL}/${createdContactId}`, updateData);
        logResponse("Update Contact", updateRes);

        const favoriteUpdate = { favorite: true };
        const favoriteRes = await axios.patch(`${BASE_URL}/${createdContactId}/favorite`, favoriteUpdate);
        logResponse("Update Favorite Status", favoriteRes);

        const verifyFavoriteRes = await axios.get(`${BASE_URL}/${createdContactId}`);
        logResponse("Verify Favorite Status", verifyFavoriteRes);

        const deleteRes = await axios.delete(`${BASE_URL}/${createdContactId}`);
        logResponse("Delete Contact", deleteRes);
    } catch (error) {
        handleError("API Test", error);
    }
};

(async () => {
    await testApi();
})();
