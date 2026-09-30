-- =====================================
-- ADMIN TABLE
-- =====================================

Admin ID
Name
Email
Password
Mobile
Role

-- =====================================
-- BUILDING TABLE
-- =====================================

Building ID
Building Name
Address
Number Of Floors
Description

-- =====================================
-- FLAT TABLE
-- =====================================

Flat ID
Building ID
Flat Number
Floor Number
Flat Type
Rent Amount
Deposit Amount
Status
Description

-- =====================================
-- TENANT TABLE
-- =====================================

Tenant ID
Flat ID
Name
Mobile
Aadhaar Number
Address
Occupation
Family Members
Emergency Contact
Move In Date
Move Out Date
Status

-- =====================================
-- RENT TABLE
-- =====================================

Rent ID
Tenant ID
Month
Year
Rent Amount
Due Date
Payment Date
Status

-- =====================================
-- DEPOSIT TABLE
-- =====================================

Deposit ID
Tenant ID
Deposit Amount
Received Date
Returned Date
Deduction Amount
Reason
Status

-- =====================================
-- ELECTRICITY BILL TABLE
-- =====================================

Electricity Bill ID
Flat ID
Previous Reading
Current Reading
Units
Rate Per Unit
Bill Amount
Status
Bill Month

-- =====================================
-- DOCUMENT TABLE
-- =====================================

Document ID
Tenant ID
Aadhaar
PAN
Agreement
Photo