$("#content").hide();
$("#contact-form-btn, #TextBoxesGroup, #doSaving").hide();
$(".cardFrontImg, .cardBackImg").hide();
$(".middle-container>.clearfix").hide();
var imageDataURL = null;
var imageDataURLback = null;
var loading = '<div class="signal"></div>';
var counter = 0;


$("#capturePhoto").on("click", function() {
   let BCS = BusinessDetails();
   BCS.capturePhoto();
});

$("#capturePhoto1").on("click", function() {
   let BCS = BusinessDetails();
   BCS.capturePhoto('backSide');
});
                      
$("#addButton").click( function () {
    let BCS = BusinessDetails();
	BCS.addFields();
});

$("#listCards").on("click", function(){
	let BCS = BusinessDetails();
    BCS.doImageListing();
});

// Contact Saving in mobile device
$("#doSaving").on("click", function(event) {
    try {

        event.preventDefault();
        var textboxes = [];
        var formData = [];
        var selectboxes = [];

        for (var i = 0; i < $('input[type="text"]').length; i++){
            if ($('input[type="text"]')[i].value != '') {
                textboxes.push($('input[type="text"]')[i].value);
            }
            if ($('select.select-box')[i].value != ''){
                selectboxes.push($('select.select-box')[i].value);
            }
        }
        var txt = '';
        var notes = '';
        $('select.select-box').each(function(i, val){
            if(val.value == '') {
                txt += $(this).parent().parent()[0].children[0].children[0].value;
            } else {
                formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value;
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
            console.log(formData);

            if (formData.phone != undefined) {
                var phnNo = formData.phone;
                var phneNo = phnNo.replace(/\D/g,'');
                phoneNumbers[0] = new ContactField(BCS.home, phneNo, false);
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
                emails[0] = new ContactField(BCS.home, formData.email, false);
                myContact.emails = emails;
            }
            if (formData.website != undefined) {
                urls[0] = new ContactField(BCS.work, formData.website, false);
                myContact.urls = urls;
            }
            

            if (formData.company != undefined) {
                organizations[0] = new ContactOrganization('', 'name', formData.company, '', '');
                myContact.organizations = organizations;
            }

            if (formData.address != undefined) {
                addresses[0] = new ContactAddress('', 'home', '' , formData.address, '', '' , '', '');
                myContact.addresses = addresses;
            }

            if(document.getElementById("formNotes") != '') {
                notes = $("#formNotes").val()+' '+txt;
            }
            myContact.note = notes;
     
            myContact.save(contactSuccess, contactError);
            function contactSuccess() {
                alert(BCS.contact_saved_title);
                let BCS = BusinessDetails();
                BCS.doFile(imageDataURL, imageDataURLback, myContact);
                $("#contact-form-btn, #TextBoxesGroup, #doSaving").hide();
                $("#dataCotent, #myInput").show();
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


document.addEventListener('DOMContentLoaded', () => {
    let BCS = BusinessDetails();
	BCS.initDb();
});