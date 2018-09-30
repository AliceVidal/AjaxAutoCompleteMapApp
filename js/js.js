/* global google */

//Hide county input and town select box
$(function () {
    $("#county").hide();
    $(".select-style").hide();
});

//declare and initilize initialize countries, counties and towns array
var countries = [];
var counties = [];
var towns = [];
//declare and initialize the search variable
var search = "";


//ajax function to retrieve first json string(Called onLoad)
function ajaxGetCountries()
{
    //calls function to display map;
    displayMap();
    
    var fileName = "php/getCountries.php";         // name of file to send request to 
    var method = "POST";                     // use POST method 
    var urlParameterStringToSend = "";       // Construct a url parameter string to POST to fileName 

    var http_request;

    if (window.XMLHttpRequest)
    {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        http_request = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        http_request = new ActiveXObject("Microsoft.XMLHTTP");
    }

    http_request.onreadystatechange = function ()
    {
        if ((http_request.readyState === 4) && (http_request.status === 200)) {
            read_http_request_data(http_request.responseText);
        }
    };

    http_request.open(method, fileName, true);

    http_request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    http_request.send(urlParameterStringToSend);

    function read_http_request_data(responseText)
    {
         
        var jsonData = JSON.parse(responseText); //parse the json string that returns from getCountries.php
        countries = []; //emptys the array
        for (var i = 0; i < jsonData.length; i++) {

            countries.push(['' + jsonData[i].country] + ''); // adding counrty names to countries array
        }
        //calls the jquery autocomplete and uses countries array as source
        $(function () {
            $("#country").autocomplete({  
                source: countries,
                select: function (event, ui) {  
                    postCountry(ui.item.value); //function postCounrty called on select.(ui.item.value = country name selected)

                    search += ui.item.value; // adds country name to search string
                    // search = country
                }
            });
        });
    }
}
function postCountry(data)
{
    // posts country name to getCounties php page 
    var county = data;
    $.ajax({
        type: "POST", // Use post method
        url: 'php/getCounties.php', // path of page
        data: {data: county}, //variable posted
        success: function (data)
        {
            ajaxGetCounties(data); // returns json string of counties
        }
    });
}
function ajaxGetCounties(data)
{
    read_counties(data);
    function read_counties(responseText)
    {
        //parse the json string that returns from getCounties.php
        var jsonData = JSON.parse(responseText);
        counties = []; //emptys the array
        for (var i = 0; i < jsonData.length; i++) {
            counties.push(['' + jsonData[i].name] + '');  // adding counrtie names to counties array
        }
        //ckecks if counties is empty
        if (counties.length > 0) {
            $(function () {
                $("#county").fadeIn(); //if array is populated then show county input box
            });
        } else {
            $(function () {
                $("#county").hide(); // if array is empty then there are no counties associated with the country so the input box is hiden
            });
        }
        //calls the jquery autocomplete and uses counties array as source
        $(function () {
            $("#county").autocomplete({
                source: counties,
                select: function (event, ui) {

                    postTown(ui.item.value); //function postTown called on select.(ui.item.value = county name selected)
                    search += ui.item.value; // adds country name to search string
                    //search = country county
                }
            });
        });
    }
}
function postTown(data)
{
    // posts country name to getTowns php page 
    var towns = data;
    $.ajax({
        type: "POST", // Use post method
        url: 'php/getTowns.php',  // path of page
        data: {data: towns},  //variable posted
        success: function (data)
        {
            ajaxGetTowns(data); // returns json string of towns

        }
    });
}

function ajaxGetTowns(data)
{

    read_Towns(data);
    function read_Towns(responseText)
    {
        //parse the json string that returns from getCounties.php
        var jsonData = JSON.parse(responseText);
        towns = [];
        for (var i = 0; i < jsonData.length; i++) {

            towns.push(['<option value= "' + jsonData[i].townName + '">' + jsonData[i].townName] + '</option>'); // adding town names to towns array with option tags
        }

        $("#town").html(towns); //A string of HTML to set as the content of each matched element.

        $(function () {
            $("#town").change(function () { //onChange jquery functiion
                search += $(this).val(); //adds town name to the search string
                //search = country countie name
            });

        });

        //checks the length of thew towns array if empty hides the town select box 
        if (towns.length > 0) {
            $(function () {
                $(".select-style").show();
                $("#town").show();
            });
        } else {
            $(function () {
                $(".select-style").hide();
            });
        }
    }
}


// map function
function displayMap()
{
    var geocoder;
    var map;
    var address = search; 
    initMap();

    function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 9,
            center: new google.maps.LatLng(53.98485693, -6.39410164)
        });
        geocoder = new google.maps.Geocoder();
        codeAddress(geocoder, map);
    }

    function codeAddress(geocoder, map) {
        geocoder.geocode({'address': address}, function (results, status) {
            if (status === 'OK') {
                map.setCenter(results[0].geometry.location);
                var marker = new google.maps.Marker({

                    map: map,
                    position: results[0].geometry.location
                });
            }
        });
    }

}
