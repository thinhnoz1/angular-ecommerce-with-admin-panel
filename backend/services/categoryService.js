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

exports.getOrders = async (params) => {
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

exports.getAllCategories = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM categories`, (err, result) => {
            if (err) {
                console.log(err);
                reject({error: "Internal Server Error"});
            } else {
                resolve({data: result, total: result.length});
            }
        });
    });
};

exports.getCategoryById = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM categories WHERE id = ${id}`, (err, result) => {
            if (err) {
                console.log(err);
                reject({error: "Internal Server Error"});
            } else {
                resolve(result[0]);
            }
        });
    });
};

exports.createCategory = (categoryData) => {
    return new Promise((resolve, reject) => {
        const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const sqlQuery = `INSERT INTO categories (title, name, slug, description, status, type, parent_id, category_image_id, category_icon_id, created_by_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(
            sqlQuery,
            [
                categoryData.title,
                categoryData.name,
                categoryData.slug,
                categoryData.description,
                categoryData.status,
                categoryData.type,
                categoryData.parent_id,
                categoryData.category_image_id,
                categoryData.category_icon_id,
                categoryData.created_by_id,
                createdAt,
            ],
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
};

exports.updateCategory = (id, categoryData) => {
    return new Promise((resolve, reject) => {
        const sqlQuery = `UPDATE categories SET title = ?,
        name = ?,
        slug = ?,
        description = ?,
        status = ?,
        type = ?,
        parent_id = ?,
        category_image_id = ?,
        category_icon_id = ?,
        updated_at = NOW()
      WHERE id = ?`;

        db.query(sqlQuery,
            [
                categoryData.title,
                categoryData.name,
                categoryData.slug,
                categoryData.description,
                categoryData.status,
                categoryData.type,
                categoryData.parent_id,
                categoryData.category_image_id,
                categoryData.category_icon_id,
                id],
            (err, result) => {
                if (err) {
                    console.error(err);
                    reject({message: err, statusCode: 500});
                } else {
                    resolve({message: "Category updated successfully", data: result, statusCode: 200});
                }
            });
    })
};

exports.deleteCategory = (id) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE categories SET status = 0, deleted_at = NOW() WHERE id = ${id}`,
            (err, result) => {
                if (err) {
                    console.log(err);
                    reject({error: err});
                } else {
                    resolve({data: result});
                }
            });
    });
};