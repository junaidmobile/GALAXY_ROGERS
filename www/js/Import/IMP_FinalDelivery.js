
var CMSserviceURL = '';
var GHAImportFlightserviceURL = window.localStorage.getItem("GHAImportFlightserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var HAWBId;
var WdoSeqNo;

$(function () {

    if (window.localStorage.getItem("RoleIMPFinalDelivery") == '0') {
        window.location.href = 'IMP_Dashboard.html';
    }

    $("#chkManual").attr('checked', 'checked');

    var formattedDate = new Date();
    var d = formattedDate.getDate();
    if (d.toString().length < Number(2))
        d = '0' + d;
    var m = formattedDate.getMonth();
    m += 1;  // JavaScript months are 0-11
    if (m.toString().length < Number(2))
        m = '0' + m;
    var y = formattedDate.getFullYear();
    var date = 'N' + y.toString() + m.toString() + d.toString();
    // $('#txtGPDate').val(date);
    //$('#txtGPDate').val(y.toString().substring(2));

});

function CheckDeliveryDetails() {
    WdoSeqNo = "";
    var inputxml = "";
    clearBeforePopulate();
    var GPNo = $('#txtGPDate').val();
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    //var CompanyCode = window.localStorage.getItem("companyCode");
    //var CompanyCode = "2";

    var errmsg = "";
    if (GPNo == null || GPNo == "") {
        errmsg = "Enter GP No.</br>";
    }

    inputxml = '<Root><GPNo>' + GPNo + '</GPNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAImportFlightserviceURL + "GetImportFinalDeliveryDetails",
            data: JSON.stringify({ 'InputXML': inputxml }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                //debugger;
                $("body").mLoading('hide');
                var str = response.d;
                var xmlDoc = $.parseXML(str);

                if (str != null && str != "") {
                    //var arr = new Array();
                    //arr = str.split(",");               

                    if ($(str).find('AWBNo').text() != '') {

                        $(xmlDoc).find('Table').each(function (index) {
                            if (index == 0) {

                                $('#txtAWBNo').val($(this).find('AWBNo').text());
                                $('#txtHAWBNo').val($(this).find('HAWB').text());
                                $('#txtPieces').val($(this).find('NOP').text());
                                $('#txtWitnessBy').val(window.localStorage.getItem("UserName"));
                                $('#txtCollectedBy').val($(this).find('CollectedBy').text());
                                $('#txtIdentification').val($(this).find('Identification').text());
                                $('#txtVehicleNo').val($(this).find('VehicleNo').text());
                                $('#txtDriverName').val($(this).find('DriverName').text());

                                $('#lblStatus').text('Status:' + ' ' + $(this).find('Status').text());

                                WdoSeqNo = $(this).find('WDOSeqNo').text();

                            }
                        });
                    }
                    else {
                        errmsg = 'GP number does not exists';
                        $.alert(errmsg);
                        $('#txtGPDate').focus();
                        clearALL();
                    }
                }
                else {
                    errmsg = 'GP number does not exists';
                    $.alert(errmsg);
                    $('#txtGPDate').focus();
                    clearALL();
                }

            },
            error: function (msg) {
                $("body").mLoading('hide');
                var r = jQuery.parseJSON(msg.responseText);
                //alert("Message: " + r.Message);
                $.alert(r.Message);
            }
        });
    }
    else if (connectionStatus == "offline") {
        $("body").mLoading('hide');
        $.alert('No Internet Connection!');
    }
    else if (errmsg != "") {
        $("body").mLoading('hide');
        $.alert(errmsg);
    }
    else {
        $("body").mLoading('hide');
    }
}

function SaveDeliveryDetails() {

    //if ($('#txtDeliveryStatus').val() == 'Delivered') {
    //    $.alert('Shipment already delivered!');
    //    return;
    //}
    var inputxml = "";
    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    if ($('#txtGPDate').val() == "") {

        errmsg = "Please enter Gate Pass No.</br>";
        $.alert(errmsg);
        return;
    }

    //if ($('#txtCollectedBy').val() == "") {

    //    errmsg = "Please enter Collected by</br>";
    //    $.alert(errmsg);
    //    return;
    //}

    //if ($('#txtIdentification').val() == "") {

    //    errmsg = "Please enter Identification</br>";
    //    $.alert(errmsg);
    //    return;
    //}

    inputxml = '<Root><WDOSeqNo>' + WdoSeqNo + '</WDOSeqNo><NOP>' + $('#txtPieces').val() + '</NOP><WitnessBy>' + $('#txtWitnessBy').val() + '</WitnessBy><CollecdtedBy>' + $('#txtCollectedBy').val() + '</CollecdtedBy><IdNo>' + $('#txtIdentification').val() + '</IdNo><VehicleNo>' + $('#txtVehicleNo').val() + '</VehicleNo><DriverName>' + $('#txtDriverName').val() + '</DriverName><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {

        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "ImportFinalDeliverySave",
            data: JSON.stringify({ 'InputXML': inputxml }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                //$('.dialog-background').css('display', 'block');
                $('body').mLoading({
                    text: "Please Wait..",
                });
            },
            success: function (response) {
                $("body").mLoading('hide');
                //$.alert(response.d);

                var str = response.d;
                if (str != null && str != "") {
                    $.alert($(str).find('StrMessage').text());
                    
                }

                clearALL();
                //window.location.reload();
            },
            error: function (msg) {
                $("body").mLoading('hide');
                //var r = jQuery.parseJSON(msg.responseText);
                //alert("Message: " + r.Message);
                $.alert('Some error occurred while saving data');
            }
        });
        return false;
    }

}

//function PutGPno() {

//    if (document.getElementById('chkManual').checked) {
//        var formattedDate = new Date();
//        var d = formattedDate.getDate();
//        if (d.toString().length < Number(2))
//            d = '0' + d;
//        var m = formattedDate.getMonth();
//        m += 1;  // JavaScript months are 0-11
//        if (m.toString().length < Number(2))
//            m = '0' + m;
//        var y = formattedDate.getFullYear();
//        var date = 'N' + y.toString() + m.toString() + d.toString();
//        $('#txtGPDate').val(y.toString().substring(2));
//        $('#txtGPDate').focus();

//    } else {
//        $('#txtGPDate').val('');
//        $('#txtGPDate').focus();
//    }

//}


function clearALL() {
    $('#txtGPDate').val('');
    $('#txtAWBNo').val('');
    $('#txtHAWBNo').val('');
    $('#txtPieces').val('');
    $('#txtWitnessBy').val('');
    $('#txtCollectedBy').val('');
    $('#txtIdentification').val('');
    $('#txtVehicleNo').val('');
    $('#txtDriverName').val('');
    $('#lblStatus').text('Status:');
    $('#txtGPDate').focus();
}
function clearBeforePopulate() {
    $('#txtAWBNo').val('');
    $('#txtHAWBNo').val('');
    $('#txtPieces').val('');
    $('#txtWitnessBy').val('');
    $('#txtCollectedBy').val('');
    $('#txtIdentification').val('');
    $('#txtVehicleNo').val('');
    $('#txtDriverName').val('');
    $('#lblStatus').val('Status:');
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}

