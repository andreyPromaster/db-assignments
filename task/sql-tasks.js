'use strict';

/********************************************************************************************
 *                                                                                          *
 * The goal of the task is to get basic knowledge of SQL functions and                      *
 * approaches to work with data in SQL.                                                     *
 * https://dev.mysql.com/doc/refman/5.7/en/function-reference.html                          *
 *                                                                                          *
 * The course do not includes basic syntax explanations. If you see the SQL first time,     *
 * you can find explanation and some trainings at W3S                                       *
 * https://www.w3schools.com/sql/sql_syntax.asp                                             *
 *                                                                                          *
 ********************************************************************************************/


/**
 *  Create a SQL query to return next data ordered by city and then by name:
 * | Employy Id | Employee Full Name | Title | City |
 *
 * @return {array}
 *
 */
async function task_1_1(db) {
    // The first task is example, please follow the style in the next functions.
    let result = await db.query(`
        SELECT
           EmployeeID as "Employee Id",
           CONCAT(FirstName, ' ', LastName) AS "Employee Full Name",
           Title as "Title",
           City as "City"
        FROM Employees
        ORDER BY City, "Employee Full Name"
    `);
    return result[0];
}

/**
 *  Create a query to return an Order list ordered by order id descending:
 * | Order Id | Order Total Price | Total Order Discount, % |
 *
 * NOTES: Discount in OrderDetails is a discount($) per Unit.
 * @return {array}
 *
 */
async function task_1_2(db) {
    let result = await db.query(`
    SELECT 
        OrderID AS "Order Id",
        SUM(unitPrice * Quantity) AS "Order Total Price",
        ROUND(100 * SUM(Discount * Quantity) / SUM(unitPrice * Quantity),
                3) AS "Total Order Discount, %"
    FROM
        orderdetails
    GROUP BY OrderID
    ORDER BY OrderID DESC;`);
 return result[0];
}

/**
 *  Create a query to return all customers from USA without Fax:
 * | CustomerId | CompanyName |
 *
 * @return {array}
 *
 */
async function task_1_3(db) {
    let result = await db.query(`
    SELECT 
        CustomerId, CompanyName
    FROM
        customers
    WHERE
        Country = 'USA' AND Fax IS NULL;`);
    return result[0];
}

/**
 * Create a query to return:
 * | Customer Id | Total number of Orders | % of all orders |
 *
 * order data by % - higher percent at the top, then by CustomerID asc
 *
 * @return {array}
 *
 */
async function task_1_4(db) {
    let result = await db.query(`
    SELECT 
        customers.CustomerId as "Customer Id",
        COUNT(customers.CustomerID) AS "Total number of Orders",
        ROUND(COUNT(customers.CustomerID) / (SELECT 
                        COUNT(*)
                    FROM
                        orders) * 100,
                5) AS "% of all orders"
    FROM
        orders
            JOIN
        customers ON customers.CustomerID = orders.CustomerID
    GROUP BY customers.CustomerID
    ORDER BY COUNT(*)/(SELECT COUNT(*) FROM Orders)*100 DESC , customers.CustomerID ASC;`);

    return result[0];
}

/**
 * Return all products where product name starts with 'A', 'B', .... 'F' ordered by name.
 * | ProductId | ProductName | QuantityPerUnit |
 *
 * @return {array}
 *
 */
async function task_1_5(db) {
    let result = await db.query(`SELECT 
        ProductId, ProductName, QuantityPerUnit
    FROM
        products
    WHERE
        ProductName REGEXP '^([A-F])'
    ORDER BY ProductName;
    `);

    return result[0];
}

/**
 *
 * Create a query to return all products with category and supplier company names:
 * | ProductName | CategoryName | SupplierCompanyName |
 *
 * Order by ProductName then by SupplierCompanyName
 * @return {array}
 *
 */
async function task_1_6(db) {
    let result = await db.query(`
    SELECT 
        ProductName,
        CategoryName,
        CompanyName AS 'SupplierCompanyName'
    FROM
        products
            JOIN
        suppliers ON suppliers.supplierid = products.supplierid
            JOIN
        categories ON categories.CategoryID = products.CategoryID
    ORDER BY ProductName , SupplierCompanyName;`);
    
    return result[0];
}

/**
 *
 * Create a query to return all employees and full name of person to whom this employee reports to:
 * | EmployeeId | FullName | ReportsTo |
 *
 * Order data by EmployeeId.
 * Reports To - Full name. If the employee does not report to anybody leave "-" in the column.
 * @return {array}
 *
 */
async function task_1_7(db) {
    let result = await db.query(`
    SELECT 
        a.EmployeeId,
        CONCAT(a.FirstName, ' ', a.LastName) AS FullName,
        IFNULL(CONCAT(b.FirstName, ' ', b.LastName), '-') as ReportsTo
    FROM
        employees a
        LEFT JOIN employees b on b.EmployeeID = a.ReportsTo
    ORDER BY a.EmployeeId;`);

    return result[0];
}


/**
 *
 * Create a query to return:
 * | CategoryName | TotalNumberOfProducts |
 *
 * @return {array}
 *
 */
async function task_1_8(db) {
    let result = await db.query(`
    SELECT 
        CategoryName, COUNT(*) AS TotalNumberOfProducts
    FROM
        products
            JOIN
        categories ON categories.CategoryID = products.CategoryID
    GROUP BY CategoryName 
    ORDER BY CategoryName;`);

    return result[0];
}

/**
 *
 * Create a SQL query to find those customers whose contact name containing the 1st character is 'F' and the 4th character is 'n' and rests may be any character.
 * | CustomerID | ContactName |
 *
 * @return {array}
 *
 */
async function task_1_9(db) {
    let result = await db.query(`
    SELECT 
        CustomerID, ContactName
    FROM
        customers
    WHERE
        ContactName LIKE "F__n%";`);

    return result[0];
}

/**
 * Write a query to get discontinued Product list:
 * | ProductID | ProductName |
 *
 * @return {array}
 *
 */
async function task_1_10(db) {
    let result = await db.query(`
    SELECT 
        ProductID, ProductName
    FROM
        products
    WHERE
        Discontinued = TRUE;`);

    return result[0];
}

/**
 * Create a SQL query to get Product list (name, unit price) where products cost between $5 and $15:
 * | ProductName | UnitPrice |
 *
 * Order by UnitPrice then by ProductName
 *
 * @return {array}
 *
 */
async function task_1_11(db) {
    let result = await db.query(`
    SELECT 
        ProductName, UnitPrice
    FROM
        products
    WHERE
        UnitPrice BETWEEN 5 AND 15
    ORDER BY UnitPrice, ProductName;`);
        
    return result[0];
}

/**
 * Write a SQL query to get Product list of twenty most expensive products:
 * | ProductName | UnitPrice |
 *
 * Order products by price then by ProductName.
 *
 * @return {array}
 *
 */
async function task_1_12(db) {
    let result = await db.query(`
    (SELECT 
        ProductName, UnitPrice
    FROM
        products
    ORDER BY UnitPrice DESC
    LIMIT 20) ORDER BY UnitPrice , ProductName;`);
        
    return result[0];
}

/**
 * Create a SQL query to count current and discontinued products:
 * | TotalOfCurrentProducts | TotalOfDiscontinuedProducts |
 *
 * @return {array}
 *
 */
async function task_1_13(db) {
    let result = await db.query(`
    select (select count(*) from products) as TotalOfCurrentProducts,
    (select count(*) from products where Discontinued = 1) as TotalOfDiscontinuedProducts; 
    `);
        
    return result[0];
}


/**
 * Create a SQL query to get Product list of stock is less than the quantity on order:
 * | ProductName | UnitsOnOrder| UnitsInStock |
 *
 * @return {array}
 *
 */
async function task_1_14(db) {
    let result = await db.query(`
    SELECT 
        ProductName, UnitsOnOrder, UnitsInStock
    FROM
        products
    WHERE
        UnitsInStock < UnitsOnOrder;`);
        
    return result[0];
}

/**
 * Create a SQL query to return the total number of orders for every month in 1997 year:
 * | January | February | March | April | May | June | July | August | September | November | December |
 *
 * @return {array}
 *
 */
async function task_1_15(db) {
    let result = await db.query(`
    select (select count(*) from orders where YEAR(OrderDate) = 1997 and MONTH(OrderDate) = 1) as January,
    (select count(*) from orders where YEAR(OrderDate) = 1997 and MONTH(OrderDate) = 2) as February,
    (select count(*) from orders where YEAR(OrderDate) = 1997 and MONTH(OrderDate) = 3) as March,
    (select count(*) from orders where YEAR(OrderDate) = 1997 and MONTH(OrderDate) = 4) as April,
    (select count(*) from orders where YEAR(OrderDate) = 1997 and MONTH(OrderDate) = 5) as May,
    (select count(*) from orders where YEAR(OrderDate) = 1997 and MONTH(OrderDate) = 6) as June,
    (select count(*) from orders where YEAR(OrderDate) = 1997 and MONTH(OrderDate) = 7) as July,
    (select count(*) from orders where YEAR(OrderDate) = 1997 and MONTH(OrderDate) = 8) as August,
    (select count(*) from orders where YEAR(OrderDate) = 1997 and MONTH(OrderDate) = 9) as September,
    (select count(*) from orders where YEAR(OrderDate) = 1997 and MONTH(OrderDate) = 10) as October,
    (select count(*) from orders where YEAR(OrderDate) = 1997 and MONTH(OrderDate) = 11) as November,
    (select count(*) from orders where YEAR(OrderDate) = 1997 and MONTH(OrderDate) = 12) as December;`);
        
    return result[0];
}

/**
 * Create a SQL query to return all orders where ship postal code is provided:
 * | OrderID | CustomerID | ShipCountry |
 *
 * @return {array}
 *
 */
async function task_1_16(db) {
    let result = await db.query(`
    SELECT 
        OrderID, CustomerID, ShipCountry
    FROM
        orders
    WHERE
        ShipPostalCode IS NOT NULL;`);
        
    return result[0];
}

/**
 * Create SQL query to display the average price of each categories's products:
 * | CategoryName | AvgPrice |
 *
 * @return {array}
 *
 * Order by AvgPrice descending then by CategoryName
 *
 */
async function task_1_17(db) {
    let result = await db.query(`
    SELECT 
        CategoryName, AVG(UnitPrice) AS AvgPrice
    FROM
        products
            JOIN
        categories ON categories.CategoryID = products.CategoryID
    GROUP BY categories.CategoryID
    ORDER BY AvgPrice DESC, CategoryName;`);
        
    return result[0];
}

/**
 * Create a SQL query to calcualte total orders count by each day in 1998:
 * | OrderDate | Total Number of Orders |
 *
 * OrderDate needs to be in the format '%Y-%m-%d %T'
 * @return {array}
 *
 */
async function task_1_18(db) {
    let result = await db.query(`
    SELECT 
        DATE_FORMAT(OrderDate, '%Y-%m-%d %T') AS OrderDate,
        COUNT(*) AS 'Total Number of Orders'
    FROM
        orders
    WHERE
        YEAR(OrderDate) = 1998
    GROUP BY OrderDate;`);
        
    return result[0];
}

/**
 * Create a SQL query to display customer details whose total orders amount is more than 10000$:
 * | CustomerID | CompanyName | TotalOrdersAmount, $ |
 *
 * Order by "TotalOrdersAmount, $" descending then by CustomerID
 * @return {array}
 *
 */
async function task_1_19(db) {
    let result = await db.query(`
    SELECT 
        orders.CustomerID,
        CompanyName,
        SUM(UnitPrice * Quantity) AS 'TotalOrdersAmount, $'
    FROM
        orders
            JOIN
        customers ON customers.CustomerID = orders.CustomerID
            JOIN
        orderdetails ON orderdetails.OrderID = orders.OrderID
    GROUP BY customers.CustomerID
    HAVING SUM(UnitPrice * Quantity) > 10000
    ORDER BY SUM(UnitPrice * Quantity) DESC , orders.CustomerID;`);
        
    return result[0];
}

/**
 *
 * Create a SQL query to find the employee that sold products for the largest amount:
 * | EmployeeID | Employee Full Name | Amount, $ |
 *
 * @return {array}
 *
 */
async function task_1_20(db) {
    let result = await db.query(`
    WITH 
    t as (select employees.EmployeeID, CONCAT(FirstName, ' ', LastName) AS FullName, sum(UnitPrice * Quantity) as amount
    FROM orders
            JOIN
        employees ON employees.EmployeeID = orders.EmployeeID
            JOIN
        orderdetails ON orderdetails.OrderID = orders.OrderID
    GROUP BY employees.EmployeeID)
    SELECT 
        EmployeeID, 
        FullName as "Employee Full Name", 
        amount as "Amount, $"  
    FROM t where t.amount = (select max(t.amount) from t);`);
            
    return result[0];
}

/**
 * Write a SQL statement to get the maximum purchase amount of all the orders.
 * | OrderID | Maximum Purchase Amount, $ |
 *
 * @return {array}
 */
async function task_1_21(db) {
    let result = await db.query(`
    with 
    t as (
        SELECT 
            OrderID, SUM(UnitPrice * Quantity) AS amount
        FROM
            orderdetails
        GROUP BY OrderID)
    SELECT 
        t.OrderID, t.amount AS 'Maximum Purchase Amount, $'
    FROM
        t
    WHERE
        t.amount = (
            SELECT 
                MAX(t.amount)
            FROM
                t);
    `);
            
    return result[0];
}

/**
 * Create a SQL query to display the name of each customer along with their most expensive purchased product:
 * | CompanyName | ProductName | PricePerItem |
 *
 * order by PricePerItem descending and them by CompanyName and ProductName acceding
 * @return {array}
 */
async function task_1_22(db) {
    let result = await db.query(`
    SELECT DISTINCT
        t_Cust.CompanyName,
        t_Prod.ProductName,
        t_OrderD.UnitPrice AS PricePerItem
    FROM
        Customers AS t_Cust
            JOIN
        Orders AS t_Order ON t_Order.CustomerID = t_Cust.CustomerID
            JOIN
        OrderDetails AS t_OrderD ON t_OrderD.OrderID = t_Order.OrderID
            JOIN
        Products AS t_Prod ON t_OrderD.ProductID = t_Prod.ProductID
    WHERE
        t_OrderD.UnitPrice = (SELECT 
                MAX(t1_OrderD.UnitPrice)
            FROM
                Customers AS t1_Cust
                    JOIN
                Orders AS t1_Order ON t1_Order.CustomerID = t1_Cust.CustomerID
                    JOIN
                OrderDetails AS t1_OrderD ON t1_Order.OrderID = t1_OrderD.OrderID
            WHERE
                t1_Cust.CompanyName = t_Cust.CompanyName)
    ORDER BY PricePerItem DESC , CompanyName , ProductName
    `);
            
    return result[0];
}

module.exports = {
    task_1_1: task_1_1,
    task_1_2: task_1_2,
    task_1_3: task_1_3,
    task_1_4: task_1_4,
    task_1_5: task_1_5,
    task_1_6: task_1_6,
    task_1_7: task_1_7,
    task_1_8: task_1_8,
    task_1_9: task_1_9,
    task_1_10: task_1_10,
    task_1_11: task_1_11,
    task_1_12: task_1_12,
    task_1_13: task_1_13,
    task_1_14: task_1_14,
    task_1_15: task_1_15,
    task_1_16: task_1_16,
    task_1_17: task_1_17,
    task_1_18: task_1_18,
    task_1_19: task_1_19,
    task_1_20: task_1_20,
    task_1_21: task_1_21,
    task_1_22: task_1_22
};
