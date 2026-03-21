"""Business constants for waste categories and impact calculations.

These are hardcoded per D-06 (not stored in DB).
Values for weights and CO2 multipliers are reasonable estimates
for common waste items (Claude's discretion per CONTEXT.md).
"""

# Valid waste categories (D-01)
VALID_CATEGORIES: tuple[str, ...] = (
    "paper_cardboard",
    "metal_glass",
    "plastic",
    "trash",
)

# Confidence threshold below which items fall back to trash (D-04)
CONFIDENCE_THRESHOLD: float = 0.7

# Average weight per item in kg, by category (D-12)
CATEGORY_WEIGHTS: dict[str, float] = {
    "paper_cardboard": 0.15,
    "metal_glass": 0.25,
    "plastic": 0.08,
    "trash": 0.12,
}

# CO2 saved per kg diverted, by category (D-13)
# Trash = 0.0 because sending to landfill saves no CO2 (D-14)
CO2_MULTIPLIERS: dict[str, float] = {
    "paper_cardboard": 1.1,
    "metal_glass": 2.5,
    "plastic": 1.8,
    "trash": 0.0,
}
