# PrintGuard AI — Project Proposal

---

## Problem Statement

### What?
3D printers fail — a lot. Research shows there is a **41% probability of problems arising during any given print**, and up to **80% of all 3D printing waste comes directly from failed prints**. Common failure types include spaghetti (filament tangling mid-air), warping, layer detachment, stringing, and under-extrusion. These failures often go undetected for hours because 3D prints run unattended — especially overnight.

### Why Does It Matter?
The consequences are real and measurable:
- **Material waste:** Failed builds waste 2.22x more material than ideal conditions
- **Energy waste:** Actual energy consumption from failed prints runs ~50% higher than expected
- **Time loss:** A single undetected failure can waste 4–12 hours of print time
- **Financial impact:** In a university makerspace tracked over 10 weeks, 34.6% of all filament used was lost to failed prints

For HBCU makerspaces and small engineering labs operating on tight budgets, every wasted spool of filament is a direct hit to limited resources. There is currently no affordable, easy-to-deploy solution that gives these labs the quality control safety net that large manufacturers take for granted.

---

## Target Users

### Primary: HBCU Makerspace & Engineering Lab Managers
- **Role:** One or two staff managing 10–30 printers for hundreds of rotating students
- **Pain point:** Prints run overnight or unattended; failures go unnoticed until the damage is done
- **Success looks like:** Fewer failed prints per week, less filament waste, no need to babysit machines

### Secondary: Small Manufacturing Shops & Print Farms
- **Role:** Small businesses running 5–50 printers for prototyping or production
- **Pain point:** Costly failed prints in high-value materials (resin, carbon fiber, nylon)
- **Success looks like:** Automated quality control without hiring dedicated monitoring staff

### Why This Audience for Innovation Venture?
This event is hosted at Delaware State University — an HBCU — with a focus on empowering underserved communities through technology. PrintGuard AI directly addresses a real operational pain point for institutions exactly like DSU's own makerspace, making it immediately deployable and demonstrable on-site.

---

## Solution Overview

### How PrintGuard AI Works

PrintGuard AI is a real-time computer vision monitoring system that watches a 3D printer through a webcam, detects failure patterns the moment they begin, and automatically pauses the print before significant damage occurs.

**The Core Loop:**
1. A webcam mounted on the printer streams live footage into the system
2. A fine-tuned YOLOv8 AI model analyzes each frame, classifying it as: `GOOD`, `SPAGHETTI`, `WARPING`, `STRINGING`, or `DETACHMENT`
3. If 3 or more consecutive frames flag a failure (reducing false positives), a confirmed failure is triggered
4. The system automatically calls the OctoPrint API to pause or cancel the print
5. A web dashboard displays the live feed, annotated failure screenshot, failure type, and estimated filament/time saved

**What Makes It Different from Existing Tools (Obico, SimplyPrint):**
- **No complex setup required** — existing tools require OctoPrint server configuration and technical expertise; PrintGuard is designed to be plug-and-play for non-technical lab staff
- **Open community dataset** — every lab using PrintGuard contributes anonymized failure images back to a shared model, making detection smarter for every user over time
- **Academic lab focus** — designed for rotating student users and shared equipment, not individual hobbyist printers

**The Demo:**
A live 3D printer runs during the pitch. A failure is introduced. The audience watches the dashboard detect it and pause the printer in real time.

---

## Tech Stack Justification

| Layer | Tool | Why |
|---|---|---|
| **AI Model** | YOLOv8 (Ultralytics) | Industry-standard real-time object detection; pre-trained weights reduce training time dramatically; runs efficiently on a local GPU without cloud dependency |
| **Backend** | FastAPI (Python) | Lightweight, async-ready framework ideal for streaming video frames and serving WebSocket connections to the frontend; native Python means seamless integration with OpenCV and Ultralytics |
| **Video Capture** | OpenCV | The standard library for real-time camera frame capture and preprocessing; integrates directly with YOLOv8 inference pipeline |
| **Frontend** | Next.js (React) | Enables a fast, responsive live dashboard with real-time WebSocket updates; component-based architecture makes it easy to display annotated frames, alert logs, and waste metrics |
| **Printer Control** | OctoPrint REST API | Free, open-source printer management software with a well-documented API; allows Python to pause, cancel, or modify prints programmatically over WiFi with no hardware wiring |
| **Training Data** | Roboflow Public Dataset | 4,549 labeled 3D print failure images pre-formatted for YOLOv8 — free, publicly available, and ready to fine-tune on our GPU in hours |

### Why Not Ollama / LLMs?
Large language models are not suited for real-time image classification tasks. YOLOv8 is purpose-built for object detection, runs in milliseconds per frame, and is deployable locally on our GPU. Ollama could be incorporated as a future feature — generating plain-English failure explanations when a defect is detected — but is not part of the MVP.

### Why Local (Not Cloud)?
Running inference locally on our GPU means zero API costs, no latency from cloud round-trips, and no dependency on internet connectivity — critical for a makerspace environment where prints run overnight.

---

*PrintGuard AI — Stopping waste before it happens.*
