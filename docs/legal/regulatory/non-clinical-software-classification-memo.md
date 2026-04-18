# Renvoo Non-Clinical Software Classification Memo

Internal memo for pre-launch review. Update before first live pilot.

## Current intended purpose

Renvoo is intended to support clinic operations around appointment attendance uncertainty. Its current purpose is to help clinics identify operationally risky appointments, coordinate confirmations and rescheduling earlier, and recover otherwise unused appointment capacity.

## Explicitly excluded intended purpose

Renvoo is not intended to:

- diagnose or predict disease
- recommend treatment or alter treatment plans
- provide patient-specific clinical advice
- replace clinician judgment
- function as a medical device, patient portal, or public healthcare marketplace in v1

## Data boundary

Current scope is limited to non-clinical administrative scheduling and communication data. Default exclusions are:

- BSN
- diagnosis and diagnostic codes
- medication and allergy data
- lab data
- clinical notes and free text
- treatment-plan fields

## Current conclusion

Based on Renvoo's current intended purpose and excluded features, the v1 launch should be treated as non-clinical operational software. That conclusion depends on staying within the boundary above.

## Re-review triggers

Stop and re-run legal review before launch if Renvoo adds:

- medical recommendations
- diagnosis-linked features
- treatment-path suggestions
- patient-facing risk scores with clinical implications
- workflows that rely on special-category health data beyond incidental clinic context
