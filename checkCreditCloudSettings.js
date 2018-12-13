function updateCreditOnce(cloudSettingsData = null) {
    try{
        var objectStore = db.transaction([tableName1], "readwrite").objectStore(tableName1);
        var objectStoreTitleRequest = objectStore.get(1);

        objectStoreTitleRequest.onsuccess = function() {
            data = cloudSettingsData;
            // Create another request that inserts the item back into the database
            var updateTitleRequest = objectStore.put(data);
            // When this new request succeeds, run the displayData() function again to update the display
            updateTitleRequest.onsuccess = function() {
                console.log('update data in DB from cloud settings successfully.');
                return true;
            };
        };

    } catch(err) {
        console.log(err);
        navigator.notification.alert( err.message, function(){}, BCS.alert_box, BCS.ok );
    }
}

function checkCreditsInCloudSettingOnce() {
    // Check the credits is avaiable in cloud settings or not....
    document.addEventListener("deviceready", function onDeviceReady() {

         cordova.plugin.cloudsettings.exists(function(exists) {
            // if credits is exists in cloud settings.
            if(exists) {
                console.log(exists);
                cordova.plugin.cloudsettings.load(function(settings) {
                    console.log('update data in DB from cloud settings');
                    console.log(settings.user.data);
                    updateCreditOnce(settings.user.data);
                }, function(error) {
                    navigator.notification.alert( error, function(){}, BCS.alert_box, BCS.ok);
                });
            } else {
                // if there is no credits exists in cloud settings then add 100 credits in .
                checkCreditsInDBOnce();
            }
        });
    }, false);         
}

function checkCreditsInDBOnce() {
    try {
        var objectStore = db.transaction([tableName1], "readwrite").objectStore(tableName1);
        var objectStoreTitleRequest = objectStore.get(1);

        objectStoreTitleRequest.onsuccess = function(success) {
            // Grab the data object returned as the result
            var data = objectStoreTitleRequest.result;
            alert('checkCreditsInDBOnce');
            console.log(success.target.result);
            if (success.target.result) {
                
            } else {
                addCreditInCreditsDBOnce();
            }
        };
    } catch(err) {
       navigator.notification.alert( err.message, function(){}, BCS.alert_box, BCS.ok);
    }    
}


function addCreditInCreditsDBOnce() {
    try{
        var data = {credits: 100, createdAt: new Date(), id: 1};

        let trans = db.transaction([tableName2], 'readwrite');
        let addReq = trans.objectStore(tableName2).add(data);

        addReq.onerror = function(e) {
            navigator.notification.alert( BCS.error.error_store_data_in_creditslog, function(){}, BCS.alert_box, BCS.ok );
            console.error(e);
        }

        trans.oncomplete = function(e) {
            console.log('addCreditInCreditsDBOnce');
            updateCreditsInCloudOnce(data);
        }
    }
    catch(err){
        navigator.notification.alert( err, function(){}, BCS.alert_box, BCS.ok );
    }
}

function updateCreditsInCloudOnce(data = null) {
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

            cordova.plugin.cloudsettings.save(UserCreditData, function(savedSettings){
                console.log("Settings successfully saved at " + (new Date(savedSettings.timestamp)).toISOString());
                // console.log(savedSettings);
                window.location = "index.html";
            }, function(error){
                console.error("Failed to save settings: " + error);
            }, false);            

        }, false);
    } catch(err) {
       navigator.notification.alert( err.message, function(){}, BCS.alert_box, BCS.ok);
    }
}