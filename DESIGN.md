---
name: ShotDesk Website
description: A technical map of local screenshot indexing
colors:
  graphite-ground: "#171a1f"
  graphite-sidebar: "#191c21"
  graphite-panel: "#1d2127"
  graphite-raised: "#22272e"
  seam: "#30363e"
  ink: "#e4e8ee"
  secondary-ink: "#a0aab7"
  focus-blue: "#83b7ff"
  success-green: "#80c8a4"
  indexing-amber: "#f1bd63"
typography:
  display:
    fontFamily: "Segoe UI Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(42px, 5vw, 70px)"
    fontWeight: 640
    lineHeight: 1.03
    letterSpacing: "-0.055em"
  body:
    fontFamily: "Segoe UI Variable, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Cascadia Code, Consolas, Liberation Mono, monospace"
    fontSize: "9px"
    fontWeight: 500
rounded:
  xs: "2px"
  sm: "4px"
  md: "6px"
spacing:
  xs: "8px"
  sm: "14px"
  md: "22px"
  lg: "32px"
  xl: "56px"
components:
  button-primary:
    backgroundColor: "#d6e6fa"
    textColor: "#18212a"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 14px"
---

# Design System: ShotDesk Website

## Overview

The website carries ShotDesk's graphite desktop identity into a technical product introduction. One visible processing line connects a synthetic screenshot to its local image details, palette, OCR text, and searchable result. The site explains how the product works rather than relying on general productivity claims.

The illustration uses authored CSS UI and explicitly labeled example data; it never includes user captures. The site has no analytics, tracking cookies, or third-party hosted fonts.

## Colors

Graphite surfaces carry the technical explanation. Blue marks interaction, green confirms local processing, and amber denotes active work.

### Named Rules
**The Evidence Rule.** Every product claim stays grounded in implemented behavior; sample data is visibly illustrative.

## Typography

**Display Font:** Segoe UI Variable with Inter and system UI fallbacks.\
**Body Font:** Segoe UI Variable with Inter and system UI fallbacks.\
**Label/Mono Font:** Cascadia Code, Consolas, or Liberation Mono for technical values.

**Character:** Compact system type for clear desktop continuity; monospace only for values and process labels.

## Layout

The opening pairs the product explanation and release action with one local processing diagram. Subsequent sections follow the workflow, show a technical data table, clarify privacy, and end at the release/source actions. The diagram stacks vertically on narrow screens.

## Elevation & Depth

Graphite tonal steps and one-pixel seams define separation; shadows remain restrained.

## Shapes

Panels and controls use compact 2–6px corners with fine seams.

## Components

### Buttons
- **Primary:** Pale blue-gray release action with dark text and compact padding.
- **Secondary:** Graphite controls and text links with visible keyboard focus.

### Processing diagram
- **Structure:** A labeled synthetic screenshot connects to image facts, color analysis, OCR, and a searchable FTS5 result.
- **State:** Green signals local completion; amber is reserved for active processing.

## Do's and Don'ts

### Do:
- **Do** keep the example technical flow visible and factual.
- **Do** provide a complete English/French toggle.
- **Do** link release availability to GitHub Releases rather than implying an installer exists.

### Don't:
- **Don't** show user screenshots or personal file paths.
- **Don't** claim Linux validation before a Linux build and install pass.
- **Don't** add analytics, tracking cookies, or remote fonts.
