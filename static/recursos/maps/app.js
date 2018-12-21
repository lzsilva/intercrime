// See post: http://asmaloney.com/2015/06/code/clustering-markers-on-leaflet-maps

var csrftoken = getCookie('csrftoken');

var map = L.map('map', {
    center: [10.0, 5.0],
    minZoom: 2,
    zoom: 2
});


var legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend form-group crimes');
    div.innerHTML = '<label for="select1">Crimes</label>\n' +
        '<select class="form-control" id="select1"><option></option><option>HOMICIDE</option><option>THEFT</option><option>MOTOR VEHICLE THEFT</option><option>CRIMINAL TRESPASS</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend.addTo(map);


var legend = L.control({position: 'topleft'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend form-group');
    div.innerHTML = '<label for="date-input1" class="col-form-label">Data inicial</label>\n' +
        '  <div>\n' +
        '    <input class="form-control" type="date" id="date-input1">\n' +
        '  </div>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend.addTo(map);

var legend = L.control({position: 'topleft'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend form-group');
    div.innerHTML = '<label for="date-input2" class="col-form-label">Data final</label>\n' +
        '  <div>\n' +
        '    <input class="form-control" type="date" id="date-input2">\n' +
        '  </div>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend.addTo(map);

crimeClicado = 'Crime';
dateInicial = undefined;
dateFinal = undefined;

url_base = "http://localhost:8010/exibir_mapa/";

url_busca = ""

url_data_inicio = '';
url_data_fim = '';

$('select').on('change', function () {
    crimeClicado = this.value;

    url_crime = '?crime_escolhido=' + crimeClicado;


    url_busca = url_base + url_crime + "&data_inicio=" + url_data_inicio + "&data_fim=" + url_data_fim;

    window.location.href = url_busca;

});


$('#date-input1').change(function () {
    if ($('#date-input1').val() !== '') {
        dateInicial = $('#date-input1').val();
        url_data_inicio = dateInicial;
        //
        // $.ajax({
        //     method: 'GET',
        //     url: '',
        //     data: {"data_inicio":dateInicial, "data_fim": dateFinal, "crime_escolhido":crimeClicado},
        //     success: function (data) {
        //         console.log(data);
        //     },
        //     error: function (data) {
        //     }
        // });
        //
        // if($('#date-input2').val() === '')
        //     initMap(crimeClicado, dateInicial, dateInicial);
        // else
        //     initMap(crimeClicado, dateInicial, dateFinal);
    }
});

$('#date-input2').change(function () {
    if ($('#date-input2').val() !== '') {
        dateFinal = $('#date-input2').val();
        url_data_fim = dateFinal;
        // $.ajax({
        //     method: 'GET',
        //     url: '',
        //     data: {"data_inicio":dateInicial, "data_fim": dateFinal, "crime_escolhido":crimeClicado},
        //     success: function (data) {
        //     },
        //     error: function (data) {
        //     }
        // });
        //
        // if($('#date-input1').val() === '')
        //     initMap(crimeClicado, dateFinal, dateFinal);
        // else
        //     initMap(crimeClicado, dateInicial, dateFinal);
    }
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a', 'b', 'c']
}).addTo(map);

var myURL = jQuery('script[src$="app.js"]').attr('src').replace('app.js', '');

var myIcon = L.icon({
    iconUrl: myURL + 'images/pin24.png',
    iconRetinaUrl: myURL + 'images/pin48.png',
    iconSize: [29, 24],
    iconAnchor: [9, 21],
    popupAnchor: [0, -14]
});

var markerClusters = L.markerClusterGroup();

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

initMap(crimeClicado, dateFinal, dateFinal);

function initMap(crimeClicado, dateInicial, dateFinal) {

    markerClusters.clearLayers();


    if (!(crimeClicado == '') && !(crimeClicado == 'Crime'))
        filtros["crime_type"] = crimeClicado;


    $.each(crimes, function (i, crime) {

        var houve_prisao = crime.arrest ? 'Sim' : 'Não';


        var popup = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">' + crime.crime_type+ '</h1>' +
            '<div id="bodyContent">' +
            '<p><b>Location:</b> ' + crime.location_description  + '</p>' +
            '<p><b>Descrição do crime:</b> ' + crime.description + '</p>' +
            '<p><b>Bloco:</b> ' + crime.block + '</p>' +
            '<p><b>Data do evento:</b> ' + crime.date + '</p>' +
            '<p><b>Houve prisão:</b> ' + houve_prisao + '</p>' +
            '<p><b>Ano:</b> ' + crime.year + '</p>' +

            '<p>Coordenadas:</p>' +
            '<p><b>Latitude:</b> ' + crime.lat + '</p>' +
            '<p><b>Longitude:</b> ' + crime.lon + '</p>' +
            '</div>' +
            '</div>';

        if (crime.lat && crime.lon) {
            var m = L.marker([crime.lat, crime.lon], {icon: myIcon})
                .bindPopup(popup);

            markerClusters.addLayer(m);
        }
    });

    // $.post("", filtros, function (data, textStatus) {
    //
    // $.each(data.resources, function (i, recurso) {
    //     $.each(recurso.capabilities.incidencia_crime, function (j, crime) {
    //
    //         var houve_prisao = crime.arrest ? 'Sim' : 'Não';
    //
    //         var popup = '<div id="content">' +
    //             '<div id="siteNotice">' +
    //             '</div>' +
    //             '<h1 id="firstHeading" class="firstHeading">' + crime.location_description + '</h1>' +
    //             '<div id="bodyContent">' +
    //             '<p><b>Crime primário:</b> ' + crime.crime_type + '</p>' +
    //             '<p><b>Descrição do crime:</b> ' + crime.description + '</p>' +
    //             '<p><b>Bloco:</b> ' + crime.block + '</p>' +
    //             '<p><b>Data do evento:</b> ' + crime.date + '</p>' +
    //             '<p><b>Houve prisão:</b> ' + houve_prisao + '</p>' +
    //             '<p><b>Ano:</b> ' + crime.year + '</p>' +
    //
    //             '<p>Coordenadas:</p>' +
    //             '<p><b>Latitude:</b> ' + crime.lat + '</p>' +
    //             '<p><b>Longitude:</b> ' + crime.lon + '</p>' +
    //             '</div>' +
    //             '</div>';
    //
    //         if (crime.lat && crime.lon) {
    //
    //             var m = L.marker([crime.lat, crime.lon], {icon: myIcon})
    //                 .bindPopup(popup);
    //
    //             markerClusters.addLayer(m);
    //         }
    //
    //     });
    //
    // });
    // }, "json");

    map.addLayer(markerClusters);

}
