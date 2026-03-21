# Model Context

## 1. Model Role

The perception model is responsible for recognizing the staged trash item and producing a label and confidence score that maps to a routing decision.

## 2. Deployment Assumption
- Train/fine-tune off-device.
- Run inference on Raspberry Pi.
- Send one image per sorted item to dashboard.

## 3. Practical Modeling Guidance
- Use YOLO with fixed camera assumptions.
- Favor classes that map directly to bins or meaningful categories.
- Use confidence thresholds.
- Use fallback/default-bin logic for low-confidence cases.

## 4. Dashboard-Relevant Outputs
Each inference should produce:
- label
- confidence
- optionally annotated image

## 5. Why This Matters
The dashboard is partly a trust layer. Confidence and recent image evidence make the AI feel real and believable.
