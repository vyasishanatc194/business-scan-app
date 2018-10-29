
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	if (cordova.platformId == 'android') {
	    StatusBar.backgroundColorByHexString("#333");
	}
}

var newTextBoxDiv = '';

let BCS = {
		'position': 'Position',
		'app_name': 'Business Scans App',
	    "business_card":"Business Card",
	    "scanner":"Scanner",
	    "cards":"Cards",
		"credit" : "Credits",
	    "get_credits":"Get Credits",
	    "search":"Search",
	    "delete_a_card":"Delete Card",
	    "scan_new_card":"Scan New Card",
	    "front":"Front",
	    "back":"Back",
	    "display_name":"displayName",
	    "full_name":"Full Name",
	    "phone":"Phone",
	    "address":"Address",
	    "company":"Company",
	    "website":"Website",
	    "twitter":"Twitter",
	    "facebook":"Facebook",
	    "linkedin":"Linkedin",
	    "wechat":"WeChat",
	    "telegram":"Telegram",
	    "others":"Others",
	    "email_address":"Email Address",
		"save_contact":"Save Contact",
		"delete_btn":"Delete",
		"no_more_text":"No more textbox to remove",
		'record_delete_confirmation_text':"Are you sure want to delete record?",
		'home': "Home",
		'work': "Work",
		'contact_saved_title': "Contact is saved!",
		error : {
			'error_store_data': "error storing data",
			'error_store_data_in_creditslog' : 'error storing data in creditsLog'
		},
		'buy_credits_confirmation_box_title': "You have no credits to continue. You should buy credits",
		'no_cards_scanned_yet': "No scanned cards yet!",
		'retrive_data_error': "Unable to retrieve daa from database!",
		'letter_on' :  'Remind me letter',
		'pay': 'Pay Now',
		'expand_contact_info_title': 'Expand Contact Info',
		'search_card_placeholder': 'Search Card here..',
		'app_purchase_screen_content': "You can use purchased credits to scan business cards and save contacts in address book."
	  }

	  

// document.addEventListener("deviceready", onDeviceReady, false);
// function onDeviceReady() {
// 	var myContact = navigator.contacts.create();

// 	var phoneNumbers = [];
// 	var organizations = [];
// 	var addresses = [];
// 	phoneNumbers[0] = new ContactField('home', '212-555-1234', false);
// 	myContact.phoneNumbers = phoneNumbers;

// 	myContact.displayName = "Test Contact Ishan";

// 	organizations[0] = new ContactOrganization('', 'name', 'Organationation Test Contact Ishan', '', '');
// 	myContact.organizations = organizations;

// 	addresses[0] = new ContactAddress('', 'home', '' ,'Address Test Contact Ishan', '', '' , '', '');
	
// 	console.log(addresses);
// 	myContact.addresses = addresses;

// 	myContact.save(contactSuccess, contactError);
// 	function contactSuccess() {
//         console.log('saved contact success');
//     }
	
// 	function contactError(message) {
//         alert('Failed because: ' + message);
//     }
// }

		