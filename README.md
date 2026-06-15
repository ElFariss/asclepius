# Asclepius: The Archangel

Predictive, Preactive, Preventive.

Asclepius is an AI-driven pre-operative monitoring platform that helps doctors identify surgical readiness risks earlier, guide patients through preparation, and reduce avoidable surgery cancellations.

## Page 1: The Problem

Many surgeries are cancelled or postponed not because of clinical error, but because patients fail to follow protocols such as fasting, medication adjustment, or smoking cessation due to lack of guidance and monitoring.

**28.4 million** surgeries were affected during the COVID-19 pandemic (Wijaya, 2025).

In Indonesia's universal healthcare system, JKN/BPJS, every cancelled surgery is a financial leak. When a surgery is delayed on the day of the event, the hospital loses the opportunity to treat other patients.

**Our Stakeholders**

- Patients
- Surgeons and care teams
- Healthcare systems

## Page 2: The Archangel

**The Archangel**

> "Predictive, Preactive, Preventive"

## Page 3: Solution Value & Proposition

**How It Creates Value**

- Instant clarity: converts complex patient data into `Safe | Borderline | Intervene`.
- Reduced anxiety: patients track progress while doctors prioritize easily at a glance.
- Operational efficiency: fewer cancellations, better operating-room utilization, and better scheduling.
- Early intervention: detects risks days before surgery before they become critical.

**The AI Solution**

Clinical Decision Support System (CDSS)

- Integrates patient compliance, vitals such as Hb and BP, and warning signs.
- Outputs risk indicators, early alerts, and actionable recommendations.
- Updates continuously with the latest labs and consultations.

## Page 4: AI Technicality

**Input Signals**

- Compliance checklist: daily activity tracking.
- Vital signs: BP, Hb, and more.
- Warning signs: flagged symptoms.

**AI Pipeline**

Feature engineering feeds a Clinical Decision Support System (CDSS) model.

**Readiness Outputs**

- Safe to Operate
- Borderline: Monitor
- Intervene

**Doctor's Dashboard**

Doctors see all patient risk indicators, receive alerts for bad indicators, and add further actions or recommendations for patients.

**Patient's App**

Patients view compliance score only, complete daily checklists and restrictions, and view schedules through an integrated calendar.

**Ground Truth Update**

Recent weekly consultation results update the monitoring loop.

## Page 5: Opportunity

**Market Size**

- 300M+ surgeries per year globally creates a large unmet need in pre-operative readiness.
- 10-20% cancellation rate is caused by poor preparation.
- Growing digital health and AI market with more than $100B TAM.
- Initial SOM focus: private hospitals and surgical centers in Indonesia.

**Outcome Transformation**

- Cancellation rate decreases.
- Doctor efficiency increases through AI triage and alerts.
- Patient anxiety decreases through clear compliance scoring.
- Healthcare shifts from reactive to preventive.

**Comparison Table**

| Aspect | Before: Current System | After: AI Monitoring System |
| --- | --- | --- |
| Speed | Reactive; issues detected near surgery day | Real-time monitoring with early detection days or weeks before surgery |
| Accuracy | Manual and self-reported, causing inconsistent data | AI-driven checklist, vitals, and metrics for more reliable monitoring |
| Accessibility | Limited to hospital visits | Mobile-based and scalable to rural patients |
| Cost | High from cancellations, repeated tests, and inefficiency | Lower cost through prevention and better resource allocation |
| Doctor Workflow | Time-consuming and hard to track all patients | AI triage and alerts help doctors focus on high-risk patients |
| Patient Experience | Unclear progress creates high anxiety | Compliance score and guidance reduce anxiety |

## Page 6: Competitors, Our Advantage, Impact

**Competitors**

Telehealth platforms focus on consultation and medicine delivery, but do not provide continuous pre-operative monitoring or surgical readiness scoring.

**Our Advantage**

- Real-time patient monitoring
- AI readiness score
- Predicts risk days before surgery
- Clinical decision support, not just a checklist

**Impact**

- Fewer last-minute cancellations
- Better operating-room utilization
- Data-driven surgical decisions

## Page 7: Business Model

**B2B SaaS Licensing Fee**

Monthly license fee.

**Integration Fees**

One-time setup fee for syncing with existing Hospital Information Systems (HIS).

The timing for this software is exceptionally strategic, driven by a perfect storm of regulatory shifts, technological adoption, and financial pressure within the Indonesian healthcare system in 2026.

## Page 8: Go-To-Market Strategy

- Phase 1: Kick-Off. Target private hospital groups such as Siloam and Hermina to prove financial improvement.
- Phase 2: Expand. Partner with HIS/SIMRS vendors and integrate with our API to scale deployments and refine AI predictive accuracy.
- Phase 3: Scale. National integration with the app to standardize pre-operative protocols across BPJS referral networks.

## Page 9: Ask

We are seeking **Rp 2 Billion - Rp 4 Billion** in pre-seed funding to build, validate, and pilot our AI-driven pre-operative monitoring platform across Indonesia.

**Use of Funds**

1. Product & Engineering: 45%
2. Clinical Advisory & Validation: 20%
3. Data & Infrastructure: 15%
4. Pilot & Operations: 15%
5. Contingency: 5%

**Value Inflection Point**

1. AI is still a strong tailwind.
2. More patient data makes the model better.
3. Workflow integration creates stickiness.

**Milestones**

- Phase 1: MVP Build, 0-4 months
- Phase 2: Pilot in 1-2 hospitals, 4-8 months
- Phase 3: Clinical Expansion, 8-12 months
- Phase 4: Scaling, 12+ months

## Page 10: Team

- 1 software engineer lecturer as mentor
- 1 health expert as mentor
- 3 computer science students
- 2 medical students

## Page 11: Summary

We stop surgeries from failing before they begin by using AI to predict readiness, reduce cancellations, and become the intelligence layer behind every surgery.

> "Predictive, Preactive, Preventive"

## Repository

This monorepo contains:

- `apps/web`: Vue 3 frontend for patient, doctor, and landing experiences.
- `services/api`: Go REST API with PostgreSQL persistence, demo workspace, uploaded assets, chat, risk scoring, checkups, and calendar data.
- `services/ai`: Python AI scaffold reserved for later phases.
- `docs`: product architecture, route map, and backend handoff notes.

## Local Development

From the repo root:

```bash
npm install
npm run db:up
npm run dev:api
npm run dev
```

Useful checks:

```bash
npm run lint
npm run test
npm run build
cd services/api && go test ./...
```

The frontend uses same-origin `/api` and `/assets` by default. In local development, Vite proxies those paths to `http://localhost:8080`.

## Demo Mode

Normal login/register uses the live workspace and starts empty. The public `/landing` page has a `Demo` button that creates an isolated doctor or patient demo session backed by seeded demo data. Demo writes stay in the demo workspace.

## Production Scaffold

Production deployment is prepared with Docker Compose:

```bash
cp .env.production.example .env.production
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
curl http://127.0.0.1:8088/health
```

The production stack serves the Vue app through Nginx and proxies `/api` and `/assets` to the Go API. PostgreSQL and uploaded assets use persistent Docker volumes.
