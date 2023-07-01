-- mysql
CREATE TABLE `user_role` (
  `user_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin,
  `role_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin,
  `restaurant_id` char(36) CHARACTER SET utf8 COLLATE utf8_bin,
  PRIMARY KEY (`user_id`, `role_id`, `restaurant_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO roles (id, name, value) VALUES (UUID(), 'Admin', 'ADMIN');
INSERT INTO roles (id, name, value) VALUES (UUID(), 'Owner', 'OWNER');

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
