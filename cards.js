$("#contact-form, #dataCotent").hide();
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
	var stringData = '';
	$.each(obj, function( index, value ) {
    	$.each(value, function( i, j ) {
  			stringData = stringData +" "+ j.text;
		});
	});
	$("#content").val(stringData);
    doAction(stringData);
	// navigator.contacts.create({"displayName": "Test User"});
}

function doAction(str) {
	var $output = [];
	var arraFromString = string_to_array(str);
	$.each(arraFromString, function( index, value ) {
	  if (ValidateEmail(value)) {
	  	$output['email'] = value;
	  } else if (ValidatePhone(value)) {
        if ($output['phone'] != '' && $output['phone'] != undefined) {
            value = $output['phone'] + value;
        } 
        $output['phone'] = value;
	  } else if (value.startsWith('@')) {
	  	$output['twitter'] = value;
	  } else if (value.startsWith('http') || value.startsWith('www')) {
	  	$output['website'] = value;
	  } else {
	  	$output.push(value);
	  }
	});
    
    $("#contact-form").show();
    var arry = $output.email.split("@");

    if (arry[0] != '' && $(".Sfirst").val() == '') {
        $('.Tfirst').val(arry[0]);
        $(".Sfirst").val('displayName');
    } else if ($output.email != '' && $(".Sfirst").val() == '') {
        $('.Tfirst').val($output.email);
        $(".Sfirst").val('email');
    } else if ($output.phone != '' && $(".Sfirst").val() == '') {
        $('.Tfirst').val($output.phone);
        $(".Sfirst").val('phone');
    } else if ($(".Sfirst").val() == ''){
        $('.Tfirst').val(getTheFinalString($output));
        $(".Sfirst").val('others');
    } else {
        console.log('nothing');
    }

    if (arry[0] != '' && $(".Ssecond").val() == '' && $(".Sfirst").val() == '') {
        $('.Tsecond').val(arry[0]);
        $(".Ssecond").val('displayName');
    } else if ($output.email != '' && $(".Ssecond").val() == '') {
        $('.Tsecond').val($output.email);
        $(".Ssecond").val('email');
    } else if ($output.phone != '' && $(".Ssecond").val() == '') {
        $('.Tsecond').val($output.phone);
        $(".Ssecond").val('phone');
    } else if ($(".Ssecond").val() == ''){
        $('.Tsecond').val(getTheFinalString($output));
        $(".Ssecond").val('others');
    } else {
        console.log('nothing');
    }

    if (arry[0] != '' && $(".Sthird").val() == '' && $(".Sfirst").val() == '' && $(".Ssecond").val() == '') {
        $('.Tthird').val(arry[0]);
        $(".Sthird").val('displayName');
    } else if ($output.email != '' && $(".Sthird").val() == '' && $(".Ssecond").val() == '') {
        $('.Tthird').val($output.email);
        $(".Sthird").val('email');
    } else if ($output.phone != '' && $(".Sthird").val() == '') {
        $('.Tthird').val($output.phone);
        $(".Sthird").val('phone');
    } else if ($(".Sthird").val() == ''){
        $('.Tthird').val(getTheFinalString($output));
        $(".Sthird").val('others');
    } else {
        console.log('nothing');
    }

    if (arry[0] != '' && $(".Sthird").val() == '' && $(".Sfirst").val() == '' && $(".Ssecond").val() == '' && $(".Sforth").val() == '') {
        $('.Tforth').val(arry[0]);
        $(".Sforth").val('displayName');
    } else if ($output.email != '' && $(".Sthird").val() == '' && $(".Ssecond").val() == '' && $(".Sforth").val() == '') {
        $('.Tforth').val($output.email);
        $(".Sforth").val('email');
    } else if ($output.phone != '' && $(".Sthird").val() == '' && $(".Sforth").val() == '') {
        $('.Tforth').val($output.phone);
        $(".Sforth").val('phone');
    } else if ($(".Sforth").val() == ''){
        $('.Tforth').val(getTheFinalString($output));
        $(".Sforth").val('others');
    } else {
        console.log('nothing');
    }
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
$("#doContactCreation").on("click", function(event) {

    event.preventDefault();

    $.ajax({
        type: 'POST',
        url: 'ajax.php',
        dataType: 'json',
        data: $( "#contact-form" ).serialize(),
        success: function(results) {
           
            resultArr = JSON.parse(results);
            var myContact = navigator.contacts.create();
            var phoneNumbers = [];
            var emails = [];

            $.each(resultArr, function(i, item) {
                if (i != '' && i != 'undefined') {
                    if (i == "phone"){
                        phoneNumbers[0] = new ContactField('home', item, false);
                        myContact.phoneNumbers = phoneNumbers;
                    }
                    if (i == "email"){
                        emails[0] = new ContactField('home', item, false);
                        myContact.emails = emails;
                    }
                    if (i == "displayName"){
                        myContact.displayName = item;
                        myContact.name = item;
                    }
                    if(i == 'others') {
                        alert(item);
                        myContact.note = item;
                    }
                }
            });

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
           }
            
           function contactError(message) {
              alert('Failed because: ' + message);
           }

        },
        error: function( jqXHR, textStatus, errorThrown ) {
            console.log( 'Could not get posts, server response: ' + textStatus + ': ' + errorThrown );
        }
    }).responseJSON; // <-- this instead of .responseText
});