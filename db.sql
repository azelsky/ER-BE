-- mysql
CREATE TABLE `user_role` (
  `user_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin,
  `role_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin,
  `restaurant_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin,
  PRIMARY KEY (`user_id`, `role_id`, `restaurant_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- add roles
INSERT INTO roles (id, name, value) VALUES (UUID(), 'Admin', 'ADMIN');
INSERT INTO roles (id, name, value) VALUES (UUID(), 'Owner', 'OWNER');

-- add pricing plans
INSERT INTO pricing_plans (id, name, price, type)
VALUES
  (UUID(), 'Trial Plan', 0, 'trial'),
  (UUID(), 'Monthly Plan', 19, 'monthly'),
  (UUID(), 'Semi-Annual Plan', 105, 'semi-annual'),
  (UUID(), 'Annual Plan', 199, 'annual');


INSERT INTO guest_pages (id, restaurantId, successBackground, successTextColor)
SELECT
    UUID() AS id,
    restaurants.id AS restaurantId,
    "#732796" AS successBackground,
    "#f1e5f4" AS successTextColor
FROM restaurants;

ALTER TABLE pricing_plans
ADD display_price DECIMAL(10,2);

-- postgreSQL
CREATE TABLE user_role (
  user_id UUID,
  role_id UUID,
  restaurant_id UUID,
  PRIMARY KEY (user_id, role_id, restaurant_id),
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (role_id) REFERENCES roles (id),
  FOREIGN KEY (restaurant_id) REFERENCES restaurants (id)
);
