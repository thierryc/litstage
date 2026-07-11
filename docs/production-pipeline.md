# Production Pipeline

Use this structure for multi-scene videos, data-driven variants, and work that needs review before final export.

## 1. Brief

Define the job:

- Audience.
- Duration.
- Format and aspect ratio.
- Required messages.
- Source assets and data.
- Delivery format.

## 2. Design

Collect the visual rules:

- Colors.
- Typography.
- Logo and asset usage.
- Layout patterns.
- Motion tone.
- Do and do-not rules.

For source-driven work, capture assets and store them locally before build.

## 3. Script

Write the words that determine timing:

- Narration.
- On-screen titles.
- Lower thirds.
- Data labels.
- Calls to action.

For silent loops, the script can be a beat-by-beat text and timing plan.

## 4. Storyboard

Translate the script into scenes:

- Time range.
- Visual goal.
- Assets.
- Layout.
- Motion.
- Transition.
- Sound or silence.

This is the review checkpoint before implementation.

## 5. Build

Create the LitSquare Stage project:

- Add local assets and data snapshots.
- Implement the stage root and sketch lifecycle.
- Derive motion from `FrameContext`.
- Keep format-specific layout responsive when required.

## 6. Preview

Run the browser preview and inspect:

- First frame.
- Scene transitions.
- Text fit.
- Asset loading.
- Responsive formats.
- Motion rhythm.
- If using the LitSquare Stage MCP app, show and front the native render window in compact mode for still/image inspection.

## 7. Render

Build, capture stills, render short ranges, then render final video. Use motion blur only after the base render is visually correct.

When rendering through the MCP app, use the native render window as live feedback: compact mode for stills and regular mode for video or long sequence progress.

## 8. QA

Check:

- Correct dimensions and duration.
- No clipped or overlapping text.
- No missing fonts or assets.
- Motion starts and ends cleanly.
- Data is from the intended snapshot.
- Final artifact path and naming are correct.
