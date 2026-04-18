# Security And Subprocessors Annex

Template only. Review with Dutch counsel before signature.

## Security commitments

Renvoo's default v1 control set:

- MFA enforced for administrative access
- least-privilege access to pilot systems and data
- encryption in transit and at rest where supported
- audit logging for material access and operational events
- routine backup and restore testing
- separation of production access from normal founder workflow where possible
- documented incident-response process

## Data boundary controls

- no default storage of diagnosis, medication, lab, BSN, or clinical notes
- reject or review unknown import fields before onboarding
- use secure links for patient interaction instead of patient accounts in v1

## Initial subprocessor schedule

| Vendor | Purpose | Data categories | Hosting region | Transfer basis | Status |
| --- | --- | --- | --- | --- | --- |
| `[vendor name]` | `[hosting / email / SMS / analytics / support]` | `[categories]` | `[EU / NL / other]` | `[not needed / SCCs / adequacy]` | `[planned / approved / live]` |

## Change management

- Renvoo will update the processor register before adding a new live subprocessor
- material subprocessor changes should be notified to the Clinic before use, following the notice process in the MSA or DPA

## Minimum internal targets

- internal breach escalation opened immediately after confirmation
- controller notice target: within `24` hours of confirmed processor-side awareness where practicable
- critical access review: quarterly during live pilot operations
