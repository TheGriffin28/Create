# Technical Architecture Brief: Inventory Management Calculator Module

## 1. Executive Summary
The Inventory Management Calculator Module is designed to handle core inventory tracking, batch movement auditing, and analytical calculations (EOQ, Safety Stock, Reorder Points, Inventory Valuation Methods). It provides deterministic, tested mathematical calculation engines decoupled from transaction processing.

## 2. Relational Schema & Entity Relationships
- **categories**: Top-level categorization for inventory segmentation.
- **products**: Core catalog maintaining SKUs, pricing, lead times, demand parameters, and current on-hand counts.
- **stock_movements**: Immutable ledger tracking all inflows (`IN`), outflows (`OUT`), write-offs (`SPOILAGE`/`DAMAGED`), and corrections (`ADJUSTMENT`).
- **reorder_calculations & inventory_valuations**: Historical snapshots of computed inventory metrics for auditing and trend reporting.

## 3. Core Calculation Formulas
- **Economic Order Quantity (EOQ)**: `EOQ = sqrt((2 * D * S) / H)`
  - `D`: Annual Demand
  - `S`: Fixed Order Cost (Setup Cost)
  - `H`: Annual Holding Cost per Unit (`unit_cost * holding_cost_rate`)
- **Reorder Point (ROP)**: `ROP = (Lead Time Demand) + Safety Stock = (Daily Demand * Lead Time Days) + (Z * sqrt(Lead Time * Variance of Demand))`
- **Weighted Average Cost (WAC)**: `WAC = Total Cost of Goods Available for Sale / Total Units Available for Sale`

## 4. Data Validation Rules
- SKUs must follow alphanumeric uppercase pattern `^[A-Z0-9_-]{3,32}$`.
- Stock movement quantities must be positive integers; direction is determined by `movement_type`.
- Calculations strictly validate non-negative values for demand, lead times, and unit costs.
- Holding cost rate must be between `0.00` and `1.00` (representing percentage).

## 5. Edge Cases & Boundary Handling
- **Zero Holding Cost / Zero Demand**: Guard against division by zero in EOQ computations by defaulting to base minimum batch constraints.
- **Negative Stock Prevention**: Concurrency control via PostgreSQL row-level locks (`SELECT FOR UPDATE`) on product records during stock deductions to avoid race-condition overdrafts.
- **Rounding & Precision**: Currency values and decimal quantities utilize PostgreSQL `DECIMAL(12, 4)` and JavaScript `BigInt` / fixed-precision arithmetic to avoid IEEE-754 floating-point inaccuracies.

## 6. Test Suite Specifications
- **Unit Tests**: Full boundary coverage for pure calculation engines (`eoq.test.ts`, `safetyStock.test.ts`, `valuation.test.ts`).
- **Integration Tests**: API endpoint validation using Jest and Supertest against an in-memory/test PostgreSQL instance for transaction rollback integrity.