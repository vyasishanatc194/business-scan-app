var URL = window.location.href;
// var URL = "www.bcs.com/deploy/screenshots/2";

var splitURL = URL.split("/");

var screenID = splitURL[splitURL.length - 1];

switch(screenID) {
    case 1:
        window.location = 'index.html';
        break;
    case 2:
        window.location = 'searchCard.html?addvalue=123';
        break;
    case 3:
        window.location = 'editCard.html';
        break;
    case 3:
        window.location = 'editCardwithnotes.html';
        break;
    default:
        code block
}
