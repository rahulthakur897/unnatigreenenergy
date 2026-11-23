ALTER TABLE `company_settings` ADD `bill_of_supply_prefix` text DEFAULT 'BOS' NOT NULL;--> statement-breakpoint
ALTER TABLE `invoices` ADD `invoice_type` text DEFAULT 'tax_invoice' NOT NULL;