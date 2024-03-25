USE foodpanda;

CREATE TABLE restaurants(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(300) NOT NULL,
    description TEXT,
    location VARCHAR(1000) NOT NULL,
    contact VARCHAR(30) NOT NULL
) engine = innodb;

CREATE TABLE menu_items(
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT UNSIGNED,
    name VARCHAR(300) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    category VARCHAR(50),
    status BOOLEAN NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
) engine = innodb;


-- Create Order table
CREATE TABLE orders (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    restaurant_id INT UNSIGNED,
    createAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updateAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- Create OrderItem table
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT UNSIGNED,
    menu_item_id INT UNSIGNED,
    quantity INT NOT NULL,
    subtotal INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
