
var GHAserviceURL = "https://rogers.kalelogistics.com/Live/services/hhtimpservices.asmx/";
// var GHAserviceURL = "http://galaxy.kalelogistics.in/RogersHHTUAT/Services/HHTImpServices.asmx/";
// var GHAserviceURL = 'http://113.193.225.59:8080/Rogers/Services/HHTImpServices.asmx/';

var GHAImportFlightserviceURL = 'https://rogers.kalelogistics.com/Live/services/hhtimpservices.asmx/';
// var GHAImportFlightserviceURL = 'http://galaxy.kalelogistics.in/RogersHHTUAT/Services/HHTImpServices.asmx/';
// var GHAImportFlightserviceURL = "http://113.193.225.59:8080/Rogers/Services/HHTimpServices.asmx/";


var GHAExportFlightserviceURL = 'https://rogers.kalelogistics.com/Live/services/hhtexpservices.asmx/';
// var GHAExportFlightserviceURL = 'http://113.193.225.59:8080/Rogers/services/hhtexpservices.asmx/';


//var CMSserviceURL = 'http://localhost:8080/GmaxCMSWebservice/CMS_WS_PDA.asmx/';
// var CMSserviceURL = 'http://113.193.225.59:8080/CELEBIHHTCMS_New/CMS_WS_PDA.asmx/';
//var CMSserviceURL = 'http://52.172.181.171/CELEBICMSHHT/CMS_WS_PDA.asmx/';
//var CMSserviceURL = 'http://52.172.189.217/CELEBIHHTCMS/CMS_WS_PDA.asmx/';
var CMSserviceURL = 'http://113.193.225.59:8080/Rogers/CMS_WS_PDA.asmx/';

document.addEventListener("deviceready", SetRememberLogin, false);
document.addEventListener("backbutton", exitFromApp, false);
$(function () {
    //$(":text").addClear();
    //$(":password").addClear();
    //$('input[type=text]').addClear();
    //$('input[type=password]').addClear();
    if (typeof (MSApp) !== "undefined") {
        MSApp.execUnsafeLocalFunction(function () {
            //$('input[type=text]').addClear();
            //$('input[type=password]').addClear();
        });
    } else {
        $('input[type=text]').addClear();
        $('input[type=password]').addClear();
    }

    clearStorageExcept(['UserName', 'Password', 'IsRememberChecked']);

    SetRememberLogin();
});

function ProcessLogin() {
    //window.location = "GalaxyHome.html";
    //return;

    var errmsg = "";
    var Uname = $('#txtUserName').val();
    var Pass = $('#txtPassword').val();

    window.localStorage.setItem("Uname", Uname);

    var connectionStatus = navigator.onLine ? 'online' : 'offline'

    if (Uname == null || Uname == "") {
        errmsg = errmsg + 'Please enter user id.<br/>';
        $.alert(errmsg);
        return false;
    }

    if (Pass == null || Pass == "") {
        errmsg = errmsg + 'Please enter password.';
        $.alert(errmsg);
        return false;
    }


    SetLoginRolesRights(Uname);

    if (Uname != null && Uname != "" && Pass != null && Pass != "" && connectionStatus == "online") {
        $.ajax({
            type: 'POST',
            url: GHAImportFlightserviceURL + "GetLoginUserDetails",
            data: JSON.stringify({ 'LoginName': Uname, 'Password': Pass }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                HideLoader();
                var str = response.d;
                if (str != null && str != "" && str != "<NewDataSet />") {

                    var xmlDoc = $.parseXML(str);

                    $(xmlDoc).find('Table').each(function (index) {
                        window.localStorage.setItem("UserID", $(this).find('Userid').text());
                        window.localStorage.setItem("UserName", $(this).find('User_Name').text());
                        window.localStorage.setItem("companyCode", $(this).find('CompanyCode').text());
                        window.localStorage.setItem("SHED_AIRPORT_CITY", $(this).find('SHED_AIRPORT_CITY').text());
                        window.localStorage.setItem("SHED_CODE", $(this).find('SHED_CODE').text());

                        window.localStorage.setItem("GHAserviceURL", GHAserviceURL);
                        window.localStorage.setItem("GHAImportFlightserviceURL", GHAImportFlightserviceURL);
                        window.localStorage.setItem("GHAExportFlightserviceURL", GHAExportFlightserviceURL);
                        //window.localStorage.setItem("CargoWorksServiceURL", CargoWorksServiceURL);
                        window.localStorage.setItem("CMSserviceURL", CMSserviceURL);
                        window.localStorage.setItem("CMSserviceURL", CMSserviceURL);

                        window.location = "GalaxyHome.html";
                    });

                }
                else {
                    HideLoader();
                    errmsg = errmsg + 'Invalid username and/or password.';
                    $.alert(errmsg);
                }
            },
            error: function (msg) {
                HideLoader();
                //var r = jQuery.parseJSON(msg.responseText);
                //alert("Message: " + r.Message);
                alert("Login failed due to some error");
            }
        });


        //window.location = "GalaxyHome.html";

        //if (Uname == "VENKATAS" && Pass == "123") {
        //    window.location = "GalaxyHome.html";
        //}
    }
    else if (connectionStatus == "offline") {
        HideLoader();
        $.alert('No Internet Connection!');
    }
    if (errmsg != "") {
        HideLoader();
        $.alert(errmsg);
    }
}

function clearALL() {
    $('#txtUserName').val('');
    $('#txtPassword').val('');
}

function RememberCheck() {
    if ($('#chkRemember').is(':checked')) {
        var UserName = $('#txtUserName').val();
        var PassWord = $('#txtPassword').val();
        window.localStorage.setItem("UserName", UserName);
        window.localStorage.setItem("Password", PassWord);
        window.localStorage.setItem("IsRememberChecked", "true");
    }
    else {
        window.localStorage.setItem("UserName", "");
        window.localStorage.setItem("Password", "");
        window.localStorage.setItem("IsRememberChecked", "false");
    }
}

function SetRememberLogin() {
    var U = window.localStorage.getItem("UserName");
    var P = window.localStorage.getItem("Password");
    var R = window.localStorage.getItem("IsRememberChecked");
    if (R != null && R == "true") {
        $('#chkRemember').prop("checked", true);
    }
    else {
        $('#chkRemember').prop("checked", false);
    }
    if (U != null && U != "") {
        $('#txtUserName').val(U);
    }
    if (P != null && P != "") {
        $('#txtPassword').val(P);
    }

    var connectionStatus = navigator.onLine ? 'online' : 'offline'
    if (connectionStatus == 'offline') {
        $.alert('No Internet Connection!');
        setInterval(function () {
            connectionStatus = navigator.onLine ? 'online' : 'offline';
            if (connectionStatus == 'online') {
            }
            else {
                $.tips('You are offline. Please contact IT helpdesk at +918860130401, 01125601027 </br>Email: ithelpdesk@celebiaviation.in');
            }
        }, 3000);
    }
}

function SetLoginRolesRights() {

    window.localStorage.setItem("RoleImpDashboard", '1');
    window.localStorage.setItem("RoleIMPFlightCheck", '1');
    window.localStorage.setItem("RoleIMPSegregation", '1');
    window.localStorage.setItem("RoleIMPBinning", '1');
    window.localStorage.setItem("RoleIMPIntlMvmt", '1');
    window.localStorage.setItem("RoleIMPFinalDelivery", '1');
    window.localStorage.setItem("RoleIMPDocUpload", '1');

}

function exitFromApp() {
    //console.log("in button");
    clearStorageExcept(['UserName', 'Password', 'IsRememberChecked']);
    navigator.app.exitApp();
}

function onCreateAWB() {
    window.location = "ExpCreateAWB.html";
}
function onSearchAWB() {
    window.location = "ExpSearchAWB.html";
}
function onFlightCheck() {
    window.location = "IMP_FlightCheck.html";
}
function onIMPShipmentLoc() {
    window.location = "IMP_ShipmentLocation.html";
}

clearStorageExcept = function (exceptions) {
    var storage = localStorage;
    var keys = [];
    var exceptions = [].concat(exceptions); //prevent undefined

    //get storage keys
    $.each(localStorage, function (key, val) {
        keys.push(key);
    });

    //loop through keys
    for (i = 0; i < keys.length; i++) {
        var key = keys[i];
        var deleteItem = true;

        //check if key excluded
        for (j = 0; j < exceptions.length; j++) {
            var exception = exceptions[j];
            if (key == exception) {
                deleteItem = false;
            }
        }

        //delete key
        if (deleteItem) {
            localStorage.removeItem(key);
        }
    }
}
