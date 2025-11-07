 -- Create database (skip if it already exists)
  IF DB_ID(N'SmartEStore') IS NULL
  BEGIN
      CREATE DATABASE SmartEStore;
  END;
  GO

  USE SmartEStore;
  GO

  -- Drop existing tables if you want a clean slate
  IF OBJECT_ID(N'dbo.OrderItems', 'U') IS NOT NULL DROP TABLE dbo.OrderItems;
  IF OBJECT_ID(N'dbo.Orders', 'U') IS NOT NULL DROP TABLE dbo.Orders;
  IF OBJECT_ID(N'dbo.Products', 'U') IS NOT NULL DROP TABLE dbo.Products;
  IF OBJECT_ID(N'dbo.Categories', 'U') IS NOT NULL DROP TABLE dbo.Categories;
  GO

  CREATE TABLE dbo.Categories
  (
      Id          INT            IDENTITY(1,1) PRIMARY KEY,
      Name        NVARCHAR(200)  NOT NULL
  );

  CREATE TABLE dbo.Products
  (
      Id          INT            IDENTITY(1,1) PRIMARY KEY,
      Name        NVARCHAR(200)  NOT NULL,
      Description NVARCHAR(MAX)  NOT NULL,
      Price       DECIMAL(18,2)  NOT NULL,
      ImageUrl    NVARCHAR(500)  NOT NULL,
      Stock       INT            NOT NULL,
      CategoryId  INT            NOT NULL,
      CreatedAt   DATETIME2(0)   NOT NULL DEFAULT (SYSUTCDATETIME()),
      CONSTRAINT FK_Products_Categories FOREIGN KEY (CategoryId)
          REFERENCES dbo.Categories(Id) ON DELETE CASCADE
  );

  CREATE TABLE dbo.Orders
  (
      Id            INT            IDENTITY(1,1) PRIMARY KEY,
      CustomerName  NVARCHAR(200)  NOT NULL,
      CustomerEmail NVARCHAR(200)  NOT NULL,
      TotalAmount   DECIMAL(18,2)  NOT NULL,
      Status        INT            NOT NULL,          -- matches OrderStatus enum
      CreatedAt     DATETIME2(0)   NOT NULL DEFAULT (SYSUTCDATETIME())
  );

  CREATE TABLE dbo.OrderItems
  (
      Id         INT            IDENTITY(1,1) PRIMARY KEY,
      OrderId    INT            NOT NULL,
      ProductId  INT            NOT NULL,
      Quantity   INT            NOT NULL,
      Price      DECIMAL(18,2)  NOT NULL,
      CONSTRAINT FK_OrderItems_Orders FOREIGN KEY (OrderId)
          REFERENCES dbo.Orders(Id) ON DELETE CASCADE,
      CONSTRAINT FK_OrderItems_Products FOREIGN KEY (ProductId)
          REFERENCES dbo.Products(Id) ON DELETE CASCADE
  );
  GO

  -- Seed static data
  SET IDENTITY_INSERT dbo.Categories ON;
  INSERT INTO dbo.Categories (CategoryId, CategoryName) VALUES
      (1, N'Electronics'),
      (2, N'Clothing'),
      (3, N'Books'),
      (4, 'Home & Kitchen'),
    (5, 'Sports & Outdoors'),
    (6, 'Toys & Games'),
    (7, 'Beauty & Personal Care'),
    (8, 'Automotive');
  SET IDENTITY_INSERT dbo.Categories OFF;

  SET IDENTITY_INSERT dbo.Products ON;
  INSERT INTO dbo.Products
      (ProductId, ProductName, Description, Price, ImageUrl, Stock, CategoryId, CreatedAt)
  VALUES

          -- Electronics
    (1, 'Laptop Pro 15', 'High-performance laptop with 16GB RAM and 512GB SSD. Perfect for professionals and content creators.', 1299.99, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 15, 1, '2024-01-01T00:00:00'),
    (2, 'Wireless Mouse', 'Ergonomic wireless mouse with precision tracking and long battery life.', 29.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 50, 1, '2024-01-01T00:00:00'),
    (3, 'Bluetooth Headphones', 'Noise-canceling over-ear headphones with 30-hour battery life.', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 30, 1, '2024-01-01T00:00:00'),
    (4, 'Smartphone X', 'Latest smartphone with 5G, triple camera system, and OLED display.', 899.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 25, 1, '2024-01-01T00:00:00'),
    (5, '4K Monitor 27', 'Ultra HD monitor with HDR support and 144Hz refresh rate.', 449.99, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', 20, 1, '2024-01-01T00:00:00'),

    -- Clothing
    (6, 'Cotton T-Shirt', 'Comfortable 100% cotton t-shirt available in multiple colors.', 19.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 100, 2, '2024-01-01T00:00:00'),
    (7, 'Denim Jeans', 'Classic fit denim jeans with stretch comfort.', 59.99, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 75, 2, '2024-01-01T00:00:00'),
    (8, 'Running Shoes', 'Lightweight running shoes with cushioned sole and breathable mesh.', 89.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 40, 2, '2024-01-01T00:00:00'),
    (9, 'Winter Jacket', 'Warm insulated jacket with water-resistant outer layer.', 149.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 30, 2, '2024-01-01T00:00:00'),
    (10, 'Baseball Cap', 'Adjustable baseball cap with embroidered logo.', 24.99, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', 60, 2, '2024-01-01T00:00:00'),

    -- Books
    (11, 'The Great Novel', 'Bestselling fiction that captivated millions of readers worldwide.', 14.99, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 50, 3, '2024-01-01T00:00:00'),
    (12, 'Programming Fundamentals', 'Comprehensive guide to modern programming concepts and practices.', 49.99, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500', 35, 3, '2024-01-01T00:00:00'),
    (13, 'Cooking Masterclass', 'Learn professional cooking techniques from world-renowned chefs.', 34.99, 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500', 45, 3, '2024-01-01T00:00:00'),
    (14, 'History of Art', 'Beautiful illustrated guide covering art history from ancient to modern times.', 59.99, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500', 25, 3, '2024-01-01T00:00:00'),

    -- Home & Kitchen
    (15, 'Coffee Maker', 'Programmable coffee maker with thermal carafe and auto-brew feature.', 79.99, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', 40, 4, '2024-01-01T00:00:00'),
    (16, 'Blender Pro', 'High-power blender perfect for smoothies, soups, and more.', 129.99, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500', 30, 4, '2024-01-01T00:00:00'),
    (17, 'Knife Set', 'Professional 10-piece knife set with wooden block.', 99.99, 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500', 20, 4, '2024-01-01T00:00:00'),
    (18, 'Non-stick Pan Set', 'Durable non-stick cookware set with heat-resistant handles.', 149.99, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', 25, 4, '2024-01-01T00:00:00'),

    -- Sports & Outdoors
    (19, 'Yoga Mat', 'Premium non-slip yoga mat with carrying strap.', 39.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', 60, 5, '2024-01-01T00:00:00'),
    (20, 'Camping Tent', 'Waterproof 4-person tent with easy setup system.', 199.99, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500', 15, 5, '2024-01-01T00:00:00'),
    (21, 'Dumbbell Set', 'Adjustable dumbbell set from 5 to 50 lbs.', 299.99, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500', 20, 5, '2024-01-01T00:00:00'),
    (22, 'Basketball', 'Official size basketball with superior grip.', 29.99, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500', 50, 5, '2024-01-01T00:00:00'),

    -- Toys & Games
    (23, 'Building Blocks Set', 'Creative building blocks set with 500 pieces.', 44.99, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500', 40, 6, '2024-01-01T00:00:00'),
    (24, 'Board Game Classic', 'Family-friendly strategy board game for ages 8+.', 34.99, 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500', 35, 6, '2024-01-01T00:00:00'),
    (25, 'Remote Control Car', 'High-speed RC car with rechargeable battery.', 79.99, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 25, 6, '2024-01-01T00:00:00'),

    -- Beauty & Personal Care
    (26, 'Facial Cleanser', 'Gentle daily facial cleanser for all skin types.', 24.99, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', 70, 7, '2024-01-01T00:00:00'),
    (27, 'Hair Dryer Pro', 'Professional ionic hair dryer with multiple heat settings.', 89.99, 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500', 30, 7, '2024-01-01T00:00:00'),
    (28, 'Moisturizer SPF 30', 'Daily moisturizer with broad-spectrum sun protection.', 34.99, 'https://images.unsplash.com/photo-1556228852-80c3b5daadb9?w=500', 55, 7, '2024-01-01T00:00:00'),

    -- Automotive
    (29, 'Car Phone Mount', 'Universal car phone holder with adjustable grip.', 19.99, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500', 80, 8, '2024-01-01T00:00:00'),
    (30, 'Dash Camera', 'Full HD dash cam with night vision and parking mode.', 129.99, 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500', 35, 8, '2024-01-01T00:00:00');

  SET IDENTITY_INSERT dbo.Products OFF;
  GO



USE SmartEStore;
 GO
  select * from dbo.Categories
  select * from dbo.OrderItems
   select * from dbo.Products
  select * from dbo.Orders


   -- ============================================
-- SEED DATA - Categories
-- ============================================
INSERT INTO Categories (Id, Name) VALUES
(1, 'Electronics'),
(2, 'Clothing'),
(3, 'Books'),
(4, 'Home & Kitchen'),
(5, 'Sports & Outdoors'),
(6, 'Toys & Games'),
(7, 'Beauty & Personal Care'),
(8, 'Automotive');

-- ============================================
-- SEED DATA - Products
-- ============================================
INSERT INTO Products (Id, Name, Description, Price, ImageUrl, Stock, CategoryId, IsActive) VALUES
-- Electronics
(1, 'Laptop Pro 15', 'High-performance laptop with 16GB RAM and 512GB SSD. Perfect for professionals and content creators.', 1299.99, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', 15, 1, 1),
(2, 'Wireless Mouse', 'Ergonomic wireless mouse with precision tracking and long battery life.', 29.99, 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500', 50, 1, 1),
(3, 'Bluetooth Headphones', 'Noise-canceling over-ear headphones with 30-hour battery life.', 199.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', 30, 1, 1),
(4, 'Smartphone X', 'Latest smartphone with 5G, triple camera system, and OLED display.', 899.99, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', 25, 1, 1),
(5, '4K Monitor 27', 'Ultra HD monitor with HDR support and 144Hz refresh rate.', 449.99, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', 20, 1, 1),

-- Clothing
(6, 'Cotton T-Shirt', 'Comfortable 100% cotton t-shirt available in multiple colors.', 19.99, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 100, 2, 1),
(7, 'Denim Jeans', 'Classic fit denim jeans with stretch comfort.', 59.99, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 75, 2, 1),
(8, 'Running Shoes', 'Lightweight running shoes with cushioned sole and breathable mesh.', 89.99, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 40, 2, 1),
(9, 'Winter Jacket', 'Warm insulated jacket with water-resistant outer layer.', 149.99, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 30, 2, 1),
(10, 'Baseball Cap', 'Adjustable baseball cap with embroidered logo.', 24.99, 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500', 60, 2, 1),

-- Books
(11, 'The Great Novel', 'Bestselling fiction that captivated millions of readers worldwide.', 14.99, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500', 50, 3, 1),
(12, 'Programming Fundamentals', 'Comprehensive guide to modern programming concepts and practices.', 49.99, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500', 35, 3, 1),
(13, 'Cooking Masterclass', 'Learn professional cooking techniques from world-renowned chefs.', 34.99, 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500', 45, 3, 1),
(14, 'History of Art', 'Beautiful illustrated guide covering art history from ancient to modern times.', 59.99, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500', 25, 3, 1),

-- Home & Kitchen
(15, 'Coffee Maker', 'Programmable coffee maker with thermal carafe and auto-brew feature.', 79.99, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500', 40, 4, 1),
(16, 'Blender Pro', 'High-power blender perfect for smoothies, soups, and more.', 129.99, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500', 30, 4, 1),
(17, 'Knife Set', 'Professional 10-piece knife set with wooden block.', 99.99, 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500', 20, 4, 1),
(18, 'Non-stick Pan Set', 'Durable non-stick cookware set with heat-resistant handles.', 149.99, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500', 25, 4, 1),

-- Sports & Outdoors
(19, 'Yoga Mat', 'Premium non-slip yoga mat with carrying strap.', 39.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500', 60, 5, 1),
(20, 'Camping Tent', 'Waterproof 4-person tent with easy setup system.', 199.99, 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=500', 15, 5, 1),
(21, 'Dumbbell Set', 'Adjustable dumbbell set from 5 to 50 lbs.', 299.99, 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500', 20, 5, 1),
(22, 'Basketball', 'Official size basketball with superior grip.', 29.99, 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500', 50, 5, 1),

-- Toys & Games
(23, 'Building Blocks Set', 'Creative building blocks set with 500 pieces.', 44.99, 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500', 40, 6, 1),
(24, 'Board Game Classic', 'Family-friendly strategy board game for ages 8+.', 34.99, 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=500', 35, 6, 1),
(25, 'Remote Control Car', 'High-speed RC car with rechargeable battery.', 79.99, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', 25, 6, 1),

-- Beauty & Personal Care
(26, 'Facial Cleanser', 'Gentle daily facial cleanser for all skin types.', 24.99, 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500', 70, 7, 1),
(27, 'Hair Dryer Pro', 'Professional ionic hair dryer with multiple heat settings.', 89.99, 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500', 30, 7, 1),
(28, 'Moisturizer SPF 30', 'Daily moisturizer with broad-spectrum sun protection.', 34.99, 'https://images.unsplash.com/photo-1556228852-80c3b5daadb9?w=500', 55, 7, 1),

-- Automotive
(29, 'Car Phone Mount', 'Universal car phone holder with adjustable grip.', 19.99, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500', 80, 8, 1),
(30, 'Dash Camera', 'Full HD dash cam with night vision and parking mode.', 129.99, 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=500', 35, 8, 1);

-- ============================================
-- SEED DATA - Sample Users
-- ============================================
INSERT INTO Users (Email, PasswordHash, FirstName, LastName, Role, IsActive) VALUES
('admin@onlinestore.com', '$2a$11$hashed_password_here', 'Admin', 'User', 'Admin', 1),
('john.doe@example.com', '$2a$11$hashed_password_here', 'John', 'Doe', 'Customer', 1),
('jane.smith@example.com', '$2a$11$hashed_password_here', 'Jane', 'Smith', 'Customer', 1);

-- ============================================
-- SEED DATA - Sample Orders
-- ============================================
INSERT INTO Orders (CustomerName, CustomerEmail, CustomerPhone, ShippingAddress, TotalAmount, Status) VALUES
('John Doe', 'john.doe@example.com', '+1234567890', '123 Main St, New York, NY 10001', 1329.98, 'Delivered'),
('Jane Smith', 'jane.smith@example.com', '+0987654321', '456 Oak Ave, Los Angeles, CA 90001', 109.98, 'Shipped'),
('Bob Johnson', 'bob.johnson@example.com', '+1122334455', '789 Pine Rd, Chicago, IL 60601', 449.99, 'Processing');

-- ============================================
-- SEED DATA - Sample Order Items
-- ============================================
INSERT INTO OrderItems (OrderId, ProductId, Quantity, Price) VALUES
-- Order 1
(1, 1, 1, 1299.99),
(1, 2, 1, 29.99),

-- Order 2
(2, 6, 2, 19.99),
(2, 8, 1, 89.99),

-- Order 3
(3, 5, 1, 449.99);

-- ============================================
-- SEED DATA - Sample Reviews
-- ============================================
INSERT INTO Reviews (ProductId, UserId, CustomerName, Rating, Comment) VALUES
(1, 2, 'John Doe', 5, 'Excellent laptop! Fast and reliable for all my work needs.'),
(1, 3, 'Jane Smith', 4, 'Great performance but a bit pricey.'),
(6, 2, 'John Doe', 5, 'Very comfortable t-shirt, fits perfectly!'),
(8, 3, 'Jane Smith', 5, 'Best running shoes I have ever owned. Highly recommend!'),
(11, 2, 'John Doe', 4, 'Engaging story with well-developed characters.'),
(15, NULL, 'Anonymous', 5, 'Makes perfect coffee every morning!');
