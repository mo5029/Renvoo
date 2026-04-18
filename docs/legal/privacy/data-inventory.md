# Renvoo Pilot Data Inventory

Operational draft for the first Dutch clinic pilots.

## Product posture

- Product type: B2B clinic SaaS
- v1 interaction model: clinic-triggered reminders, confirmations, and secure links
- Not in v1: patient accounts, public profiles, marketplace listings, UGC, consumer billing

## Role map

| Processing area | Renvoo role | Counterparty role |
| --- | --- | --- |
| Clinic appointment and patient operational data | Processor | Clinic is controller |
| Renvoo website analytics and contact forms | Controller | Site visitor is data subject |
| CRM, finance, hiring, and vendor administration | Controller | Vendor / lead / employee / applicant |

## Allowed pilot data

| Category | Typical fields | Why needed |
| --- | --- | --- |
| Patient identification | first name, last name, clinic patient ID | identify the scheduled person |
| Contact | mobile phone, email, preferred contact channel | send reminders and rescheduling messages |
| Appointment metadata | appointment ID, type, status, start/end time, duration | manage operational workflow |
| Clinic routing | location, practitioner, chair or slot reference where approved | route the workflow operationally |
| Message events | reminder sent, response status, confirmation status | track whether operational follow-up is needed |
| Outcome events | cancellation timing, attendance outcome, recovery status | measure pilot performance |

## Excluded by default

- BSN
- diagnosis codes
- medication
- allergies
- lab results
- clinical notes
- treatment plans
- open free-text medical history

## Systems

| System | Purpose | Live status |
| --- | --- | --- |
| Website | marketing site and contact capture | `[planned / live]` |
| CRM | clinic lead follow-up | `[planned / live]` |
| Pilot data store | clinic operational workflow data | `[planned / live]` |
| Messaging provider | clinic-triggered reminders and confirmations | `[planned / live]` |

## Rule

If a proposed field does not fit the allowed categories above, treat it as blocked until explicit review approves it.
