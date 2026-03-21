# Hardware System Context

## 1. Honest Engineering Constraint

The project should not rely on accurate mid-air classification of tumbling trash. That is too fragile for a student build.

## 2. Recommended Physical Strategy

Multiple pieces of trash may be dropped into the top opening, but the system should mechanically reduce this into a single-item classification problem.

## 3. Preferred Mechanisms

### Option A: Funnel + narrow gate
- wide top intake
- sloped walls
- narrow staging entry
- one item settles into camera view

### Option B: Staging chamber + trap door
- item enters holding area
- camera captures while object is still
- gate opens only after classification

### Option C: Servo diverter after staging
- once classified, a servo-controlled flap or chute routes the item

## 4. Software-Relevant Implications
- Pi should emit one event per finalized item.
- Dashboard should visualize finalized sort decisions.
- Live feed should be event-based, not raw-stream based.

## 5. Builder Heuristic
The hardware should solve chaos mechanically so software can stay reliable.
