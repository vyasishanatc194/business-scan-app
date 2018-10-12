$("#content").hide();
$("#contact-form-btn, #TextBoxesGroup, #doSaving").hide();
$("#dataCotent").hide();
var imageDataURL = null;
$("#capturePhoto").on("click", function() {
   capturePhoto();
});

function capturePhoto() {
    // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 10, allowEdit: false, destinationType: Camera.DestinationType.DATA_URL }); 
}

// Called when a photo is successfully retrieved
//
function onPhotoDataSuccess(imageData) {
    window.Q.ML.Cordova.ocr(imageData, false, function(result) {
        // Uncomment to view the base64 encoded image data
        imageDataURL = imageData;
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
}

var counter = 1;
                        
$("#addButton").click(function () {
    addFields();
});

function addFields(data = '') {
    if(counter > 20) {
        alert("Only 20 fields allow");
        return false;
    }
    var newTextBoxDiv = $(document.createElement('div')).attr("id", 'TextBoxDiv' + counter);       

    newTextBoxDiv.after().html('<div class="box-1 clearfix"><div class="cols-1" ><input type="text" name="enteredContent'+ counter +'" class="form-control width100" value="' + data + '" name="textbox' + counter + 
          '" id="textbox' + counter + '" value="" ></div><div class="cols-2"><select  name="selectedFields'+ counter +'" id="select' + counter + '" class="form-control width100"><option value="" >Select Type</option>'+
            '<option value="displayName" >Full Name</option>'+
            '<option value="phone" >Phone</option>'+
            '<option value="email" >Email Address</option>'+
            '<option value="address" >Address</option>'+
            '<option value="twitter" >Twitter</option>'+
            '<option value="facebook" >Facebook</option>'+
            '<option value="linkedin" >Linkedin</option>'+
            '<option value="wechat" >WeChat</option>'+
            '<option value="telegram" >Telegram</option>'+
            '<option value="others" >Others</option></select></div></div>');

    newTextBoxDiv.appendTo("#TextBoxesGroup");
    counter++;
}

function doAction(data) {
    $("#dataCotent").hide();
    $("#contact-form-btn, #TextBoxesGroup, #doSaving").show();
}

$("#listCards").on("click", function(){
    alert("Go for listing..");
    doImageListing();
});

// Cretae contact in mobile device
$("#doSaving").on("click", function(event) {
    try
        {
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
            var phoneNumbers = [];
            var emails = [];

            if (formData.phone != undefined){
                phoneNumbers[0] = new ContactField('home', formData.phone, false);
                myContact.phoneNumbers = phoneNumbers;
            }
            if (formData.email != undefined){
                emails[0] = new ContactField('home', formData.email, false);
                myContact.emails = emails;
            }
            if (formData.displayName != undefined){
                myContact.displayName = formData.displayName;
                myContact.name = formData.displayName;
            }
            if(formData.others != undefined) {
                myContact.note = formData.others;
            }
            
            myContact.save(contactSuccess, contactError);
            
            // navigator.contacts.pickContact(function(myContact){
            //     // alert(myContact.displayName);
            // },function(err){
            //     alert('Error: ' + err);
            // });
            
            function contactSuccess() {
                alert("Contact is saved!");
                // var smallImage = document.getElementById('myImage');
                // smallImage.style.display = 'block';
                // alert(imageDataURL);
                // smallImage.src = "data:image/jpeg;base64," + imageDataURL;
                var msg = '';
                for(i=1; i<counter; i++){
                    msg += " " + $('#textbox' + i).val();
                }
                doFile(imageDataURL, msg);
                $("#contact-form-btn, #TextBoxesGroup, #doSaving").hide();
                $("#dataCotent").show();
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