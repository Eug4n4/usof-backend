use usf;

insert into roles (name) values ('user'),('admin');

insert into users (login, password, full_name, email, role_id, is_active) values
('login1', '$2b$10$CLk3ABiyOy/F46Gpoj2mHusI14e0Ybw9sPxHNImOHpzV/0v5r6PxO', 'John Doe','doe@gmail.com',1, 1),
('login2','$2b$10$CLk3ABiyOy/F46Gpoj2mHusI14e0Ybw9sPxHNImOHpzV/0v5r6PxO','Alice Bob', 'bob@mail.com',1,1),
('login3','$2b$10$CLk3ABiyOy/F46Gpoj2mHusI14e0Ybw9sPxHNImOHpzV/0v5r6PxO','Bob Joe', 'joe@mail.com',1,1),
('login4','$2b$10$CLk3ABiyOy/F46Gpoj2mHusI14e0Ybw9sPxHNImOHpzV/0v5r6PxO','Uncle Dad', 'dad@mail.com',1,1),
('login5','$2b$10$CLk3ABiyOy/F46Gpoj2mHusI14e0Ybw9sPxHNImOHpzV/0v5r6PxO','Dad Joe', 'dadjoe@mail.com',1,1),
('login6','$2b$10$CLk3ABiyOy/F46Gpoj2mHusI14e0Ybw9sPxHNImOHpzV/0v5r6PxO','Admin Adminus', 'admin@hotmail.com',2,1);

insert into posts (author, title, content) values 
(1, 'How to center a div', 'help me center div, please'),
(2, 'jakarta email throwing jakarta.mail.MessagingException: Could not convert socket to tls', 'help me with my problem'),
(3, 'Interface without Jakarta Validation Annotation for Validation in Implementation Class', 'help me with my problem'),
(1, 'Express routes not being hit; router testing middleware never logs requests', 'help me with my problem'),
(4, 'Assembly loading at runtime for .NET and .NET Framework', 'help me with my problem'),
(5, 'How do I store and use rax output into a register for later use?', 'help me with my problem'),
(4, 'Adding custom CSS to Power Pages using VS code', 'help me with my problem'),
(3, 'Why my x86 Asm code gets Segmentation fault?', 'help me with my problem'),
(1, 'PhantomJs Emulate IE8', 'help me with my problem');


insert into categories (name, description) values 
('CSS','Category devoted to css'),
('Java','Category devoted to java'),
('assembly','Category devoted to asm'),
('asp.net','Category devoted to .net'),
('java script','Category devoted to js');

insert into post_categories (post_id, category_id) values
(1,1),
(1,5),
(2,2),
(3,2),
(4,5),
(5,4),
(6,3),
(7,1),
(8,3),
(9,5);

insert into comments (author, post_id, content) values
(1, 1, 'comment1'),
(2, 2, 'comment2'),
(3, 3, 'comment3'),
(4, 4, 'comment4'),
(5, 5, 'comment5'),
(6, 6, 'comment6'),
(2, 7, 'comment7'),
(4, 8, 'comment8'),
(6, 9, 'comment9'),
(1, 2, 'comment10'),
(3, 4, 'comment11');

insert into likes (author, post_id, type) values
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1),
(2, 7, 1),
(4, 8, 1),
(6, 9, 1),
(1, 2, 0),
(3, 4, 0),
(5, 6, 0);

insert into likes (author, comment_id, type) values
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1),
(2, 7, 0),
(4, 8, 1),
(6, 9, 0),
(1, 10, 0),
(5, 11, 1);



