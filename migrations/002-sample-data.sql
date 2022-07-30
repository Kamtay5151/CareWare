    insert into patients (patient_id, patient_givenname, patient_surname)
        values (NULL, 'Cory', 'Lody'),
               (NULL, 'Shanta', 'Reynolds-Woods'),
               (NULL, 'Emily', 'Roa'),
               (NULL, 'Stephanie', 'Galvez');

    insert into rooms (room_id, room_number)
        values (NULL, 101),
               (NULL, 102);

    insert into doctors (doc_id, doc_givenname, doc_surname)
        values (NULL, 'Jon', 'Bon Jovi'),
               (NULL, 'Stevie', 'Wonder'),
               (NULL, 'Michael', 'Jackson');

    insert into appointments (appt_id, patient_id, room_id, doc_id, time)
        values (NULL, 1, 1, 1, 1659088800),
               (NULL, 2, 2, 3, 1659276000);