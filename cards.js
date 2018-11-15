$("#content").hide();
$("#contact-form-btn, #TextBoxesGroup, #doSaving").hide();
$(".cardFrontImg, .cardBackImg").hide();
$(".middle-container>.clearfix").hide();
var imageDataURL = null;
var imageDataURLback = null;
var counter = 0;

$("#capturePhoto").on("click", function() {
   capturePhoto('Front');
});

$("#capturePhoto1").on("click", function() {
   capturePhoto('Back');
});

function addLoading() {
    var loading = '<div class="signal"></div>';
    $(".loading-box").show();
    $(".loading-box").append(loading);
}
function removeLoading() {
    var loading = '<div class="signal"></div>';
    $(".loading-box").hide();
    $(".loading-box .signal").remove();
}


function capturePhoto(cameraType = null) {
    $(".scanCardForm").show();
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    if (cameraType == 'Front') {
        navigator.camera.getPicture(onPhotoFrontSuccess, onFailFrontCamera, { quality: 10, allowEdit: false, destinationType: Camera.DestinationType.DATA_URL }); 
    } else {
        navigator.camera.getPicture(onPhotoBackSuccess, onFailBackCamera, { quality: 10, allowEdit: false, destinationType: Camera.DestinationType.DATA_URL }); 
    }
}
// Called when a photo is successfully retrieved
//
function onPhotoFrontSuccess(imageData) {
    addLoading();
    $(".scanCardForm div.middle-container").css('position', 'fixed');
    window.Q.ML.Cordova.ocr(imageData, true, function(result) {
        // Uncomment to view the base64 encoded image data
        handleFrontPhotoSuccess(imageData, result);
    }, function(error){
        window.Q.ML.Cordova.ocr(imageData, false, function(result) {
            // Uncomment to view the base64 encoded image data
            handleFrontPhotoSuccess(imageData, result);
        }, function(error) {
            navigator.notification.alert( error, function(){}, BCS.alert_box, BCS.ok );
            window.location = "index.html";
        })
    })
}

function handleFrontPhotoSuccess(imageData, result) {
    removeLoading();
    $(".scanCardForm div.middle-container").css('position', 'relative');
    imageDataURL = imageData;
    if (imageData != null) {
        $(".cardFrontBtn").hide();
        $(".cardFrontImg").show().attr('src',  "data:image/jpeg;base64,"+imageData);
        if ($(".cardFrontImg").attr('src') != "") {
            autoRemoveFields('frontPhoto');
        }
    }
    clearContent(JSON.stringify(result),  'frontPhoto');
}

// Called if something bad happens.
// 
function onFailFrontCamera(message) {
    removeLoading();
    $(".scanCardForm div.middle-container").css('position', 'relative');
    if ($(".cardFrontImg").attr('src') == "") {
        navigator.notification.alert( message, function(){ window.location = "index.html"; }, BCS.alert_box, BCS.ok );
    }
    $('input[type="text"]').each(function(i, val) {
        if(val.value == '') {
            window.location = "index.html";
        }
    });  
}

// Called when a photo is successfully retrieved
//
function onPhotoBackSuccess(imageData) {
    addLoading();
    $(".scanCardForm div.middle-container").css('position', 'fixed');
    window.Q.ML.Cordova.ocr(imageData, true, function(result) {
        // Uncomment to view the base64 encoded image data
        handleBackPhotoSuccess(imageData, result);
    }, function(error){
         window.Q.ML.Cordova.ocr(imageData, false, function(result) {
            // Uncomment to view the base64 encoded image data
            handleBackPhotoSuccess(imageData, result);
        }, function(error) {
            navigator.notification.alert( error, function(){}, BCS.alert_box, BCS.ok );
            window.location = "index.html";
        })
    })
}

function handleBackPhotoSuccess(imageData, result) {
    removeLoading();
    $(".scanCardForm div.middle-container").css('position', 'relative');
    imageDataURLback = imageData;
    if (imageData != null) {
        $(".cardBackBtn").hide();
        $(".cardBackImg").show().attr('src',  "data:image/jpeg;base64,"+imageData);
        if ($(".cardBackImg").attr('src') != "") {
            autoRemoveFields('backPhoto');
        }
    }
    clearContent(JSON.stringify(result), 'backPhoto');
}
// Called if something bad happens.
// 
function onFailBackCamera(message) {
    removeLoading();
    $(".scanCardForm div.middle-container").css('position', 'relative');
    if ($(".cardBackImg").attr('src') == "") {
        navigator.notification.alert( message, function(){ }, BCS.alert_box, BCS.ok );
    }
    $('input[type="text"]').each(function(i, val) {
        if(val.value == '') {
            window.location = "index.html";
        }
    });    
}

function autoRemoveFields(side = '') {
    $('select.select-box').each(function(i, val) {
        if(val.value == '' && side != '') {
            $(this).closest("div."+side).remove();
        }
    });
}

function clearContent(str, side) {
	var result = [];
	var obj = JSON.parse(str);
	$.each(obj, function( index, value ) {
    	$.each(value, function( i, j ) {
  			result.push(j.text);
		});
	});
    doAction(result);

    for (i = 0; i < result.length; i++) {
        addFields(result[i], side);
        $('.select-box').select2({
            minimumResultsForSearch: -1
        }); 
    }    
}
                        
$("#addButton").click( function () {
    addFields();
    $('.select-box').select2({
        minimumResultsForSearch: -1
    }); 
});

function addFields(data = '', side = '') {
    newTextBoxDiv = $(document.createElement('div')).attr("id", 'TextBoxDiv' + counter).attr("class", 'containerDiv '+side);       

    newTextBoxDiv.after().html('<div class="row-group clearfix"><div class="box-1"><input type="text" class="input-box"  value="' + data + '" id="textbox' + counter + '" /></div>'+
        '<div class="box-2"><select data-value="TextBoxDiv'+counter+'" id="select' + counter + '" class="select-box"><option value="" >Select Type</option>'+
            '<option value="displayName" >'+BCS.full_name+'</option>'+
            '<option value="phone" >'+BCS.phone+'</option>'+
            '<option value="email" >'+BCS.email_address+'</option>'+
            '<option value="position" >'+BCS.position+'</option>'+
            '<option value="address" >'+BCS.address+'</option>'+
            '<option value="company" >'+BCS.company+'</option>'+
            '<option value="website" >'+BCS.website+'</option>'+
            '<option value="twitter" >'+BCS.twitter+'</option>'+
            '<option value="facebook" >'+BCS.facebook+'</option>'+
            '<option value="skype" >'+BCS.skype+'</option>'+
            '<option value="linkedin" >'+BCS.linkedin+'</option>'+
            '<option value="wechat" >'+BCS.wechat+'</option>'+
            '<option value="telegram" >'+BCS.telegram+'</option>'+
            '<option value="others" >'+BCS.others+'</option>'+
            '</select></div>'+
            '<div class="box-3"><span class="dlt-div"><a onclick="removeField('+counter+');" id="TextBoxDiv'+counter+'"><img src="images/close-gray.png" alt=""></a></span></div>'+
            '</div>');

    newTextBoxDiv.appendTo("#TextBoxesGroup form");
    counter++;
}

// remove dynamic fields
function removeField(optionId){
    var r = confirm(BCS.record_delete_confirmation_text);
    if (r == true) {
        $('form div#TextBoxDiv'+optionId).remove();            
    }
}

function doAction(data) {
    $(".middle-container .signal").remove();
    $(".middle-container>.clearfix").show();
    $("#dataCotent, #myInput").hide();
    $("#contact-form-btn, #TextBoxesGroup, #doSaving").show();
}

$("#listCards").on("click", function(){
    doImageListing();
});

// Contact Saving in mobile device
$("#doSaving").on("click", function(event) {
    try {
        event.preventDefault();
        var textboxes = [];
        var selectboxes = [];
        var formData = []; 
        for (var i = 0; i < $('input[type="text"]').length; i++){
            if ($('input[type="text"]')[i].value != '') {
                textboxes.push($('input[type="text"]')[i].value);
            }
            if ($('select.select-box')[i].value != ''){
                selectboxes.push($('select.select-box')[i].value);
            }
        }

        var address = [];
        var phone = [];
        var email = [];
        var website = [];
        var txt = '';
        var notes = '';
        var flag = 1;
        $('select.select-box').each(function(i, val){
            if(val.value == '') {
                txt += $(this).parent().parent()[0].children[0].children[0].value;
                txt += '\n';
            } else {
                if (val.value == 'address') {
                    address.push($(this).parent().parent()[0].children[0].children[0].value);
                    formData[val.value] = address;
                }  else if (val.value == 'phone') {
                    phone.push($(this).parent().parent()[0].children[0].children[0].value);
                    formData[val.value] = phone;
                } else if (val.value == 'email') {
                    email.push($(this).parent().parent()[0].children[0].children[0].value);
                    formData[val.value] = email;
                } else if (val.value == 'website') {
                    website.push($(this).parent().parent()[0].children[0].children[0].value);
                    formData[val.value] = website;
                } else if (val.value == 'facebook') {
                    formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value;
                } else if (val.value == 'twitter') {
                    formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value;
                } else if (val.value == 'skype') {
                    formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value;
                } else if (val.value == 'linkedin') {
                    formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value;
                } else if (val.value == 'wechat') {
                    formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value;
                } else if (val.value == 'telegram') {
                    formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value;
                } else {
                    formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value;
                }
                flag = 0;
            }
        });

        function alertDismissed() {
            return false;
        }
        
        if (flag == 0) {
            document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
                var myContact = navigator.contacts.create();

                var phoneNumbers = [];
                var organizations = [];
                var addresses = [];
                var urls = [];
                var nm = [];
                var emails = [];
                var IM = [];

                if (formData.phone != undefined) {
                    $.each(formData.phone, function(i, val){
                        var phnNo = formData.phone[i];
                        var phneNo = phnNo.replace(/\D/g,'');
                        phoneNumbers.push(new ContactField(BCS.work, phneNo, false));
                    });
                    myContact.phoneNumbers = phoneNumbers;
                }

                if (formData.displayName != undefined) {
                    var Username = [];
                    myContact.displayName = formData.displayName;
                    var dName = formData.displayName;
                    
                    nm = dName.split(" ");
                    if (nm.length > 0) {
                        if (nm[0] != undefined) {
                            Username.nickname = nm[0];
                        }
                        if (nm[1] != undefined) {
                            Username.firstname = nm[1];
                        }
                        if (nm[2] != undefined) {
                            Username.lastname = nm[2];
                        }
                        myContact.name = Username;
                    }
                }

                if (formData.email != undefined) {
                    $.each(formData.email, function(i, val){
                        emails.push(new ContactField(BCS.work, formData.email[i], false));
                    });
                    myContact.emails = emails;
                }

                if (formData.website != undefined) {
                    $.each(formData.website, function(i, val){
                        urls.push(new ContactField('website', formData.website[i], false));
                    });
                    myContact.urls = urls;
                }        

                if (formData.company != undefined) {
                    organizations.push(new ContactOrganization('', BCS.work, formData.company, '', formData.position));
                    myContact.organizations = organizations;
                }

                if (formData.address != undefined) {
                    $.each(formData.address, function(i, val){
                        addresses.push(new ContactAddress('', BCS.work, '' , formData.address[i], '', '' , '', ''));
                    });
                    myContact.addresses = addresses;
                }

                if (formData.facebook != undefined) {
                    IM.push(new ContactField('facebook', formData.facebook, false));
                }
                if (formData.twitter != undefined) {
                    IM.push(new ContactField('twitter', formData.twitter, false));
                }
                if (formData.skype != undefined) {
                    IM.push(new ContactField('skype', formData.skype, false));
                }
                if (formData.linkedin != undefined) {
                    IM.push(new ContactField('linkedin', formData.linkedin, false));
                }
                if (formData.wechat != undefined) {
                    IM.push(new ContactField('wechat', formData.wechat, false));
                }
                if (formData.telegram != undefined) {
                    IM.push(new ContactField('telegram', formData.telegram, false));
                }
                myContact.ims = IM;
                

                if(document.getElementById("formNotes") != '') {
                    notes = $("#formNotes").val()+'\n'+txt;
                }
                myContact.note = notes;
         
                myContact.save(contactSuccess, contactError);
                function contactSuccess() {
                    navigator.notification.alert( BCS.contact_saved_title, function(){}, BCS.alert_box, BCS.ok );
                    doFile(imageDataURL, imageDataURLback, myContact);
                    $("#contact-form-btn, #TextBoxesGroup, #doSaving").hide();
                    $("#dataCotent, #myInput").show();
                }
                
                function contactError(message) {
                    alert('Failed because: ' + message);
                }
            }
        } else {
            navigator.notification.alert(
                BCS.alert_msg_when_no_item_selected,  // message
                alertDismissed,         // callback
                BCS.alert_box,            // title
                BCS.ok            // buttonName
            );
        }        
    }
    catch(err){ 
        console.log(err);
        alert(err); 
    }   
});