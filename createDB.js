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
    let dbExists = true;

    request.onerror = function(e) {
        console.error('Unable to open database.');
    }

    request.onsuccess = function(e) {
        db = e.target.result;        
    }
    
    request.onupgradeneeded = function(e) {
        let db = e.target.result;
        var objectStore = db.createObjectStore(tableName, {keyPath:'id', autoIncrement: true});
        var objectStore1 = db.createObjectStore(tableName1, {keyPath:'id', autoIncrement: true});
        var objectStore2 = db.createObjectStore(tableName2, {keyPath:'id', autoIncrement: true});

        // objectStore1.add({credits: 100, createdAt: new Date()});
        // objectStore2.add({credits: 100, createdAt: new Date()});

        dbExists = false;
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
                showConfirm();                
            } else {
                capturePhoto('frontPhoto');
            }
        };
    } catch(err) {
        navigator.notification.alert( err, function(){}, BCS.alert_box, BCS.ok );
    }
}

// process the confirmation dialog result
function onConfirm(buttonIndex) {
    if (buttonIndex == 1) {
        window.location = 'expand-contact.html';
    } else {
        window.location = 'index.html';
    }
}

// Show a custom confirmation dialog
//
function showConfirm() {
    navigator.notification.confirm(
        BCS.buy_credits_confirmation_box_title,  // message
        onConfirm,                               // callback to invoke with index of button pressed
        BCS.buy_credits_confirmation_box_subtitle, // title
        ''+BCS.pay_now_btn_title+','+ BCS.remind_me_letter_btn_title+''          // buttonLabels
    );
}

function showCredits() {
    try{
        var trans = db.transaction([tableName1], 'readonly');
        var ObjectTras = trans.objectStore(tableName1);

        ObjectTras.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor.value.credits != '') {
                $(".largenumber").html(cursor.value.credits);
                $(".smalltxt").html(BCS.credit);
            }
            $(".expand-contact-text-info span.red-txt").html(cursor.value.credits);
            removeLoading();     
            return true;
        };
    } catch(err) {
        // navigator.notification.alert( err, function(){}, BCS.alert_box, BCS.ok );
        return false;
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
            navigator.notification.alert( BCS.error.error_store_data, function(){}, BCS.alert_box, BCS.ok );
            console.error(e);
        }

        trans.oncomplete = function(e) {
            console.log(e);
            updateCredits();            
        }
    } catch(err) {
        anavigator.notification.alert( err, function(){}, BCS.alert_box, BCS.ok );
    }
}

function updateCredits(cloudSettingsData = null) {
    try{
        var objectStore = db.transaction([tableName1], "readwrite").objectStore(tableName1);
        var objectStoreTitleRequest = objectStore.get(1);

        objectStoreTitleRequest.onsuccess = function() {
            // Grab the data object returned as the result
            var data = objectStoreTitleRequest.result;

            // Update the notified value in the object to "yes"
            if (cloudSettingsData == null) {
                data = {
                    credits: parseInt(data.credits) - 1,
                    updatedAt: new Date(),
                    id: 1
                };
            } else {
                data = cloudSettingsData;
            }

            // Create another request that inserts the item back into the database
            var updateTitleRequest = objectStore.put(data);
            // When this new request succeeds, run the displayData() function again to update the display
            updateTitleRequest.onsuccess = function() {
                addCreditLogs(data.credits);
            };
        };

    } catch(err) {
        console.log(err);
        navigator.notification.alert( err.message, function(){}, BCS.alert_box, BCS.ok );
    }
}

/**
 *   @paremeter credits // interger number
 */
function addCreditLogs(credits = null) {
    try{
        var updatedData = {
            credits : credits,
            createdAt : new Date(),
        }

        let trans = db.transaction([tableName2], 'readwrite');
        let addReq = trans.objectStore(tableName2).add(updatedData);

        addReq.onerror = function(e) {
            navigator.notification.alert( BCS.error.error_store_data_in_creditslog, function(){}, BCS.alert_box, BCS.ok );
            console.error(e);
        }

        trans.oncomplete = function(e) {
            console.log(e);
            updateCreditsInClouds(updatedData);            
        }
    }
    catch(err){
        navigator.notification.alert( err, function(){}, BCS.alert_box, BCS.ok );
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
                if (data.urls != null) { rowData += '<p><i class="fa fa-globe"></i>'+data.urls[0].value+'</p>' };
                if (data.ims != null && data.ims.length > 0) {
                    $.each(data.ims, function(i ,val) {
                        if (data.ims[i].value != null) {
                             rowData += '<span><p><i class="fa fa-'+data.ims[i].type+'"></i>'+data.ims[i].value+'</p></span>';
                        }
                    });
                }

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
        navigator.notification.alert( err, function(){}, BCS.alert_box, BCS.ok );
    }
}

// fill the form after scan card
function fillData(tableData) {
    $("#dataCotent").css("display", "block");
    $.each(tableData, function(index, val) {
        $("#dataCotent").append(val);
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
            $(".searchCardPage").hide();
            $(".card-detail-div").show();
            if(request.result) {

                $(".deleteItem").attr('data-value', cardId);
                if (request.result.data != null ) {
                    $(".card-detail-div img#imgFrnt").attr('src', "data:image/jpeg;base64,"+request.result.data);
                }  else { 
                    $(".card-detail-div img#imgFrnt").hide(); 
                }
                if (request.result.imgBack != null ) {
                    $(".card-detail-div img#imgBck").attr('src', "data:image/jpeg;base64,"+request.result.imgBack);
                } else { 
                    $(".card-detail-div img#imgBck").hide(); 
                }
                var cardTitle = request.result.content.displayName;
                $(".content-blk textarea#cardNotes").val(request.result.content.note);
                if (cardTitle != null) {
                    if (cardTitle.length > 18) {
                        $("h4#cardDetailPageTitle").html(cardTitle.substr(0, 18)+"...");
                    } else {
                        $("h4#cardDetailPageTitle").html(cardTitle.substr(0, 18));
                    }
                } else { $("h4#cardDetailPageTitle").html(BCS.card_detail_page); }

            } 
       };
    }
    catch(err) {
        $(".txtboxes-group-div").show();
        $(".card-detail-div").hide();
        navigator.notification.alert( err, function(){}, BCS.alert_box, BCS.ok ); 
    }
}



function checkInCloudSettings() {
    try {
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

                // Check the credits is avaiable in cloud settings or not....
                cordova.plugin.cloudsettings.exists(function(exists) {
                    // if credits is exists in cloud settings.
                    if(exists) {
                        cordova.plugin.cloudsettings.save(UserCreditData, function(savedSettings){
                            console.log("Settings successfully saved at " + (new Date(savedSettings.timestamp)).toISOString());
                            console.log(savedSettings);
                        }, function(error){
                            console.error("Failed to save settings: " + error);
                        }, false);
                    } else {
                        // if there is no credits exists in cloud settings then add 100 credits in .
                        initDb();
                    }
                });               

            }, false);
        };
    } catch(err) {
       navigator.notification.alert( err.message, function(){}, BCS.alert_box, BCS.ok);
    }
}

function updateCreditsInClouds(data = null) {
	try {
        document.addEventListener("deviceready", function onDeviceReady() {

            var UserCreditData = {
              user: {
                id: device.uuid,
                name: BCS.app_name,
                data: data,
                preferences: {
                  mute: true,
                  locale: 'en_GB'
                }
              }
            };

            // Check the credits is avaiable in cloud settings or not....
            cordova.plugin.cloudsettings.exists(function(exists) {
                // if credits is exists in cloud settings.
                if(exists) {
                    cordova.plugin.cloudsettings.save(UserCreditData, function(savedSettings){
                        console.log("Settings successfully saved at " + (new Date(savedSettings.timestamp)).toISOString());
                        console.log(savedSettings);
                        window.location = "index.html";
                    }, function(error){
                        console.error("Failed to save settings: " + error);
                    }, false);
                } 
            });               

        }, false);
    } catch(err) {
       navigator.notification.alert( err.message, function(){}, BCS.alert_box, BCS.ok);
    }
	
}