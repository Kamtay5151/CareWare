var sqlite3 = require('sqlite3');
var dbname = 'careware.db';

let db= new sqlite3.Database('./' + dbname, sqlite3.OPEN_READWRITE, (err) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
        console.log ("Creating DB");
        createDatabase();
        return;
        } else if (err) {
            console.log("Error " + err);
            exit(1);
    }
    console.log("DB already exists");
});

function createDatabase() {
    var newdb = new sqlite3.Database(dbname, (err) => {
        if (err) {
            console.log("Getting error " + err);
            exit(1);
        }
        createTables(newdb);
    });
}

function createTables(newdb) {
    newdb.exec(`
    create table patientRecords (
        patient_id INTEGER PRIMARY KEY,
        patient_givenname TEXT NOT NULL,
        patient_surname TEXT NOT NULL
    );
    insert into patientRecords (patient_id, patient_givenname, patient_surname)
        values (NULL, 'Cory', 'Lody'),
               (NULL, 'Shanta', 'Reynolds-Woods'),
               (NULL, 'Emily', 'Roa'),
               (NULL, 'Stephanie', 'Galvez');

    create table rooms (
        room_id INTEGER PRIMARY KEY,
        room_number INTEGER NOT NULL
    );
    insert into rooms (room_id, room_number)
        values (NULL, 101),
               (NULL, 102);

    create table doctors (
        doc_id INTEGER PRIMARY KEY,
        doc_givenname TEXT NOT NULL,
        doc_surname TEXT NOT NULL
    );
    insert into doctors (doc_id, doc_givenname, doc_surname)
        values (NULL, 'Jon', 'Bon Jovi'),
               (NULL, 'Stevie', 'Wonder'),
               (NULL, 'Michael', 'Jackson');

    create table appointments (
        appt_id INTEGER PRIMARY KEY,
        patient_id INTEGER NOT NULL,
        room_id INTEGER NOT NULL,
        doc_id INTEGER NOT NULL,
        time INTEGER NOT NULL
    );
    insert into appointments (appt_id, patient_id, room_id, doc_id, time)
        values (NULL, 1, 1, 1, 1659088800),
               (NULL, 2, 2, 3, 1659276000);
        `, ()  => {
    });
}

//for testing
function runQueries(db) {
    db.all(`select * from appointments`, (err, rows) => {
        rows.forEach(row => {
            console.log(row.patient_id + "\t" +row.time);
        });
    });
}
runQueries(db);

module.exports = db;