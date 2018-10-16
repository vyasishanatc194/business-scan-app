let db;
let dbVersion = 1;
let dbReady = false;
var tableName = 'scanCard';
var availableData = '';

document.addEventListener('DOMContentLoaded', () => {
    // alert('dom content loaded');

    initDb();

});
 
function initDb() {
    let request = indexedDB.open('scanDB', dbVersion);

    request.onerror = function(e) {
        console.error('Unable to open database.');
    }

    request.onsuccess = function(e) {
        db = e.target.result;
        // alert('db opened');
        doImageListing();
    }

    // const employeeData = [
    //     { id: 1, data: "gopal", content: "Mobile: 98986 31317 SANToSH R. DUBEY Advocate High Court of Gujarat 20, Ashoknagar Society, B/h. Railway Station, Nadiad-387 002. Dist. Kheda (Gujarat) E-mail : santoshdubey_75@yahoo.com", created:new Date() },
    //     { id: 2, data: "gopal", content: "Shah Harsh (Business Partner) Head Office: 71, Maddybeth crescent, Brampton, ON L6Y SR6, Canada. M: +91 99258 33511 harsh.shah@citrusbug.com www.citrusbug.com Skype: citrus.bug", created:new Date() }
    //  ];

    request.onupgradeneeded = function(e) {
        let db = e.target.result;
        var objectStore = db.createObjectStore(tableName, {keyPath:'id', autoIncrement: true});
        
        // for (var i in employeeData) {
        //    objectStore.add(employeeData[i]);
        // }
        dbReady = true;
    }
}

function doFile(data, imageDataURLback = null, content) {
    let bits = data;
    let ob = {
        created:new Date(),
        data:bits,
        imgBack: imageDataURLback,
        content: content
    };

    let trans = db.transaction([tableName], 'readwrite');
    let addReq = trans.objectStore(tableName).add(ob);

    addReq.onerror = function(e) {
        alert('error storing data');
        console.error(e);
    }

    trans.oncomplete = function(e) {
        alert('data stored');
        doImageListing();
    }
}


function doImageListing(str = null) {
    try{
        $("#contact-form-btn, #TextBoxesGroup, #doSaving").hide();
        $(".card-detail-page").hide();
        $("#dataCotent, #myInput").show();
        $("#dataCotent div.white-box-div.color-1.clearfix").remove(); 
        var trans = db.transaction([tableName], 'readonly');
        // $("#dataCotent").append('<div class="white-box-div color-1 clearfix"></div>');
        trans.objectStore(tableName).openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
              
            if (cursor) {
                if (str != null && cursor.value.content.indexOf(str) > -1) {
                    //  $("#dataCotent").append('<div class="white-box-div color-1 clearfix"><div class="thumb">'+
                    //     '<img style="width:80px;height:65px;" id="myImage" src="" /></div>'+
                    //     '<div class="txt-div"><h3>'+ cursor.value.content.substring(0, 55) +'</h3>'+
                    //     '<div class="dlt-div"><span><i class="fa fa-times-circle deleteItem" id='+cursor.key+' ></i></span></div></div></div>');
                    // cursor.continue();
                } else if (str == null) {
                    availableData = ['<tr class="white-box-div color-1 clearfix cardItem" id='+cursor.key+' >'+
                        '<td class="thumb"><img style="width:80px;height:65px;" id="myImage" src="data:image/jpeg;base64,'+ cursor.value.data +'" /></td>'+
                        '<td class="txt-div"><h3>'+ cursor.value.content.substring(0, 55) +'</h3><div class="dlt-div">'+
                        '<span><i class="fa fa-times-circle deleteItem" id='+cursor.key+' ></i></span></div></td>'+
                        '</tr>'];
                    fillData(availableData);
                    cursor.continue();
                } else {
                    $("#dataCotent div.white-box-div.color-1.clearfix").remove(); 
                }
            } else {
                $('.deleteItem').on("click", function(){
                    var r = confirm("Are you sure want to delete record?");
                    if (r == true) {
                        removeRecord($(this).attr('id'));
                        doImageListing();
                    }                    
                });
            }
            if ($("#Timg").length <= 0) {
                $("#dataCotent tbody").append('<div class="white-box-div color-1 clearfix" >No more entries!</div>');
            }
        };

    } catch(err) {
        alert(err);
    }
}

function fillData(availableData) {
    $.each(availableData, function(index, val){
        console.log(val);
        $("#dataCotent").append(val);
    });

    $(".cardItem").on('click', function(){
        var cardId = $(this).attr('id');
        cardDetailPage(cardId);        
    });
}

function cardDetailPage(cardId) {
    try {
        $(".txtboxes-group-div").hide();
        $(".card-detail-page").show();
        var transaction = db.transaction([tableName]);
        var objectStore = transaction.objectStore(tableName);
        var request = objectStore.get(parseInt(cardId));
       
        request.onerror = function(event) {
           alert("Unable to retrieve daa from database!");
        };
       
        request.onsuccess = function(event) {
            if(request.result) {            
                $(".card-detail-page img#imgFront").attr('src', "data:image/jpeg;base64,"+request.result.data);
                $(".card-detail-page img#imgBack").attr('src', "data:image/jpeg;base64,"+request.result.imgBack);
                $(".card-detail-page .card-content").html(request.result.content);
            } 
       };
    }
    catch(err) {
        $(".txtboxes-group-div").show();
        $(".card-detail-page").hide();
        alert('Detail Page:'+err); 
    }
}


function removeRecord(id) {
    var request = db.transaction([tableName], "readwrite")
    .objectStore(tableName)
    .delete(parseInt(id));
       
    request.onsuccess = function(event) {
        // alert("Entry has been removed from your database.");
    };
}