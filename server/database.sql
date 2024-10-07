CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE test_users (
    serial_id SERIAL PRIMARY KEY,
    uuid_id UUID DEFAULT gen_random_uuid(),
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    PhoneNumber VARCHAR(20),
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    RoleID INT REFERENCES Roles(RoleID),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Roles (
    RoleID SERIAL PRIMARY KEY,
    RoleName VARCHAR(100) NOT NULL
);

CREATE TABLE UserPermissions (
    UserPermissionID SERIAL PRIMARY KEY,
    UserID INT REFERENCES Users(UserID),
    PermissionID INT REFERENCES Permissions(PermissionID)
);

CREATE TABLE Suppliers (
    SupplierID SERIAL PRIMARY KEY,
    SupplierName VARCHAR(100) NOT NULL,
    ContactPerson VARCHAR(100),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(100),
    Address VARCHAR(255)
);

CREATE TABLE Products (
    ProductID SERIAL PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Category VARCHAR(50),
    UnitOfMeasure VARCHAR(50),
    Price DECIMAL(10, 2) NOT NULL,
    StockQuantity INT NOT NULL,
    ReorderLevel INT DEFAULT 10,
    ProductStatus VARCHAR(50) DEFAULT 'Active',
    SupplierID INT REFERENCES Suppliers(SupplierID)
);

CREATE TABLE Inventory (
    InventoryID SERIAL PRIMARY KEY,
    ProductID INT REFERENCES Products(ProductID),
    Quantity INT NOT NULL,
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedBy INT REFERENCES Users(UserID)
);

CREATE TABLE Orders (
    OrderID SERIAL PRIMARY KEY,
    ProductID INT REFERENCES Products(ProductID),
    Quantity INT NOT NULL,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    OrderStatus VARCHAR(50) DEFAULT 'Pending',
    OrderTotal DECIMAL(10, 2),
    UserID INT REFERENCES Users(UserID)
);

CREATE TABLE Sales (
    SaleID SERIAL PRIMARY KEY,
    ProductID INT REFERENCES Products(ProductID),
    Quantity INT NOT NULL,
    SaleDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PaymentMethod VARCHAR(50) DEFAULT 'Cash',
    SaleStatus VARCHAR(50) DEFAULT 'Completed',
    UserID INT REFERENCES Users(UserID)
);

CREATE TABLE Logs (
    LogID SERIAL PRIMARY KEY,
    UserID INT REFERENCES Users(UserID),
    Action VARCHAR(255),
    ActionType VARCHAR(50),
    TableAffected VARCHAR(100),
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Permissions (
    PermissionID SERIAL PRIMARY KEY,
    PermissionName VARCHAR(100) NOT NULL
);

CREATE TABLE RolePermissions (
    RolePermissionID SERIAL PRIMARY KEY,
    RoleID INT REFERENCES Roles(RoleID),
    PermissionID INT REFERENCES Permissions(PermissionID)
);