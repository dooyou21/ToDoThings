-- create user table
CREATE TABLE user (
    userId INT unsigned NOT NULL AUTO_INCREMENT,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(200),
    userName VARCHAR(200) NOT NULL,
    oauthName VARCHAR(20),
    oauthToken VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT pk_user PRIMARY KEY (userId)
);

-- create category table
CREATE TABLE category (
	categoryId INT UNSIGNED NOT NULL AUTO_INCREMENT,
    categoryName VARCHAR(100) NOT NULL,
    ownerId INT UNSIGNED NOT NULL,
	CONSTRAINT pk_category PRIMARY KEY (categoryId),
    CONSTRAINT fk_category_user FOREIGN KEY (ownerId) REFERENCES user (userId) ON DELETE CASCADE
);

-- create todo_table
CREATE TABLE todo (
	todoId INT UNSIGNED NOT NULL AUTO_INCREMENT,
    memo VARCHAR(500) NOT NULL,
    isDone BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    completedAt TIMESTAMP NULL DEFAULT NULL,
    deletedAt TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT pk_todo PRIMARY KEY (todoId)
);

-- create Categorization table
CREATE TABLE Categorization (
	categorizationId INT UNSIGNED NOT NULL AUTO_INCREMENT,
	categoryId INT UNSIGNED NOT NULL,
	todoId INT UNSIGNED NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_categorization PRIMARY KEY (categorizationId),
    CONSTRAINT fk_categorization_category FOREIGN KEY (categoryId) REFERENCES category (categoryId) ON DELETE CASCADE,
    CONSTRAINT fk_categoriaztion_todo FOREIGN KEY (todoId) REFERENCES todo (todoId) ON DELETE CASCADE
);

-- insert data for test
insert into user ( email, password, userName) values ('user1@email.com', 'pwd', 'user1');
insert into user ( email, password, userName) values ('user2@email.com', 'pwd', 'user2');

insert into category ( categoryName, ownerId) values ('daily-routine', 1);
insert into category ( categoryName, ownerId) values ('development-study', 1);
insert into category ( categoryName, ownerId) values ('life', 2);
insert into category ( categoryName, ownerId) values ('work', 2);

insert into todo ( memo, ownerId ) values ( '떡볶이 사러가기', 1 );
insert into todo ( memo, ownerId ) values ( 'todo server 개발', 1 );
insert into todo ( memo, ownerId ) values ( 'todo frontend 개발', 1 );
insert into todo ( memo, ownerId ) values ( '노래듣기', 1 );

insert into todo ( memo, ownerId ) values ( '강아지 산책', 2 );
insert into todo ( memo, ownerId ) values ( '사진찍기', 2 );
insert into todo ( memo, ownerId ) values ( '책읽기', 2 );

insert into Categorization ( categoryId, todoId ) values ( 1, 1 );
insert into Categorization ( categoryId, todoId ) values ( 2, 2 );
insert into Categorization ( categoryId, todoId ) values ( 2, 3 );
insert into Categorization ( categoryId, todoId ) values ( 1, 4 );
insert into Categorization ( categoryId, todoId ) values ( 3, 5 );
insert into Categorization ( categoryId, todoId ) values ( 3, 6 );