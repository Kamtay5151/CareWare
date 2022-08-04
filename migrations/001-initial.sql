-- Up
create table patients (
    patient_id INTEGER PRIMARY KEY,
    patient_givenname TEXT NOT NULL,
    patient_surname TEXT NOT NULL
);

create table rooms (
    room_id INTEGER PRIMARY KEY,
    room_number INTEGER NOT NULL
);

create table doctors (
    doc_id INTEGER PRIMARY KEY,
    doc_givenname TEXT NOT NULL,
    doc_surname TEXT NOT NULL
);

create table appointments (
    appt_id INTEGER PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    doc_id INTEGER NOT NULL,
    time INTEGER NOT NULL
);

create table patientRecords (
    record_id INTEGER PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    note TEXT NOT NULL
);

create table users (
    user_id INTEGER PRIMARY KEY,
    username STRING NOT NULL,
    password STRING NOT NULL
);

-- Down
drop table patients;
drop table rooms;
drop table doctors;
drop table appointments;
drop table patientRecords;
drop table users;