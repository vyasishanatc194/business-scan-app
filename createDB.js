let db;
let dbVersion = 1;
let dbReady = false;
var tableName = 'cachedForms';

document.addEventListener('DOMContentLoaded', () => {
    console.log('dom content loaded');

    initDb();

});

function initDb() {
    let request = indexedDB.open('testPics', dbVersion);

    request.onerror = function(e) {
        console.error('Unable to open database.');
    }

    request.onsuccess = function(e) {
        db = e.target.result;
        alert('db opened');
        doImageListing();
    }

    request.onupgradeneeded = function(e) {
        let db = e.target.result;
        db.createObjectStore(tableName, {keyPath:'id', autoIncrement: true});
        dbReady = true;
    }
}

function doFile(data) {
    console.log('change event fired for input field');
        //alert(e.target.result);
        let bits = data;
        let ob = {
            created:new Date(),
            data:bits,
            content: $("#content").val()
        };

        let trans = db.transaction([tableName], 'readwrite');
        let addReq = trans.objectStore(tableName).add(ob);

        addReq.onerror = function(e) {
            alert('error storing data');
            console.error(e);
        }

        trans.oncomplete = function(e) {
            alert('data stored');
        }
}

function doImageTest() {
    try{

        alert('doImageTest');
        var smallImage = document.getElementById('myImage');
            
        let recordToLoad = parseInt(document.querySelector('#recordToLoad').value,10);
        if(recordToLoad === '') recordToLoad = 1;

        let trans = db.transaction([tableName], 'readonly');
        //hard coded id
        let req = trans.objectStore(tableName).get(recordToLoad);
        req.onsuccess = function(e) {
            let record = e.target.result;
            alert(record.data);
            smallImage.src = "data:image/jpeg;base64," + btoa(record.data);
        }
        req.onerror = function(event) {
          console.log("error: ");
        };

    } catch(err) {
        alert(err);
    }
}


function doImageListing() {
    try{
        $("#contact-form-btn, #TextBoxesGroup, #doSaving").hide();
        alert('doImageListing');
        $("#dataCotent").remove('tbody');
        var trans = db.transaction([tableName], 'readonly');
        $("#dataCotent").append('<tbody></tbody>');
        trans.objectStore(tableName).openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
              
            if (cursor) {
                // $("#dataCotent tbody").append('<tr><td id="Timg"><img style="width:60px;height:60px;" id="myImage" src="data:image/jpeg;base64,'+btoa(cursor.value.data)+'" /></td><td id="Ttxt">'+cursor.value.content+'</td><td id="Tdel"><i class="fa fa-times-circle" id='+cursor.key+' ></i></td></tr>');
                // cursor.continue();
                // $('i.fa').on("click", function(){
                //     remove($(this).attr('id'));
                // });
            } else {
                
            }
            if ($("#Timg").length <= 0) {
                $("#dataCotent tbody").append('<tr><td colspan="3" style="text-align:center;">No more entries!</td></tr>');
            }
        };

    } catch(err) {
        alert(err);
    }
}

function remove(id) {
    
   var request = db.transaction([tableName], "readwrite")
   .objectStore(tableName)
   .delete(id);
   
   request.onsuccess = function(event) {
      alert("Card delete successfully");
      doImageListing();
   };
}