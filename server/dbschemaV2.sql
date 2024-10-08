CREATE TABLE Roles (
    RoleID SERIAL PRIMARY KEY,
    RoleName VARCHAR(100) NOT NULL
);

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

CREATE TABLE ProductIn (
    ProductInID SERIAL PRIMARY KEY,
    ProductID INT REFERENCES Products(ProductID),
    QuantityAdded INT NOT NULL,
    SupplierID INT REFERENCES Suppliers(SupplierID),
    ReceivedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Remarks TEXT
);

CREATE TABLE ProductOut (
    ProductOutID SERIAL PRIMARY KEY,
    ProductID INT REFERENCES Products(ProductID),
    QuantityRemoved INT NOT NULL,
    RemovalDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Reason VARCHAR(100),
    Remarks TEXT
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

CREATE TABLE UserPermissions (
    UserPermissionID SERIAL PRIMARY KEY,
    UserID INT REFERENCES Users(UserID),
    PermissionID INT REFERENCES Permissions(PermissionID)
);

-- Insert statements

INSERT INTO Roles (RoleName) VALUES 
('Owner'),
('Admin'),
('Inventory Personnel'),
('Cashier');

INSERT INTO Users (FirstName, LastName, PhoneNumber, Username, Password, RoleID) VALUES 
('John', 'Doe', '09123456789', 'johndoe', 'hashed_password_1', 1),
('Jane', 'Smith', '09122334455', 'janesmith', 'hashed_password_2', 2),
('Alex', 'Johnson', '09125678901', 'alexjohnson', 'hashed_password_3', 3),
('Emily', 'Davis', '09129876543', 'emilydavis', 'hashed_password_4', 4);

INSERT INTO Suppliers (SupplierName, ContactPerson, PhoneNumber, Email, Address) VALUES 
('Supplier A', 'Alice Brown', '09121111111', 'alice@suppliera.com', '123 Supplier St.'),
('Supplier B', 'Bob Green', '09122222222', 'bob@supplierb.com', '456 Supplier Ave.');

INSERT INTO Products (ProductName, Category, UnitOfMeasure, Price, StockQuantity, ReorderLevel, ProductStatus, SupplierID) VALUES 
('Espresso', 'Beverage', 'ml', 150.00, 50, 10, 'Active', 1),
('Frappuccino', 'Beverage', 'ml', 180.00, 30, 10, 'Active', 1),
('Biryani', 'Food', 'pcs', 250.00, 20, 5, 'Active', 2),
('Sinigang', 'Food', 'pcs', 300.00, 25, 5, 'Active', 2),
('Coke', 'Beverage', 'ml', 60.00, 100, 20, 'Active', 2);

INSERT INTO ProductIn (ProductID, QuantityAdded, SupplierID, ReceivedDate, Remarks) VALUES 
(1, 20, 1, CURRENT_TIMESTAMP, 'New batch received'),
(3, 15, 2, CURRENT_TIMESTAMP, 'Monthly delivery');

INSERT INTO ProductOut (ProductID, QuantityRemoved, RemovalDate, Reason, Remarks) VALUES 
(2, 5, CURRENT_TIMESTAMP, 'Expired', 'Old stock removed'),
(4, 2, CURRENT_TIMESTAMP, 'Damaged', 'Sinigang pots spilled');

INSERT INTO Orders (ProductID, Quantity, OrderDate, OrderStatus, OrderTotal, UserID) VALUES 
(1, 3, CURRENT_TIMESTAMP, 'Completed', 450.00, 4), 
(3, 2, CURRENT_TIMESTAMP, 'Pending', 500.00, 4), 
(5, 10, CURRENT_TIMESTAMP, 'Completed', 600.00, 4);

INSERT INTO Sales (ProductID, Quantity, SaleDate, SaleStatus, UserID) VALUES 
(1, 3, CURRENT_TIMESTAMP, 'Completed', 4), 
(2, 1, CURRENT_TIMESTAMP, 'Completed', 4), 
(3, 2, CURRENT_TIMESTAMP, 'Completed', 4);

INSERT INTO Permissions (PermissionName) VALUES 
('View Inventory'),
('Edit Inventory'),
('View Orders'),
('Edit Orders'),
('Manage Users');

INSERT INTO RolePermissions (RoleID, PermissionID) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 2), (2, 3), (2, 4),
(3, 1), (3, 2),
(4, 3), (4, 4);

INSERT INTO UserPermissions (UserID, PermissionID) VALUES 
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5),
(2, 1), (2, 2), (2, 3), (2, 4),
(3, 1), (3, 2),
(4, 3), (4, 4);

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

('John', 'Doe', '09123456789', 'johndoe', 'hashed_password_1', 1),

-- reg new user --

{
    "firstname": "a",
    "lastname": "b",
    "phonenumber": "123",
    "username": "admin",
    "password": "password",
    "roleid": "1"
}

-- alter tables (optional) --

ALTER TABLE Products ALTER COLUMN SupplierID DROP NOT NULL;

ALTER TABLE products ADD COLUMN lastupdated TIMESTAMP DEFAULT NOW();

ALTER TABLE products ADD COLUMN updatedby VARCHAR(255);

-- new --

CREATE TABLE ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    ingredient_name VARCHAR(100) NOT NULL,
    ingredient_type VARCHAR(50),
    ingredient_quantity INT NOT NULL,
    ingredient_unit VARCHAR(50),
    ingredient_price DECIMAL(10, 2) NOT NULL,
    supplier_id INT REFERENCES suppliers(supplier_id),
    reorder_level INT DEFAULT 10,
    ingredient_status VARCHAR(50) DEFAULT 'Active'
);

CREATE TABLE ingredient_type (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    product_quantity INT NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    supplier_id INT REFERENCES suppliers(supplier_id),
    reorder_level INT DEFAULT 10,
    product_status VARCHAR(50) DEFAULT 'Active'
);

CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255)
);

CREATE TABLE order_summary (
    order_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    order_status VARCHAR(50) DEFAULT 'Pending',
    order_total DECIMAL(10, 2),
);