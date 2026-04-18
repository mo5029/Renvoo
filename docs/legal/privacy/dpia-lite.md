# DPIA Lite For First Clinic Pilots

Use this before the first live clinic data import.

## Processing summary

- Product: Renvoo clinic SaaS
- Purpose: no-show prevention, confirmation support, rescheduling support, and slot recovery
- Data posture: non-clinical administrative scheduling and communication data only
- Data subjects: patients in participating clinic workflows and clinic staff users

## Why this DPIA is being run

Renvoo is early-stage, uses profiling-like operational risk logic, and operates in a healthcare context even though the intended scope is non-clinical. A short DPIA reduces launch risk and forces the data boundary to stay explicit.

## Key risks

| Risk | Initial concern | Mitigation |
| --- | --- | --- |
| Importing out-of-scope clinical data | medium | approved field list, import review, contract boundary |
| Over-collection of personal data | medium | admin-data-only default, no patient accounts in v1 |
| Messaging misuse or overreach | medium | clinic instruction model, approved templates, audit trail |
| Security incident affecting clinic data | high | encryption, MFA, logging, breach SOP, least privilege |
| Data kept too long after pilot end | medium | retention matrix and offboarding checklist |

## Residual decision

- Residual risk after controls: `[low / medium / high]`
- If high remains after controls, stop and get external legal review before launch

## Sign-off

- Product owner: `[name]`
- Privacy owner: `[name]`
- Date: `[date]`
