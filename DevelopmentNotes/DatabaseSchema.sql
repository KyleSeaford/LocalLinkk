
CREATE TABLE "companies" (
    `company_id` guid PRIMARY KEY, 
    `company_name`, 
    `category_id` guid,
    `email` varchar(255),
    `phone` varchar(15),
    `website` varchar(255),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL, 
    advert_type TEXT, 
    advert_text TEXT, 
    advert_image TEXT, 
    advert_expires Date
    )

CREATE UNIQUE INDEX `sqlite_autoindex_companies_1` ON `companies` (company_id);

CREATE TABLE "categories" (
    `category_id` guid PRIMARY KEY, 
    `category_name`, 
    `parent_category_id`
    )

CREATE TABLE "Settings" (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT, 
    `Sname`, 
    `Svalue`
    )

CREATE TABLE "users" (
    `userID` TEXT PRIMARY KEY UNIQUE NOT NULL, 
    `userFname` TEXT, 
    `userLname` TEXT, 
    `userLocation` TEXT, 
    `userEmail` TEXT UNIQUE, 
    `userPassword` TEXT, 
    userType TEXT DEFAULT 
    viewer, 
    `userAdmin` TEXT DEFAULT 0
    )

CREATE UNIQUE INDEX `sqlite_autoindex_users_2` ON `users` (userEmail);
CREATE UNIQUE INDEX `sqlite_autoindex_users_1` ON `users` (userID);