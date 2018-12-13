var URL = window.location.href;
// var URL = "www.bcs.com/deploy/screenshots/2";

var splitURL = URL.split("?Q.screenshots=");

var screenID = splitURL[splitURL.length - 1];

switch(screenID) {
    case '1':
        window.location = 'listing.html';
        break;
    case '2':
        window.location = 'searchCard.html';
        break;
    case '3':
        window.location = 'editCard.html';
        break;
    case '4':
        window.location = 'editCardwithnotes.html';
        break;
    default:
        break;
}
