$("#content").hide();
$("#contact-form-btn, #TextBoxesGroup, #doSaving").hide();
$(".cardFrontImg, .cardBackImg").hide();
$(".middle-container>.clearfix").hide();
var imageDataURL = null;
var imageDataURLback = null;
var loading = '<div class="signal"></div>';
var counter = 0;

$("#capturePhoto").on("click", function() {
   capturePhoto('Front');
});

$("#capturePhoto1").on("click", function() {
   capturePhoto('Back');
});


function capturePhoto(cameraType = null) {

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
}

// Called when a photo is successfully retrieved
//
function onPhotoFrontSuccess(imageData) {
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
}
// Called when a photo is successfully retrieved
//
function onPhotoBackSuccess(imageData) {
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
}

// Called if something bad happens.
// 
function onFail(message) {
    window.location = "index.html";
    alert(message);
}

function clearContent(str) {
	var result = [];
	var obj = JSON.parse(str);
	$.each(obj, function( index, value ) {
    	$.each(value, function( i, j ) {
  			result.push(j.text);
		});
	});
    doAction(result);

    for (i = 0; i < result.length; i++) {
        addFields(result[i]);
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

function addFields(data = '') {

    newTextBoxDiv = $(document.createElement('div')).attr("id", 'TextBoxDiv' + counter).attr("class", 'containerDiv');       

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
    console.log(optionId);
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
        var formData = [];
        var selectboxes = [];
        var arrAddress = [];
        var arrPhone = [];
        var arrEmail = [];

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
                } else {
                    formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value;
                }
            }
        });


        document.addEventListener("deviceready", onDeviceReady, false);
        function onDeviceReady() {
            var myContact = navigator.contacts.create();

            var phoneNumbers = [];
            var organizations = [];
            var addresses = [];
            var urls = [];
            var nm = [];
            var emails = [];

            if (formData.phone != undefined) {
                $.each(formData.phone, function(i, val){
                    var phnNo = formData.phone[i];
                    var phneNo = phnNo.replace(/\D/g,'');
                    phoneNumbers.push(new ContactField('', phneNo, false));
                });
                myContact.phoneNumbers = phoneNumbers;
            }

            if (formData.displayName != undefined) {
                myContact.displayName = formData.displayName;
                myContact.name = formData.displayName;
                var dName = formData.displayName;
                nm = dName.split(" ");
                if (nm.length > 0) {
                    if (nm[0] != undefined) {
                        myContact.nickname = nm[0];
                    }
                    if (nm[2] != undefined) {
                        myContact.name = nm[2];
                    }
                }
            }

            if (formData.email != undefined) {
                $.each(formData.email, function(i, val){
                    emails.push(new ContactField('', formData.email[i], false));
                });
                myContact.emails = emails;
            }

            if (formData.website != undefined) {
                $.each(formData.website, function(i, val){
                    urls.push(new ContactField('', formData.website[i], false));
                });
                myContact.urls = urls;
            }        

            if (formData.company != undefined) {
                $.each(formData.email, function(i, val){
                    emails.push(new ContactOrganization('', formData.email[i], false));
                });
                myContact.emails = emails;
            }

            if (formData.address != undefined) {
                $.each(formData.address, function(i, val){
                    addresses.push(new ContactAddress('', '', '' , formData.address[i], '', '' , '', ''));
                });
                myContact.addresses = addresses;
            }

            if(document.getElementById("formNotes") != '') {
                notes = $("#formNotes").val()+' '+txt;
            }
            myContact.note = notes;
     
            myContact.save(contactSuccess, contactError);
            function contactSuccess() {
                alert(BCS.contact_saved_title);
                doFile(imageDataURL, imageDataURLback, myContact);
                $("#contact-form-btn, #TextBoxesGroup, #doSaving").hide();
                $("#dataCotent, #myInput").show();
            }
            
            function contactError(message) {
                alert('Failed because: ' + message);
            }
        }
    }
    catch(err){ 
        console.log(err);
        alert(err); 
    }   
});