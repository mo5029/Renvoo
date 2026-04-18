# Processor Register

Maintain this before going live with each clinic.

| Processor / subprocessor | Service | Data processed | Region | Transfer mechanism | Contract status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `Renvoo B.V.` | Clinic-SaaS pilot service | patient name, contact details, appointment metadata, message events | `[NL / EU]` | n/a | live controller-processor contract | Renvoo is processor for clinic pilot data |
| `[Hosting vendor]` | infrastructure hosting | operational clinic data and logs | `[region]` | `[n/a / SCC / adequacy]` | `[draft / signed / live]` | |
| `[Messaging vendor]` | SMS or email delivery | patient contact fields and message metadata | `[region]` | `[n/a / SCC / adequacy]` | `[draft / signed / live]` | |
| `[Support / ticket vendor]` | support operations | clinic contact data and limited support content | `[region]` | `[n/a / SCC / adequacy]` | `[draft / signed / live]` | |

## Maintenance rule

- Update this register before onboarding a new live vendor
- Keep it aligned with the DPA annex and privacy notices
- Record whether the vendor is only planned or already processing live clinic data
