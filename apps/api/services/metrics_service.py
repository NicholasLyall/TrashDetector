"""Aggregate metric computation from event rows (D-07, D-15)."""


def compute_metrics(events: list[dict]) -> dict:
    """Compute aggregate metrics from a list of event records.

    Returns a dict matching MetricsResponse shape with all 7 fields.
    Empty event list returns all zeros.
    """
    if not events:
        return {
            "total_items": 0,
            "recycling_rate": 0.0,
            "co2_saved_kg": 0.0,
            "waste_diverted_kg": 0.0,
            "avg_confidence": 0.0,
            "uncertain_rate": 0.0,
            "fallback_rate": 0.0,
        }

    total = len(events)
    non_trash = sum(1 for e in events if e["label"] != "trash")
    recycling_rate = round(non_trash / total, 2)

    co2_saved_kg = round(sum(e["co2_saved_kg"] for e in events), 2)
    waste_diverted_kg = round(sum(e["waste_diverted_kg"] for e in events), 2)

    avg_confidence = round(sum(e["confidence"] for e in events) / total, 2)

    uncertain_count = sum(1 for e in events if e["confidence"] < 0.7)
    uncertain_rate = round(uncertain_count / total, 2)

    fallback_count = sum(1 for e in events if e["fallback_used"])
    fallback_rate = round(fallback_count / total, 2)

    return {
        "total_items": total,
        "recycling_rate": recycling_rate,
        "co2_saved_kg": co2_saved_kg,
        "waste_diverted_kg": waste_diverted_kg,
        "avg_confidence": avg_confidence,
        "uncertain_rate": uncertain_rate,
        "fallback_rate": fallback_rate,
    }


def compute_breakdown(events: list[dict]) -> list[dict]:
    """Compute category counts and percentages from event records.

    Returns a list of category breakdown dicts sorted by count descending.
    At most 4 categories per D-07 (matching VALID_CATEGORIES).
    """
    if not events:
        return []

    total = len(events)

    # Count occurrences by label
    counts: dict[str, int] = {}
    for event in events:
        label = event["label"]
        counts[label] = counts.get(label, 0) + 1

    # Build breakdown list sorted by count descending
    breakdown = [
        {
            "label": cat,
            "count": count,
            "percentage": round(count / total, 2),
        }
        for cat, count in sorted(counts.items(), key=lambda x: x[1], reverse=True)
    ]

    return breakdown
