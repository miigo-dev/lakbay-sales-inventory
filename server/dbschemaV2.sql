-- User Roles
CREATE TABLE Roles (
    RoleID SERIAL PRIMARY KEY,
    RoleName VARCHAR(100) NOT NULL
);

-- Users
CREATE TABLE Users (
    UserID SERIAL PRIMARY KEY,
    FirstName VARCHAR(100),
    LastName VARCHAR(100),
    PhoneNumber VARCHAR(20),
    Username VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    RoleID INT REFERENCES Roles(RoleID),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Suppliers
CREATE TABLE Suppliers (
    SupplierID SERIAL PRIMARY KEY,
    SupplierName VARCHAR(100) NOT NULL,
    ContactPerson VARCHAR(100),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(100),
    Address VARCHAR(255)
);

-- Products
CREATE TABLE Products (
    ProductID SERIAL PRIMARY KEY,
    ProductName VARCHAR(100) NOT NULL,
    Category VARCHAR(50), -- e.g., 'Beverage', 'Food'
    UnitOfMeasure VARCHAR(50), -- e.g., 'ml', 'pcs'
    Price DECIMAL(10, 2) NOT NULL,
    StockQuantity INT NOT NULL,
    ReorderLevel INT DEFAULT 10,
    ProductStatus VARCHAR(50) DEFAULT 'Active',
    SupplierID INT REFERENCES Suppliers(SupplierID)
);

-- Product In (Adding stock)
CREATE TABLE ProductIn (
    ProductInID SERIAL PRIMARY KEY,
    ProductID INT REFERENCES Products(ProductID),
    QuantityAdded INT NOT NULL,
    SupplierID INT REFERENCES Suppliers(SupplierID),
    ReceivedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Remarks TEXT
);

-- Product Out (Removing stock)
CREATE TABLE ProductOut (
    ProductOutID SERIAL PRIMARY KEY,
    ProductID INT REFERENCES Products(ProductID),
    QuantityRemoved INT NOT NULL,
    RemovalDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Reason VARCHAR(100), -- e.g., 'Expired', 'Damaged'
    Remarks TEXT
);

-- Orders
CREATE TABLE Orders (
    OrderID SERIAL PRIMARY KEY,
    ProductID INT REFERENCES Products(ProductID),
    Quantity INT NOT NULL,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    OrderStatus VARCHAR(50) DEFAULT 'Pending',
    OrderTotal DECIMAL(10, 2),
    UserID INT REFERENCES Users(UserID)
);

-- Sales
CREATE TABLE Sales (
    SaleID SERIAL PRIMARY KEY,
    ProductID INT REFERENCES Products(ProductID),
    Quantity INT NOT NULL,
    SaleDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    SaleStatus VARCHAR(50) DEFAULT 'Completed',
    UserID INT REFERENCES Users(UserID)
);

-- Logs
CREATE TABLE Logs (
    LogID SERIAL PRIMARY KEY,
    UserID INT REFERENCES Users(UserID),
    Action VARCHAR(255),
    ActionType VARCHAR(50),
    TableAffected VARCHAR(100),
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions
CREATE TABLE Permissions (
    PermissionID SERIAL PRIMARY KEY,
    PermissionName VARCHAR(100) NOT NULL
);

-- Role Permissions
CREATE TABLE RolePermissions (
    RolePermissionID SERIAL PRIMARY KEY,
    RoleID INT REFERENCES Roles(RoleID),
    PermissionID INT REFERENCES Permissions(PermissionID)
);

-- Optimized queries

CREATE INDEX idx_products_name ON Products(ProductName);
CREATE INDEX idx_orders_date ON Orders(OrderDate);

SELECT o.OrderID, p.ProductName, o.Quantity 
FROM Orders o
JOIN Products p ON o.ProductID = p.ProductID;

SELECT ProductName, Price FROM Products WHERE StockQuantity > 0;

INSERT INTO Products (ProductName, Price) VALUES 
('Coffee', 3.00),
('Tea', 2.50);

CREATE VIEW ActiveProducts AS 
SELECT * FROM Products WHERE ProductStatus = 'Active';

-- Sales Loss computation

SELECT o.OrderID,
       p.ProductName,
       o.Quantity AS OrderedQuantity,
       p.Price,
       CASE 
           WHEN p.StockQuantity < o.Quantity THEN (o.Quantity - p.StockQuantity) * p.Price 
           ELSE 0 
       END AS PotentialSalesLoss
FROM Orders o
JOIN Products p ON o.ProductID = p.ProductID
WHERE p.ProductStatus = 'Expired' OR p.StockQuantity < o.Quantity;