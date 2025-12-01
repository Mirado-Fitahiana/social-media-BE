CREATE TABLE users (
    id INT PRIMARY KEY IDENTITY(1,1),
    username NVARCHAR(50) NOT NULL UNIQUE,
    email NVARCHAR(100) NOT NULL UNIQUE,
    name NVARCHAR(100) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL DEFAULT 'user',
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT CHK_role CHECK (role IN ('admin', 'user', 'guest'))
);
