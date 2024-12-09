-- new --

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE suppliers (
    supplier_id SERIAL PRIMARY KEY,
    supplier_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone_number VARCHAR(20),
    address VARCHAR(255)
);

CREATE TABLE warehouses (
    warehouse_id SERIAL PRIMARY KEY,
    warehouse_name VARCHAR(100) NOT NULL
);

CREATE TABLE ingredient_types (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL
);

CREATE TABLE product_categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    warehouse_id INT REFERENCES warehouses(warehouse_id)
);

CREATE TABLE ingredients (
    ingredient_id SERIAL PRIMARY KEY,
    ingredient_name VARCHAR(100) NOT NULL,
    ingredient_quantity INT,
    ingredient_unit VARCHAR(50),
    ingredient_price DECIMAL(10, 2) NOT NULL,
    supplier_id INT REFERENCES suppliers(supplier_id),
    reorder_level INT DEFAULT 10,
    type_id INT REFERENCES ingredient_types(type_id),
    warehouse_id INT REFERENCES warehouses(warehouse_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    product_quantity INT NOT NULL CHECK (product_quantity >= 0),
    product_price DECIMAL(10, 2) NOT NULL,
    reorder_level INT DEFAULT 10,
    category_id INT REFERENCES product_categories(category_id),
    warehouse_id INT REFERENCES warehouses(warehouse_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE movements (
    movement_id SERIAL PRIMARY KEY,
    item_type VARCHAR(10) NOT NULL CHECK (item_type IN ('PRODUCT', 'INGREDIENT')),
    item_id INT NOT NULL,
    movement_quantity INT NOT NULL,
    movement_type VARCHAR(10) NOT NULL CHECK (movement_type IN ('IN', 'OUT')),
    supplier_id INT REFERENCES suppliers(supplier_id),
    remarks TEXT,
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (item_id) REFERENCES products(product_id) ON DELETE CASCADE
        DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    order_status VARCHAR(50) DEFAULT 'Pending',
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    order_total DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL CHECK (quantity > 0),
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2),
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    notification_type VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- date-fns readable format --
const result = await db.query('SELECT * FROM products WHERE ...');
const product = result.rows[0];
product.created_at = formatDate(product.created_at); // Using the utility function
product.updated_at = formatDate(product.updated_at);

-- reset sequence --
ALTER SEQUENCE table_name_column_name_seq RESTART WITH 1;

-- update timestamp --

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- trigger for each table --

CREATE TRIGGER update_ingredients_timestamp
BEFORE UPDATE ON ingredients
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_products_timestamp
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_product_movement_timestamp
BEFORE UPDATE ON product_movements
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_ingredient_movement_timestamp
BEFORE UPDATE ON ingredient_movements
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_orders_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- order summary update --

CREATE OR REPLACE FUNCTION update_order_summary_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_summary_timestamp_trigger
BEFORE UPDATE ON order_summary
FOR EACH ROW
EXECUTE FUNCTION update_order_summary_timestamp();