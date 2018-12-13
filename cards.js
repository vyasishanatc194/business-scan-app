$("#content").hide();
$("#contact-form-btn, #TextBoxesGroup, #doSaving").hide();
$(".cardFrontImg, .cardBackImg").hide();
$(".middle-container>.clearfix").hide();
var imageDataURL = null;

var imageDataURLback = null;      
var counter = 0;
var clickFlag = 0;
$("#capturePhoto").on("click", function() {
    capturePhoto('frontPhoto');
    clickFlag = 1
});
$("#capturePhoto1").on("click", function() {
    capturePhoto('backPhoto')
});

function addLoading() {
    var loading = '<div class="signal"></div>';
    $(".loading-box").show();
    $(".loading-box").append(loading)
}

function removeLoading() {
    var loading = '<div class="signal"></div>';
    $(".loading-box").hide();
    $(".loading-box .signal").remove()
}

function capturePhoto(cameraType = null) {
    $(".scanCardForm").show();
    if (cameraType == 'frontPhoto') {
        navigator.camera.getPicture(onPhotoFrontSuccess, onFailFrontCamera, {
            quality: 10,
            allowEdit: !1,
            destinationType: Camera.DestinationType.DATA_URL
        })
    } else {
        navigator.camera.getPicture(onPhotoBackSuccess, onFailBackCamera, {
            quality: 10,
            allowEdit: !1,
            destinationType: Camera.DestinationType.DATA_URL
        })
    }
}

function onPhotoFrontSuccess(imageData) {
    addLoading();
    $(".scanCardForm div.middle-container").css('position', 'fixed');
    window.Q.ML.Cordova.ocr(imageData, !0, function(result) {
        handleFrontPhotoSuccess(imageData, result)
    }, function(error) {
        window.Q.ML.Cordova.ocr(imageData, !1, function(result) {
            handleFrontPhotoSuccess(imageData, result)
        }, function(error) {
            if (PLATFORM == 'iOS') {
                if (clickFlag == 1) {
                    navigator.notification.alert(BCS.error.somthing_went_wrong, function() {
                        removeLoading();
                        $(".scanCardForm div.middle-container").css('position', 'relative')
                    }, BCS.alert_box, BCS.ok)
                } else {
                    navigator.notification.alert(BCS.error.somthing_went_wrong, function() {
                        window.location = "index.html"
                    }, BCS.alert_box, BCS.ok)
                }
            } else {
                navigator.notification.alert(error, function() {
                    window.location = "index.html"
                }, BCS.alert_box, BCS.ok)
            }
        })
    })
}

function handleFrontPhotoSuccess(imageData, result) {
    removeLoading();
    $(".scanCardForm div.middle-container").css('position', 'relative');
    imageDataURL = imageData;
    if (imageData != null) {
        $(".cardFrontBtn").hide();
        $(".cardFrontImg").show().attr('src', "data:image/jpeg;base64," + imageData);
        if ($(".cardFrontImg").attr('src') != "") {
            autoRemoveFields('frontPhoto')
        }
    }
    clearContent(JSON.stringify(result), 'frontPhoto')
}

function onFailFrontCamera(message) {
    removeLoading();
    $(".scanCardForm div.middle-container").css('position', 'relative');
    if ($(".cardFrontImg").attr('src') == "") {
        navigator.notification.alert(message, function() {
            window.location = "index.html"
        }, BCS.alert_box, BCS.ok)
    }
    $('input[type="text"]').each(function(i, val) {
        if (val.value == '') {
            window.location = "index.html"
        }
    })
}

function onPhotoBackSuccess(imageData) {
    addLoading();
    $(".scanCardForm div.middle-container").css('position', 'fixed');
    window.Q.ML.Cordova.ocr(imageData, !0, function(result) {
        handleBackPhotoSuccess(imageData, result)
    }, function(error) {
        window.Q.ML.Cordova.ocr(imageData, !1, function(result) {
            handleBackPhotoSuccess(imageData, result)
        }, function(error) {
            if (PLATFORM == 'iOS') {
                navigator.notification.alert(BCS.error.somthing_went_wrong, function() {
                    removeLoading();
                    $(".scanCardForm div.middle-container").css('position', 'relative')
                }, BCS.alert_box, BCS.ok)
            } else {
                navigator.notification.alert(error, function() {
                    window.location = "index.html"
                }, BCS.alert_box, BCS.ok)
            }
        })
    })
}

function handleBackPhotoSuccess(imageData, result) {
    removeLoading();
    $(".scanCardForm div.middle-container").css('position', 'relative');
    imageDataURLback = imageData;
    if (imageData != null) {
        $(".cardBackBtn").hide();
        $(".cardBackImg").show().attr('src', "data:image/jpeg;base64," + imageData);
        if ($(".cardBackImg").attr('src') != "") {
            autoRemoveFields('backPhoto')
        }
    }
    clearContent(JSON.stringify(result), 'backPhoto')
}

function onFailBackCamera(message) {
    removeLoading();
    $(".scanCardForm div.middle-container").css('position', 'relative');
    if ($(".cardBackImg").attr('src') == "") {
        navigator.notification.alert(message, function() {}, BCS.alert_box, BCS.ok)
    }
    $('input[type="text"]').each(function(i, val) {
        if (val.value == '') {       
            window.location = "index.html"
        }
    })
}

function autoRemoveFields(side = '') {
    $('select.select-box').each(function(i, val) {
        if (val.value == '' && side != '') {
            $(this).closest("div." + side).remove()
        }
    })
}

function clearContent(str = null, side = null) {
    var result = [];
    if (str.length > 2) {
        var obj = JSON.parse(str);
        $.each(obj, function(index, value) {
            $.each(value, function(i, j) {
                result.push(j.text)
            })
        });
        doAction(result);
        for (i = 0; i < result.length; i++) {
            addFields(result[i], side);
            $('.select-box').select2({
                minimumResultsForSearch: -1 
            })
        }
    } else {
        navigator.notification.alert(BCS.error.error_no_data_found, function() {
            capturePhoto(side)
        }, BCS.alert_box, BCS.ok)
    }
}
$("#addButton").click(function() {
    addFields();
    $('.select-box').select2({
        minimumResultsForSearch: -1
    })
}); 

// ***** AUTO DETECT RULES ***** //

function validateEmail(email) {
    var re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
    return re.test(String(email).toLowerCase())
}

function validateExtraWithEmail(str, flag = null) {
	if ( validateEmail(str) ) {
		var str = str.trim();
		var emailaddress = '';
		var arr1 = [];
		if (str.indexOf(" ") != -1) {
	        arr1 = str.split(" ");
		} else if (str.indexOf("-") != -1) {
			arr1 = str.split("-");
		} else if (str.indexOf("=") != -1) {
			arr1 = str.split("=");
		} else if (str.indexOf(":") != -1) {
			arr1 = str.split(":");
		} else {
			arr1 = [];
		}

		if ( Array.isArray(arr1) && arr1.length > 0 ) {
			$.each(arr1, function(i, v) {
				if ( validateEmail(v) ) {
                    if (flag) {
                        emailaddress =  v;
                    } else {
                        emailaddress =  str.trim();
                    }
	            } 
	        });
		} else if ( validateEmail(str)) {
			emailaddress = str;
		} else {
			emailaddress = false;
		}
		return emailaddress;
	}
}

function validateURL(URL) {
	if (URL.toLowerCase().indexOf('www') != -1 || URL.toLowerCase().indexOf('http') != -1) {
		return true;
	} 
	return false;
}

function validateURLWithText(url, flag = null)
{
	if (validateURL(url)) {
		var url = url.trim();
		var websiteurl = '';
		var arr1 = [];
		if (url.indexOf(" ") != -1) {
	        arr1 = url.split(" ");
		} else if (url.indexOf("=") != -1) {
			arr1 = url.split("=");
		} else if (url.indexOf(":") != -1) {
			arr1 = url.split(":");
		} else {
			arr1 = [];
		}

		if ( Array.isArray(arr1) && arr1.length > 0 ) {
        	$.each(arr1, function(i, v) {
				if ( validateURL(v) ) {
                    if (flag) {
                        websiteurl = v;
                    } else {
                        websiteurl = url.trim();
                    }	               	
	            } 
	        });
		} else {
			websiteurl = url;
		}
		return websiteurl;
    }
}

function validateTwitterId(twitter) {
    var re = /((?=[^\w!]) @\w+\b)/g;
    return re.test(String(twitter).toLowerCase())
}

function validateTwitterWithText(twitter, flag = null)
{
	if (validateTwitterId(twitter)) {
		var twitter = twitter.trim();
		var twitterId = '';
		var arr1 = [];
		if (twitter.indexOf(" ") != -1) {
	        arr1 = twitter.split(" ");
		} else if (twitter.indexOf("-") != -1) {
			arr1 = twitter.split("-");
		} else if (twitter.indexOf("=") != -1) {
			arr1 = twitter.split("=");
		} else if (twitter.indexOf(":") != -1) {
			arr1 = twitter.split(":");
		} else {
			arr1 = [];
		}

		if ( Array.isArray(arr1) && arr1.length > 0 ) {
        	$.each(arr1, function(i, v) {
				if ( validateTwitterId(v) ) {
                    if (flag) {
                        twitterId = v;
                    } else {
                        twitterId = twitter.trim();
                    }	               	
	            } 
	        });
		} else {
			twitterId = twitter;
		}
		return twitterId;
    }
} 

function validatePhone(strPhone, flag = null) {
	var isString = 0;
	var isNumber = 0;
	var onlyNumbers = '';
	var arr = strPhone.split("");
	$.each(arr, function(i, v) {
	
		if (v == "+" || v == "-") {
			isNumber = isNumber + 1;
			onlyNumbers += v;
		} else if (!isNaN(parseInt(v))) {
			isNumber = isNumber + 1;
			onlyNumbers += v;
		} else {
			isString = isString + 1;
		}
		
	});
	if (parseInt(isString) < parseInt(isNumber)) {
        if (flag) {
            return onlyNumbers;
        }
		return strPhone;
	} 
	return false;
}

function addFields(data = '', side = '') {
    var newData = '';
    if (validateExtraWithEmail(data)) {
    	newData = data;
    	console.log(validateExtraWithEmail(data));
    	newTextBoxDiv = $(document.createElement('div')).attr("id", 'TextBoxDiv' + counter).attr("class", 'containerDiv ' + side);
	    newTextBoxDiv.after().html('<div class="row-group clearfix"><div class="box-1"><input type="text" class="input-box"  value="' + validateExtraWithEmail(data) + '" id="textbox' + counter + '" /></div>' + '<div class="box-2"><select data-value="TextBoxDiv' + counter + '" id="select' + counter + '" class="select-box"><option value="" >Select Type</option>' + '<option value="displayName" >' + BCS.full_name + '</option>' + '<option value="phone" >' + BCS.phone + '</option>' + '<option value="email" >' + BCS.email_address + '</option>' + '<option value="position" >' + BCS.position + '</option>' + '<option value="address" >' + BCS.address + '</option>' + '<option value="company" >' + BCS.company + '</option>' + '<option value="website" >' + BCS.website + '</option>' + '<option value="twitter" >' + BCS.twitter + '</option>' + '<option value="facebook" >' + BCS.facebook + '</option>' + '<option value="skype" >' + BCS.skype + '</option>' + '<option value="linkedin" >' + BCS.linkedin + '</option>' + '<option value="wechat" >' + BCS.wechat + '</option>' + '<option value="telegram" >' + BCS.telegram + '</option>' + '<option value="others" >' + BCS.others + '</option>' + '</select></div>' + '<div class="box-3"><span class="dlt-div"><a onclick="removeField(' + counter + ');" id="TextBoxDiv' + counter + '"><img src="images/close-gray.png" alt=""></a></span></div>' + '</div>');
	    newTextBoxDiv.appendTo("#TextBoxesGroup form");
        $('#select' + counter).val('email').trigger('change')
    }
    if (validateURLWithText(data)) {
    	newData = data;
    	newTextBoxDiv = $(document.createElement('div')).attr("id", 'TextBoxDiv' + counter).attr("class", 'containerDiv ' + side);
	    newTextBoxDiv.after().html('<div class="row-group clearfix"><div class="box-1"><input type="text" class="input-box"  value="' + validateURLWithText(data) + '" id="textbox' + counter + '" /></div>' + '<div class="box-2"><select data-value="TextBoxDiv' + counter + '" id="select' + counter + '" class="select-box"><option value="" >Select Type</option>' + '<option value="displayName" >' + BCS.full_name + '</option>' + '<option value="phone" >' + BCS.phone + '</option>' + '<option value="email" >' + BCS.email_address + '</option>' + '<option value="position" >' + BCS.position + '</option>' + '<option value="address" >' + BCS.address + '</option>' + '<option value="company" >' + BCS.company + '</option>' + '<option value="website" >' + BCS.website + '</option>' + '<option value="twitter" >' + BCS.twitter + '</option>' + '<option value="facebook" >' + BCS.facebook + '</option>' + '<option value="skype" >' + BCS.skype + '</option>' + '<option value="linkedin" >' + BCS.linkedin + '</option>' + '<option value="wechat" >' + BCS.wechat + '</option>' + '<option value="telegram" >' + BCS.telegram + '</option>' + '<option value="others" >' + BCS.others + '</option>' + '</select></div>' + '<div class="box-3"><span class="dlt-div"><a onclick="removeField(' + counter + ');" id="TextBoxDiv' + counter + '"><img src="images/close-gray.png" alt=""></a></span></div>' + '</div>');
	    newTextBoxDiv.appendTo("#TextBoxesGroup form");
        $('#select' + counter).val('website').trigger('change')
    }
    if (validateTwitterWithText(data)) {
    	newData = data;
    	newTextBoxDiv = $(document.createElement('div')).attr("id", 'TextBoxDiv' + counter).attr("class", 'containerDiv ' + side);
	    newTextBoxDiv.after().html('<div class="row-group clearfix"><div class="box-1"><input type="text" class="input-box"  value="' + validateTwitterWithText(data) + '" id="textbox' + counter + '" /></div>' + '<div class="box-2"><select data-value="TextBoxDiv' + counter + '" id="select' + counter + '" class="select-box"><option value="" >Select Type</option>' + '<option value="displayName" >' + BCS.full_name + '</option>' + '<option value="phone" >' + BCS.phone + '</option>' + '<option value="email" >' + BCS.email_address + '</option>' + '<option value="position" >' + BCS.position + '</option>' + '<option value="address" >' + BCS.address + '</option>' + '<option value="company" >' + BCS.company + '</option>' + '<option value="website" >' + BCS.website + '</option>' + '<option value="twitter" >' + BCS.twitter + '</option>' + '<option value="facebook" >' + BCS.facebook + '</option>' + '<option value="skype" >' + BCS.skype + '</option>' + '<option value="linkedin" >' + BCS.linkedin + '</option>' + '<option value="wechat" >' + BCS.wechat + '</option>' + '<option value="telegram" >' + BCS.telegram + '</option>' + '<option value="others" >' + BCS.others + '</option>' + '</select></div>' + '<div class="box-3"><span class="dlt-div"><a onclick="removeField(' + counter + ');" id="TextBoxDiv' + counter + '"><img src="images/close-gray.png" alt=""></a></span></div>' + '</div>');
	    newTextBoxDiv.appendTo("#TextBoxesGroup form");
        $('#select' + counter).val('twitter').trigger('change')
    }
    if (validatePhone(data)) {
    	newData = data;
    	newTextBoxDiv = $(document.createElement('div')).attr("id", 'TextBoxDiv' + counter).attr("class", 'containerDiv ' + side);
	    newTextBoxDiv.after().html('<div class="row-group clearfix"><div class="box-1"><input type="text" class="input-box"  value="' + validatePhone(data) + '" id="textbox' + counter + '" /></div>' + '<div class="box-2"><select data-value="TextBoxDiv' + counter + '" id="select' + counter + '" class="select-box"><option value="" >Select Type</option>' + '<option value="displayName" >' + BCS.full_name + '</option>' + '<option value="phone" >' + BCS.phone + '</option>' + '<option value="email" >' + BCS.email_address + '</option>' + '<option value="position" >' + BCS.position + '</option>' + '<option value="address" >' + BCS.address + '</option>' + '<option value="company" >' + BCS.company + '</option>' + '<option value="website" >' + BCS.website + '</option>' + '<option value="twitter" >' + BCS.twitter + '</option>' + '<option value="facebook" >' + BCS.facebook + '</option>' + '<option value="skype" >' + BCS.skype + '</option>' + '<option value="linkedin" >' + BCS.linkedin + '</option>' + '<option value="wechat" >' + BCS.wechat + '</option>' + '<option value="telegram" >' + BCS.telegram + '</option>' + '<option value="others" >' + BCS.others + '</option>' + '</select></div>' + '<div class="box-3"><span class="dlt-div"><a onclick="removeField(' + counter + ');" id="TextBoxDiv' + counter + '"><img src="images/close-gray.png" alt=""></a></span></div>' + '</div>');
	    newTextBoxDiv.appendTo("#TextBoxesGroup form");
        $('#select' + counter).val('phone').trigger('change')
    }
    if (newData == '') {
    	newTextBoxDiv = $(document.createElement('div')).attr("id", 'TextBoxDiv' + counter).attr("class", 'containerDiv ' + side);
	    newTextBoxDiv.after().html('<div class="row-group clearfix"><div class="box-1"><input type="text" class="input-box"  value="' + data + '" id="textbox' + counter + '" /></div>' + '<div class="box-2"><select data-value="TextBoxDiv' + counter + '" id="select' + counter + '" class="select-box"><option value="" >Select Type</option>' + '<option value="displayName" >' + BCS.full_name + '</option>' + '<option value="phone" >' + BCS.phone + '</option>' + '<option value="email" >' + BCS.email_address + '</option>' + '<option value="position" >' + BCS.position + '</option>' + '<option value="address" >' + BCS.address + '</option>' + '<option value="company" >' + BCS.company + '</option>' + '<option value="website" >' + BCS.website + '</option>' + '<option value="twitter" >' + BCS.twitter + '</option>' + '<option value="facebook" >' + BCS.facebook + '</option>' + '<option value="skype" >' + BCS.skype + '</option>' + '<option value="linkedin" >' + BCS.linkedin + '</option>' + '<option value="wechat" >' + BCS.wechat + '</option>' + '<option value="telegram" >' + BCS.telegram + '</option>' + '<option value="others" >' + BCS.others + '</option>' + '</select></div>' + '<div class="box-3"><span class="dlt-div"><a onclick="removeField(' + counter + ');" id="TextBoxDiv' + counter + '"><img src="images/close-gray.png" alt=""></a></span></div>' + '</div>');
	    newTextBoxDiv.appendTo("#TextBoxesGroup form");
    }

    counter++
}

function removeField(optionId) {
    var r = confirm(BCS.record_delete_confirmation_text);
    if (r == !0) {
        $('form div#TextBoxDiv' + optionId).remove()
    }
}

function doAction(data) {
    $(".middle-container .signal").remove();
    $(".middle-container>.clearfix").show();
    $("#dataCotent, #myInput").hide();
    $("#contact-form-btn, #TextBoxesGroup, #doSaving").show()
}
$("#listCards").on("click", function() {
    doImageListing()
});
$("#doSaving").on("click", function(event) {
    try {
        event.preventDefault();
        var textboxes = [];
        var selectboxes = [];
        var formData = [];
        for (var i = 0; i < $('input[type="text"]').length; i++) {
            if ($('input[type="text"]')[i].value != '') {
                textboxes.push($('input[type="text"]')[i].value)
            }
            if ($('select.select-box')[i].value != '') {
                selectboxes.push($('select.select-box')[i].value)
            }
        }
        var address = [];
        var phone = [];
        var email = [];
        var website = [];
        var txt = '';
        var notes = '';
        var flag = 1;
        $('select.select-box').each(function(i, val) {
            if (val.value == '') {
                txt += $(this).parent().parent()[0].children[0].children[0].value;
                txt += '\n'
            } else {
                if (val.value == 'address') {
                    address.push($(this).parent().parent()[0].children[0].children[0].value);
                    formData[val.value] = address
                } else if (val.value == 'phone') {
                    phone.push($(this).parent().parent()[0].children[0].children[0].value);
                    formData[val.value] = phone
                } else if (val.value == 'email') {
                    email.push($(this).parent().parent()[0].children[0].children[0].value);
                    formData[val.value] = email
                } else if (val.value == 'website') {
                    website.push($(this).parent().parent()[0].children[0].children[0].value);
                    formData[val.value] = website
                } else if (val.value == 'facebook') {
                    formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value
                } else if (val.value == 'twitter') {
                    formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value
                } else if (val.value == 'skype') {
                    formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value
                } else if (val.value == 'linkedin') {
                    formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value
                } else if (val.value == 'wechat') {
                    formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value
                } else if (val.value == 'telegram') {
                    formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value
                } else {
                    formData[val.value] = $(this).parent().parent()[0].children[0].children[0].value
                }
                flag = 0
            }
        });

        function alertDismissed() {
            return !1
        }
        if (flag == 0) {
            document.addEventListener("deviceready", onDeviceReady, !1);

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
                    $.each(formData.phone, function(i, val) {
                        if (validatePhone(formData.phone[i], true)) {
                            var phnNo = validatePhone(formData.phone[i], true);
                            var phneNo = phnNo.replace(/\D/g, '');
                            phoneNumbers.push(new ContactField(BCS.work, phneNo, !1))
                        }
                    });
                    myContact.phoneNumbers = phoneNumbers
                }
                if (formData.displayName != undefined) {
                    var Username = [];
                    myContact.displayName = formData.displayName;
                    var dName = formData.displayName;
                    nm = dName.split(" ");
                    if (nm.length > 0) {
                        if (nm[0] != undefined) {
                            Username.nickname = nm[0]
                        }
                        if (nm[1] != undefined) {
                            Username.firstname = nm[1]
                        }
                        if (nm[2] != undefined) {
                            Username.lastname = nm[2]
                        }
                        myContact.name = Username
                    }
                }
                if (formData.email != undefined) {
                    $.each(formData.email, function(i, val) {
                        if (validateExtraWithEmail(formData.email[i], true)) {
                            emails.push(new ContactField(BCS.work, validateExtraWithEmail(formData.email[i], true), !1))
                        }
                    });
                    myContact.emails = emails
                }
                if (formData.website != undefined) {
                    $.each(formData.website, function(i, val) {
                        if (validateURLWithText(formData.website[i], true)) {
                            urls.push(new ContactField('website', validateURLWithText(formData.website[i], true), !1))
                        }
                    });
                    myContact.urls = urls
                }
                if (formData.company != undefined) {
                    organizations.push(new ContactOrganization('', BCS.work, formData.company, '', formData.position));
                    myContact.organizations = organizations
                }
                if (formData.address != undefined) {
                    $.each(formData.address, function(i, val) {
                        addresses.push(new ContactAddress('', BCS.work, '', formData.address[i], '', '', '', ''))
                    });
                    myContact.addresses = addresses
                }
                if (formData.facebook != undefined) {
                    IM.push(new ContactField('facebook', formData.facebook, !1))
                }
                if (formData.twitter != undefined) {
                    if (validateTwitterWithText(formData.twitter, true)) {
                        IM.push(new ContactField('twitter', validateTwitterWithText(formData.twitter, true), !1))
                    }
                }
                if (formData.skype != undefined) {
                    IM.push(new ContactField('skype', formData.skype, !1))
                }
                if (formData.linkedin != undefined) {
                    IM.push(new ContactField('linkedin', formData.linkedin, !1))
                }
                if (formData.wechat != undefined) {
                    IM.push(new ContactField('wechat', formData.wechat, !1))
                }
                if (formData.telegram != undefined) {
                    IM.push(new ContactField('telegram', formData.telegram, !1))
                }
                myContact.ims = IM;
                if (document.getElementById("formNotes") != '') {
                    notes = $("#formNotes").val() + '\n' + txt
                }
                myContact.note = notes;
                myContact.save(contactSuccess, contactError);

                function contactSuccess() {
                    navigator.notification.alert(BCS.contact_saved_title, function() {}, BCS.alert_box, BCS.ok);
                    doFile(imageDataURL, imageDataURLback, myContact);
                    $("#contact-form-btn, #TextBoxesGroup, #doSaving").hide();
                    $("#dataCotent, #myInput").show()
                }

                function contactError(message) {
                    alert('Failed because: ' + message)
                }
            }
        } else {
            navigator.notification.alert(BCS.alert_msg_when_no_item_selected, alertDismissed, BCS.alert_box, BCS.ok)
        }
    } catch (err) {
        console.log(err);
        alert(err)
    }
})