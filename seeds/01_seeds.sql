let password = `$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.`

INSERT INTO users (id, name, email, password)
VALUES (1, 'matt', 'matt@gmail.com', password),
(2, 'alice', 'alice@gmail.com', password),
(3, 'bob', 'bob@gmail.com', password);

INSERT INTO properties (id, owner_id, title, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 1, 'abc', 'TP.jpg',' CP.jpg', 20, 3, 2, 3, 'Canada', 'barleyStreet', 'Van', 'B.C', 'V3R', TRUE),
VALUES (2, 2, 'def', 'TP.jpg',' CP.jpg', 20, 3, 2, 3, 'Europe', 'someStreet', 'Lux', 'E.U', 'E1T', TRUE),
VALUES (3, 3, 'ghi', 'TP.jpg',' CP.jpg', 20, 3, 2, 3, 'China', 'hellostreet', 'Hong', 'H.K', 'H4T', TRUE);

INSERT INTO reservations (id, start_date, end_date, property_id, guest_id)
VALUES (1, 2023-03-20, 2023-03-30, 1, 1),
VALUES (2, 2023-03-20, 2023-03-30, 2, 2),
VALUES (3, 2023-03-20, 2023-03-30, 3, 3);

INSERT INTO property_reviews (id, guest_id, property_id, reservation_id, rating, message)
VALUES (1, 1, 1, 1, 80, "REVIEW1"),
VALUES (2, 2, 2, 2, 50, "REVIEW2"),
VALUES (3, 3, 3, 3, 25, "REVIEW3");