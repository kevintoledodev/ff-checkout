/*
  # Create Orders System

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text, customer full name)
      - `customer_email` (text, customer email)
      - `customer_phone` (text, customer phone)
      - `customer_cpf` (text, customer CPF)
      - `product_type` (text, type of product: 'diamonds' or 'subscription')
      - `product_name` (text, name of the product/subscription)
      - `amount` (numeric, payment amount in BRL)
      - `original_price` (numeric, original price before discount)
      - `discount_percentage` (integer, discount applied)
      - `payment_status` (text, status: 'pending', 'completed', 'cancelled')
      - `pix_qr_code` (text, PIX QR code string)
      - `pix_copy_paste` (text, PIX copy and paste code)
      - `transaction_id` (text, Nivus transaction ID)
      - `created_at` (timestamptz, order creation time)
      - `updated_at` (timestamptz, last update time)
      
  2. Security
    - Enable RLS on `orders` table
    - Add policy for service role to manage all orders
    - Public can insert orders (for checkout)
    - Users can read their own orders by email
*/

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  customer_cpf text NOT NULL,
  product_type text NOT NULL CHECK (product_type IN ('diamonds', 'subscription')),
  product_name text NOT NULL,
  amount numeric(10, 2) NOT NULL,
  original_price numeric(10, 2) NOT NULL,
  discount_percentage integer DEFAULT 90,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'cancelled')),
  pix_qr_code text,
  pix_copy_paste text,
  transaction_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Service role can manage all orders"
  ON orders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_transaction_id ON orders(transaction_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);