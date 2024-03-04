var CMSserviceURL = '';
var GHAImportFlightserviceURL = window.localStorage.getItem("GHAImportFlightserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var SelectedHawbId;
var IGMno;
var strXmlStore;
var locPieces;
var html;
var FromLoc;
var Hawbid;
var flagMovement;
var serviceName;
var locid;
var OldLocationId;
var IsFlightFinalized;
var GHAflightSeqNo;


$(function () {

    if (window.localStorage.getItem("RoleIMPIntlMvmt") == '0') {
        window.location.href = 'IMP_Dashboard.html';
    }

    flagMovement = '';
    serviceName = '';

    $("#rdoIntlMovement").click(function () {
        rdoIntlMovementChecked();
    });

    $("#rdoForwarding").click(function () {
        rdoForwardingChecked();
    });
});


function rdoIntlMovementChecked() {
    clearALL();
    $('#divForwarding').hide();
    $('#divInternalMvmt').show();
    $('#divDest').show();
    flagMovement = 'I';
}

function rdoForwardingChecked() {
    clearALL();
    $('#divInternalMvmt').hide();
    $('#divDest').hide();
    $('#divForwarding').show();
    flagMovement = 'F';
}

function GetHAWBDetailsForMAWB() {

    IsFlightFinalized = '';
    GHAMawbid = '';
    Hawbid = '';
    GHAhawbid = '';
    GHAflightSeqNo = '';
    html = '';

    $('#txtOrigin').val('');
    $('#txtDestination').val('');
    $('#txtTotalPkg').val('');
    $('#txtCommodity').val('');
    $('#divAddTestLocation').empty();

    var list = new Array();
    var uniqueIgms = [];

    $('#ddlHAWB').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlHAWB');

    $('#ddlIGM').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlIGM');

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var MAWBNo = $('#txtAWBNo').val();

    if (MAWBNo == '') {
        return;
    }

    if (MAWBNo.length != '11') {
        if (MAWBNo.length != '13') {
            errmsg = "Please enter valid AWB No.";
            $.alert(errmsg);
            $('#txtAWBNo').val('');
            return;
        }
    }

    //var inputXML = '<Root><AirWaybillNo>' + MAWBNo + '</AirWaybillNo><HouseNo></HouseNo><AirportCity>' + AirportCity + '</AirportCity><EventType>A</EventType></Root>';
    var inputXML = '<Root><AWBNo>' + MAWBNo + '</AWBNo><HouseNo></HouseNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAImportFlightserviceURL + "GetBinningHawbFlightDetails",
            data: JSON.stringify({ 'InputXML': inputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                //debugger;                
                $("body").mLoading('hide');
                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table').each(function () {

                    var outMsg = $(this).find('Status').text();

                    if (outMsg == 'E') {
                        $.alert($(this).find('StrMessage').text());
                        return;
                    }
                });

                $(xmlDoc).find('Table1').each(function () {

                    var HawbNo = $(this).find('HouseNo').text();

                    if (HawbNo != '') {

                        var HAWBId;
                        var HAWBNos;

                        HAWBId = $(this).find('HouseNo').text();
                        HAWBNos = HawbNo;

                        var newOption = $('<option></option>');
                        newOption.val(HAWBId).text(HAWBNos);
                        newOption.appendTo('#ddlHAWB');
                    }
                });


                $(xmlDoc).find('Table2').each(function () {

                    var Flightid = $(this).find('FlightSeqNo').text();
                    var FlightNo = $(this).find('Flight').text();

                    if (FlightNo != '') {

                        var newOption = $('<option></option>');
                        newOption.val(Flightid).text(FlightNo);
                        newOption.appendTo('#ddlIGM');
                    }
                });

            },
            error: function (msg) {
                //debugger;
                $("body").mLoading('hide');
                var r = jQuery.parseJSON(msg.responseText);
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

function GetHouseLevelDetails() {

    IsFlightFinalized = '';
    GHAMawbid = '';
    Hawbid = '';
    GHAhawbid = '';
    GHAflightSeqNo = '';
    html = '';

    $('#txtOrigin').val('');
    $('#txtDestination').val('');
    $('#txtTotalPkg').val('');
    $('#txtCommodity').val('');
    $('#divAddTestLocation').empty();

    var list = new Array();
    var uniqueIgms = [];

    $('#ddlIGM').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlIGM');

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var MAWBNo = $('#txtAWBNo').val();

    if (MAWBNo == '') {
        return;
    }

    if (MAWBNo.length != '11') {
        if (MAWBNo.length != '13') {
            errmsg = "Please enter valid AWB No.";
            $.alert(errmsg);
            $('#txtAWBNo').val('');
            return;
        }
    }

    //var inputXML = '<Root><AirWaybillNo>' + MAWBNo + '</AirWaybillNo><HouseNo></HouseNo><AirportCity>' + AirportCity + '</AirportCity><EventType>A</EventType></Root>';
    var inputXML = '<Root><AWBNo>' + MAWBNo + '</AWBNo><HouseNo>' + $("#ddlHAWB option:selected").val() + '</HouseNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAImportFlightserviceURL + "GetBinningHawbFlightDetails",
            data: JSON.stringify({ 'InputXML': inputXML }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            beforeSend: function doStuff() {
                $('body').mLoading({
                    text: "Loading..",
                });
            },
            success: function (response) {
                //debugger;                
                $("body").mLoading('hide');
                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table').each(function () {

                    var outMsg = $(this).find('Status').text();

                    if (outMsg == 'E') {
                        $.alert($(this).find('StrMessage').text());
                        return;
                    }
                });


                $(xmlDoc).find('Table2').each(function () {

                    var Flightid = $(this).find('FlightSeqNo').text();
                    var FlightNo = $(this).find('Flight').text();

                    if (FlightNo != '') {

                        var newOption = $('<option></option>');
                        newOption.val(Flightid).text(FlightNo);
                        newOption.appendTo('#ddlIGM');
                    }
                });

            },
            error: function (msg) {
                //debugger;
                $("body").mLoading('hide');
                var r = jQuery.parseJSON(msg.responseText);
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

function GetMovementDetails() {

    GetInternalMovementDetails();

}

function GetInternalMovementDetails() {

    //clearBeforePopulate();
    IsFlightFinalized = '';
    $("#btnSubmit").removeAttr("disabled");

    html = '';
    $('#divAddTestLocation').empty();

    $('#txtFromLoc').val('');
    $('#txtTotPkgs').val('');

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();
    var HAWBNo = $("#ddlHAWB option:selected").text();
    var IgmId = $("#ddlIGM option:selected").val();
    var IgmNo = $("#ddlIGM option:selected").text();
    SelectedHawbId = $("#ddlHAWB option:selected").val();

    if (AWBNo == '') {
        errmsg = "Please enter AWB No.";
        $.alert(errmsg);
        return;
    }

    if (HAWBNo == 'Select') {
        HAWBNo = '';
        // errmsg = "Please select HAWB No.</br>";
        // $.alert(errmsg);
        // return;
    }

    if (IgmNo == 'Select' || IgmNo == '') {
        errmsg = "Please select Flight number</br>";
        $.alert(errmsg);
        return;
    }

    GetMovementDetailsFromGHA();
}

function GetMovementDetailsFromGHA() {


    $("#btnSubmit").removeAttr("disabled");

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();
    var HAWBNo = $("#ddlHAWB option:selected").text();
    var IgmNo = $("#ddlIGM option:selected").text();

    var IgmVal = $("#ddlIGM option:selected").val();

    if (HAWBNo == 'Select') {
        HAWBNo = '';
    }

    SelectedHawbId = $("#ddlHAWB option:selected").val();

    //var inputXML = '<Root><AWBNo>' + AWBNo + '</AWBNo><HouseNo>' + HAWBNo + '</HouseNo><IGMNo>' + IgmVal + '</IGMNo><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';
    var inputXML = '<Root><AWBNo>' + AWBNo + '</AWBNo><HouseNo>' + HAWBNo + '</HouseNo><FlightSeqNo>' + IgmVal + '</FlightSeqNo><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAImportFlightserviceURL + "GetBinningLocPkgDetails",
            data: JSON.stringify({ 'InputXML': inputXML }),
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

                strXmlStore = str;

                if (str != null && str != "") {

                    $('#divAddTestLocation').empty();
                    html = '';

                    html = "<table id='tblNews' border='1' style='width:100%;table-layout:fixed;word-break:break-word;border-color: white;margin-top: 2%;'>";
                    html += "<thead><tr>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Location</th>";
                    html += "<th height='30' style='background-color:rgb(208, 225, 244);padding: 3px 3px 3px 0px;font-size:14px' align='center'font-weight:'bold'>Binned Pkgs.</th>";
                    html += "</tr></thead>";
                    html += "<tbody>";

                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table1').each(function (index) {

                        var outMsg = $(this).find('Status').text();

                        if (outMsg == 'E') {
                            $.alert($(this).find('StrMessage').text());
                            return;
                        }

                        var location;

                        location = $(this).find('LocCode').text().toUpperCase();
                        locPieces = $(this).find('LocPieces').text();

                        $('#txtOrigin').val($(this).find('Origin').text());
                        $('#txtDestination').val($(this).find('Destination').text());

                        AddTableLocation(location, locPieces);

                        if (index == 0) {
                            $('#txtTotalPkg').val($(this).find('LocationStatus').text());
                            $('#txtCommodity').val($(this).find('Commodity').text());
                            Hawbid = $(this).find('HAWBId').text();
                        }

                        var remainingPieces = $(this).find('RemainingPieces').text().substr(0, $(this).find('RemainingPieces').text().indexOf('/'));

                        // if (remainingPieces == 0)
                        //     $("#btnSubmit").attr("disabled", "disabled");
                    });

                    html += "</tbody></table>";

                    if (locPieces != '0' && locPieces != '')
                        $('#divAddTestLocation').append(html);
                }
                else {
                    errmsg = 'Shipment does not exists';
                    $.alert(errmsg);
                }

            },
            error: function (msg) {
                $("body").mLoading('hide');
                var r = jQuery.parseJSON(msg.responseText);
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

function SaveMovementDetails() {
    SaveInternalForwardDetailsForGHA();
}

function SaveInternalForwardDetailsForGHA() {

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    var AWBNo = $('#txtAWBNo').val();

    if (AWBNo == '') {
        errmsg = "Please enter AWB No.";
        $.alert(errmsg);
        return;
    }

    var IgmId = $("#ddlIGM option:selected").val();

    var FromLoc = $('#txtFromLoc').val().toUpperCase();
    var TotalPIECESno = $('#txtTotPkgs').val();
    var MovePIECESno = $('#txtMovePkgs').val();
    var NewLoc = $('#txtNewLoc').val().toUpperCase();
    var NewVolume = $('#txtNewVol').val();

    if (FromLoc == "" || TotalPIECESno == "") {

        errmsg = "From location and pckgs not selected.</br>";
        $.alert(errmsg);
        return;

    }

    if (MovePIECESno == "" || NewLoc == "") {

        errmsg = "Please enter move pckgs and new location.</br>";
        $.alert(errmsg);
        return;

    }

    if (NewVolume == "") {
        NewVolume = 0;
    }

    SelectedHawbNo = $("#ddlHAWB option:selected").text();

    if (SelectedHawbNo == '' || SelectedHawbNo == '0') {
        //SelectedHawbId = Hawbid;
        SelectedHawbNo = '';
    }

    //var inputXML = '<Root><MAWBID>' + GHAMawbid + '</MAWBID><HAWBID>' + GHAhawbid + '</HAWBID><IGMNo>' + IgmNo + '</IGMNo><FlightSeqNo>' + GHAflightSeqNo + '</FlightSeqNo><LocCode>' + location + '</LocCode><NOP>' + BinnPckgs + '</NOP><Weight></Weight><LocId></LocId><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';

    var inputXML = '<Root><AWBNo>' + AWBNo + '</AWBNo><HouseNo>' + SelectedHawbNo + '</HouseNo><FlightSeqNo>' + IgmId + '</FlightSeqNo><LocCode>' + NewLoc + '</LocCode><LocId>' + OldLocationId + '</LocId><NOP>' + MovePIECESno + '</NOP><Volume>' + NewVolume + '</Volume><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "SaveBinning",
            data: JSON.stringify({ 'InputXML': inputXML }),
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

                response = response.d;
                var xmlDoc = $.parseXML(response);

                $(xmlDoc).find('Table').each(function () {

                    if ($(this).find('StrMessage').text() != '')
                        $.alert($(this).find('StrMessage').text());
                    else
                        $.alert('Success');
                });

                $('#txtFromLoc').val('');
                $('#txtTotPkgs').val('');
                $('#txtMovePkgs').val('');
                $('#txtNewLoc').val('');
                $('#txtNewVol').val('');
                GetMovementDetailsFromGHA();
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert(msg.d);
            }
        });
        return false;
    }

}

function AddTableLocation(loc, locpieces) {

    html += "<tr onclick='SelectLocationInfo(this);'>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + loc + "</td>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + locpieces + "</td>";
    html += "</tr>";

}

function AddTableLocationGHA(loc, locpieces) {

    html += "<tr onclick='SelectLocationInfoGHA(this);'>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + loc + "</td>";

    html += "<td height='30' style='background: rgb(224, 243, 215);padding-left: 4px;font-size:14px'align='center'>" + locpieces + "</td>";
    html += "</tr>";

}

function SelectLocationInfo(a) {

    var xmlDoc = $.parseXML(strXmlStore);

    $(xmlDoc).find('Table1').each(function (index) {

        if (index == a.rowIndex - 1) {
            $('#txtFromLoc').val($(this).find('LocCode').text());
            $('#txtTotPkgs').val($(this).find('LocPieces').text());
            OldLocationId = $(this).find('LocId').text();
            IGMno = $(this).find('IGMNo').text();
            FromLoc = $(this).find('LocId').text();
        }

    });
}

function SelectLocationInfoGHA(a) {

    var xmlDoc = $.parseXML(strXmlStore);

    $(xmlDoc).find('Table1').each(function (index) {

        if (index == a.rowIndex - 1) {
            $('#txtFromLoc').val($(this).find('LocCode').text());
            $('#txtTotPkgs').val($(this).find('LocPieces').text());
            OldLocationId = $(this).find('LocId').text();
            IGMno = $(this).find('IGMNo').text();
            FromLoc = $(this).find('LocId').text();
        }

    });
}

function ClearIGM() {

    $('#ddlIGM').empty();
}

function clearALL() {
    $('#txtAWBNo').val('');
    $('#txtOrigin').val('');
    $('#txtDestination').val('');
    $('#txtFromLoc').val('');
    $('#txtTotPkgs').val('');
    $('#txtMovePkgs').val('');
    $('#txtNewLoc').val('');
    $('#divAddTestLocation').empty();
    $('#ddlIGM').val(0);
    $('#ddlHAWB').val(0);
    $('#txtBCNo').val('');
    $('#txtNewVol').val('');
    $('#txtAWBNo').focus();
}

function clearBeforePopulate() {
    $('#txtFromLoc').val('');
    $('#txtTotPkgs').val('');
    $('#txtMovePkgs').val('');
    $('#txtNewLoc').val('');
}


function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}

$(function () {
    $("#txtBCDate").datepicker({
        dateFormat: "dd/mm/yy"
    });
    $("#txtBCDate").datepicker().datepicker("setDate", new Date());
});
