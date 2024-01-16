const db = require("../database/db");

exports.createOrder = async (params) => {
    const {userId, cart} = params;

    if (!cart) throw {message: "cart was not provided", statusCode: 400};
    if (!userId) throw {message: "userId was not provided", statusCode: 400};

    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO orders (user_id) VALUES (?)`,
            [userId],
            (err, result) => {
                if (err) reject({message: err, statusCode: 500});

                if (result) {
                    let newOrderId = result.insertId;
                    cart.products.forEach(async (prod) => {
                        db.query(
                            `SELECT p.quantity FROM products p WHERE p.id = ?`,
                            [prod.id],
                            (err, result) => {
                                if (err) reject({message: err, statusCode: 500});

                                let productQuantity = result[0].quantity; // db product

                                // deduct the quantity from products that were ordered in db
                                let updatedQuantity = productQuantity - prod.quantity;
                                if (updatedQuantity > 0) {
                                    productQuantity = updatedQuantity;
                                } else productQuantity = 0;

                                db.query(
                                    `INSERT INTO orders_details (order_id, product_id, quantity) VALUES (?,?,?)`,
                                    [newOrderId, prod.id, prod.quantity],
                                    (err, result) => {
                                        if (err) reject({message: err, statusCode: 500});

                                        db.query(
                                            `UPDATE products SET quantity = ${productQuantity} WHERE id = ${prod.id}`,
                                            (err, result) => {
                                                if (err) reject({message: err, statusCode: 500});
                                                console.log(result);
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    });

                    resolve({
                        message: `Order was successfully placed with order id ${newOrderId}`,
                        orderId: newOrderId,
                        products: cart.products,
                        statusCode: 201,
                    });
                } else {
                    reject({
                        message: "New order failed while adding order details",
                        statusCode: 500,
                    });
                }
            }
        );
    });
};

exports.getSingleOrder = async (params) => {
    const {orderId, userId} = params;

    if (!orderId) throw {message: "orderId was not provided", statusCode: 400};
    if (!userId) throw {message: "userId was not provided", statusCode: 400};

    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM orders INNER JOIN orders_details ON ( orders.id = orders_details.order_id ) WHERE orders.id = ? AND orders.user_id = ?`,
            [orderId, userId],
            (err, result) => {
                if (err) reject({message: err, statusCode: 500});

                if (result.length === 0)
                    reject({message: "order was not found", statusCode: 400});

                resolve({
                    statusCode: 200,
                    message: `Order was found`,
                    data: result,
                });
            }
        );
    });
};

exports.getProducts = async (params) => {
    const {userId} = params;

    if (!userId) throw {message: "userId was not provided", statusCode: 400};

    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM orders INNER JOIN orders_details ON ( orders.id = orders_details.order_id ) WHERE user_id = ?`,
            [userId],
            (err, result) => {
                if (err) reject({message: err, statusCode: 500});

                if (result.length === 0)
                    reject({message: "No order were found", statusCode: 400});

                resolve({
                    statusCode: 200,
                    message: `${result.length} orders were found`,
                    data: result,
                });
            }
        );
    });
};

exports.getAllProducts = async () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM products`, (err, result) => {
            if (err) reject({message: err, statusCode: 500});

            resolve({
                statusCode: 200,
                message: `${result.length} products were found`,
                data: result,
            });
        });
    });
};

exports.getProductById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM products WHERE id = ${id}`, (err, result) => {
            if (err) reject({message: err, statusCode: 500});
            if (result.length === 0)
                reject({message: "Product was not found", statusCode: 400});

            resolve({
                statusCode: 200,
                message: `Product was found`,
                data: result[0],
            });
        });
    });
};

exports.createProduct = (product) => {
    return new Promise((resolve, reject) => {
        db.query(
            `INSERT INTO products (title, name, description, price, quantity, status, image, short_desc) VALUES (?,?,?,?,?,1,?,?)`,
            [product.title, product.name, product.description, product.price, product.quantity, product.image, product.short_desc],
            (err, result) => {
                if (err) {
                    console.error(err);
                    reject({message: err, statusCode: 500});
                } else {
                    resolve({
                        message: "Category created successfully",
                        data: result,
                        statusCode: 201,
                    });
                }
            }
        );
    });
}

exports.updateProduct = (id,product) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE products SET title = ?, name = ?, description = ?, price = ?, quantity = ?, status = ?, image = ?, short_desc = ? WHERE id = ?`,
            [product.title, product.name, product.description, product.price, product.quantity, product.status, product.image, product.short_desc, id],
            (err, result) => {
                if (err) reject({message: err, statusCode: 500});
                else resolve({message: "Product was updated successfully", statusCode: 200});
            }
        );
    });
}

exports.deleteProduct = (id) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE products SET status = 0 WHERE id = ?`,
            [id],
            (err, result) => {
                if (err) reject({message: err, statusCode: 500});
                else resolve({message: "Product was deleted successfully", statusCode: 200});
            }
        );
    });
}