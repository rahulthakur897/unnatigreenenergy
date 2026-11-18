CREATE TABLE `activity_log` (
	`id` text PRIMARY KEY NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`action` text NOT NULL,
	`description` text NOT NULL,
	`user_id` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `activity_created_idx` ON `activity_log` (`created_at`);--> statement-breakpoint
CREATE TABLE `company_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`logo_file_id` text,
	`address` text DEFAULT '' NOT NULL,
	`gstin` text DEFAULT '' NOT NULL,
	`pan` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`website` text DEFAULT '' NOT NULL,
	`state` text DEFAULT '' NOT NULL,
	`state_code` text DEFAULT '' NOT NULL,
	`bank_name` text DEFAULT '' NOT NULL,
	`bank_account_name` text DEFAULT '' NOT NULL,
	`bank_account_number` text DEFAULT '' NOT NULL,
	`bank_ifsc` text DEFAULT '' NOT NULL,
	`bank_branch` text DEFAULT '' NOT NULL,
	`upi_id` text DEFAULT '' NOT NULL,
	`invoice_prefix` text DEFAULT 'UGE' NOT NULL,
	`auto_numbering` integer DEFAULT true NOT NULL,
	`number_padding` integer DEFAULT 3 NOT NULL,
	`default_gst_rate` text DEFAULT '18' NOT NULL,
	`default_due_days` integer DEFAULT 0 NOT NULL,
	`default_terms` text DEFAULT '' NOT NULL,
	`default_footer` text DEFAULT '' NOT NULL,
	`round_off_total` integer DEFAULT true NOT NULL,
	`signatory_name` text DEFAULT '' NOT NULL,
	`signatory_designation` text DEFAULT 'Authorized Signatory' NOT NULL,
	`signature_file_id` text,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`contact_person` text DEFAULT '' NOT NULL,
	`mobile` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`gstin` text DEFAULT '' NOT NULL,
	`pan` text DEFAULT '' NOT NULL,
	`billing_address` text DEFAULT '' NOT NULL,
	`shipping_address` text DEFAULT '' NOT NULL,
	`state` text DEFAULT '' NOT NULL,
	`state_code` text DEFAULT '' NOT NULL,
	`customer_type` text DEFAULT 'business' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`lead_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `customers_name_idx` ON `customers` (`name`);--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`amount` integer NOT NULL,
	`gst_amount` integer DEFAULT 0 NOT NULL,
	`expense_date` text NOT NULL,
	`payment_mode` text NOT NULL,
	`vendor_name` text DEFAULT '' NOT NULL,
	`attachment_file_id` text,
	`created_by` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `expenses_date_idx` ON `expenses` (`expense_date`);--> statement-breakpoint
CREATE TABLE `files` (
	`id` text PRIMARY KEY NOT NULL,
	`file_name` text NOT NULL,
	`mime_type` text NOT NULL,
	`size` integer NOT NULL,
	`data` blob NOT NULL,
	`uploaded_by` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invoice_items` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`position` integer NOT NULL,
	`product_id` text,
	`description` text NOT NULL,
	`hsn_code` text DEFAULT '' NOT NULL,
	`unit` text DEFAULT 'PCS' NOT NULL,
	`quantity` text NOT NULL,
	`rate` integer NOT NULL,
	`gst_rate` text NOT NULL,
	`amount` integer NOT NULL,
	`tax_amount` integer NOT NULL,
	`cost_price` integer,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `invoice_items_invoice_idx` ON `invoice_items` (`invoice_id`);--> statement-breakpoint
CREATE TABLE `invoice_sequences` (
	`id` text PRIMARY KEY NOT NULL,
	`prefix` text NOT NULL,
	`financial_year` text NOT NULL,
	`last_number` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_number` text,
	`sequence_number` integer,
	`financial_year` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`invoice_date` text NOT NULL,
	`due_date` text,
	`customer_id` text,
	`bill_name` text NOT NULL,
	`bill_address` text DEFAULT '' NOT NULL,
	`bill_gstin` text DEFAULT '' NOT NULL,
	`bill_state` text DEFAULT '' NOT NULL,
	`bill_state_code` text DEFAULT '' NOT NULL,
	`bill_phone` text DEFAULT '' NOT NULL,
	`bill_email` text DEFAULT '' NOT NULL,
	`ship_same_as_billing` integer DEFAULT true NOT NULL,
	`ship_name` text DEFAULT '' NOT NULL,
	`ship_address` text DEFAULT '' NOT NULL,
	`ship_gstin` text DEFAULT '' NOT NULL,
	`ship_state` text DEFAULT '' NOT NULL,
	`ship_state_code` text DEFAULT '' NOT NULL,
	`place_of_supply` text DEFAULT '' NOT NULL,
	`tax_type` text DEFAULT 'intra' NOT NULL,
	`vehicle_number` text DEFAULT '' NOT NULL,
	`transporter_name` text DEFAULT '' NOT NULL,
	`lr_number` text DEFAULT '' NOT NULL,
	`eway_bill_number` text DEFAULT '' NOT NULL,
	`subtotal` integer DEFAULT 0 NOT NULL,
	`taxable_amount` integer DEFAULT 0 NOT NULL,
	`cgst_amount` integer DEFAULT 0 NOT NULL,
	`sgst_amount` integer DEFAULT 0 NOT NULL,
	`igst_amount` integer DEFAULT 0 NOT NULL,
	`round_off` integer DEFAULT 0 NOT NULL,
	`total` integer DEFAULT 0 NOT NULL,
	`terms` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`seller_snapshot` text,
	`generated_at` text,
	`cancelled_at` text,
	`cancel_reason` text,
	`cancelled_by` text,
	`replaces_invoice_id` text,
	`created_by` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invoices_number_unique` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE INDEX `invoices_status_idx` ON `invoices` (`status`);--> statement-breakpoint
CREATE INDEX `invoices_customer_idx` ON `invoices` (`customer_id`);--> statement-breakpoint
CREATE INDEX `invoices_date_idx` ON `invoices` (`invoice_date`);--> statement-breakpoint
CREATE TABLE `lead_activities` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_id` text NOT NULL,
	`type` text NOT NULL,
	`content` text NOT NULL,
	`created_by` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`lead_id`) REFERENCES `leads`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `lead_activities_lead_idx` ON `lead_activities` (`lead_id`);--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`lead_name` text NOT NULL,
	`company_name` text DEFAULT '' NOT NULL,
	`contact_person` text DEFAULT '' NOT NULL,
	`mobile` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`gstin` text DEFAULT '' NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`product_interest` text DEFAULT '' NOT NULL,
	`expected_quantity` text DEFAULT '' NOT NULL,
	`expected_value` integer DEFAULT 0 NOT NULL,
	`source` text DEFAULT 'other' NOT NULL,
	`follow_up_date` text,
	`status` text DEFAULT 'new' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`customer_id` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `leads_status_idx` ON `leads` (`status`);--> statement-breakpoint
CREATE INDEX `leads_created_idx` ON `leads` (`created_at`);--> statement-breakpoint
CREATE TABLE `password_resets` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`used_at` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`payment_date` text NOT NULL,
	`amount` integer NOT NULL,
	`mode` text NOT NULL,
	`reference` text DEFAULT '' NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`created_by` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`invoice_id`) REFERENCES `invoices`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE INDEX `payments_invoice_idx` ON `payments` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `payments_date_idx` ON `payments` (`payment_date`);--> statement-breakpoint
CREATE TABLE `product_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_categories_name_unique` ON `product_categories` (`name`);--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`hsn_code` text DEFAULT '' NOT NULL,
	`unit` text DEFAULT 'PCS' NOT NULL,
	`category_id` text,
	`available_qty` text DEFAULT '0' NOT NULL,
	`purchase_price` integer DEFAULT 0 NOT NULL,
	`selling_price` integer DEFAULT 0 NOT NULL,
	`gst_rate` text DEFAULT '18' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `products_name_idx` ON `products` (`name`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` text NOT NULL,
	`user_agent` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sessions_user_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE TABLE `stock_movements` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`change` text NOT NULL,
	`reason` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`invoice_id` text,
	`created_by` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `stock_movements_product_idx` ON `stock_movements` (`product_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`role` text DEFAULT 'staff' NOT NULL,
	`avatar_file_id` text,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);