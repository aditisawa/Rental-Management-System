/* =====================================================
   SMART PROPERTY RENTAL MANAGEMENT SYSTEM
   Frontend Application
===================================================== */


/* ================= GLOBAL ================= */

let buildings = [];
let flats = [];
let tenants = [];
let rents = [];
let deposits = [];
let electricityBills = [];
let documents = [];
let complaints = [];
let maintenanceRecords = [];


/* ================= PAGE NAVIGATION ================= */

function showSection(sectionId, button) {

    document.querySelectorAll(".section")
        .forEach(section => {
            section.classList.remove("active");
        });


    const section = document.getElementById(sectionId);

    if (section) {
        section.classList.add("active");
    }


    document.querySelectorAll(".nav-item")
        .forEach(item => {
            item.classList.remove("active");
        });


    if (button) {
        button.classList.add("active");
    }


    const titles = {

        dashboard: [
            "Dashboard",
            "Overview of your rental properties"
        ],

        buildings: [
            "Buildings",
            "Manage your rental buildings"
        ],

        flats: [
            "Flats",
            "Manage flats and availability"
        ],

        tenants: [
            "Tenants",
            "Manage tenant information"
        ],

        rent: [
            "Rent Management",
            "Track monthly rent payments"
        ],

        deposit: [
            "Security Deposits",
            "Track tenant deposits"
        ],

        electricity: [
            "Electricity Bills",
            "Track electricity usage"
        ],

        documents: [
            "Tenant Documents",
            "Manage tenant documents"
        ],

        complaints: [
            "Complaints",
            "Track tenant complaints"
        ],

        maintenance: [
            "Maintenance",
            "Manage property maintenance"
        ]
    };


    document.getElementById("pageTitle").textContent =
        titles[sectionId][0];

    document.getElementById("pageSubtitle").textContent =
        titles[sectionId][1];


    loadSectionData(sectionId);
}


/* ================= LOAD DATA ================= */

async function loadSectionData(sectionId) {

    try {

        switch (sectionId) {

            case "dashboard":
                await loadDashboard();
                break;

            case "buildings":
                await loadBuildings();
                break;

            case "flats":
                await loadFlats();
                break;

            case "tenants":
                await loadTenants();
                break;

            case "rent":
                await loadRents();
                break;

            case "deposit":
                await loadDeposits();
                break;

            case "electricity":
                await loadElectricity();
                break;

            case "documents":
                await loadDocuments();
                break;

            case "complaints":
                await loadComplaints();
                break;

            case "maintenance":
                await loadMaintenance();
                break;
        }

    } catch (error) {

        showToast(error.message, true);

    }
}


/* ================= DASHBOARD ================= */

async function loadDashboard() {

    buildings = await getBuildings();
    flats = await getFlats();
    tenants = await getTenants();
    rents = await getRents();
    complaints = await getComplaints();


    document.getElementById("totalBuildings")
        .textContent = buildings.length;


    document.getElementById("totalFlats")
        .textContent = flats.length;


    const activeTenants =
        tenants.filter(t =>
            String(t.status).toLowerCase() === "active"
        );


    document.getElementById("totalTenants")
        .textContent = activeTenants.length;


    const paid =
        rents.filter(r =>
            String(r.status).toLowerCase() === "paid"
        );


    document.getElementById("paidRent")
        .textContent = paid.length;


    renderDashboardTenants();
    renderDashboardComplaints();
}


function renderDashboardTenants() {

    const container =
        document.getElementById("dashboardTenants");


    if (!tenants.length) {

        container.innerHTML =
            `<div class="empty">No tenant records found.</div>`;

        return;
    }


    const latest =
        tenants.slice(-5).reverse();


    let html = `
        <table>

            <thead>
                <tr>
                    <th>Name</th>
                    <th>Mobile</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>
    `;


    latest.forEach(tenant => {

        html += `
            <tr>

                <td>${safe(tenant.full_name)}</td>

                <td>${safe(tenant.mobile)}</td>

                <td>
                    ${statusBadge(tenant.status)}
                </td>

            </tr>
        `;

    });


    html += `
            </tbody>
        </table>
    `;


    container.innerHTML = html;
}


function renderDashboardComplaints() {

    const container =
        document.getElementById("dashboardComplaints");


    if (!complaints.length) {

        container.innerHTML =
            `<div class="empty">No complaints found.</div>`;

        return;
    }


    const latest =
        complaints.slice(-5).reverse();


    let html = `
        <table>

            <thead>
                <tr>
                    <th>Complaint</th>
                    <th>Priority</th>
                    <th>Status</th>
                </tr>
            </thead>

            <tbody>
    `;


    latest.forEach(item => {

        html += `
            <tr>

                <td>
                    ${safe(item.complaint_title)}
                </td>

                <td>
                    ${safe(item.priority)}
                </td>

                <td>
                    ${statusBadge(item.status)}
                </td>

            </tr>
        `;

    });


    html += `
            </tbody>
        </table>
    `;


    container.innerHTML = html;
}


/* ================= BUILDINGS ================= */

async function loadBuildings() {

    buildings = await getBuildings();

    const container =
        document.getElementById("buildingList");


    if (!buildings.length) {

        container.innerHTML =
            `<div class="empty">
                No buildings found.
             </div>`;

        return;
    }


    container.innerHTML =
        buildings.map(building => `

            <div class="building-card">

                <div class="building-icon">
                    🏢
                </div>

                <h3>
                    ${safe(building.building_name)}
                </h3>

                <p>
                    ${safe(building.address)}
                </p>

                <p>
                    Floors:
                    ${safe(building.number_of_floors)}
                </p>

                <p>
                    Flats:
                    ${safe(building.total_flats)}
                </p>

                <div class="card-actions">

                    <button
                        class="edit-btn"
                        onclick="editBuilding(${building.building_id})">
                        Edit
                    </button>

                    <button
                        class="danger-btn"
                        onclick="removeBuilding(${building.building_id})">
                        Delete
                    </button>

                </div>

            </div>

        `).join("");
}


/* ================= BUILDING FORM ================= */

function openBuildingForm(building = null) {

    const isEdit = building !== null;


    document.getElementById("modalTitle").textContent =
        isEdit ? "Edit Building" : "Add Building";


    document.getElementById("modalBody").innerHTML = `

        <form class="form"
              onsubmit="saveBuilding(event, ${isEdit ? building.building_id : "null"})">

            <div class="form-grid">

                <div class="form-group">
                    <label>Building Name</label>

                    <input
                        id="buildingName"
                        required
                        value="${isEdit ? safe(building.building_name) : ""}">
                </div>


                <div class="form-group">
                    <label>Number of Floors</label>

                    <input
                        type="number"
                        id="buildingFloors"
                        required
                        value="${isEdit ? building.number_of_floors : ""}">
                </div>


                <div class="form-group">
                    <label>Total Flats</label>

                    <input
                        type="number"
                        id="buildingFlats"
                        required
                        value="${isEdit ? building.total_flats : ""}">
                </div>


                <div class="form-group full">
                    <label>Address</label>

                    <textarea
                        id="buildingAddress"
                        required>${isEdit ? safe(building.address) : ""}</textarea>
                </div>


                <div class="form-group full">
                    <label>Description</label>

                    <textarea
                        id="buildingDescription">${isEdit ? safe(building.description || "") : ""}</textarea>
                </div>

            </div>


            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="closeModal()">
                    Cancel
                </button>

                <button
                    type="submit"
                    class="primary-btn">
                    Save Building
                </button>

            </div>

        </form>
    `;


    openModal();
}


async function saveBuilding(event, id) {

    event.preventDefault();


    const data = {

        building_name:
            document.getElementById("buildingName").value,

        address:
            document.getElementById("buildingAddress").value,

        number_of_floors:
            Number(document.getElementById("buildingFloors").value),

        total_flats:
            Number(document.getElementById("buildingFlats").value),

        description:
            document.getElementById("buildingDescription").value

    };


    try {

        if (id) {

            await updateBuilding(id, data);

            showToast("Building updated successfully.");

        } else {

            await createBuilding(data);

            showToast("Building added successfully.");
        }


        closeModal();

        await loadBuildings();

    } catch (error) {

        showToast(error.message, true);
    }
}


async function editBuilding(id) {

    const building =
        buildings.find(b => b.building_id == id);

    if (building) {
        openBuildingForm(building);
    }
}


async function removeBuilding(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this building?"
        );


    if (!confirmDelete) return;


    try {

        await deleteBuilding(id);

        showToast("Building deleted.");

        await loadBuildings();

    } catch (error) {

        showToast(
            "Cannot delete this building. It may contain flats.",
            true
        );
    }
}


/* ================= FLATS ================= */

async function loadFlats() {

    flats = await getFlats();

    const container =
        document.getElementById("flatTable");


    if (!flats.length) {

        container.innerHTML =
            `<div class="empty">
                No flats found.
             </div>`;

        return;
    }


    let html = `
        <table>

            <thead>
                <tr>

                    <th>Flat</th>
                    <th>Building</th>
                    <th>Floor</th>
                    <th>Type</th>
                    <th>Rent</th>
                    <th>Status</th>
                    <th>Action</th>

                </tr>
            </thead>

            <tbody>
    `;


    flats.forEach(flat => {

        html += `

            <tr>

                <td>${safe(flat.flat_number)}</td>

                <td>${safe(flat.building_name || "-")}</td>

                <td>${safe(flat.floor_number)}</td>

                <td>${safe(flat.flat_type || "-")}</td>

                <td>₹${safe(flat.rent_amount || 0)}</td>

                <td>
                    ${statusBadge(flat.status)}
                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editFlat(${flat.flat_id})">
                        Edit
                    </button>

                </td>

            </tr>

        `;

    });


    html += `
            </tbody>
        </table>
    `;


    container.innerHTML = html;
}


async function openFlatForm(flat = null) {
    const isEdit = flat !== null;

    try {
        // Always get the latest buildings from the database
        buildings = await getBuildings();

        if (!buildings || buildings.length === 0) {
            showToast("Please save a building first.", true);
            return;
            
        }


    document.getElementById("modalTitle").textContent =
        isEdit ? "Edit Flat" : "Add Flat";


    const buildingOptions =
        buildings.map(b => `

            <option
                value="${b.building_id}"
                ${isEdit && flat.building_id == b.building_id
                    ? "selected"
                    : ""}>

                ${safe(b.building_name)}

            </option>

        `).join("");


    document.getElementById("modalBody").innerHTML = `

        <form class="form"
              onsubmit="saveFlat(event, ${isEdit ? flat.flat_id : "null"})">

            <div class="form-grid">

                <div class="form-group">

                    <label>Building</label>

                    <select
                        id="flatBuilding"
                        required>

                        ${buildingOptions}

                    </select>

                </div>


                <div class="form-group">

                    <label>Flat Number</label>

                    <input
                        id="flatNumber"
                        required
                        value="${isEdit ? safe(flat.flat_number) : ""}">

                </div>


                <div class="form-group">

                    <label>Floor Number</label>

                    <input
                        type="number"
                        id="flatFloor"
                        required
                        value="${isEdit ? flat.floor_number : ""}">

                </div>


                <div class="form-group">

                    <label>Flat Type</label>

                    <select id="flatType">

                        <option>1 BHK</option>
                        <option>2 BHK</option>
                        <option>3 BHK</option>
                        <option>Shop</option>
                        <option>Office</option>

                    </select>

                </div>


                <div class="form-group">

                    <label>Rent Amount</label>

                    <input
                        type="number"
                        id="flatRent"
                        value="${isEdit ? flat.rent_amount || "" : ""}">

                </div>


                <div class="form-group">

                    <label>Deposit Amount</label>

                    <input
                        type="number"
                        id="flatDeposit"
                        value="${isEdit ? flat.deposit_amount || "" : ""}">

                </div>


                <div class="form-group">

                    <label>Status</label>

                    <select id="flatStatus">

                        <option>Available</option>
                        <option>Occupied</option>
                        <option>Maintenance</option>

                    </select>

                </div>


                <div class="form-group full">

                    <label>Description</label>

                    <textarea
                        id="flatDescription">${isEdit ? safe(flat.description || "") : ""}</textarea>

                </div>

            </div>


            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="closeModal()">
                    Cancel
                </button>

                <button
                    class="primary-btn"
                    type="submit">
                    Save Flat
                </button>

            </div>

        </form>
    `;


    openModal();
        } catch (error) {
        console.error("Error loading buildings:", error);
        showToast("Unable to load buildings. Please check the backend.", true);
    }
}



async function saveFlat(event, id) {

    event.preventDefault();


    const data = {

        building_id:
            Number(document.getElementById("flatBuilding").value),

        flat_number:
            document.getElementById("flatNumber").value,

        floor_number:
            Number(document.getElementById("flatFloor").value),

        flat_type:
            document.getElementById("flatType").value,

        rent_amount:
            Number(document.getElementById("flatRent").value || 0),

        deposit_amount:
            Number(document.getElementById("flatDeposit").value || 0),

        status:
            document.getElementById("flatStatus").value,

        description:
            document.getElementById("flatDescription").value

    };


    try {

        if (id) {

            await updateFlat(id, data);

            showToast("Flat updated.");

        } else {

            await createFlat(data);

            showToast("Flat added.");

        }


        closeModal();

        await loadFlats();

    } catch (error) {

        showToast(error.message, true);
    }
}


async function editFlat(id) {

    const flat =
        flats.find(f => f.flat_id == id);

    if (flat) {
        openFlatForm(flat);
    }
}


/* ================= TENANTS ================= */

async function loadTenants() {

    tenants = await getTenants();

    const container =
        document.getElementById("tenantTable");


    if (!tenants.length) {

        container.innerHTML =
            `<div class="empty">
                No tenants found.
             </div>`;

        return;
    }


    let html = `

        <table>

            <thead>

                <tr>
                    <th>Name</th>
                    <th>Flat</th>
                    <th>Building</th>
                    <th>Mobile</th>
                    <th>Occupation</th>
                    <th>Status</th>
                </tr>

            </thead>

            <tbody>
    `;


    tenants.forEach(tenant => {

        html += `

            <tr>

                <td>
                    ${safe(tenant.full_name)}
                </td>

                <td>
                    ${safe(tenant.flat_number || "-")}
                </td>

                <td>
                    ${safe(tenant.building_name || "-")}
                </td>

                <td>
                    ${safe(tenant.mobile)}
                </td>

                <td>
                    ${safe(tenant.occupation || "-")}
                </td>

                <td>
                    ${statusBadge(tenant.status)}
                </td>

            </tr>

        `;

    });


    html += `
            </tbody>
        </table>
    `;


    container.innerHTML = html;
}


function openTenantForm() {

    if (!flats.length) {

        showToast(
            "Please add a flat first.",
            true
        );

        return;
    }


    document.getElementById("modalTitle").textContent =
        "Add Tenant";


    const flatOptions =
        flats.map(flat => `

            <option value="${flat.flat_id}">

                ${safe(flat.flat_number)}
                -
                ${safe(flat.building_name || "")}

            </option>

        `).join("");


    document.getElementById("modalBody").innerHTML = `

        <form class="form"
              onsubmit="saveTenant(event)">

            <div class="form-grid">

                <div class="form-group">

                    <label>Flat</label>

                    <select
                        id="tenantFlat"
                        required>

                        ${flatOptions}

                    </select>

                </div>


                <div class="form-group">

                    <label>Full Name</label>

                    <input
                        id="tenantName"
                        required>

                </div>


                <div class="form-group">

                    <label>Mobile</label>

                    <input
                        id="tenantMobile"
                        required>

                </div>


                <div class="form-group">

                    <label>Email</label>

                    <input
                        type="email"
                        id="tenantEmail">

                </div>


                <div class="form-group">

                    <label>Aadhaar Number</label>

                    <input
                        id="tenantAadhaar">

                </div>


                <div class="form-group">

                    <label>PAN Number</label>

                    <input
                        id="tenantPan">

                </div>


                <div class="form-group">

                    <label>Occupation</label>

                    <input
                        id="tenantOccupation">

                </div>


                <div class="form-group">

                    <label>Family Members</label>

                    <input
                        type="number"
                        id="tenantFamily">

                </div>


                <div class="form-group">

                    <label>Emergency Contact</label>

                    <input
                        id="tenantEmergency">

                </div>


                <div class="form-group">

                    <label>Move In Date</label>

                    <input
                        type="date"
                        id="tenantMoveIn">

                </div>


                <div class="form-group full">

                    <label>Address</label>

                    <textarea
                        id="tenantAddress"></textarea>

                </div>

            </div>


            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="closeModal()">
                    Cancel
                </button>

                <button
                    class="primary-btn"
                    type="submit">
                    Add Tenant
                </button>

            </div>

        </form>
    `;


    openModal();
}


async function saveTenant(event) {

    event.preventDefault();


    const data = {

        flat_id:
            Number(document.getElementById("tenantFlat").value),

        full_name:
            document.getElementById("tenantName").value,

        mobile:
            document.getElementById("tenantMobile").value,

        email:
            document.getElementById("tenantEmail").value,

        aadhaar_number:
            document.getElementById("tenantAadhaar").value,

        pan_number:
            document.getElementById("tenantPan").value,

        address:
            document.getElementById("tenantAddress").value,

        occupation:
            document.getElementById("tenantOccupation").value,

        family_members:
            Number(document.getElementById("tenantFamily").value || 0),

        emergency_contact:
            document.getElementById("tenantEmergency").value,

        move_in_date:
            document.getElementById("tenantMoveIn").value,

        status:
            "Active"

    };


    try {

        await createTenant(data);

        showToast("Tenant added successfully.");

        closeModal();

        await loadTenants();

    } catch (error) {

        showToast(error.message, true);
    }
}


/* ================= RENT ================= */

async function loadRents() {

    rents = await getRents();

    const container =
        document.getElementById("rentTable");


    if (!rents.length) {

        container.innerHTML =
            `<div class="empty">
                No rent records found.
             </div>`;

        return;
    }


    let html = `

        <table>

            <thead>

                <tr>
                    <th>Tenant</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Payment Date</th>
                    <th>Status</th>
                </tr>

            </thead>

            <tbody>
    `;


    rents.forEach(rent => {

        html += `

            <tr>

                <td>
                    ${safe(rent.full_name || rent.tenant_name || "-")}
                </td>

                <td>${safe(rent.month)}</td>

                <td>${safe(rent.year)}</td>

                <td>₹${safe(rent.rent_amount)}</td>

                <td>${formatDate(rent.due_date)}</td>

                <td>${formatDate(rent.payment_date)}</td>

                <td>${statusBadge(rent.status)}</td>

            </tr>

        `;

    });


    html += `
            </tbody>
        </table>
    `;


    container.innerHTML = html;
}


function openRentForm() {

    if (!tenants.length) {

        showToast(
            "Please add a tenant first.",
            true
        );

        return;
    }


    document.getElementById("modalTitle").textContent =
        "Add Rent Record";


    const tenantOptions =
        tenants
            .filter(t =>
                String(t.status).toLowerCase() === "active"
            )
            .map(t => `

                <option value="${t.tenant_id}">

                    ${safe(t.full_name)}

                    -

                    ${safe(t.flat_number || "")}

                </option>

            `).join("");


    document.getElementById("modalBody").innerHTML = `

        <form class="form"
              onsubmit="saveRent(event)">

            <div class="form-grid">

                <div class="form-group full">

                    <label>Tenant</label>

                    <select
                        id="rentTenant"
                        required>

                        ${tenantOptions}

                    </select>

                </div>


                <div class="form-group">

                    <label>Month</label>

                    <select id="rentMonth">

                        <option>January</option>
                        <option>February</option>
                        <option>March</option>
                        <option>April</option>
                        <option>May</option>
                        <option>June</option>
                        <option>July</option>
                        <option>August</option>
                        <option>September</option>
                        <option>October</option>
                        <option>November</option>
                        <option>December</option>

                    </select>

                </div>


                <div class="form-group">

                    <label>Year</label>

                    <input
                        type="number"
                        id="rentYear"
                        value="${new Date().getFullYear()}">

                </div>


                <div class="form-group">

                    <label>Rent Amount</label>

                    <input
                        type="number"
                        id="rentAmount"
                        required>

                </div>


                <div class="form-group">

                    <label>Due Date</label>

                    <input
                        type="date"
                        id="rentDueDate">

                </div>


                <div class="form-group">

                    <label>Payment Date</label>

                    <input
                        type="date"
                        id="rentPaymentDate">

                </div>


                <div class="form-group">

                    <label>Payment Mode</label>

                    <select id="rentPaymentMode">

                        <option>UPI</option>
                        <option>Cash</option>
                        <option>Bank Transfer</option>
                        <option>Cheque</option>

                    </select>

                </div>


                <div class="form-group">

                    <label>Status</label>

                    <select id="rentStatus">

                        <option>Paid</option>
                        <option>Pending</option>
                        <option>Unpaid</option>

                    </select>

                </div>


                <div class="form-group full">

                    <label>Remarks</label>

                    <textarea
                        id="rentRemarks"></textarea>

                </div>

            </div>


            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="closeModal()">
                    Cancel
                </button>

                <button
                    type="submit"
                    class="primary-btn">
                    Save Rent
                </button>

            </div>

        </form>
    `;


    openModal();
}


async function saveRent(event) {

    event.preventDefault();


    const data = {

        tenant_id:
            Number(document.getElementById("rentTenant").value),

        month:
            document.getElementById("rentMonth").value,

        year:
            Number(document.getElementById("rentYear").value),

        rent_amount:
            Number(document.getElementById("rentAmount").value),

        due_date:
            document.getElementById("rentDueDate").value || null,

        payment_date:
            document.getElementById("rentPaymentDate").value || null,

        payment_mode:
            document.getElementById("rentPaymentMode").value,

        status:
            document.getElementById("rentStatus").value,

        remarks:
            document.getElementById("rentRemarks").value

    };


    try {

        await createRent(data);

        showToast("Rent record added.");

        closeModal();

        await loadRents();

    } catch (error) {

        showToast(error.message, true);
    }
}


/* ================= DEPOSIT ================= */

async function loadDeposits() {

    deposits = await getDeposits();

    const container =
        document.getElementById("depositTable");


    if (!deposits.length) {

        container.innerHTML =
            `<div class="empty">
                No deposit records found.
             </div>`;

        return;
    }


    let html = `

        <table>

            <thead>

                <tr>
                    <th>Tenant</th>
                    <th>Amount</th>
                    <th>Received</th>
                    <th>Returned</th>
                    <th>Deduction</th>
                    <th>Status</th>
                </tr>

            </thead>

            <tbody>
    `;


    deposits.forEach(deposit => {

        html += `

            <tr>

                <td>
                    ${safe(deposit.full_name || "-")}
                </td>

                <td>
                    ₹${safe(deposit.deposit_amount)}
                </td>

                <td>
                    ${formatDate(deposit.received_date)}
                </td>

                <td>
                    ${formatDate(deposit.returned_date)}
                </td>

                <td>
                    ₹${safe(deposit.deduction_amount || 0)}
                </td>

                <td>
                    ${statusBadge(deposit.status)}
                </td>

            </tr>

        `;

    });


    html += `
            </tbody>
        </table>
    `;


    container.innerHTML = html;
}


function openDepositForm() {

    if (!tenants.length) {

        showToast(
            "Please add a tenant first.",
            true
        );

        return;
    }


    document.getElementById("modalTitle").textContent =
        "Add Deposit";


    const tenantOptions =
        tenants.map(t => `

            <option value="${t.tenant_id}">
                ${safe(t.full_name)}
            </option>

        `).join("");


    document.getElementById("modalBody").innerHTML = `

        <form class="form"
              onsubmit="saveDeposit(event)">

            <div class="form-grid">

                <div class="form-group full">

                    <label>Tenant</label>

                    <select
                        id="depositTenant"
                        required>

                        ${tenantOptions}

                    </select>

                </div>


                <div class="form-group">

                    <label>Deposit Amount</label>

                    <input
                        type="number"
                        id="depositAmount"
                        required>

                </div>


                <div class="form-group">

                    <label>Received Date</label>

                    <input
                        type="date"
                        id="depositReceived">

                </div>


                <div class="form-group">

                    <label>Status</label>

                    <select id="depositStatus">

                        <option>Received</option>
                        <option>Pending</option>
                        <option>Returned</option>

                    </select>

                </div>


                <div class="form-group">

                    <label>Deduction Amount</label>

                    <input
                        type="number"
                        id="depositDeduction"
                        value="0">

                </div>


                <div class="form-group full">

                    <label>Reason / Remarks</label>

                    <textarea
                        id="depositReason"></textarea>

                </div>

            </div>


            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="closeModal()">
                    Cancel
                </button>

                <button
                    class="primary-btn"
                    type="submit">
                    Save Deposit
                </button>

            </div>

        </form>
    `;


    openModal();
}


async function saveDeposit(event) {

    event.preventDefault();


    const data = {

        tenant_id:
            Number(document.getElementById("depositTenant").value),

        deposit_amount:
            Number(document.getElementById("depositAmount").value),

        received_date:
            document.getElementById("depositReceived").value || null,

        returned_date:
            null,

        deduction_amount:
            Number(document.getElementById("depositDeduction").value || 0),

        reason:
            document.getElementById("depositReason").value,

        status:
            document.getElementById("depositStatus").value

    };


    try {

        await createDeposit(data);

        showToast("Deposit added.");

        closeModal();

        await loadDeposits();

    } catch (error) {

        showToast(error.message, true);
    }
}


/* ================= ELECTRICITY ================= */

async function loadElectricity() {

    electricityBills =
        await getElectricityBills();


    const container =
        document.getElementById("electricityTable");


    if (!electricityBills.length) {

        container.innerHTML =
            `<div class="empty">
                No electricity bills found.
             </div>`;

        return;
    }


    let html = `

        <table>

            <thead>

                <tr>
                    <th>Flat</th>
                    <th>Building</th>
                    <th>Month</th>
                    <th>Units</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                </tr>

            </thead>

            <tbody>
    `;


    electricityBills.forEach(bill => {

        html += `

            <tr>

                <td>
                    ${safe(bill.flat_number || "-")}
                </td>

                <td>
                    ${safe(bill.building_name || "-")}
                </td>

                <td>
                    ${safe(bill.bill_month)}
                </td>

                <td>
                    ${safe(bill.units)}
                </td>

                <td>
                    ₹${safe(bill.bill_amount)}
                </td>

                <td>
                    ${formatDate(bill.due_date)}
                </td>

                <td>
                    ${statusBadge(bill.status)}
                </td>

            </tr>

        `;

    });


    html += `
            </tbody>
        </table>
    `;


    container.innerHTML = html;
}


function openElectricityForm() {

    if (!flats.length) {

        showToast(
            "Please add a flat first.",
            true
        );

        return;
    }


    document.getElementById("modalTitle").textContent =
        "Add Electricity Bill";


    const flatOptions =
        flats.map(f => `

            <option value="${f.flat_id}">

                ${safe(f.flat_number)}
                -
                ${safe(f.building_name || "")}

            </option>

        `).join("");


    document.getElementById("modalBody").innerHTML = `

        <form class="form"
              onsubmit="saveElectricity(event)">

            <div class="form-grid">

                <div class="form-group full">

                    <label>Flat</label>

                    <select
                        id="electricityFlat"
                        required>

                        ${flatOptions}

                    </select>

                </div>


                <div class="form-group">

                    <label>Bill Month</label>

                    <input
                        id="billMonth"
                        placeholder="September 2026"
                        required>

                </div>


                <div class="form-group">

                    <label>Previous Reading</label>

                    <input
                        type="number"
                        id="previousReading">

                </div>


                <div class="form-group">

                    <label>Current Reading</label>

                    <input
                        type="number"
                        id="currentReading">

                </div>


                <div class="form-group">

                    <label>Units</label>

                    <input
                        type="number"
                        id="electricityUnits">

                </div>


                <div class="form-group">

                    <label>Rate Per Unit</label>

                    <input
                        type="number"
                        id="ratePerUnit">

                </div>


                <div class="form-group">

                    <label>Bill Amount</label>

                    <input
                        type="number"
                        id="billAmount">

                </div>


                <div class="form-group">

                    <label>Due Date</label>

                    <input
                        type="date"
                        id="billDueDate">

                </div>


                <div class="form-group">

                    <label>Payment Date</label>

                    <input
                        type="date"
                        id="billPaymentDate">

                </div>


                <div class="form-group">

                    <label>Status</label>

                    <select id="billStatus">

                        <option>Paid</option>
                        <option>Pending</option>
                        <option>Unpaid</option>

                    </select>

                </div>

            </div>


            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="closeModal()">
                    Cancel
                </button>

                <button
                    class="primary-btn"
                    type="submit">
                    Save Bill
                </button>

            </div>

        </form>
    `;


    openModal();
}


async function saveElectricity(event) {

    event.preventDefault();


    const data = {

        flat_id:
            Number(document.getElementById("electricityFlat").value),

        bill_month:
            document.getElementById("billMonth").value,

        previous_reading:
            Number(document.getElementById("previousReading").value || 0),

        current_reading:
            Number(document.getElementById("currentReading").value || 0),

        units:
            Number(document.getElementById("electricityUnits").value || 0),

        rate_per_unit:
            Number(document.getElementById("ratePerUnit").value || 0),

        bill_amount:
            Number(document.getElementById("billAmount").value || 0),

        due_date:
            document.getElementById("billDueDate").value || null,

        payment_date:
            document.getElementById("billPaymentDate").value || null,

        status:
            document.getElementById("billStatus").value

    };


    try {

        await createElectricityBill(data);

        showToast("Electricity bill added.");

        closeModal();

        await loadElectricity();

    } catch (error) {

        showToast(error.message, true);
    }
}


/* ================= DOCUMENTS ================= */

async function loadDocuments() {

    documents = await getDocuments();

    const container =
        document.getElementById("documentTable");


    if (!documents.length) {

        container.innerHTML =
            `<div class="empty">
                No documents found.
             </div>`;

        return;
    }


    let html = `

        <table>

            <thead>

                <tr>
                    <th>Tenant</th>
                    <th>Aadhaar</th>
                    <th>PAN</th>
                    <th>Agreement</th>
                    <th>Photo</th>
                </tr>

            </thead>

            <tbody>
    `;


    documents.forEach(doc => {

        html += `

            <tr>

                <td>
                    ${safe(doc.full_name || "-")}
                </td>

                <td>
                    ${safe(doc.aadhaar_copy || "-")}
                </td>

                <td>
                    ${safe(doc.pan_copy || "-")}
                </td>

                <td>
                    ${safe(doc.agreement_copy || "-")}
                </td>

                <td>
                    ${safe(doc.tenant_photo || "-")}
                </td>

            </tr>

        `;

    });


    html += `
            </tbody>
        </table>
    `;


    container.innerHTML = html;
}


function openDocumentForm() {

    if (!tenants.length) {

        showToast(
            "Please add a tenant first.",
            true
        );

        return;
    }


    document.getElementById("modalTitle").textContent =
        "Add Document Record";


    const options =
        tenants.map(t => `

            <option value="${t.tenant_id}">
                ${safe(t.full_name)}
            </option>

        `).join("");


    document.getElementById("modalBody").innerHTML = `

        <form class="form"
              onsubmit="saveDocument(event)">

            <div class="form-grid">

                <div class="form-group full">

                    <label>Tenant</label>

                    <select
                        id="documentTenant"
                        required>

                        ${options}

                    </select>

                </div>


                <div class="form-group">

                    <label>Aadhaar File Path</label>

                    <input
                        id="aadhaarCopy"
                        placeholder="uploads/tenants/1/aadhaar.pdf">

                </div>


                <div class="form-group">

                    <label>PAN File Path</label>

                    <input
                        id="panCopy"
                        placeholder="uploads/tenants/1/pan.pdf">

                </div>


                <div class="form-group">

                    <label>Agreement File Path</label>

                    <input
                        id="agreementCopy">

                </div>


                <div class="form-group">

                    <label>Tenant Photo Path</label>

                    <input
                        id="tenantPhoto">

                </div>

            </div>


            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="closeModal()">
                    Cancel
                </button>

                <button
                    class="primary-btn"
                    type="submit">
                    Save Document
                </button>

            </div>

        </form>
    `;


    openModal();
}


async function saveDocument(event) {

    event.preventDefault();


    const data = {

        tenant_id:
            Number(document.getElementById("documentTenant").value),

        aadhaar_copy:
            document.getElementById("aadhaarCopy").value,

        pan_copy:
            document.getElementById("panCopy").value,

        agreement_copy:
            document.getElementById("agreementCopy").value,

        tenant_photo:
            document.getElementById("tenantPhoto").value

    };


    try {

        await createDocument(data);

        showToast("Document record added.");

        closeModal();

        await loadDocuments();

    } catch (error) {

        showToast(error.message, true);
    }
}


/* ================= COMPLAINTS ================= */

async function loadComplaints() {

    complaints = await getComplaints();


    const container =
        document.getElementById("complaintTable");


    if (!complaints.length) {

        container.innerHTML =
            `<div class="empty">
                No complaints found.
             </div>`;

        return;
    }


    let html = `

        <table>

            <thead>

                <tr>
                    <th>Tenant</th>
                    <th>Complaint</th>
                    <th>Priority</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>

            </thead>

            <tbody>
    `;


    complaints.forEach(item => {

        html += `

            <tr>

                <td>
                    ${safe(item.full_name || "-")}
                </td>

                <td>
                    ${safe(item.complaint_title)}
                </td>

                <td>
                    ${safe(item.priority)}
                </td>

                <td>
                    ${formatDate(item.complaint_date)}
                </td>

                <td>
                    ${statusBadge(item.status)}
                </td>

            </tr>

        `;

    });


    html += `
            </tbody>
        </table>
    `;


    container.innerHTML = html;
}


function openComplaintForm() {

    if (!tenants.length) {

        showToast(
            "Please add a tenant first.",
            true
        );

        return;
    }


    document.getElementById("modalTitle").textContent =
        "Add Complaint";


    const options =
        tenants.map(t => `

            <option value="${t.tenant_id}">
                ${safe(t.full_name)}
            </option>

        `).join("");


    document.getElementById("modalBody").innerHTML = `

        <form class="form"
              onsubmit="saveComplaint(event)">

            <div class="form-grid">

                <div class="form-group full">

                    <label>Tenant</label>

                    <select
                        id="complaintTenant"
                        required>

                        ${options}

                    </select>

                </div>


                <div class="form-group">

                    <label>Complaint Title</label>

                    <input
                        id="complaintTitle"
                        required>

                </div>


                <div class="form-group">

                    <label>Priority</label>

                    <select id="complaintPriority">

                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>

                    </select>

                </div>


                <div class="form-group">

                    <label>Complaint Date</label>

                    <input
                        type="date"
                        id="complaintDate">

                </div>


                <div class="form-group">

                    <label>Status</label>

                    <select id="complaintStatus">

                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Resolved</option>

                    </select>

                </div>


                <div class="form-group full">

                    <label>Description</label>

                    <textarea
                        id="complaintDescription"
                        required></textarea>

                </div>

            </div>


            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="closeModal()">
                    Cancel
                </button>

                <button
                    class="primary-btn"
                    type="submit">
                    Save Complaint
                </button>

            </div>

        </form>
    `;


    openModal();
}


async function saveComplaint(event) {

    event.preventDefault();


    const data = {

        tenant_id:
            Number(document.getElementById("complaintTenant").value),

        complaint_title:
            document.getElementById("complaintTitle").value,

        complaint_description:
            document.getElementById("complaintDescription").value,

        complaint_date:
            document.getElementById("complaintDate").value || null,

        priority:
            document.getElementById("complaintPriority").value,

        status:
            document.getElementById("complaintStatus").value,

        resolved_date:
            null

    };


    try {

        await createComplaint(data);

        showToast("Complaint added.");

        closeModal();

        await loadComplaints();

    } catch (error) {

        showToast(error.message, true);
    }
}


/* ================= MAINTENANCE ================= */

async function loadMaintenance() {

    maintenanceRecords =
        await getMaintenance();


    const container =
        document.getElementById("maintenanceTable");


    if (!maintenanceRecords.length) {

        container.innerHTML =
            `<div class="empty">
                No maintenance records found.
             </div>`;

        return;
    }


    let html = `

        <table>

            <thead>

                <tr>
                    <th>Building</th>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                </tr>

            </thead>

            <tbody>
    `;


    maintenanceRecords.forEach(item => {

        html += `

            <tr>

                <td>
                    ${safe(item.building_name || "-")}
                </td>

                <td>
                    ${safe(item.title)}
                </td>

                <td>
                    ${formatDate(item.maintenance_date)}
                </td>

                <td>
                    ₹${safe(item.amount || 0)}
                </td>

                <td>
                    ${statusBadge(item.status)}
                </td>

            </tr>

        `;

    });


    html += `
            </tbody>
        </table>
    `;


    container.innerHTML = html;
}


function openMaintenanceForm() {

    if (!buildings.length) {

        showToast(
            "Please add a building first.",
            true
        );

        return;
    }


    document.getElementById("modalTitle").textContent =
        "Add Maintenance";


    const options =
        buildings.map(b => `

            <option value="${b.building_id}">
                ${safe(b.building_name)}
            </option>

        `).join("");


    document.getElementById("modalBody").innerHTML = `

        <form class="form"
              onsubmit="saveMaintenance(event)">

            <div class="form-grid">

                <div class="form-group full">

                    <label>Building</label>

                    <select
                        id="maintenanceBuilding"
                        required>

                        ${options}

                    </select>

                </div>


                <div class="form-group">

                    <label>Title</label>

                    <input
                        id="maintenanceTitle"
                        required>

                </div>


                <div class="form-group">

                    <label>Date</label>

                    <input
                        type="date"
                        id="maintenanceDate">

                </div>


                <div class="form-group">

                    <label>Amount</label>

                    <input
                        type="number"
                        id="maintenanceAmount">

                </div>


                <div class="form-group">

                    <label>Status</label>

                    <select id="maintenanceStatus">

                        <option>Pending</option>
                        <option>In Progress</option>
                        <option>Completed</option>

                    </select>

                </div>


                <div class="form-group full">

                    <label>Description</label>

                    <textarea
                        id="maintenanceDescription"></textarea>

                </div>

            </div>


            <div class="form-actions">

                <button
                    type="button"
                    class="secondary-btn"
                    onclick="closeModal()">
                    Cancel
                </button>

                <button
                    class="primary-btn"
                    type="submit">
                    Save Maintenance
                </button>

            </div>

        </form>
    `;


    openModal();
}


async function saveMaintenance(event) {

    event.preventDefault();


    const data = {

        building_id:
            Number(document.getElementById("maintenanceBuilding").value),

        title:
            document.getElementById("maintenanceTitle").value,

        description:
            document.getElementById("maintenanceDescription").value,

        maintenance_date:
            document.getElementById("maintenanceDate").value || null,

        amount:
            Number(document.getElementById("maintenanceAmount").value || 0),

        status:
            document.getElementById("maintenanceStatus").value

    };


    try {

        await createMaintenance(data);

        showToast("Maintenance record added.");

        closeModal();

        await loadMaintenance();

    } catch (error) {

        showToast(error.message, true);
    }
}


/* ================= MODAL ================= */

function openModal() {

    document.getElementById("modal")
        .classList.add("show");
}


function closeModal() {

    document.getElementById("modal")
        .classList.remove("show");

    document.getElementById("modalBody")
        .innerHTML = "";
}


/* ================= TOAST ================= */

function showToast(message, error = false) {

    const toast =
        document.getElementById("toast");


    toast.textContent = message;

    toast.style.background =
        error ? "#dc2626" : "#111827";


    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


/* ================= HELPERS ================= */

function safe(value) {

    if (value === null ||
        value === undefined) {

        return "";
    }


    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function formatDate(date) {

    if (!date) {
        return "-";
    }


    return String(date)
        .substring(0, 10);
}


function statusBadge(status) {

    if (!status) {
        return "-";
    }


    const value =
        String(status)
            .toLowerCase()
            .replaceAll(" ", "-");


    return `
        <span class="status status-${value}">
            ${safe(status)}
        </span>
    `;
}


/* ================= INITIAL LOAD ================= */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try {

            await loadDashboard();

        } catch (error) {

            showToast(
                "Backend is not connected. Start Node.js server.",
                true
            );

            console.error(error);
        }

    }
);