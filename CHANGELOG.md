# Changelog

All notable changes and features implemented in **RailFlow Optimizer** are documented in this file.

## [0.1.0] - 2026-11-26

### Added
- **Executive Operations Dashboard (`/dashboard`)**: KPI summary cards (`Overall Punctuality`, `Average Delay`, `Network Throughput`, `Track Utilization`) and Recharts visualizations (*Punctuality by Train Type* and *Average Delay Trend*).
- **AI What-If Scenario Simulation (`/dashboard/scenarios`)**: Guided scenario builder supporting 8 operational contingencies (`engine-failure`, `track-maintenance`, `signal-failure`, `derailment`, `medical-emergency`, `security-threat`, `reroute-train`, `reschedule-train`) powered by Google Genkit (`refineScenarioParameters`).
- **Live Train Monitoring (`/dashboard/trains`)**: Status table displaying active train IDs, service types, priority tiers, delays, current locations, and next stations.
- **Disruption Management (`/dashboard/disruptions`)**: Active and resolved network incident log, Zod-validated *Report New Disruption* modal, and one-click AI schedule re-optimization (`reoptimizeOnDisruption`).
- **Audit Trail (`/dashboard/audit`)**: Chronological decision log capturing controller overrides and automated `SYSTEM` actions.
- **Settings & Controller Login (`/dashboard/settings`, `/login`)**: Profile panel, dark/light theme switcher (`next-themes`), alert preferences, and controller sign-in screen.
- **Firebase & Security Blueprint**: Client Firebase provider/hooks (`src/firebase/*`), Firestore schema blueprint (`docs/backend.json`), and Firestore Security Rules (`firestore.rules`).
- **GitHub & Repository Documentation**: Detailed `README.md`, `docs/ARCHITECTURE.md`, `LICENSE` (MIT), `CONTRIBUTING.md`, `SECURITY.md`, `.env.example`, `.gitattributes`, and `.github/` CI workflow and issue/PR templates.

