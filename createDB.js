let db;
let dbVersion = 1;
let dbReady = false;
var tableName = 'scanCard';

document.addEventListener('DOMContentLoaded', () => {
    // alert('dom content loaded');

    initDb();

});

function initDb() {
    let request = indexedDB.open('scanDB', dbVersion);

    request.onerror = function(e) {
        console.error('Unable to open database.');
    }

    request.onsuccess = function(e) {
        db = e.target.result;
        // alert('db opened');
        doImageListing();
    }

    // const employeeData = [
    //     { id: 1, data: "gopal", content: "Mobile: 98986 31317 SANToSH R. DUBEY Advocate High Court of Gujarat 20, Ashoknagar Society, B/h. Railway Station, Nadiad-387 002. Dist. Kheda (Gujarat) E-mail : santoshdubey_75@yahoo.com", created:new Date() },
    //     { id: 2, data: "gopal", content: "Shah Harsh (Business Partner) Head Office: 71, Maddybeth crescent, Brampton, ON L6Y SR6, Canada. M: +91 99258 33511 harsh.shah@citrusbug.com www.citrusbug.com Skype: citrus.bug", created:new Date() }
    //  ];

    request.onupgradeneeded = function(e) {
        let db = e.target.result;
        var objectStore = db.createObjectStore(tableName, {keyPath:'id', autoIncrement: true});
        
        // for (var i in employeeData) {
        //    objectStore.add(employeeData[i]);
        // }
        dbReady = true;
    }
}

function doFile(data, content) {
    let bits = data;
    let ob = {
        created:new Date(),
        data:bits,
        content: content
    };

    let trans = db.transaction([tableName], 'readwrite');
    let addReq = trans.objectStore(tableName).add(ob);

    addReq.onerror = function(e) {
        alert('error storing data');
        console.error(e);
    }

    trans.oncomplete = function(e) {
        alert('data stored');
        doImageListing();
    }
}


function doImageListing() {
    try{
        // alert('doImageListing');
        $("#contact-form-btn, #TextBoxesGroup, #doSaving").hide();
        $("#dataCotent").show();
        $("#dataCotent tbody").remove(); 
        var trans = db.transaction([tableName], 'readonly');
        $("#dataCotent").append('<tbody></tbody>');
        trans.objectStore(tableName).openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
              
            if (cursor) {
                $("#dataCotent tbody").append('<tr><td id="Timg"><img style="width:80px;height:65px;" id="myImage" src="data:image/jpeg;base64,'+cursor.value.data+'" /></td><td id="Ttxt">'+ cursor.value.content.substring(0, 55) +'...</td><td id="Tdel"><i class="fa fa-times-circle deleteItem" id='+cursor.key+' ></i></td></tr>');
                cursor.continue();
                
            } else {
                $('.deleteItem').on("click", function(){

                    var r = confirm("Are you sure want to delete record?");
                    if (r == true) {
                        removeRecord($(this).attr('id'));
                        doImageListing();
                    }
                    
                });
            }
            if ($("#Timg").length <= 0) {
                $("#dataCotent tbody").append('<tr><td colspan="3" style="text-align:center;">No more entries!</td></tr>');
            }
        };

    } catch(err) {
        alert(err);
    }
}

function removeRecord(id) {
    var request = db.transaction([tableName], "readwrite")
    .objectStore(tableName)
    .delete(parseInt(id));
       
    request.onsuccess = function(event) {
        // alert("Entry has been removed from your database.");
    };
}