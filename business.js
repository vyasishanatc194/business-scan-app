/**
* This Class use for create a FBX object and call the method gobally.
* @class friendsDetails
*/
var imageDataURL = null;
var imageDataURLback = null;
var loading = '<div class="signal"></div>';
var counter = 0;
let db;
let dbVersion = 1;
let dbReady = false;
var tableName = 'scanCard';
var tableName1 = 'credits';
var tableName2 = 'creditsLogs';
var tableData = '';
var DEVICEUID = '';
var TOTAL_CREDITS = 0;

var BusinessDetails = function(){
  // Let's initialise the balance with the value passed as an argument
  // to the function.


  return {
	  
	  capturePhoto: function(cameraType = null) {
        $(".scanCardForm").show();
	    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
	    if (cameraType == 'Front') {
	        navigator.camera.getPicture(onPhotoFrontSuccess, onFail, { quality: 10, allowEdit: false, destinationType: Camera.DestinationType.DATA_URL }); 
	    } else {
	        navigator.camera.getPicture(onPhotoBackSuccess, onFail, { quality: 10, allowEdit: false, destinationType: Camera.DestinationType.DATA_URL }); 
	    }
	    $('select.select-box').each(function(i, val){
	        if(val.value == '') {
	            $(this).closest("div.containerDiv").remove();
	        }
	    });
      },
	  onPhotoFrontSuccess : function(imageData) {
	    $(".middle-container").append(loading);
	    window.Q.ML.Cordova.ocr(imageData, false, function(result) {
	        // Uncomment to view the base64 encoded image data
	        imageDataURL = imageData;
	        if (imageData != null) {
	            $(".cardFrontBtn").hide();
	            $(".cardFrontImg").show().attr('src',  "data:image/jpeg;base64,"+imageData);
	            if ($(".cardFrontImg").attr('src') != "") {
	                $('select.select-box').each(function(i, val){
	                    if(val.value == '') {
	                        $(this).closest("div.containerDiv").remove();
	                    }
	                });
	            }
	        }
	        clearContent(JSON.stringify(result));
	    }, function(error){
	        alert("Error: "+error);
	    })
	  },
	  onPhotoBackSuccess:function(imageData) {
		$(".middle-container").append(loading);
	    window.Q.ML.Cordova.ocr(imageData, false, function(result) {
	        // Uncomment to view the base64 encoded image data
	        imageDataURLback = imageData;
	        if (imageData != null) {
	            $(".cardBackBtn").hide();
	            $(".cardBackImg").show().attr('src',  "data:image/jpeg;base64,"+imageData);
	            if ($(".cardBackImg").attr('src') != "") {
	                $('select.select-box').each(function(i, val){
	                    if(val.value == '') {
	                        $(this).closest("div.containerDiv").remove();
	                    }
	                });
	            }
	        }
	        clearContent(JSON.stringify(result));
	    }, function(error){
	        alert("Error: "+error);
	    })
	  },
	  onFail:function(message) {
		window.location = "index.html";
    	alert(message);
	  },
	  clearContent:function(str) {
	  	var result = [];
		var obj = JSON.parse(str);
		$.each(obj, function( index, value ) {
	    	$.each(value, function( i, j ) {
	  			result.push(j.text);
			});
		});
	    let BCS = BusinessDetails();
		BCS.doAction(result);
	    for (i = 0; i < result.length; i++) {
	        BCS.addFields(result[i]);
	    }
	  },
	  addFields:function(data = '') {
		newTextBoxDiv = $(document.createElement('div')).attr("id", 'TextBoxDiv' + counter).attr("class", 'containerDiv');       

	    newTextBoxDiv.after().html('<div class="row-group clearfix"><div class="box-1"><input type="text" class="input-box"  value="' + data + '" id="textbox' + counter + '" /></div>'+
	        '<div class="box-2"><select data-value="TextBoxDiv'+counter+'" id="select' + counter + '" class="select-box"><option value="" >Select Type</option>'+
	            '<option value="displayName" >'+BCS.full_name+'</option>'+
	            '<option value="phone" >'+BCS.phone+'</option>'+
	            '<option value="email" >'+BCS.email_address+'</option>'+
	            '<option value="address" >'+BCS.address+'</option>'+
	            '<option value="company" >'+BCS.company+'</option>'+
	            '<option value="website" >'+BCS.website+'</option>'+
	            '<option value="twitter" >'+BCS.twitter+'</option>'+
	            '<option value="facebook" >'+BCS.facebook+'</option>'+
	            '<option value="linkedin" >'+BCS.linkedin+'</option>'+
	            '<option value="wechat" >'+BCS.wechat+'</option>'+
	            '<option value="telegram" >'+BCS.telegram+'</option>'+
	            '<option value="others" >'+BCS.others+'</option>'+
	            '</select></div>'+
	            '<div class="box-3"><span class="dlt-div"><a onclick="removeField('+counter+');" id="TextBoxDiv'+counter+'"><img src="images/close-gray.png" alt=""></a></span></div>'+
	            '</div>');

	    newTextBoxDiv.appendTo("#TextBoxesGroup form");
	    counter++;
	  },
	  removeField:function(optionId) {
	    console.log(optionId);
	    var r = confirm(BCS.record_delete_confirmation_text);
	    if (r == true) {
	        $('form div#TextBoxDiv'+optionId).remove();            
	    }
	  },
	  doAction:function(data) {
    	$(".middle-container .signal").remove();
	    $(".middle-container>.clearfix").show();
	    $("#dataCotent, #myInput").hide();
	    $("#contact-form-btn, #TextBoxesGroup, #doSaving").show();
	  },
	  initDb:function() {
		let request = indexedDB.open('scanDB', dbVersion);

		request.onerror = function(e) {
			console.error('Unable to open database.');
		}

		request.onsuccess = function(e) {
			db = e.target.result;
			let BCS = BusinessDetails();
			BCS.doImageListing();
			BCS.showCredits();
			BCS.checkInCloudSettings();
		}

		request.onupgradeneeded = function(e) {
			let db = e.target.result;
			var objectStore = db.createObjectStore(tableName, {keyPath:'id', autoIncrement: true});
			var objectStore1 = db.createObjectStore(tableName1, {keyPath:'id', autoIncrement: true});
			var objectStore2 = db.createObjectStore(tableName2, {keyPath:'id', autoIncrement: true});

			objectStore1.add({credits: 5, createdAt: new Date()});
			objectStore2.add({credits: 5, createdAt: new Date()});

			dbReady = true;		
		}
	  },
	  doFile:function(data, imageDataURLback = null, content) {
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
		            let BCS = BusinessDetails();
		            BCS.createCreditsLog();
		            window.location = "index.html";
		        }
		    } catch(err) {
		        alert(err);
		    }
	  },
	  doImageListing:function() {
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
	  },
	  fillData:function(tableData) {
	   	$("#dataCotent").css("display", "block");
		$.each(tableData, function(index, val) {
			$("#dataCotent").append(val);
		});

		$('.deleteItem').on("click", function(){
			var r = confirm("Are you sure want to delete record?");
			if (r == true) {
				let BCS = BusinessDetails();
				BCS.removeRecord($(this).attr('id'));
			}                    
		});

		$(".cardItem").on("click", function() {
			$(".cardListing").hide();
			$(".scanCardForm").hide();
			$(".cardDetailPage").show();
			var cardId = $(this).attr('id');
			let BCS = BusinessDetails();
			BCS.cardDetailPage(cardId); 
		});
	  },
	  cardDetailPage:function(cardId) {
	  	try {
			var transaction = db.transaction([tableName]);
			var objectStore = transaction.objectStore(tableName);
			var request = objectStore.get(parseInt(cardId));
		   
			request.onerror = function(event) {
			   alert("Unable to retrieve daa from database!");
			};
		   
			request.onsuccess = function(event) {
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
			$(".card-detail-page").hide();
			alert('Detail Page:'+err); 
		}
	  },
	  removeRecord:function(id) {
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
	  },
	  checkInCloudSettings:function() {
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
	  },
	  addCreditLogs:function(credits = null) {
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
	  },
	  createCreditsLog:function() {
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
	            	let BCS = BusinessDetails();
					BCS.addCreditLogs(data.credits);
	            };
	        };

	    } catch(err) {
	        alert(err);
	    }
	  },
	  showCredits:function() {
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
	  },
	  checkCredits:function() {
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
	            	let BCS = BusinessDetails();
	                BCS.capturePhoto('Front');
	            }
	        };
	    } catch(err) {
	        alert(err);
	    }
	  },
	  
  }
  

}

