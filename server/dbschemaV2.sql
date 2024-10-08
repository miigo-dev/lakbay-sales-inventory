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

-- new --

CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingredient_type (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_category (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    ingredient_name VARCHAR(100) NOT NULL,
    type_id INT REFERENCES ingredient_type(type_id),
    ingredient_quantity INT NOT NULL CHECK (ingredient_quantity >= 0),
    ingredient_unit VARCHAR(50),
    ingredient_price DECIMAL(10, 2) NOT NULL,
    supplier_id INT REFERENCES suppliers(supplier_id),
    reorder_level INT DEFAULT 10,
    ingredient_status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    category_id INT REFERENCES category_type(category_id),
    product_quantity INT NOT NULL CHECK (product_quantity >= 0),
    product_price DECIMAL(10, 2) NOT NULL,
    reorder_level INT DEFAULT 10,
    product_status VARCHAR(50) DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL,
    order_status VARCHAR(50) DEFAULT 'Pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_summary (
    order_summary_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    order_status VARCHAR(50) DEFAULT 'Pending',
    order_total DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- date-fns readable format --
const result = await db.query('SELECT * FROM products WHERE ...');
const product = result.rows[0];
product.created_at = formatDate(product.created_at); // Using the utility function
product.updated_at = formatDate(product.updated_at);

-- reset sequence --
ALTER SEQUENCE table_name_column_name_seq RESTART WITH 1;
