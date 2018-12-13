var PLATFORM = '';
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {	
	PLATFORM = device.platform;
    StatusBar.backgroundColorByHexString("#2865da");
    // console.log(StatusBar);
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
	    "skype":"Skype",
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
		'delete_confirm_title': "Delete Item",
		'home': "Home",
		'work': "Work",
		'contact_saved_title': "Contact is saved!",
		'buy_credits_confirmation_box_title': "You have no credits to continue. You should buy credits",
		'buy_credits_confirmation_box_subtitle': "Buy Credits",
		'pay_now_btn_title': 'Pay Now',
		'remind_me_letter_btn_title': 'Remind Me Leter',
		'no_cards_scanned_yet': "No scanned cards yet!",
		'retrive_data_error': "Unable to retrieve daa from database!",
		'letter_on' :  'Remind me letter',
		'pay': 'Pay Now',
		'credit_purchase_page_title': 'PURCHASE CREDITS',
		'search_card_placeholder': 'Search Card here..',
		'app_purchase_screen_content': "You can use purchased credits to scan business cards and save contacts in address book.",
		"alert_msg_when_no_item_selected": "Please select atleast one field to save contact.",
		"alert_box": "",
		"ok": "Ok",
		"unable_to_load": "Unable to load product items, please check your internet connection.",
		"option_yes": "Yes",
		"option_no": "No",
		"thanks1": "Congratulations. You bought ",
		"thanks2": " credits",
		"card_detail_page": "Card Detail Page",
		"want_to_delete_record" : "Are you sure want to delete record?",
		'error' : {
			'error_store_data': "error storing data",
			'error_store_data_in_creditslog' : 'error storing data in creditsLog',
			'error_no_data_found': "Haven't found any text on the provided photo. Please try again.",
			"somthing_went_wrong": "Something went wrong. Please try again."
		}
	  }
		