/*
Gunakan pendekatan OOP, IndexDB API
Minimal ada:
1. constructor
2. getter & setter
3. fungsi tampilkanData()
4. fungsi hapusData()
*/

window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

// check for support
if(!(window.indexedDB)){
    alert("This browser doesn't support IndexedDB");
}

var request, 
    db, 
    transaction, 
    store, 
    index;

const dataMahasiswa = [];

class Data {
    constructor(nama, nim, prodi, email) {
        this.nama = nama;
        this.nim = nim;
        this.prodi = prodi;
        this.email = email;
    }

    // Getter 
    // GET MAHASISWA PADA INDEX ???
    getNama = function () {
        return this.nama;
    };
    getNim = function () {
        return this.nim;
    };
    getProdi = function () {
        return this.prodi;
    };
    getEmail = function () {
        return this.email;
    };
}

function setData(){
    var nama = document.forms["registrasiMhs"]["nama"].value;
    var nim = document.forms["registrasiMhs"]["nim"].value;
    var prodi = document.forms["registrasiMhs"]["prodi"].value;
    var email = document.forms["registrasiMhs"]["email"].value;

    if(validateForm(nama, nim, prodi, email)){
        var data = new Data(nama, nim, prodi, email);
        dataMahasiswa.push({nama: nama, nim: nim, prodi: prodi, email: email});
        console.log(dataMahasiswa);
        
    }
}

function addData() {
    request = window.indexedDB.open("database", 1); 
        // db, 
        // transaction, 
        // store, 
        // index;
        
    request.onupgradeneeded = function(event){
        var db = request.result,
            store = db.createObjectStore("dataMahasiswa", {keyPath: "nim"}),
            index = store.createIndex("nama", "nama", {unique: false});
    };

    request.onerror = function(event){
        console.log("Error: " + event.target.errorCode);
    };
    
    request.onsuccess= function(event){
        db = request.result;
        transaction = db.transaction("dataMahasiswa", "readwrite");
        store = transaction.objectStore("dataMahasiswa");
        index = store.index("nama");
        dataMahasiswa.push(store.getAll());

        db.onerror = function(event){
            console.log("ERROR: " + event.target.errorCode);
        };

        // store.put(dataMahasiswa[dataMahasiswa.length - 1]);
        var dbMahasiswa = store.getAll();
        
        dbMahasiswa.onsuccess = function(){
            console.log(dbMahasiswa.result);
            for(var i=0; i<dbMahasiswa.result.length; i++){
                tampilkanData(dbMahasiswa.result[i].nama, dbMahasiswa.result[i].nim, dbMahasiswa.result[i].prodi, dbMahasiswa.result[i].email);
            }
        };
    };
}

function hapusData(index){
    db = request.result;
    transaction = db.transaction("dataMahasiswa", "readwrite");
    store = transaction.objectStore("dataMahasiswa");
    var delDb;
    var dbMahasiswa = store.getAll();

    dbMahasiswa.onsuccess = function(){
        delDb = store.delete(dbMahasiswa.result[index].nim);
        alert(dbMahasiswa.result[index].nim + " sudah dihapus");
    }
}
// SUBMIT TANPA ADA YANG TERULANG!!!
function tampilkanData(nama, nim, prodi, email){
    // var table = document.getElementById("hasil");
    // table.innerHTML = "<table id=\"hasilTabel\">" +
    //                 "<tr>" + 
    //                     "<th class=\"nama\">Nama</th>" +
    //                     "<th class=\"nim\">NIM</th>" +
    //                     "<th class=\"prodi\">Prodi</th>" +
    //                     "<th class=\"email\">Email</th>" +
    //                 "</tr></table>";

    var hasilTabel = document.getElementById("hasilTabel");
    var cellNama = "<td class=\"nama\">" + nama + "</td>",
        cellNim = "<td class=\"nim\">" + nim + "</td>",
        cellProdi = "<td class=\"prodi\">" + prodi + "</td>",
        cellEmail = "<td class=\"email\">" + email + "</td>",
        cellHapus = "<td class=\"hapus\"><input type=\"button\" value=\"Hapus\" onclick=\"hapusData()\"/></td>";

    hasilTabel.innerHTML += "<tr>" + cellNama + cellNim + cellProdi + cellEmail + cellHapus + "</tr>";
}

function validateForm(nama, nim, prodi, email){
    if(nama == "" || nim == "" || prodi == "" || email == ""){
        alert("Anda harus melengkapi semua data.");
        return false;
    } else{
        return true;
    }
}