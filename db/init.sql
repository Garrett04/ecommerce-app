CREATE TABLE "users" (
  "id" int PRIMARY KEY,
  "username" text,
  "first_name" varhcar(50),
  "last_name" varchar(50),
  "pw_hash" text,
  "pw_salt" text
);

CREATE TABLE "carts" (
  "id" int PRIMARY KEY,
  "title" text,
  "user_id" int
);

CREATE TABLE "products" (
  "id" int PRIMARY KEY,
  "name" text,
  "price" money
);

CREATE TABLE "categories" (
  "id" int PRIMARY KEY,
  "name" text
);

CREATE TABLE "addresses" (
  "id" int PRIMARY KEY,
  "user_id" int,
  "address_line1" varchar(300),
  "address_line2" varchar(300),
  "city" varchar(100),
  "state" varchar(100),
  "postal_code" varchar(20),
  "country" varchar(100)
);

CREATE TABLE "checkout" (
  "id" int PRIMARY KEY,
  "payment_method" text,
  "shipping_address_id" text,
  "billing_address_id" text,
  "subtotal" money,
  "tax" money,
  "shipping_cost" money,
  "total_amount" money,
  "checkout_date" date,
  "checkout_status" text,
  "cart_id" integer
);

CREATE TABLE "orders" (
  "id" int PRIMARY KEY,
  "user_id" int,
  "order_date" date,
  "order_status" text,
  "checkout_id" int
);

CREATE TABLE "carts_products" (
  "cart_id" int,
  "product_id" int,
  "quantity" int
);

CREATE TABLE "categories_products" (
  "category_id" int,
  "product_id" int
);

ALTER TABLE "carts" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "addresses" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "checkout" ADD FOREIGN KEY ("shipping_address_id") REFERENCES "addresses" ("id");

ALTER TABLE "checkout" ADD FOREIGN KEY ("billing_address_id") REFERENCES "addresses" ("id");

ALTER TABLE "checkout" ADD FOREIGN KEY ("cart_id") REFERENCES "carts" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "orders" ADD FOREIGN KEY ("checkout_id") REFERENCES "checkout" ("id");

ALTER TABLE "carts_products" ADD FOREIGN KEY ("cart_id") REFERENCES "carts" ("id");

ALTER TABLE "carts_products" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");

ALTER TABLE "categories_products" ADD FOREIGN KEY ("category_id") REFERENCES "categories" ("id");

ALTER TABLE "categories_products" ADD FOREIGN KEY ("product_id") REFERENCES "products" ("id");
