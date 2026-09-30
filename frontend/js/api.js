const API_BASE_URL = "http://localhost:5000/api";


/* ================= COMMON API FUNCTION ================= */

async function apiRequest(endpoint, options = {}) {

    try {

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,

                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {})
                }
            }
        );


        // Try to read JSON response
        const data = await response.json();


        // Check HTTP status
        if (!response.ok) {

            throw new Error(
                data.message || `Request failed with status ${response.status}`
            );

        }


        return data;

    } catch (error) {

        console.error("API Error:", error);

        throw error;
    }
}


/* ================= BUILDINGS ================= */

async function getBuildings() {

    return await apiRequest("/buildings");

}


async function getBuilding(id) {

    return await apiRequest(`/buildings/${id}`);

}


async function createBuilding(data) {

    return await apiRequest("/buildings", {

        method: "POST",

        body: JSON.stringify(data)

    });

}


async function updateBuilding(id, data) {

    return await apiRequest(`/buildings/${id}`, {

        method: "PUT",

        body: JSON.stringify(data)

    });

}


async function deleteBuilding(id) {

    return await apiRequest(`/buildings/${id}`, {

        method: "DELETE"

    });

}


/* ================= FLATS ================= */

async function getFlats() {

    return await apiRequest("/flats");

}


async function createFlat(data) {

    return await apiRequest("/flats", {

        method: "POST",

        body: JSON.stringify(data)

    });

}


async function updateFlat(id, data) {

    return await apiRequest(`/flats/${id}`, {

        method: "PUT",

        body: JSON.stringify(data)

    });

}


async function deleteFlat(id) {

    return await apiRequest(`/flats/${id}`, {

        method: "DELETE"

    });

}


/* ================= TENANTS ================= */

async function getTenants() {

    return await apiRequest("/tenants");

}


async function createTenant(data) {

    return await apiRequest("/tenants", {

        method: "POST",

        body: JSON.stringify(data)

    });

}


async function updateTenant(id, data) {

    return await apiRequest(`/tenants/${id}`, {

        method: "PUT",

        body: JSON.stringify(data)

    });

}


async function deleteTenant(id) {

    return await apiRequest(`/tenants/${id}`, {

        method: "DELETE"

    });

}


/* ================= RENT ================= */

async function getRents() {

    return await apiRequest("/rents");

}


async function createRent(data) {

    return await apiRequest("/rents", {

        method: "POST",

        body: JSON.stringify(data)

    });

}


async function updateRent(id, data) {

    return await apiRequest(`/rents/${id}`, {

        method: "PUT",

        body: JSON.stringify(data)

    });

}


/* ================= DEPOSIT ================= */

async function getDeposits() {

    return await apiRequest("/deposits");

}


async function createDeposit(data) {

    return await apiRequest("/deposits", {

        method: "POST",

        body: JSON.stringify(data)

    });

}


async function updateDeposit(id, data) {

    return await apiRequest(`/deposits/${id}`, {

        method: "PUT",

        body: JSON.stringify(data)

    });

}


/* ================= ELECTRICITY ================= */

async function getElectricityBills() {

    return await apiRequest("/electricity");

}


async function createElectricityBill(data) {

    return await apiRequest("/electricity", {

        method: "POST",

        body: JSON.stringify(data)

    });

}


async function updateElectricityBill(id, data) {

    return await apiRequest(`/electricity/${id}`, {

        method: "PUT",

        body: JSON.stringify(data)

    });

}


/* ================= DOCUMENTS ================= */

async function getDocuments() {

    return await apiRequest("/documents");

}


async function createDocument(data) {

    return await apiRequest("/documents", {

        method: "POST",

        body: JSON.stringify(data)

    });

}


/* ================= COMPLAINTS ================= */

async function getComplaints() {

    return await apiRequest("/complaints");

}


async function createComplaint(data) {

    return await apiRequest("/complaints", {

        method: "POST",

        body: JSON.stringify(data)

    });

}


async function updateComplaint(id, data) {

    return await apiRequest(`/complaints/${id}`, {

        method: "PUT",

        body: JSON.stringify(data)

    });

}


/* ================= MAINTENANCE ================= */

async function getMaintenance() {

    return await apiRequest("/maintenance");

}


async function createMaintenance(data) {

    return await apiRequest("/maintenance", {

        method: "POST",

        body: JSON.stringify(data)

    });

}


async function updateMaintenance(id, data) {

    return await apiRequest(`/maintenance/${id}`, {

        method: "PUT",

        body: JSON.stringify(data)

    });

}