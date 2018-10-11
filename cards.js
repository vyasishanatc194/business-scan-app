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
	// $("#content").val(stringData);
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
	// var $output = [];
	// var arraFromString = string_to_array(str);
    $("#dataCotent").hide();
    $("#contact-form-btn, #TextBoxesGroup, #doSaving").show();



	// $.each(arraFromString, function( index, value ) {
	//   if (ValidateEmail(value)) {
	//   	$output['email'] = value;
	//   } else if (ValidatePhone(value)) {
 //        if ($output['phone'] != '' && $output['phone'] != undefined) {
 //            value = $output['phone'] + value;
 //        } 
 //        $output['phone'] = value;
	//   } else if (value.startsWith('@')) {
	//   	$output['twitter'] = value;
	//   } else if (value.startsWith('http') || value.startsWith('www')) {
	//   	$output['website'] = value;
	//   } else {
	//   	$output.push(value);
	//   }
	// });
    
 //    var arry = $output.email.split("@");

 //    if (arry[0] != '' && $(".Sfirst").val() == '') {
 //        $('.Tfirst').val(arry[0]);
 //        $(".Sfirst").val('displayName');
 //    } else if ($output.email != '' && $(".Sfirst").val() == '') {
 //        $('.Tfirst').val($output.email);
 //        $(".Sfirst").val('email');
 //    } else if ($output.phone != '' && $(".Sfirst").val() == '') {
 //        $('.Tfirst').val($output.phone);
 //        $(".Sfirst").val('phone');
 //    } else if ($(".Sfirst").val() == ''){
 //        $('.Tfirst').val(getTheFinalString($output));
 //        $(".Sfirst").val('others');
 //    } else {
 //        console.log('nothing');
 //    }

 //    if (arry[0] != '' && $(".Ssecond").val() == '' && $(".Sfirst").val() == '') {
 //        $('.Tsecond').val(arry[0]);
 //        $(".Ssecond").val('displayName');
 //    } else if ($output.email != '' && $(".Ssecond").val() == '') {
 //        $('.Tsecond').val($output.email);
 //        $(".Ssecond").val('email');
 //    } else if ($output.phone != '' && $(".Ssecond").val() == '') {
 //        $('.Tsecond').val($output.phone);
 //        $(".Ssecond").val('phone');
 //    } else if ($(".Ssecond").val() == ''){
 //        $('.Tsecond').val(getTheFinalString($output));
 //        $(".Ssecond").val('others');
 //    } else {
 //        console.log('nothing');
 //    }

 //    if (arry[0] != '' && $(".Sthird").val() == '' && $(".Sfirst").val() == '' && $(".Ssecond").val() == '') {
 //        $('.Tthird').val(arry[0]);
 //        $(".Sthird").val('displayName');
 //    } else if ($output.email != '' && $(".Sthird").val() == '' && $(".Ssecond").val() == '') {
 //        $('.Tthird').val($output.email);
 //        $(".Sthird").val('email');
 //    } else if ($output.phone != '' && $(".Sthird").val() == '') {
 //        $('.Tthird').val($output.phone);
 //        $(".Sthird").val('phone');
 //    } else if ($(".Sthird").val() == ''){
 //        $('.Tthird').val(getTheFinalString($output));
 //        $(".Sthird").val('others');
 //    } else {
 //        console.log('nothing');
 //    }

 //    if (arry[0] != '' && $(".Sthird").val() == '' && $(".Sfirst").val() == '' && $(".Ssecond").val() == '' && $(".Sforth").val() == '') {
 //        $('.Tforth').val(arry[0]);
 //        $(".Sforth").val('displayName');
 //    } else if ($output.email != '' && $(".Sthird").val() == '' && $(".Ssecond").val() == '' && $(".Sforth").val() == '') {
 //        $('.Tforth').val($output.email);
 //        $(".Sforth").val('email');
 //    } else if ($output.phone != '' && $(".Sthird").val() == '' && $(".Sforth").val() == '') {
 //        $('.Tforth').val($output.phone);
 //        $(".Sforth").val('phone');
 //    } else if ($(".Sforth").val() == ''){
 //        $('.Tforth').val(getTheFinalString($output));
 //        $(".Sforth").val('others');
 //    } else {
 //        console.log('nothing');
 //    }
}

function getTheFinalString($output) {
    var str = '';
    $.each($output, function(idx,val) { 
      if ((typeof idx) == 'number') {
        str = str +' '+val;
      }
    });
    return str;
}

string_to_array = function (str) {
	newString = str.replace(/\s+/g,' ').trim();
    return newString.trim().split(" ");
};

function ValidateEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    return (false)
}

function ValidatePhone(phone) 
{
 if (/^[0-9-()+]+$/.test(phone) && phone.length > 2)
  {
    return (true)
  }
    return (false)
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
        alert($('#TextBoxesGroup')[0].childElementCount);
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
            alert(val);
            formData[val] = textboxes[i];
        });
        if (formData.phone != undefined) {
            // resultArr = JSON.parse(formData);
            var myContact = navigator.contacts.create();
            var phoneNumbers = [];
            var emails = [];
            alert('formdata array');
            alert(formData);
            // $.each(formData, function(i, item) {
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
            // });

            myContact.save(contactSuccess, contactError);
            navigator.contacts.pickContact(function(myContact){
                alert(myContact.displayName);
            },function(err){
                alert('Error: ' + err);
            });
            
            function contactSuccess() {
                alert("Contact is saved!");
                var smallImage = document.getElementById('myImage');
                smallImage.style.display = 'block';
                alert(imageDataURL);
                smallImage.src = "data:image/jpeg;base64," + imageDataURL;
                doFile(imageDataURL);
                $("#contact-form").hide();
                $("#dataCotent").show();
            }
            
            function contactError(message) {
                alert('Failed because: ' + message);
            }
        }
    }
    catch(err){ 
        alert(err); 
    }   
});