# EYIF 2026 Grant Program & Contact Forms Schema

This document outlines the schema for the application forms used in the grant registration process and the general contact form.

## 1. Idea Track Application Form (`#idea-form`)

**Used for:** Pre-MVP startups.

| Field Name | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `full_name` | text | Yes | |
| `email` | email | Yes | |
| `phone` | tel | Yes | |
| `age` | number | Yes | Range: 18-35 |
| `edo_connection` | select | Yes | Options: Resident, Indigene, Business Based |
| `business_name` | text | Yes | |
| `problem` | textarea | Yes | Max 1000 chars |
| `solution` | textarea | Yes | Max 1000 chars |
| `target_customer` | textarea | Yes | |
| `industry` | select | Yes | |
| `validation_status` | select | Yes | |
| `customers_spoken` | number | Yes | Min 0 |
| `customer_feedback` | textarea | Yes | |
| `has_team` | select | Yes | |
| `team_skills` | textarea | Yes | |
| `fund_usage` | textarea | Yes | |
| `mvp_timeline` | select | Yes | 1-3, 3-6, 6-12 months |
| `jobs_created` | number | Yes | Min 0 |
| `revenue_model` | textarea | Yes | |
| `social_impact` | textarea | Yes | |

---

## 2. Build Track Application Form (`#build-form`)

**Used for:** Early-stage startups with MVP.

| Field Name | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `full_name` | text | Yes | |
| `email` | email | Yes | |
| `phone` | tel | Yes | |
| `age` | number | Yes | 18-35 |
| `edo_connection` | select | Yes | |
| `startup_name` | text | Yes | |
| `founded_date` | month | Yes | |
| `website` | url | No | |
| `problem` | textarea | Yes | |
| `solution` | textarea | Yes | |
| `industry` | select | Yes | |
| `mvp_description` | textarea | Yes | |
| `mvp_link` | url | No | |
| `current_users` | number | Yes | Min 0 |
| `monthly_active_users`| number | No | Min 0 |
| `revenue_generated` | select | Yes | |
| `monthly_revenue` | number | No | |
| `traction_metric` | textarea | Yes | |
| `team_size` | number | Yes | Min 1 |
| `team_expertise` | textarea | Yes | |
| `challenges` | textarea | Yes | |
| `fund_usage` | textarea | Yes | |
| `growth_targets` | textarea | Yes | |
| `jobs_created` | number | Yes | Min 0 |
| `revenue_model` | textarea | Yes | |
| `social_impact` | textarea | Yes | |
| `sustainability_path` | textarea | Yes | |

---

## 3. Scale Track Application Form (`#scale-form`)

**Used for:** Growth-stage startups.

| Field Name | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `full_name` | text | Yes | |
| `email` | email | Yes | |
| `phone` | tel | Yes | |
| `age` | number | Yes | 18-35 |
| `edo_connection` | select | Yes | |
| `company_name` | text | Yes | |
| `cac_number` | text | No | |
| `year_founded` | number | Yes | |
| `website` | url | Yes | |
| `problem_solution` | textarea | Yes | |
| `industry` | select | Yes | |
| `total_users` | number | Yes | Min 0 |
| `monthly_active_users`| number | Yes | Min 0 |
| `monthly_revenue` | number | Yes | Min 0 (₦) |
| `annual_revenue` | number | Yes | Min 0 (₦) |
| `growth_rate` | number | Yes | |
| `cac` | number | No | (₦) |
| `ltv` | number | No | (₦) |
| `traction_evidence` | textarea | Yes | |
| `team_size` | number | Yes | Min 1 |
| `key_team_members` | textarea | Yes | |
| `previous_funding` | select | Yes | |
| `funding_details` | textarea | No | |
| `burn_rate` | number | Yes | Min 0 (₦) |
| `runway` | number | Yes | Min 0 (months) |
| `fund_usage` | textarea | Yes | |
| `growth_targets` | textarea | Yes | |
| `jobs_created` | number | Yes | Min 0 |
| `market_opportunity` | textarea | Yes | |
| `social_impact` | textarea | Yes | |
| `long_term_vision` | textarea | Yes | |
| `why_invest` | textarea | Yes | |

---

## 4. Contact Form (`#email-form`)

**Used for:** General inquiries.

| Field Name | Type | Required | Notes |
| :--- | :--- | :--- | :--- |
| `firstName` | text | Yes | |
| `lastName` | text | Yes | |
| `email` | email | Yes | |
| `phone` | text | Yes | |
| `message` | textarea | Yes | |
