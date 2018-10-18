$("#content").hide();
$("#contact-form-btn, #TextBoxesGroup, #doSaving").hide();
$(".cardFrontImg, .cardBackImg").hide();
$(".card-detail-page").hide();
var imageDataURL = null;
var imageDataURLback = null;
// var counter = $("#TextBoxesGroup")[0].children.length;
var counter = 0;

$("#capturePhoto").on("click", function() {
   capturePhoto();
});

$("#capturePhoto1").on("click", function() {
   capturePhoto('backSide');
});

function capturePhoto(cameraType = null) {

    $(".scanCardForm").show();
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string
    if (cameraType != null) {
        navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 10, allowEdit: false, destinationType: Camera.DestinationType.DATA_URL }); 
    } else {
        navigator.camera.getPicture(onSuccess, onFail, { quality: 10, allowEdit: false, destinationType: Camera.DestinationType.DATA_URL }); 
    }
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
    window.Q.ML.Cordova.ocr(imageData, false, function(result) {
        // Uncomment to view the base64 encoded image data
        imageDataURL = imageData;

        if (imageDataURL != null) {
            $(".cardBackBtn").hide();
            $(".cardBackImg").show().attr('src',  "data:image/jpeg;base64,"+imageDataURL);
        }

        clearContent(JSON.stringify(result));
    }, function(error){
        alert("Error: "+error);
    })
}
// Called when a photo is successfully retrieved
//
function onSuccess(imageData) {
    window.Q.ML.Cordova.ocr(imageData, false, function(result) {
        // Uncomment to view the base64 encoded image data
        imageDataURLback = imageData;

        if (imageDataURLback != null) {
            $(".cardFrontBtn").hide();
            $(".cardFrontImg").show().attr('src',  "data:image/jpeg;base64,"+imageDataURLback);
        }
        clearContent(JSON.stringify(result));
    }, function(error){
        alert("Error: "+error);
    })
}

// Called if something bad happens.
// 
function onFail(message) {
    alert('Failed because: ' + message);
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
    }

    $(".select-box").on("change", function(){
        console.log($(this).attr('id'));
        var option = $(this).val();
        var optionId = $(this).attr('data-value');

        if (option == 'delete') {
            var r = confirm("Are you sure want to delete record?");
            if (r == true) {
                $('div#'+optionId).remove();
            }
            
        }
    });
}

                        
$("#addButton").click( function () {
    addFields();
});

function addFields(data = '') {

    newTextBoxDiv = $(document.createElement('div')).attr("id", 'TextBoxDiv' + counter);       

    newTextBoxDiv.after().html('<div class="row-group clearfix"><div class="box-1"><input type="text" class="input-box"  value="' + data + '" id="textbox' + counter + '" /></div>'+
        '<div class="box-2"><select data-value="TextBoxDiv'+counter+'" id="select' + counter + '" class="select-box"><option value="" >Select Type</option>'+
            '<option value="displayName" >Full Name</option>'+
            '<option value="phone" >Phone</option>'+
            '<option value="email" >Email Address</option>'+
            '<option value="address" >Address</option>'+
            '<option value="company" >Company</option>'+
            '<option value="website" >Website</option>'+
            '<option value="twitter" >Twitter</option>'+
            '<option value="facebook" >Facebook</option>'+
            '<option value="linkedin" >Linkedin</option>'+
            '<option value="wechat" >WeChat</option>'+
            '<option value="telegram" >Telegram</option>'+
            '<option value="others" >Others</option>'+
            '<option value="delete">Delete</option></select></div>'+
            '</div>');

    newTextBoxDiv.appendTo("#TextBoxesGroup form");
    counter++;
}

function doAction(data) {
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
        for (var i =0; i <= $('#TextBoxesGroup')[0].childElementCount; i++){
            if ($("#textbox"+i).val() != undefined) {
                textboxes.push($("#textbox"+i).val());
            }
            if ($("#select"+i).val() != undefined){
                selectboxes.push($("#select"+i).val());
            }
        }

        $.each(selectboxes, function (i, val) {
            formData[val] = textboxes[i];
        });

        if (formData.phone != undefined) {
            var myContact = navigator.contacts.create();
            var contactObj = new Object();
            var phoneNumbers = [];
            var emails = [];
            var organizations = [];
            var urls = [];
            var addresses = [];

            if (formData.phone != undefined){
                phoneNumbers[0] = new ContactField('home', formData.phone, false);
                myContact.phoneNumbers = phoneNumbers;
                contactObj.phoneNumbers = formData.phone;
            }
            if (formData.email != undefined){
                emails[0] = new ContactField('home', formData.email, false);
                myContact.emails = emails;
                contactObj.emails = formData.email;
            }
            if (formData.company != undefined){
                organizations[0] = new ContactField('work', formData.company, false);
                myContact.organizations = organizations;
                contactObj.organizations = formData.company;
            }
            if (formData.website != undefined){
                urls[0] = new ContactField('work', formData.website, false);
                myContact.urls = urls;
                contactObj.urls = formData.website;
            }
            if (formData.address != undefined){
                addresses[0] = new ContactField('work', formData.address, false);
                myContact.addresses = addresses;
                contactObj.addresses = formData.address;
            }
            if (formData.displayName != undefined){
                myContact.displayName = formData.displayName;
                myContact.name = formData.displayName;
                contactObj.displayName = formData.displayName;
            }
            if(document.getElementById("formNotes") != '') {
                myContact.note = $("#formNotes").val();
                contactObj.note = $("#formNotes").val();
            }
            
            myContact.save(contactSuccess, contactError);
                        
            function contactSuccess() {
                console.log(contactObj);
                alert("Contact is saved!");
                doFile(imageDataURL, imageDataURLback, myContact);
                $("#contact-form-btn, #TextBoxesGroup, #doSaving").hide();
                $("#dataCotent, #myInput").show();
            }
            
            function contactError(message) {
                alert('Failed because: ' + message);
            }
        } else {
            alert('Please enter phonenumber!');
        }
    }
    catch(err){ 
        alert(err); 
    }   
});