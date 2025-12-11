CREATE TABLE
    users (
        id INT PRIMARY KEY IDENTITY (1, 1),
        username NVARCHAR (50) NOT NULL UNIQUE,
        email NVARCHAR (100) NOT NULL UNIQUE,
        name NVARCHAR (100) NOT NULL,
        password NVARCHAR (255) NOT NULL,
        role NVARCHAR (50) NOT NULL DEFAULT 'user',
        created_at DATETIME2 DEFAULT GETDATE (),
        CONSTRAINT CHK_role CHECK (role IN ('admin', 'user', 'guest'))
    );

create table
    social_media (
        id INT PRIMARY KEY IDENTITY (1, 1),
        platform NVARCHAR (50) NOT NULL,
        icon_logo NVARCHAR (255),
        description NVARCHAR (255),
        created_at DATETIME2 DEFAULT GETDATE (),
    );

create table
    social_media_user (
        id INT PRIMARY KEY IDENTITY (1, 1),
        user_id INT NOT NULL,
        social_media_id INT NOT NULL,
        token NVARCHAR (255) NOT NULL,
        CONSTRAINT FK_user FOREIGN KEY (user_id) REFERENCES users (id),
        CONSTRAINT FK_social_media FOREIGN KEY (social_media_id) REFERENCES social_media (id)
    );

create table
    posts (
        id INT PRIMARY KEY IDENTITY (1, 1),
        user_id INT NOT NULL,
        social_media_id INT NOT NULL,
        title NVARCHAR (255) NOT NULL,
        content NVARCHAR (MAX) NOT NULL,
        path_file NVARCHAR (255),
        created_at DATETIME2 DEFAULT GETDATE (),
        CONSTRAINT FK_post_user FOREIGN KEY (user_id) REFERENCES users (id),
        CONSTRAINT FK_post_social_media FOREIGN KEY (social_media_id) REFERENCES social_media (id)
    );

create table
    tarifs (
        id INT PRIMARY KEY IDENTITY (1, 1),
        name NVARCHAR (100) NOT NULL,
        description NVARCHAR (255),
        price DECIMAL(10, 2) NOT NULL,
        duration_in_days INT NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE ()
    )
create table
    user_tarifs (
        id INT PRIMARY KEY IDENTITY (1, 1),
        user_id INT NOT NULL,
        tarif_id INT NOT NULL,
        start_date DATETIME2 DEFAULT GETDATE (),
        end_date DATETIME2 NOT NULL,
        CONSTRAINT FK_user_tarif_user FOREIGN KEY (user_id) REFERENCES users (id),
        CONSTRAINT FK_user_tarif_tarif FOREIGN KEY (tarif_id) REFERENCES tarifs (id)
    );