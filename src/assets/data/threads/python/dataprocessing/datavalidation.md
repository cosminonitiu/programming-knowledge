## Data Validation
---

Data validation ensures your pipeline processes only clean, conforming data. Validating at ingestion prevents bad data from corrupting downstream systems ("garbage in, garbage out").

---

## 1. Why Validate Data?

- Upstream sources are unreliable (schema changes, NULL injections, type coercion).
- Bad data silently corrupts analytical results.
- Catches issues early — before they reach production dashboards or models.
- Enables data quality SLAs and monitoring.

---

## 2. Manual Validation with Pandas

```python
import pandas as pd
from dataclasses import dataclass, field

@dataclass
class ValidationResult:
    passed: bool
    errors: list[str] = field(default_factory=list)

def validate_orders_df(df: pd.DataFrame) -> ValidationResult:
    errors = []

    required_cols = ["order_id", "customer_id", "amount", "order_date"]
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        errors.append(f"Missing columns: {missing}")
        return ValidationResult(False, errors)   # can't continue

    if df["order_id"].isna().any():
        errors.append("order_id contains nulls")

    if df["amount"].lt(0).any():
        errors.append(f"{df['amount'].lt(0).sum()} rows have negative amount")

    if not pd.api.types.is_datetime64_any_dtype(df["order_date"]):
        errors.append("order_date is not datetime type")

    dup_count = df["order_id"].duplicated().sum()
    if dup_count > 0:
        errors.append(f"{dup_count} duplicate order_ids")

    return ValidationResult(len(errors) == 0, errors)
```

---

## 3. Pandera — Schema Validation

```bash
pip install pandera
```

```python
import pandera as pa
from pandera.typing import Series, DataFrame

class OrderSchema(pa.DataFrameModel):
    order_id: Series[int] = pa.Field(unique=True, ge=1)
    customer_id: Series[int] = pa.Field(nullable=False)
    amount: Series[float] = pa.Field(ge=0, le=1_000_000)
    status: Series[str] = pa.Field(isin=["pending", "shipped", "delivered", "cancelled"])
    order_date: Series[pa.DateTime]

    class Config:
        coerce = True       # auto-convert compatible types
        strict = False      # allow extra columns

@pa.check_types
def process_orders(df: DataFrame[OrderSchema]) -> pd.DataFrame:
    # df is guaranteed valid here
    return df.groupby("status")["amount"].sum()

# Manual validation
try:
    validated = OrderSchema.validate(raw_df, lazy=True)  # collect all errors
except pa.errors.SchemaErrors as exc:
    print(exc.failure_cases)   # DataFrame of violations
```

---

## 4. Pydantic for Row-Level Validation

```python
from pydantic import BaseModel, Field, field_validator
from datetime import datetime

class Order(BaseModel):
    order_id: int
    customer_id: int
    amount: float = Field(ge=0)
    status: str
    order_date: datetime

    @field_validator("status")
    @classmethod
    def valid_status(cls, v: str) -> str:
        allowed = {"pending", "shipped", "delivered", "cancelled"}
        if v not in allowed:
            raise ValueError(f"status must be one of {allowed}")
        return v

def validate_events(events: list[dict]) -> tuple[list[Order], list[dict]]:
    valid, invalid = [], []
    for event in events:
        try:
            valid.append(Order.model_validate(event))
        except Exception as e:
            invalid.append({"event": event, "error": str(e)})
    return valid, invalid
```

---

## 5. Great Expectations (GX)

Great Expectations is a production-grade data quality framework:

```python
import great_expectations as gx

context = gx.get_context()

# Define expectations
suite = context.add_expectation_suite("orders_suite")
validator = context.get_validator(
    batch_request=...,
    expectation_suite_name="orders_suite"
)

validator.expect_column_to_exist("order_id")
validator.expect_column_values_to_not_be_null("order_id")
validator.expect_column_values_to_be_unique("order_id")
validator.expect_column_values_to_be_between("amount", min_value=0, max_value=1_000_000)
validator.expect_column_values_to_be_in_set(
    "status", {"pending", "shipped", "delivered", "cancelled"}
)
validator.expect_column_values_to_match_strftime_format("order_date", "%Y-%m-%d")

# Run checkpoint
results = context.run_checkpoint(checkpoint_name="daily_orders_checkpoint")
if not results["success"]:
    raise ValueError("Data quality check failed!")
```

---

## 6. Schema Evolution

```python
# Detect schema drift between expected and actual
def check_schema(df: pd.DataFrame, expected_schema: dict[str, str]) -> list[str]:
    """expected_schema = {"column_name": "dtype_str"}"""
    issues = []
    for col, expected_dtype in expected_schema.items():
        if col not in df.columns:
            issues.append(f"Missing column: {col}")
        elif str(df[col].dtype) != expected_dtype:
            issues.append(f"{col}: expected {expected_dtype}, got {df[col].dtype}")
    extra = set(df.columns) - set(expected_schema)
    if extra:
        issues.append(f"Unexpected columns: {extra}")
    return issues
```
