# Retention And Deletion Matrix

Operational draft. Review with counsel and accountant before launch.

| Record type | Default retention target | Delete / archive rule | Owner |
| --- | --- | --- | --- |
| Website contact forms | 12 months after last meaningful response | delete if no live commercial need remains | Renvoo |
| CRM lead records | 12 months after last touch unless relationship continues | archive or delete stale leads | Renvoo |
| Clinic contracts and invoices | 7 years or longer if required by law | retain per finance rules | Renvoo |
| Pilot configuration data | pilot term plus 90 days unless contract says otherwise | delete after offboarding confirmation | Renvoo as processor |
| Clinic operational message/event logs | pilot term plus 90 days unless DPA says otherwise | export, then delete active copies | Renvoo as processor |
| Support tickets tied to clinic pilot | 12 months after closure | delete or anonymize if no longer needed | Renvoo |
| Security logs | 90 days unless investigation requires longer | rotate and securely delete | Renvoo |
| Encrypted backups | rolling 35 days | expire naturally unless legal hold applies | Renvoo |

## Offboarding rule

At pilot end, run the checklist in `clinic-offboarding-checklist.md`, produce the export agreed with the clinic, and confirm deletion timing for active data plus backup aging.
