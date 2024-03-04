﻿
var GHAImportFlightserviceURL = window.localStorage.getItem("GHAImportFlightserviceURL");
var AirportCity = window.localStorage.getItem("SHED_AIRPORT_CITY");
var flightSeqNo;
var ULDSeqNo;
var isFoundCargo;
var flightPrefix;
var flightNo;
var flightDate;
var selectedRowULDNo;
var selectedRowAWBNo;
var selectedRowHAWBNo;
var selectedRowULDid;
var xmlDamageType;
var mawbInd;

var showAll = 'N';

$(function () {
    flightPrefix = amplify.store("flightPrefix");
    flightNo = amplify.store("flightNo");
    flightDisplayDate = amplify.store("flightDisplayDate");
    flightDate = amplify.store("flightDate");

    selectedRowULDNo = amplify.store("selectedRowULDNo");
    selectedRowAWBNo = amplify.store("selectedRowAWBNo");
    selectedRowHAWBNo = amplify.store("selectedRowHAWBNo");
    selectedRowULDid = amplify.store("selectedRowULDid");

    if (selectedRowULDNo != '') {
        //showAll = 'Y';
        chkShowAll.checked = true;
    }

    $('#txtFltNo').val(flightPrefix + flightNo);
    $('#txtFltDate').val(flightDisplayDate);
    flightSeqNo = amplify.store("flightSeqNo");
    if (flightSeqNo != "") {
        GetULDDetails();
    }
    $("#ddlULDNo").focus().select();
});

function BacktoFlightCheck() {
    // set urs global variable here
    //amplify.store("flightSeqNo", flightSeqNo)
    window.localStorage.setItem('backPressed', true);
    amplify.store("flightPrefix", flightPrefix)
    amplify.store("flightNo", flightNo)
    amplify.store("flightDate", flightDate)
    window.location.href = 'IMP_FlightCheck.html';
}

function GetULDDetails() {

    clearPiecesInfo();



    $('#ddlULDNo').empty();
    $('#ddlDamageType').empty();

    $('#ddlAWBNo').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlAWBNo');

    $('#ddlHAWBNo').empty();
    var newOption = $('<option></option>');
    newOption.val(0).text('Select');
    newOption.appendTo('#ddlHAWBNo');

    if (chkShowAll.checked || selectedRowULDNo != '')
        showAll = 'Y';
    else
        showAll = 'N';

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    var flightCheckUldSeqNo = '';

    if (selectedRowULDid > Number(0))
        flightCheckUldSeqNo = selectedRowULDid;

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo></UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + flightCheckUldSeqNo + '</UlDSeqNo><AWBId></AWBId><HAWBId></HAWBId><AirportCity>' + AirportCity + '</AirportCity><ShowAll>' + showAll + '</ShowAll></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "GetImportULDDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                xmlDamageType = xmlDoc;

                $(xmlDoc).find('Table1').each(function (index) {

                    var ULDId;
                    var ULD;
                    ULDId = $(this).find('ULDId').text();
                    ULD = $(this).find('ULD').text();

                    var newOption = $('<option></option>');
                    newOption.val(ULDId).text(ULD);
                    newOption.appendTo('#ddlULDNo');

                    if (selectedRowULDNo != '') {
                        $("#ddlULDNo option").each(function () {
                            if ($(this).text() == selectedRowULDNo) {
                                $(this).attr('selected', 'selected');
                                //var selectedMawbId = $(this).val();

                                //GetHAWBDetails(selectedMawbId);
                            }
                        });

                    }

                    if (index == 0) {
                        ULDSeqNo = ULDId;
                    }

                    // amplify.store("flightSeqNo", "")
                    // amplify.store("flightPrefix", "")
                    // amplify.store("flightNo", "")
                    // amplify.store("flightDate", "")
                    // amplify.store("flightDisplayDate", "")

                    // amplify.store("selectedRowULDNo", "")
                    // amplify.store("selectedRowAWBNo", "")
                    // amplify.store("selectedRowHAWBNo", "")
                    // amplify.store("selectedRowULDid", "")

                });

                $(xmlDoc).find('Table2').each(function () {

                    var AWBId;
                    var AWBNo;
                    AWBId = $(this).find('AWBID').text();
                    AWBNo = $(this).find('AWBPrefix').text() + '-' + $(this).find('AWBNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(AWBId).text(AWBNo);
                    newOption.appendTo('#ddlAWBNo');

                    if (selectedRowAWBNo != '') {
                        $("#ddlAWBNo option").each(function () {
                            if ($(this).text() == selectedRowAWBNo) {
                                $(this).attr('selected', 'selected');
                                var selectedMawbId = $(this).val();

                                GetHAWBDetails(selectedMawbId);
                            }
                        });
                    }

                });
                $(xmlDoc).find('Table4').each(function () {
                    mawbInd = $(this).find('MAWB_IND').text();
                });

                $(xmlDoc).find('Table5').each(function () {

                    var AWBId;
                    var AWBNo;
                    DamageCode = $(this).find('DamageCode').text();
                    DamageType = $(this).find('DamageType').text();

                    var newOption = $('<option></option>');
                    newOption.val(DamageCode).text(DamageType);
                    newOption.appendTo('#ddlDamageType');

                });
            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Data could not be loaded');
            }
        });
        return false;
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

function GetAWBDetailsForULD(ULDid) {

    if (chkShowAll.checked || selectedRowULDNo != '')
        showAll = 'Y';
    else
        showAll = 'N';

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    clearPiecesInfo();

    ULDSeqNo = ULDid;

    inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + ULDid + '</UlDSeqNo><AirportCity>' + AirportCity + '</AirportCity><ShowAll>' + showAll + '</ShowAll></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "GetImportULDDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);
                $(ddlAWBNo).empty();
                var newddlAWBNoOption = $('<option></option>');
                newddlAWBNoOption.val(0).text('Select');
                newddlAWBNoOption.appendTo('#ddlAWBNo');

                $(xmlDoc).find('Table2').each(function (index) {

                    var AWBId;
                    var AWBNo;
                    AWBId = $(this).find('AWBID').text();
                    AWBNo = $(this).find('AWBPrefix').text() + '-' + $(this).find('AWBNo').text();

                    if (index == 0) {
                        $(ddlAWBNo).empty();
                        var newOption = $('<option></option>');
                        newOption.val(0).text('Select');
                        newOption.appendTo('#ddlAWBNo');
                    }

                    var newOption = $('<option></option>');
                    newOption.val(AWBId).text(AWBNo);
                    newOption.appendTo('#ddlAWBNo');

                });

                $(xmlDoc).find('Table4').each(function () {
                    mawbInd = $(this).find('MAWB_IND').text();
                });

            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Data could not be loaded');
            }
        });
        return false;
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

function UpdateAWBDetails() {

    var isOverride = 'N';

    var selectedUld;
    var selectedAWB;
    var selectedHAWB;

    selectedUld = $('#ddlULDNo').find('option:selected').text();
    selectedAWB = $('#ddlAWBNo').find('option:selected').text();
    selectedHAWB = $('#ddlHAWBNo').find('option:selected').text();
    if (selectedAWB == "Select") {
        $.alert("Please select MAWB No.");
        return;
    }

    if (selectedHAWB == "Select" && mawbInd == "M") {
        $.alert("Please select HAWB No.");
        return;
    }

    if (document.getElementById('chkFoundCgo').checked) {

        if ($('#txtFoundMAWB').val() == "" && $('#txtFoundHAWB').val() == "") {
            errmsg = "Please enter found cargo MAWB/HAWB No.";
            $.alert(errmsg);
            return;
        }

        if ($('#txtFoundPkgs').val() == "") {
            errmsg = "Please enter found pkgs";
            $.alert(errmsg);
            return;
        }

        if ($('#txtFoundPkgsWt').val() == "") {
            errmsg = "Please enter found pkgs wt.";
            $.alert(errmsg);
            return;
        }
    }
    else {
        if ($('#txtArrivedPkgs').val() == "" && $('#txtDamagePkgs').val() == "") {
            errmsg = "Please enter Arrived pkgs";
            $.alert(errmsg);
            return;
        }
    }

    if (document.getElementById('chkModify').checked)
        isOverride = 'Y';
    else
        isoverride = 'N';

    if ($('#txtDamagePkgs').val() != '' && $('#txtDamageWt').val() == '') {
        errmsg = "Please enter damage weight";
        $.alert(errmsg);
        return;
    }

    if ($('#txtDamagePkgs').val() != '' && $('#ddlDamageType').find('option:selected').text() == 'Select') {
        errmsg = "Please select damage type";
        $.alert(errmsg);
        return;
    }

    var inputXML;
    var serviceName;

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    var errmsg = "";

    if (isFoundCargo == 'true') {
        //inputXML = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + ULDSeqNo + '</UlDSeqNo><AWBNO>MLM</AWBNO><HAWBNO></HAWBNO><NPR>' + $('#txtFoundPkgs').val() + '</NPR><WtRec>' + $('#txtFoundPkgsWt').val() + '</WtRec><DMGPsc>' + $('#txtDamagePkgs').val() + '</DMGPsc><DMGWt></DMGWt><DMGCode></DMGCode><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';
        inputXML = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + ULDSeqNo + '</UlDSeqNo><AWBNO>' + $('#txtFoundMAWB').val() + '</AWBNO><HAWBNO>' + $('#txtFoundHAWB').val() + '</HAWBNO><NPR>' + $('#txtFoundPkgs').val() + '</NPR><WtRec>' + $('#txtFoundPkgsWt').val() + '</WtRec><DMGPsc>' + $('#txtDamagePkgs').val() + '</DMGPsc><DMGWt>' + $('#txtDamageWt').val() + '</DMGWt><DMGCode>' + $('#ddlDamageType').find('option:selected').val() + '</DMGCode><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity></Root>';
        serviceName = 'SaveImportFoundCargoDetails';
    }
    else {
        inputXML = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + ULDSeqNo + '</UlDSeqNo><AWBId>' + $('#ddlAWBNo').find('option:selected').val() + '</AWBId><HAWBId>' + $('#ddlHAWBNo').find('option:selected').val() + '</HAWBId><NPR>' + $('#txtArrivedPkgs').val() + '</NPR><DMGPsc>' + $('#txtDamagePkgs').val() + '</DMGPsc><DMGWt>' + $('#txtDamageWt').val() + '</DMGWt><DMGCode>' + $('#ddlDamageType').find('option:selected').val() + '</DMGCode><UserId>' + window.localStorage.getItem("UserID") + '</UserId><AirportCity>' + AirportCity + '</AirportCity><IsOverride>' + isOverride + '</IsOverride></Root>';
        serviceName = 'SaveImportMaifestDetails';
    }


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + serviceName,
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

                $('#ddlAWBNo').val(0);
                $('#ddlHAWBNo').val(0);
                $('#txtAwbNo').val('');
                $('#txtFoundMAWB').val('')
                $('#txtFoundHAWB').val('');
                $('#txtMnifestedPkg').val('');
                $('#txtArrivedPkgs').val('');
                $('#txtDamagePkgs').val('');
                $('#txtDamageWt').val('');
                $('#ddlDamageType').val(0);
                $('#txtFoundPkgs').val('');
                $('#txtFoundPkgsWt').val('');

                GetULDDetails();


                //$("#ddlULDNo option").each(function () {
                //    if ($(this).text() == selectedUld) {
                //        $(this).attr('selected', 'selected');
                //    }
                //});

                //$("#ddlAWBNo option").each(function () {
                //    if ($(this).text() == selectedAWB) {
                //        $(this).attr('selected', 'selected');
                //    }
                //});

                //$("#ddlHAWBNo option").each(function () {
                //    if ($(this).text() == selectedHAWB) {
                //        $(this).attr('selected', 'selected');
                //    }
                //});



            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Some error occurred while saving data');
            }
        });
        return false;
    }

}

function GetHAWBDetails(AWBid) {

    if (chkShowAll.checked || selectedRowULDNo != '')
        showAll = 'Y';
    else
        showAll = 'N';

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    clearPiecesInfo();

    var UldId = $("#ddlULDNo option:selected").val();

    inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + UldId + '</UlDSeqNo><AWBId>' + AWBid + '</AWBId><HAWBId></HAWBId><AirportCity>' + AirportCity + '</AirportCity><ShowAll>' + showAll + '</ShowAll></Root>';


    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            url: GHAImportFlightserviceURL + "GetImportULDDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                $(ddlHAWBNo).empty();
                var newOption = $('<option></option>');
                newOption.val('0').text('Select');
                newOption.appendTo('#ddlHAWBNo');

                var houseCount = 0;

                $(xmlDoc).find('Table3').each(function (index) {
                    houseCount++;
                });


                $(xmlDoc).find('Table3').each(function (index) {

                    var HAWBId;
                    var HAWBNo;
                    HAWBId = $(this).find('HAWBID').text();
                    HAWBNo = $(this).find('HouseNo').text();

                    var newOption = $('<option></option>');
                    newOption.val(HAWBId).text(HAWBNo);
                    newOption.appendTo('#ddlHAWBNo');

                    if (selectedRowHAWBNo != '') {
                        $("#ddlHAWBNo option").each(function () {
                            if ($(this).text() == selectedRowHAWBNo) {
                                $(this).attr('selected', 'selected');
                                var selectedHawbId = $(this).val();

                                GetHAWBLevelPiecesDetails(selectedHawbId);
                            }
                        });
                    } else {
                        GetHAWBLevelPiecesDetails("");
                    }

                });


                $(xmlDoc).find('Table4').each(function () {
                    mawbInd = $(this).find('MAWB_IND').text();

                    if (houseCount == 0) {
                        $('#txtMnifestedPkg').val($(this).find('NPX').text());

                        $('#txtReceivedPkgs').val($(this).find('NPR').text());
                        $('#txtRemainingPkgs').val($(this).find('RemNOP').text());
                    }

                    if ($(this).find('DmgPkgs').text() != 0) {
                        $('#txtDamagePkgsView').val($(this).find('DmgPkgs').text());
                        $('#txtDamageWtView').val($(this).find('DmgWt').text());
                    }

                });

            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Data could not be loaded');
            }
        });
        return false;
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

function GetHAWBLevelPiecesDetails(HAWBid) {
    var AWBId = "";
    if (HAWBid == "" || HAWBid == "0") {
        HAWBid = "";
    } else {
    }
    AWBId = $("#ddlAWBNo option:selected").val();

    if (chkShowAll.checked)
        showAll = 'Y';
    else
        showAll = 'N';

    var inputxml = "";

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    var errmsg = "";

    clearPiecesInfo();


    var UldId = $("#ddlULDNo option:selected").val();

    //inputxml = '<Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + UldId + '</UlDSeqNo><AWBId>' + AWBid + '</AWBId><HAWBId></HAWBId><AirportCity>' + AirportCity + '</AirportCity></Root>';

    inputxml = ' <Root><FlightSeqNo>' + flightSeqNo + '</FlightSeqNo><UlDSeqNo>' + UldId + '</UlDSeqNo><AWBId>' + AWBId + '</AWBId><HAWBId>' + HAWBid + '</HAWBId><AirportCity>' + AirportCity + '</AirportCity><ShowAll>' + showAll + '</ShowAll></Root>';

    if (errmsg == "" && connectionStatus == "online") {
        $.ajax({
            type: "POST",
            //url: GHAImportFlightserviceURL + "GetImportHouseDetails",
            url: GHAImportFlightserviceURL + "GetImportULDDetails",
            data: JSON.stringify({
                'InputXML': inputxml,
            }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (Result) {
                Result = Result.d;
                var xmlDoc = $.parseXML(Result);

                $(xmlDoc).find('Table4').each(function () {
                    mawbInd = $(this).find('MAWB_IND').text();

                    $('#txtMnifestedPkg').val($(this).find('NPX').text());
                    $('#txtReceivedPkgs').val($(this).find('NPR').text());
                    $('#txtRemainingPkgs').val($(this).find('RemNOP').text());

                    $('#txtDamagePkgsView').val($(this).find('DmgPkgs').text());
                    $('#txtDamageWtView').val($(this).find('DmgWt').text());

                });

            },
            error: function (msg) {
                $("body").mLoading('hide');
                $.alert('Data could not be loaded');
            }
        });
        return false;
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

function EnableFoundCargo() {
    clearALL();
    // $("#chkFoundCgo").prop("checked", true);

    if (document.getElementById('chkFoundCgo').checked) {
        $('#divNormalCargo').hide();
        $('#divFoundCargo').show();
        $('#foundCargoHint').show();
        $('#divArrivedPkgs').hide();
        $('#divFoundCgoDetails').show();
        //$('#ddlDamageType').val(0);
        isFoundCargo = 'true';

        $('#ddlDamageType').empty();
        $(xmlDamageType).find('Table5').each(function () {

            var AWBId;
            var AWBNo;
            DamageCode = $(this).find('DamageCode').text();
            DamageType = $(this).find('DamageType').text();

            var newOption = $('<option></option>');
            newOption.val(DamageCode).text(DamageType);
            newOption.appendTo('#ddlDamageType');

        });

    }
    else {
        $('#divNormalCargo').show();
        $('#divFoundCargo').hide();
        $('#foundCargoHint').hide();
        $('#divArrivedPkgs').show();
        $('#divFoundCgoDetails').hide();
        //$('#ddlDamageType').val(0);
        isFoundCargo = '';

        $('#ddlDamageType').empty();
        $(xmlDamageType).find('Table5').each(function () {

            var AWBId;
            var AWBNo;
            DamageCode = $(this).find('DamageCode').text();
            DamageType = $(this).find('DamageType').text();

            var newOption = $('<option></option>');
            newOption.val(DamageCode).text(DamageType);
            newOption.appendTo('#ddlDamageType');

        });
    }
}

function clearALL() {
    $('#txtAwbNo').val('');
    $('#txtFoundMAWB').val('')
    $('#txtFoundHAWB').val('');
    $('#txtMnifestedPkg').val('');
    $('#txtArrivedPkgs').val('');
    $('#txtDamagePkgs').val('');
    $('#txtDamageWt').val('');
    $('#ddlDamageType').val(0);
    $('#txtFoundPkgs').val('');
    $('#txtFoundPkgsWt').val('');
    $('#ddlAWBNo').val(0);
    $('#ddlHAWBNo').val(0);
    $('#txtReceivedPkgs').val('');
    $('#txtRemainingPkgs').val('');
    $('#txtDamagePkgsView').val('');
    $('#txtDamageWtView').val('');
    $("#ddlULDNo").val("0")

    $('#divNormalCargo').show();
    $('#divFoundCargo').hide();
    $('#foundCargoHint').hide();
    $('#divArrivedPkgs').show();
    $('#divFoundCgoDetails').hide();
    //$('#ddlDamageType').val(0);
    isFoundCargo = '';
    $(ddlHAWBNo).empty();
    var newOption = $('<option></option>');
    newOption.val('0').text('Select');
    newOption.appendTo('#ddlHAWBNo');

    $('#ddlDamageType').empty();
    $(xmlDamageType).find('Table5').each(function () {

        var AWBId;
        var AWBNo;
        DamageCode = $(this).find('DamageCode').text();
        DamageType = $(this).find('DamageType').text();

        var newOption = $('<option></option>');
        newOption.val(DamageCode).text(DamageType);
        newOption.appendTo('#ddlDamageType');

    });
    if ($('#ddlULDNo').val() != 'Select') {
        GetAWBDetailsForULD($('#ddlULDNo').val());
    }
}

function resetCheckBoxes() {
    $("#chkFoundCgo").prop("checked", false);
    $("#chkModify").prop("checked", false);
    $("#chkShowAll").prop("checked", false);
}

function ShowALLRefresh() {
    clearALL();
    // $("#chkShowAll").prop("checked", true);

    GetULDDetails()
}

function clearPiecesInfo() {
    $('#txtMnifestedPkg').val('');
    $('#txtArrivedPkgs').val('');
    $('#txtFoundPkgs').val('');
    $('#txtFoundPkgsWt').val('');
    $('#txtReceivedPkgs').val('');
    $('#txtRemainingPkgs').val('');
    $('#txtDamagePkgsView').val('');
    $('#txtDamageWtView').val('');
    $('#txtDamagePkgs').val('');
    $('#txtDamageWt').val('');
}

function ClearError(ID) {
    $("#" + ID).css("background-color", "#e7ffb5");
}
function ClearFields() {
    $('.ClearFields input[type=text]').val("");
}


