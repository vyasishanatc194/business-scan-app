let db;
let dbVersion = 1;
let dbReady = false;
var tableName = 'scanCard';
var tableName1 = 'credits';
var tableName2 = 'creditsLogs';
var tableData = '';
var DEVICEUID = '';
var TOTAL_CREDITS = 0;

document.addEventListener('DOMContentLoaded', () => {
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
        showCredits();
        doImageListing();
        checkInCloudSettings();
    }

    // dummy data
    // const employeeData = [
    //     { id: 1, data: "gopal", content: "Mobile: 98986 31317 SANToSH R. DUBEY Advocate High Court of Gujarat 20, Ashoknagar Society, B/h. Railway Station, Nadiad-387 002. Dist. Kheda (Gujarat) E-mail : santoshdubey_75@yahoo.com", created:new Date() },
    //     { id: 2, data: "gopal", content: "Shah Harsh (Business Partner) Head Office: 71, Maddybeth crescent, Brampton, ON L6Y SR6, Canada. M: +91 99258 33511 harsh.shah@citrusbug.com www.citrusbug.com Skype: citrus.bug", created:new Date() }
    // ];

    request.onupgradeneeded = function(e) {
        let db = e.target.result;
        var objectStore = db.createObjectStore(tableName, {keyPath:'id', autoIncrement: true});
        var objectStore1 = db.createObjectStore(tableName1, {keyPath:'id', autoIncrement: true});
        var objectStore2 = db.createObjectStore(tableName2, {keyPath:'id', autoIncrement: true});
        
        objectStore1.add({credits: 5, createdAt: new Date()});
        objectStore2.add({credits: 5, createdAt: new Date()});
        
        dbReady = true;
    }
}

function checkCredits() {
    try{
        var trans = db.transaction([tableName1], 'readonly');
        var ObjectTras = trans.objectStore(tableName1);

        ObjectTras.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor.value.credits == 0) {
                var r = confirm(BCS.buy_credits_confirmation_box_title);
                if (r == true) {
                    window.location = 'expand-contact.html';
                } else {
                    window.location = 'index.html';
                }
            } else {
                capturePhoto('Front');
            }
        };
    } catch(err) {
        alert(err);
    }
}

function showCredits() {
    try{
        var trans = db.transaction([tableName1], 'readonly');
        var ObjectTras = trans.objectStore(tableName1);

        ObjectTras.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;

            $(".largenumber").html(cursor.value.credits);
            $(".expand-contact-text-info span.red-txt").html(cursor.value.credits);
        };
    } catch(err) {
        alert(err);
    }
}

// save image / data in indexedDB
function doFile(data, imageDataURLback = null, content) {
    try {
        let bits = data;
        let ob = {
            created:new Date(),
            data:bits,
            imgBack: imageDataURLback,
            content: content
        };

        let trans = db.transaction([tableName], 'readwrite');
        let addReq = trans.objectStore(tableName).add(ob);

        addReq.onerror = function(e) {
            alert(BCS.error.error_store_data);
            console.error(e);
        }

        trans.oncomplete = function(e) {
            console.log(e);
            createCreditsLog();
            window.location = "index.html";
        }
    } catch(err) {
        alert(err);
    }
}

function createCreditsLog() {
    try{
        var objectStore = db.transaction([tableName1], "readwrite").objectStore(tableName1);
        var objectStoreTitleRequest = objectStore.get(1);

        objectStoreTitleRequest.onsuccess = function() {
            // Grab the data object returned as the result
            var data = objectStoreTitleRequest.result;

            // Update the notified value in the object to "yes"
            var data = {
                credits: parseInt(data.credits) - 1,
                updatedAt: new Date(),
                id: 1
            };

            // Create another request that inserts the item back into the database
            var updateTitleRequest = objectStore.put(data);
            // When this new request succeeds, run the displayData() function again to update the display
            updateTitleRequest.onsuccess = function() {
                addCreditLogs(data.credits); 
            };
        };

    } catch(err) {
        alert(err);
    }
}

function addCreditLogs(credits = null) {
    try{
        var updatedData = {
            credits : credits,
            createdAt : new Date(),
        }

        let trans = db.transaction([tableName2], 'readwrite');
        let addReq = trans.objectStore(tableName2).add(updatedData);

        addReq.onerror = function(e) {
            alert(BCS.error.error_store_data_in_creditslog);
            console.error(e);
        }

        trans.oncomplete = function(e) {
            console.log(e);
        }
    }
    catch(err){
        alert(err);
    }
}

function checkInCloudSettings() {
    try{
        var trans = db.transaction([tableName1], 'readonly');
        var ObjectTras = trans.objectStore(tableName1);

        ObjectTras.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            document.addEventListener("deviceready", function onDeviceReady() {

                var UserCreditData = {
                  user: {
                    id: device.uuid,
                    name: BCS.app_name,
                    data: cursor.value,
                    preferences: {
                      mute: true,
                      locale: 'en_GB'
                    }
                  }
                };

                cordova.plugin.cloudsettings.save(UserCreditData, function(savedSettings){
                    console.log("Settings successfully saved at " + (new Date(savedSettings.timestamp)).toISOString());
                }, function(error){
                    console.error("Failed to save settings: " + error);
                }, false);

            }, false);
        };
    } catch(err) {
        alert(err);
    }
}

// fetch all images/ data from indexedDB
function doImageListing() {
    try{
        $(".cardDetailPage, .scanCardForm").hide();
        $(".cardListing").show();
        $("#dataCotent div.card").remove(); 
        var trans = db.transaction([tableName], 'readonly');

        var ObjectTras = trans.objectStore(tableName);

        ObjectTras.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                var data = cursor.value.content;
                var rowData = '';

                if (data.displayName != null) { rowData += '<h3>'+data.displayName+'</h3>' };
                if (data.phoneNumbers != null) { rowData += '<p><i class="fa fa-phone"></i>'+data.phoneNumbers[0].value+'</p>' };
                if (data.emails != null) { rowData += '<p><i class="fa fa-envelope"></i>'+data.emails[0].value+'</p>' };
                if (data.twitter != null) { rowData += '<p><i class="fa fa-twitter"></i>'+data.twitter[0]+'</p>' };
                if (data.urls != null) { rowData += '<p><i class="fa fa-globe"></i>'+data.urls[0].value+'</p>' };

                tableData = ['<div class="card"><div class="card-data-list clearfix"><a class="cardItem" id='+cursor.key+' >'+
                    '<p id="Timg">'+ rowData +'</p></div></div>'];
                fillData(tableData);
                cursor.continue();
            } 
            if ($("#Timg").length <= 0) {
                $("#dataCotent").append('<div class="card"><div class="card-data-list clearfix"><p>'+BCS.no_cards_scanned_yet+'</p></div></div>');
            }
        };
    } catch(err) {
        alert(err);
    }
}

// fill the form after scan card
function fillData(tableData) {
    $("#dataCotent").css("display", "block");
    $.each(tableData, function(index, val) {
        $("#dataCotent").append(val);
    });

    $('.deleteItem').on("click", function(){
        var r = confirm("Are you sure want to delete record?");
        if (r == true) {
            removeRecord($(this).attr('id'));
        }                    
    });

    $(".cardItem").on("click", function(){
        $(".cardListing").hide();
        $(".scanCardForm").hide();
        $(".cardDetailPage").show();
        var cardId = $(this).attr('id');
        cardDetailPage(cardId); 
    });

}

// show detail of card page
function cardDetailPage(cardId) {
    try {
        var transaction = db.transaction([tableName]);
        var objectStore = transaction.objectStore(tableName);
        var request = objectStore.get(parseInt(cardId));
       
        request.onerror = function(event) {
           alert(BCS.retrive_data_error);
        };
       
        request.onsuccess = function(event) {
            $(".card-detail-div").show();
            if(request.result) {
                if (request.result.data != null ){
                    $(".card-detail-div img#imgFrnt").attr('src', "data:image/jpeg;base64,"+request.result.data);
                }  else { $(".card-detail-div img#imgFrnt").hide(); }

                if (request.result.imgBack != null ){
                    $(".card-detail-div img#imgBck").attr('src', "data:image/jpeg;base64,"+request.result.imgBack);
                } else { $(".card-detail-div img#imgBck").hide(); }

                $(".content-blk p").html(request.result.content.note);
                $("h4#cardDetailPageTitle").html(request.result.content.displayName);
                $(".deleteItem").attr('id', cardId);
            } 
       };
    }
    catch(err) {
        $(".txtboxes-group-div").show();
        $(".card-detail-div").hide();
        alert('Detail Page:'+err); 
    }
}


function removeRecord(id) {
    try {
        var request = db.transaction([tableName], "readwrite")
        .objectStore(tableName)
        .delete(parseInt(id));
           
        request.onsuccess = function(event) {
            window.location = "index.html";
        };
    }
    catch (err) {
        alert(err);
    }
}