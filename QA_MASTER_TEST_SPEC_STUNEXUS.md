# STUNexus QA Master Test Specification

## 1) Document Info
- Project: STUNexus Attendance System
- Scope: Full test requirements + full testcase set for UI flows, APIs, DB side effects
- Version: 1.0
- Date: 2026-04-25
- Owner: QA

## 2) Test Objectives
- Verify all business flows for Admin, Lecturer, Student.
- Verify all backend APIs (positive, negative, edge, security).
- Verify anti-fraud logic: dynamic QR, GPS radius, Passkey/WebAuthn.
- Verify data integrity in SQL Server after each critical action.
- Verify UX behavior under errors/timeouts/invalid input.

## 3) In-Scope Components
- Frontend: `FrontEnd/STUNexus/src/**`
- Backend: `BackEnd/DiemDanhLopHoc/**`
- Database schema: `Database/QuanLyDiemDanh.sql`
- Integration tests baseline: `BackEnd/DiemDanhLopHoc.Tests/**`

## 4) Out-of-Scope
- Third-party provider internals (Cloudinary, browser OS authenticator internals).
- Load test at internet scale (only staging-level concurrency in this spec).

## 5) Environments
- ENV-LOCAL: localhost FE + BE + SQL test DB.
- ENV-STAGING: HTTPS domain (required for WebAuthn realistic tests).
- ENV-PREPROD: optional mirror of production config.

## 6) Mandatory Test Requirements
1. RQ-ENV-001: Must use isolated test DB, never production DB.
2. RQ-ENV-002: Backend .NET 8 and SQL Server reachable before test run.
3. RQ-ENV-003: FE must run with valid `VITE_API_BASE_URL`.
4. RQ-SEC-001: Every endpoint tested with malformed input and missing fields.
5. RQ-SEC-002: Every critical flow tested with unauthorized/expired token.
6. RQ-SEC-003: Anti-fraud paths must include replay/tamper attempts.
7. RQ-DB-001: FK/Unique constraints must be validated by test assertions.
8. RQ-NFR-001: Concurrency test for multiple students checkin same session.
9. RQ-NFR-002: Failure recovery for GPS denied, network timeout, API 500.
10. RQ-AUD-001: All test runs must capture API request/response and DB snapshot delta.

## 7) Roles and Core Test Accounts
- ADMIN_01: valid admin
- LEC_01_ACTIVE: active lecturer
- LEC_02_LOCKED: locked lecturer (`TrangThai=0`)
- STU_01_PASSKEY: student with valid passkey + bound device
- STU_02_NOPASSKEY: student with no passkey
- STU_03_OTHER_DEVICE: student bound to another device UUID

## 8) Global Expected Response Contract
- Success shape (common): contains `success=true` or valid data payload as implemented.
- Failure shape: HTTP status must match error class; message must be meaningful.
- No unhandled HTML error page in API responses.

## 9) Full UI Flow Testcases

### 9.1 Authentication + Session
| ID | Title | Precondition | Steps | Expected UI | Expected API/DB | Priority | Severity |
|---|---|---|---|---|---|---|---|
| UI-AUTH-001 | Admin login success | ADMIN_01 exists | Login with valid admin creds | Redirect `/admin/dashboard` | `POST /auth/login` 200, JWT valid | P0 | S1 |
| UI-AUTH-002 | Lecturer login success | LEC_01_ACTIVE exists | Login with valid lecturer creds | Redirect `/lecturer/dashboard` | API 200 | P0 | S1 |
| UI-AUTH-003 | Student login success | STU_01_PASSKEY exists | Login with valid student creds | Redirect `/student/dashboard` | API 200, hasPasskey=true | P0 | S1 |
| UI-AUTH-004 | Locked lecturer blocked | LEC_02_LOCKED exists | Login locked lecturer | Error shown, no redirect | API 401 | P0 | S1 |
| UI-AUTH-005 | Invalid password | Any account exists | Input wrong password | Error alert | API 401 | P0 | S2 |
| UI-AUTH-006 | Empty credentials | None | Submit empty form | Validation + no login | API 400 | P1 | S3 |
| UI-AUTH-007 | Session restore after refresh | User logged in | Press F5 | Stay authenticated | localStorage token reused | P0 | S2 |
| UI-AUTH-008 | Expired token handling | Token manually expired | Trigger protected API | Redirect `/login` | API 401 handled by interceptor | P0 | S1 |
| UI-AUTH-009 | Inactivity auto logout | User logged in | No interaction >5 min | Auto logout and redirect | localStorage cleared | P1 | S2 |
| UI-AUTH-010 | Role route guard | Student logged in | Open `/admin/dashboard` | Redirect to student area | ProtectedRoute works | P0 | S2 |

### 9.2 Admin Flows
| ID | Title | Precondition | Steps | Expected UI | Expected API/DB | Priority | Severity |
|---|---|---|---|---|---|---|---|
| UI-ADM-001 | Dashboard stats load | Admin logged in | Open admin dashboard | Cards + activities render | `GET /admin/stats` 200 | P0 | S2 |
| UI-ADM-002 | Activity filters | Stats available | Toggle all/fraud/success | Rows filtered correctly | No DB change | P2 | S4 |
| UI-ADM-003 | Create student manual | Admin logged in | Add new student form | Success toast, row added | `POST /sinhvien` 201, DB insert | P0 | S1 |
| UI-ADM-004 | Update student | Student exists | Edit student profile fields | Updated row shown | `PUT /sinhvien/{id}` 200, DB update | P0 | S2 |
| UI-ADM-005 | Delete student | Student w/o FK dependencies | Delete student | Removed from list | `DELETE /sinhvien/{id}` 200, DB delete | P1 | S2 |
| UI-ADM-006 | Import students excel | Valid xlsx file | Upload file | Import summary shown | `POST /sinhvien/import`, DB batch insert | P0 | S2 |
| UI-ADM-007 | Create lecturer | Admin logged in | Add lecturer | New lecturer appears | `POST /giangvien` 200, DB insert | P0 | S1 |
| UI-ADM-008 | Lock lecturer | Lecturer exists | Edit `TrangThai=0` | Badge shows locked | `PUT /giangvien/{id}`, DB update | P0 | S1 |
| UI-ADM-009 | Create subject | Admin logged in | Add subject | Row added | `POST /monhocs` 200 | P1 | S2 |
| UI-ADM-010 | Create class auto schedule | Subject + lecturer exist | Add class with `SoBuoiHoc` | Class card appears | `POST /lophoc`, DB has LopHoc + BuoiHoc N rows | P0 | S1 |
| UI-ADM-011 | Delete class cascade data | Class exists with sessions/attendance | Delete class | Class removed | `DELETE /lophoc/{id}`, related attendance removed | P0 | S1 |
| UI-ADM-012 | Add student to class | Class + student exist | Add student from class students screen | Student listed in class | `POST /lophoc/{maLop}/add-new-student` | P0 | S2 |
| UI-ADM-013 | Remove student from class | Student in class with attendance | Remove student action | Student removed from class list | `DELETE /lophoc/{maLop}/remove-student/{maSv}`, attendance cleanup | P0 | S1 |
| UI-ADM-014 | Reset student device | Student has passkey/device | Click reset passkey | Success message | `POST /giangvien/{maSv}/reset-device`, passkey fields null | P0 | S1 |

### 9.3 Lecturer Flows
| ID | Title | Precondition | Steps | Expected UI | Expected API/DB | Priority | Severity |
|---|---|---|---|---|---|---|---|
| UI-LEC-001 | Lecturer dashboard | Lecturer logged in | Open dashboard | Metrics + warning list shown | `GET /diemdanh/lecturer-stats/{maGv}` | P0 | S2 |
| UI-LEC-002 | Sessions management view | Class exists | Open class sessions | Session cards listed | `GET /buoihoc/class/{maLop}` | P0 | S2 |
| UI-LEC-003 | Add makeup session | Class exists | Add new session form | Session count increases | `POST /buoihoc` insert row | P1 | S2 |
| UI-LEC-004 | Delete session | Session exists | Delete session | Card disappears | `DELETE /buoihoc/{id}` | P1 | S2 |
| UI-LEC-005 | Start QR with GPS allowed | Browser GPS allow | Open QR attendance | QR visible + countdown | `PUT /buoihoc/{id}/status` with lat/long | P0 | S1 |
| UI-LEC-006 | Start QR with GPS denied | GPS denied | Open QR attendance | Warning shown, QR still starts | `PUT status` without coords | P1 | S3 |
| UI-LEC-007 | Dynamic QR rotation | QR active | Observe 31s | Token refreshed | `GET /buoihoc/{id}/qr-token` called periodically | P0 | S1 |
| UI-LEC-008 | Stop attendance | QR active | Click stop | State indicates ended | `PUT status=2` | P0 | S2 |
| UI-LEC-009 | Manual attendance save | Session + students exist | Edit statuses and save | Success alert | `POST /diemdanh/bulk-update`, DB upsert | P0 | S1 |
| UI-LEC-010 | Export session excel | Session has data | Export | File downloaded | `GET /excel/session/{id}` blob | P1 | S3 |
| UI-LEC-011 | Export class excel | Class has sessions | Export class report | File downloaded | `GET /excel/class/{maLop}` blob | P1 | S3 |
| UI-LEC-012 | Lecturer profile update | Lecturer exists | Edit email/phone | Saved successfully | `PUT /giangvien/{id}` | P1 | S3 |
| UI-LEC-013 | Lecturer change password | Correct old password | Submit password form | Success message | `POST /auth/change-password` | P1 | S3 |
| UI-LEC-014 | Lecturer appeals list | Appeals exist | Open appeals page | Pending + resolved list visible | `GET /phanhoi/lecturer/{maGv}` | P0 | S2 |
| UI-LEC-015 | Approve appeal | Pending appeal exists | Approve with note | Appeal status updated | `PUT /phanhoi/{id}/resolve` status=1; DiemDanh->TrangThai=1 | P0 | S1 |
| UI-LEC-016 | Reject appeal | Pending appeal exists | Reject with note | Appeal marked rejected | `PUT /phanhoi/{id}/resolve` status=2 | P0 | S2 |

### 9.4 Student Flows
| ID | Title | Precondition | Steps | Expected UI | Expected API/DB | Priority | Severity |
|---|---|---|---|---|---|---|---|
| UI-STU-001 | Student dashboard metrics | Student has attendance history | Open dashboard | Cards + percentage accurate | `GET /diemdanh/student/{maSv}` | P0 | S2 |
| UI-STU-002 | QR scanner start | Camera permission granted | Open scanner and start | Camera opens | browser qr scanner start | P0 | S2 |
| UI-STU-003 | QR scanner invalid code | Scanner active | Scan non-STUNexus QR | Error shown | No checkin API call | P1 | S3 |
| UI-STU-004 | Checkin success path | Session active, valid token, passkey ready, inside radius | Scan then authenticate | Success screen | assertion-options 200 + assertion-verify 200 + DB attendance insert status=1 | P0 | S1 |
| UI-STU-005 | Checkin fail GPS denied | Session active | Deny geolocation | Fail message | no successful verify | P0 | S2 |
| UI-STU-006 | Checkin fail token expired | Session active but old QR token | Continue checkin | Fail message | assertion-options 400 | P0 | S1 |
| UI-STU-007 | Checkin fail outside radius | Session has room coords | Attempt from far location | Fraud error | assertion-options 403 + DB insert status=5 | P0 | S1 |
| UI-STU-008 | Checkin fail duplicate | Already checked in | Retry checkin | Duplicate error | assertion-options 400 | P0 | S2 |
| UI-STU-009 | Register passkey first time | Student has no passkey | Trigger register passkey | Success | register-options + register-verify success; DB passkey fields populated | P0 | S1 |
| UI-STU-010 | Register passkey when already exists | Student has passkey | Register again | Blocked message | register-options 400 | P0 | S1 |
| UI-STU-011 | Register on used device UUID | Device bound to another student | Register passkey | Blocked message | register-options 400 | P0 | S1 |
| UI-STU-012 | Student profile update | Student exists | Update email/phone | Saved | `PUT /sinhvien/{id}` | P1 | S3 |
| UI-STU-013 | Student avatar upload valid | jpg/png <=5MB | Upload avatar | Preview and saved | `POST /sinhvien/{id}/upload-avatar` 200 | P1 | S3 |
| UI-STU-014 | Student avatar upload invalid file | .pdf or >5MB | Upload | Error | API 400 | P1 | S3 |
| UI-STU-015 | Student change password | Correct old password | Submit password form | Success | `POST /auth/change-password` | P1 | S3 |
| UI-STU-016 | Student class list | Student in classes | Open class list | Classes displayed | `GET /sinhvien/{maSv}/classes` | P1 | S3 |
| UI-STU-017 | Submit complaint success | Attendance record exists and invalid status | Submit complaint | Success + appears in history | `POST /phanhoi` 201 + DB insert | P0 | S2 |
| UI-STU-018 | Submit duplicate pending complaint blocked | Existing pending complaint | Submit again same `MaDiemDanh` | Conflict message | `POST /phanhoi` 409 | P0 | S2 |
| UI-STU-019 | View complaint history | Complaints exist | Open history tab | Correct statuses visible | `GET /phanhoi/student/{maSv}` | P1 | S3 |

## 10) Full API Test Matrix

### 10.1 AuthController
#### Endpoint: `POST /api/auth/login`
- API-AUTH-LOGIN-001: Valid admin -> 200, token, role=Admin.
- API-AUTH-LOGIN-002: Valid lecturer active -> 200, role=Lecturer.
- API-AUTH-LOGIN-003: Valid lecturer locked -> 401.
- API-AUTH-LOGIN-004: Valid student -> 200, includes `hasPasskey`.
- API-AUTH-LOGIN-005: Missing `taiKhoan` -> 400.
- API-AUTH-LOGIN-006: Missing `matKhau` -> 400.
- API-AUTH-LOGIN-007: Wrong credentials -> 401.
- API-AUTH-LOGIN-008: SQL injection payload in `taiKhoan` -> 401 and no crash.
- API-AUTH-LOGIN-009: Extra unknown fields in body -> ignored, no failure.

#### Endpoint: `POST /api/auth/change-password`
- API-AUTH-CHG-001: Correct old password for admin -> 200.
- API-AUTH-CHG-002: Correct old password for lecturer -> 200.
- API-AUTH-CHG-003: Correct old password for student -> 200.
- API-AUTH-CHG-004: Incorrect old password -> 400.
- API-AUTH-CHG-005: Empty new password -> expect 400/validation fail path.

### 10.2 AdminController
#### Endpoint: `GET /api/admin/stats`
- API-ADM-STATS-001: Normal dataset -> 200 with all counters.
- API-ADM-STATS-002: Empty dataset -> 200 with zero counters.
- API-ADM-STATS-003: `RecentActivities` max size <= 10.
- API-ADM-STATS-004: DB exception simulated -> 500 with JSON error shape.

### 10.3 BuoiHocController
#### Endpoint: `GET /api/buoihoc/{id}`
- API-BH-GET-001: Existing session -> 200 details.
- API-BH-GET-002: Non-existing id -> 404.

#### Endpoint: `GET /api/buoihoc/class/{maLop}`
- API-BH-CLS-001: Class with sessions -> 200 list.
- API-BH-CLS-002: Class without sessions -> 200 empty list.
- API-BH-CLS-003: Unknown class id -> 200 empty list (current behavior).

#### Endpoint: `POST /api/buoihoc`
- API-BH-CREATE-001: Valid payload -> 200, inserted with `LoaiBuoiHoc=1`, `TrangThaiBh=0`.
- API-BH-CREATE-002: Missing required fields -> 400 model binding fail.

#### Endpoint: `GET /api/buoihoc/today/{maGv}`
- API-BH-TODAY-001: Lecturer has sessions today -> 200 with `success=true`.
- API-BH-TODAY-002: Lecturer no sessions -> 200 empty.

#### Endpoint: `PUT /api/buoihoc/{id}/status`
- API-BH-STATUS-001: Set status=1 with coords -> 200 and coords saved.
- API-BH-STATUS-002: Set status=2 no coords -> 200.
- API-BH-STATUS-003: Invalid id -> 404.

#### Endpoint: `DELETE /api/buoihoc/{id}`
- API-BH-DEL-001: Existing session -> 200.
- API-BH-DEL-002: Invalid id -> 404.

#### Endpoint: `GET /api/buoihoc/{id}/qr-token`
- API-BH-QR-001: Token returned with `success=true`.
- API-BH-QR-002: Token format length expected 16 hex chars.
- API-BH-QR-003: Token changes across 30s boundary.

### 10.4 DiemDanhController
#### Endpoint: `GET /api/diemdanh/student/{maSv}`
- API-DD-STU-001: Existing attendance records -> 200 list.
- API-DD-STU-002: No attendance -> 200 empty list.
- API-DD-STU-003: Sort order latest first.

#### Endpoint: `GET /api/diemdanh/session/{maBuoiHoc}`
- API-DD-SES-001: Session has attendance -> 200 list.
- API-DD-SES-002: Session empty -> 200 empty list.

#### Endpoint: `POST /api/diemdanh/bulk-update`
- API-DD-BULK-001: Update existing rows -> 200, DB updated.
- API-DD-BULK-002: Insert missing rows -> 200, DB inserted.
- API-DD-BULK-003: Mixed payload update+insert -> 200.
- API-DD-BULK-004: Duplicate key in payload same student/session -> verify deterministic final state.

#### Endpoint: `GET /api/diemdanh/lecturer-stats/{maGv}`
- API-DD-LSTAT-001: Lecturer with classes -> counters and warning list returned.
- API-DD-LSTAT-002: Lecturer no classes -> zeros.
- API-DD-LSTAT-003: Verify warning threshold `>30%` absent.

### 10.5 ExcelExportController
#### Endpoint: `GET /api/excel/session/{maBuoiHoc}`
- API-EX-SES-001: Valid session -> 200 file content type xlsx.
- API-EX-SES-002: Unknown session -> 404.
- API-EX-SES-003: Verify absent students shown as absent in export.

#### Endpoint: `GET /api/excel/class/{maLop}`
- API-EX-CLS-001: Valid class -> 200 xlsx.
- API-EX-CLS-002: Unknown class -> 404.
- API-EX-CLS-003: Verify fail threshold field (`CAM THI`) at >30%.

### 10.6 GiangVienController
#### Endpoint: `GET /api/giangvien`
- API-GV-GETALL-001: Returns lecturer list 200.

#### Endpoint: `GET /api/giangvien/{maGv}`
- API-GV-GET-001: Existing lecturer -> 200.
- API-GV-GET-002: Unknown lecturer -> 404.

#### Endpoint: `POST /api/giangvien`
- API-GV-CREATE-001: Valid payload -> 200.
- API-GV-CREATE-002: Duplicate `TaiKhoan` or `MaGv` -> DB error expected.

#### Endpoint: `POST /api/giangvien/{maSv}/reset-device`
- API-GV-RESET-001: Existing student with passkey -> passkey/device cleared.
- API-GV-RESET-002: Unknown student -> 404.

#### Endpoint: `PUT /api/giangvien/{maGv}`
- API-GV-UPD-001: Update profile data -> 200.
- API-GV-UPD-002: Update `TrangThai=0/1` -> 200.
- API-GV-UPD-003: Unknown `maGv` -> 404.

#### Endpoint: `DELETE /api/giangvien/{maGv}`
- API-GV-DEL-001: Lecturer without class dependencies -> 200.
- API-GV-DEL-002: Lecturer with class dependencies -> 409.

### 10.7 LopHocController
#### Endpoint: `GET /api/lophoc`
- API-LH-GETALL-001: No query -> returns all classes.
- API-LH-GETALL-002: With `maGv` filter -> only lecturer classes.

#### Endpoint: `POST /api/lophoc`
- API-LH-CREATE-001: Valid payload -> class created, sessions generated = `SoBuoiHoc`.
- API-LH-CREATE-002: Invalid payload -> 400.

#### Endpoint: `POST /api/lophoc/{maLop}/add-student`
- API-LH-ADD-001: Add existing student to class -> 200.
- API-LH-ADD-002: Missing `MaSv` -> 400.
- API-LH-ADD-003: Unknown class -> 404.
- API-LH-ADD-004: Unknown student -> 404.
- API-LH-ADD-005: Existing student already in class -> 409.

#### Endpoint: `GET /api/lophoc/{maLop}/students`
- API-LH-STU-001: Existing class -> student list.
- API-LH-STU-002: Unknown class -> 404.

#### Endpoint: `POST /api/lophoc/{maLop}/add-new-student`
- API-LH-ADDNEW-001: New student not in system -> create + attach.
- API-LH-ADDNEW-002: Existing student in system -> attach only.
- API-LH-ADDNEW-003: Student in another class same subject -> 409.
- API-LH-ADDNEW-004: Duplicate account while creating new -> 409.

#### Endpoint: `POST /api/lophoc/{maLop}/import-students`
- API-LH-IMP-001: Valid mixed list -> partial import supported.
- API-LH-IMP-002: Rows blocked by same subject conflict are skipped.
- API-LH-IMP-003: Duplicate account rows skipped.

#### Endpoint: `DELETE /api/lophoc/{maLop}/remove-student/{maSv}`
- API-LH-REM-001: Remove student + clean attendance rows for class sessions.
- API-LH-REM-002: Unknown class -> 404.
- API-LH-REM-003: Student not in class -> 404.

#### Endpoint: `DELETE /api/lophoc/{maLop}`
- API-LH-DEL-001: Delete class and cascaded linked data via explicit cleanup.
- API-LH-DEL-002: Unknown class -> 404.

### 10.8 MonHocsController
#### Endpoint: `GET /api/monhocs`
- API-MH-GETALL-001: Returns ordered subject list.

#### Endpoint: `GET /api/monhocs/{maMon}`
- API-MH-GET-001: Existing subject -> 200.
- API-MH-GET-002: Unknown subject -> 404.

#### Endpoint: `POST /api/monhocs`
- API-MH-CREATE-001: Valid create -> 200.
- API-MH-CREATE-002: Duplicate `MaMon` -> 400.

#### Endpoint: `PUT /api/monhocs/{maMon}`
- API-MH-UPD-001: Update existing subject name -> 200.
- API-MH-UPD-002: Unknown subject -> 404.

#### Endpoint: `DELETE /api/monhocs/{maMon}`
- API-MH-DEL-001: Delete unused subject -> 200.
- API-MH-DEL-002: Delete used subject (FK) -> 400.

### 10.9 PhanHoiController
#### Endpoint: `POST /api/phanhoi`
- API-PH-CREATE-001: Valid complaint -> 201.
- API-PH-CREATE-002: Empty `NoiDung` -> 400.
- API-PH-CREATE-003: Unknown `MaDiemDanh` -> 404.
- API-PH-CREATE-004: Duplicate pending complaint same attendance -> 409.

#### Endpoint: `GET /api/phanhoi/student/{maSv}`
- API-PH-STU-001: Returns student complaint history.
- API-PH-STU-002: No complaints -> 200 empty.

#### Endpoint: `GET /api/phanhoi/lecturer/{maGv}`
- API-PH-LEC-001: Returns complaints of classes taught by lecturer.
- API-PH-LEC-002: Lecturer with no classes -> 200 empty.

#### Endpoint: `PUT /api/phanhoi/{id}/resolve`
- API-PH-RES-001: Approve with status=1 -> complaint resolved + attendance set present.
- API-PH-RES-002: Reject with status=2 -> complaint resolved rejected.
- API-PH-RES-003: Invalid status value -> 400.
- API-PH-RES-004: Already resolved complaint -> 409.
- API-PH-RES-005: Unknown complaint id -> 404.

### 10.10 SinhVienController
#### Endpoint: `GET /api/sinhvien`
- API-SV-GETALL-001: Returns student list with `hasPasskey`.

#### Endpoint: `GET /api/sinhvien/{maSv}`
- API-SV-GET-001: Existing student -> 200.
- API-SV-GET-002: Unknown student -> 404.

#### Endpoint: `POST /api/sinhvien`
- API-SV-CREATE-001: Valid payload -> 201.
- API-SV-CREATE-002: Missing required fields -> 400.
- API-SV-CREATE-003: Duplicate `MaSv` -> 409.
- API-SV-CREATE-004: Duplicate `TaiKhoan` -> 409.

#### Endpoint: `POST /api/sinhvien/import`
- API-SV-IMP-001: Mixed valid+invalid rows -> 200 with `imported` and `errors`.
- API-SV-IMP-002: All duplicates -> imported=0 and errors populated.

#### Endpoint: `PUT /api/sinhvien/{maSv}`
- API-SV-UPD-001: Valid update -> 200.
- API-SV-UPD-002: Unknown student -> 404.

#### Endpoint: `DELETE /api/sinhvien/{maSv}`
- API-SV-DEL-001: Student without dependencies -> 200.
- API-SV-DEL-002: Student with dependencies -> 409.

#### Endpoint: `GET /api/sinhvien/{maSv}/classes`
- API-SV-CLS-001: Existing student with classes -> list.
- API-SV-CLS-002: Existing student no classes -> empty.
- API-SV-CLS-003: Unknown student -> 404.

#### Endpoint: `POST /api/sinhvien/{maSv}/upload-avatar`
- API-SV-AVT-001: Valid jpg/png <=5MB -> 200 + URL stored in DB.
- API-SV-AVT-002: Empty file -> 400.
- API-SV-AVT-003: Invalid extension -> 400.
- API-SV-AVT-004: File too large -> 400.
- API-SV-AVT-005: Unknown student -> 404.

### 10.11 WebAuthnController
#### Endpoint: `GET /api/webauthn/register-options?maSv=&deviceUuid=`
- API-WA-ROPT-001: Valid student no passkey + unique device -> 200 options.
- API-WA-ROPT-002: Unknown student -> 404.
- API-WA-ROPT-003: Student already has passkey -> 400.
- API-WA-ROPT-004: Missing `deviceUuid` -> 400.
- API-WA-ROPT-005: Device already bound to another student -> 400.

#### Endpoint: `POST /api/webauthn/register-verify?maSv=`
- API-WA-RVER-001: Valid attestation response -> 200 and DB passkey fields set.
- API-WA-RVER-002: Expired/missing cache challenge -> 400.
- API-WA-RVER-003: Invalid attestation -> 400.

#### Endpoint: `POST /api/webauthn/assertion-options`
- API-WA-AOPT-001: Valid session open + token valid + gps near -> 200 options.
- API-WA-AOPT-002: Student no passkey -> 400.
- API-WA-AOPT-003: Session not open -> 400.
- API-WA-AOPT-004: Already checked in -> 400.
- API-WA-AOPT-005: QR token invalid/expired -> 400.
- API-WA-AOPT-006: GPS beyond 60m -> 403 and DB fraud record status=5.

#### Endpoint: `POST /api/webauthn/assertion-verify?maSv=`
- API-WA-AVER-001: Valid assertion signature -> 200 and attendance status=1.
- API-WA-AVER-002: Missing/expired assertion cache -> 400.
- API-WA-AVER-003: Invalid signature/counter mismatch -> 403 and fraud record status=5.

## 11) DB Integrity Testcases
| ID | Check | Steps | Expected |
|---|---|---|---|
| DB-INT-001 | Unique attendance per student/session | Insert duplicate `(MaBuoiHoc, MaSV)` | SQL constraint rejection |
| DB-INT-002 | FK class->subject | Delete used subject | Rejected by FK |
| DB-INT-003 | FK attendance->session | Delete session with attendance without cleanup path | Rejected unless controller cleanup is used |
| DB-INT-004 | Complaint relation | Delete attendance with complaint | Behavior follows FK cascade settings |
| DB-INT-005 | Passkey device uniqueness logic | Bind same `DeviceUUID` to two students via API | Second bind blocked |

## 12) Security Testcases
| ID | Type | Target | Steps | Expected |
|---|---|---|---|---|
| SEC-001 | Injection | login | SQLi strings in username/password | No bypass, no server crash |
| SEC-002 | Tamper | checkin | Modify QR token in URL | assertion-options rejected |
| SEC-003 | Replay | checkin | Reuse old QR token after 30s window | rejected |
| SEC-004 | Replay | passkey assertion | Reuse old signed assertion | rejected |
| SEC-005 | Device spoof | register passkey | Reuse device UUID of another student | rejected |
| SEC-006 | AuthZ | protected APIs | call APIs without token | must reject (expected hardening requirement) |

## 13) Concurrency and Reliability
| ID | Scenario | Method | Expected |
|---|---|---|---|
| PERF-001 | 100 students checkin in same minute | parallel API load | no duplicate attendance per student; acceptable latency |
| PERF-002 | Simultaneous bulk-update + student checkin | mixed parallel requests | DB consistent, no deadlock |
| REL-001 | Temporary DB connection loss | chaos test | API fails gracefully, no corruption |
| REL-002 | Network loss during checkin | FE offline simulation | user gets clear retry path |
| REL-003 | Browser GPS timeout | geolocation timeout | meaningful error and no false success |

## 14) Regression Focus List
1. Routing mismatch risks in lecturer pages using `maLop` vs `maBuoiHoc`.
2. Missing `[Authorize]` protection on many APIs (must be tested and raised).
3. Legacy integration tests reference outdated endpoint/contracts.
4. Hardcoded secrets in config must be flagged as release blocker.

## 15) Automation Candidate Priority
- Tier 1 (must automate): auth login, webauthn API contracts (mocked), checkin anti-fraud decisions, complaint resolve.
- Tier 2: CRUD modules (student/lecturer/subject/class/session).
- Tier 3: export excel content verification, UI visual checks.

## 16) Exit Criteria
1. 100% P0/P1 testcases passed.
2. 0 open S1 defects, <=2 accepted S2 with workaround.
3. No data integrity violation in DB checks.
4. Anti-fraud critical paths validated on staging HTTPS with real devices.

## 17) Deliverables
- Test execution report by suite and severity.
- API evidence pack (request/response logs).
- DB verification scripts and snapshots.
- Defect log with repro steps and impacted module.

