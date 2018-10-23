let db;
let dbVersion = 1;
let dbReady = false;
var tableName = 'scanCard';
var tableName1 = 'credits';
var tableData = '';

document.addEventListener('DOMContentLoaded', () => {
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

    // dummy data
    // const employeeData = [
    //     { id: 1, data: "gopal", content: "Mobile: 98986 31317 SANToSH R. DUBEY Advocate High Court of Gujarat 20, Ashoknagar Society, B/h. Railway Station, Nadiad-387 002. Dist. Kheda (Gujarat) E-mail : santoshdubey_75@yahoo.com", created:new Date() },
    //     { id: 2, data: "gopal", content: "Shah Harsh (Business Partner) Head Office: 71, Maddybeth crescent, Brampton, ON L6Y SR6, Canada. M: +91 99258 33511 harsh.shah@citrusbug.com www.citrusbug.com Skype: citrus.bug", created:new Date() }
    // ];

    request.onupgradeneeded = function(e) {
        let db = e.target.result;
        var objectStore = db.createObjectStore(tableName, {keyPath:'id', autoIncrement: true});
        var objectStore1 = db.createObjectStore(tableName1, {keyPath:'id', autoIncrement: true});
        
        objectStore1.add({credits: 5, createdAt: new Date()});
        
        dbReady = true;
    }
}

// save image / data in indexedDB
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
        decreaseCredits();
        doImageListing();
    }
}

// fetch all images/ data from indexedDB
function doImageListing() {
    try{
        $(".cardDetailPage, .scanCardForm").hide();
        $(".cardListing").show();
        $("#dataCotent div.card").remove(); 
        var trans = db.transaction([tableName], 'readonly');

        var ObjectTras = trans.objectStore(tableName);

        ObjectTras.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if (cursor) {
                var data = cursor.value.content;
                var rowData = '';

                if (data.displayName != null) { rowData += '<h3>'+data.displayName+'</h3>' };
                if (data.phoneNumbers != null) { rowData += '<p><i class="fa fa-phone"></i>'+data.phoneNumbers[0].value+'</p>' };
                if (data.emails != null) { rowData += '<p><i class="fa fa-envelope"></i>'+data.emails[0].value+'</p>' };
                if (data.twitter != null) { rowData += '<p><i class="fa fa-twitter"></i>'+data.twitter[0]+'</p>' };
                if (data.urls != null) { rowData += '<p><i class="fa fa-globe"></i>'+data.urls[0].value+'</p>' };

                tableData = ['<div class="card"><div class="card-data-list clearfix"><a class="cardItem" id='+cursor.key+' >'+
                    '<p id="Timg">'+ rowData +'</p></div></div>'];
                fillData(tableData);
                cursor.continue();
            } 
            if ($("#Timg").length <= 0) {
                $("#dataCotent").append('<div class="card"><div class="card-data-list clearfix"><p>No scanned cards yet!</p></div></div>');
            }
        };

    } catch(err) {
        alert(err);
    }
}

// fill the form after scan card
function fillData(tableData) {
    $("#dataCotent").css("display", "block");
    $.each(tableData, function(index, val) {
        $("#dataCotent").append(val);
    });

    $('.deleteItem').on("click", function(){
        var r = confirm("Are you sure want to delete record?");
        if (r == true) {
            removeRecord($(this).attr('id'));
        }                    
    });

    $(".cardItem").on("click", function(){
        $(".cardListing").hide();
        $(".scanCardForm").hide();
        $(".cardDetailPage").show();
        var cardId = $(this).attr('id');
        cardDetailPage(cardId); 
    });

}

// show detail of card page
function cardDetailPage(cardId) {
    try {
        var transaction = db.transaction([tableName]);
        var objectStore = transaction.objectStore(tableName);
        var request = objectStore.get(parseInt(cardId));
       
        request.onerror = function(event) {
           alert("Unable to retrieve daa from database!");
        };
       
        request.onsuccess = function(event) {
            if(request.result) {
                if (request.result.data != null ){
                    $(".card-detail-div img#imgFrnt").attr('src', "data:image/jpeg;base64,"+request.result.data);
                }  else { $(".card-detail-div img#imgFrnt").hide(); }
                if (request.result.imgBack != null ){
                    $(".card-detail-div img#imgBck").attr('src', "data:image/jpeg;base64,"+request.result.imgBack);
                } else { $(".card-detail-div img#imgBck").hide(); }
                $(".content-blk p").html(request.result.content.note);
                $("h4#cardDetailPageTitle").html(request.result.content.displayName);
                $(".deleteItem").attr('id', cardId);
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
    try {
        var request = db.transaction([tableName], "readwrite")
        .objectStore(tableName)
        .delete(parseInt(id));
           
        request.onsuccess = function(event) {
            // alert("Entry has been removed from your database.");
            window.location = "index.html";
        };
    }
    catch (err) {
        alert(err);
    }
}