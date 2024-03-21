--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
SET search_path = public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--
-- Name: update_users_default_address_on_address_delete(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_users_default_address_on_address_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
	UPDATE users
  SET default_shipping_address_id = NULL
  WHERE default_shipping_address_id = OLD.id;
  
  UPDATE users
  SET default_billing_address_id = NULL
  WHERE default_billing_address_id = OLD.id;
	
  RETURN OLD;
END;
$$;


ALTER FUNCTION public.update_users_default_address_on_address_delete() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid,
    address_line1 character varying(300),
    address_line2 character varying(300),
    city character varying(100),
    state character varying(100),
    postal_code character varying(20),
    country character varying(100)
);


ALTER TABLE public.addresses OWNER TO postgres;


--
-- Name: carts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    title text,
    user_id uuid
);


ALTER TABLE public.carts OWNER TO postgres;


--
-- Name: carts_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.carts_products (
    cart_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity integer
);


ALTER TABLE public.carts_products OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name text
);


ALTER TABLE public.categories OWNER TO postgres;


--
-- Name: categories_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories_products (
    category_id uuid NOT NULL,
    product_id uuid NOT NULL
);


ALTER TABLE public.categories_products OWNER TO postgres;

--
-- Name: checkout; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.checkout (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    payment_method text,
    subtotal money,
    tax money,
    shipping_cost money,
    total_amount money,
    checkout_date timestamp with time zone,
    checkout_status text,
    cart_id uuid,
    stripe_session_id text,
    billing_address jsonb,
    shipping_address jsonb
);


ALTER TABLE public.checkout OWNER TO postgres;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    user_id uuid,
    order_date timestamp with time zone,
    order_status text,
    checkout_id uuid,
    cart_id uuid,
    cart_details jsonb
);


ALTER TABLE public.orders OWNER TO postgres;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    price money,
    image text,
    description text
);


ALTER TABLE public.products OWNER TO postgres;


--
-- Name: session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    username text,
    first_name character varying(50),
    last_name character varying(50),
    pw_hash text,
    pw_salt text,
    google_id text,
    login_method text,
    default_shipping_address_id uuid,
    default_billing_address_id uuid
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.addresses (id, user_id, address_line1, address_line2, city, state, postal_code, country) FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts (id, title, user_id) FROM stdin;
\.


--
-- Data for Name: carts_products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.carts_products (cart_id, product_id, quantity) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (name) FROM stdin;
Clothing
Footwear
Accessories
Books
Electronics & Computers
Sports & Outdoors
Car & Motorbike
Business, Industry & Science
\.


--
-- Data for Name: checkout; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.checkout (id, payment_method, subtotal, tax, shipping_cost, total_amount, checkout_date, checkout_status, cart_id, stripe_session_id, billing_address, shipping_address) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, order_date, order_status, checkout_id, cart_id, cart_details) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (name, price, image, description) FROM stdin;
HYDRO FLASK	$12.99	water-bottle.jpg	Water Bottle 946 ml (32 oz) - Vacuum Insulated Stainless Steel Water Bottle Flask with Leak Proof Flex Cap with Strap
Samsung Galaxy Official S24 Smart View Wallet Case, Violet	$24.99	phone-case.jpg	\N
Alaplus Mens Socks	$9.99	socks.jpg	Wicking Breathable Cushion Comfortable Casual Crew Socks Outdoor Multipack Performance Hiking Trekking Walking Athletic Socks
New Era 9forty New York Yankees Men Cap Green	$14.99	hat.jpg	\N
CASIO STANDARD DIGITAL WATCH WITH LED-LIGHT F-91W-1JF	$99.99	watch.jpg	\N
MATEIN Travel Laptop Backpack	$29.99	backpack.jpg	Work Bag Lightweight Laptop Bag with USB Charging Port, Anti Theft Business Backpack, Water Resistant School Rucksack Gift for Men and Women, Fits 15.6 Inch Laptop, Grey
Plain Pullover Hoody Hooded Top Hoodie for Mens and Ladies Hooded Sweatshirts	$39.99	hoodie.jpg	\N
Damyuan Mens Running Walking Tennis Trainers	$59.99	shoes.jpg	Casual Gym Athletic Fitness Sport Shoes Fashion Sneakers Ligthweight Comfortable Working Outdoor Flat Shoes for Jogging
Crosshatch - Mens Everyday Essential Classic 'Embossed' Casual Straight Leg Smart Stretch Slim Fit 5 Pocket Denim Cotton Rich Jeans - W30-W40	$49.99	jeans.jpg	\N
JACK & JONES Men's Jjestar Jj Tee Ss Noos T-Shirt	$19.99	t-shirt.jpg	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, first_name, last_name, pw_hash, pw_salt, google_id, login_method, default_shipping_address_id, default_billing_address_id) FROM stdin;
\.


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: carts_products carts_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts_products
    ADD CONSTRAINT carts_products_pkey PRIMARY KEY (cart_id, product_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories_products categories_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories_products
    ADD CONSTRAINT categories_products_pkey PRIMARY KEY (category_id, product_id);


--
-- Name: checkout checkout_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkout
    ADD CONSTRAINT checkout_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: users unique_default_billing_address_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_default_billing_address_id UNIQUE (default_billing_address_id);


--
-- Name: users unique_default_shipping_address_id; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_default_shipping_address_id UNIQUE (default_shipping_address_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: addresses delete_address_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_address_trigger BEFORE DELETE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.update_users_default_address_on_address_delete();


--
-- Name: addresses addresses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: carts_products carts_products_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts_products
    ADD CONSTRAINT carts_products_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id) ON DELETE CASCADE;


--
-- Name: carts_products carts_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts_products
    ADD CONSTRAINT carts_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: carts carts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: categories_products categories_products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories_products
    ADD CONSTRAINT categories_products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- Name: categories_products categories_products_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories_products
    ADD CONSTRAINT categories_products_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: checkout checkout_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.checkout
    ADD CONSTRAINT checkout_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: orders orders_checkout_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_checkout_id_fkey FOREIGN KEY (checkout_id) REFERENCES public.checkout(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users users_default_billing_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_default_billing_address_id_fkey FOREIGN KEY (default_billing_address_id) REFERENCES public.addresses(id);


--
-- Name: users users_default_shipping_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_default_shipping_address_id_fkey FOREIGN KEY (default_shipping_address_id) REFERENCES public.addresses(id);


--
-- PostgreSQL database dump complete
--
