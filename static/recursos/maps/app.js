// See post: http://asmaloney.com/2015/06/code/clustering-markers-on-leaflet-maps


var map = L.map('map', {
    center: [10.0, 5.0],
    minZoom: 2,
    zoom: 2
});


var legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend crimes');
    div.innerHTML = '<select><option></option><option>HOMICIDE</option><option>THEFT</option><option>MOTOR VEHICLE THEFT</option><option>CRIMINAL TRESPASS</option></select>';
    div.firstChild.onmousedown = div.firstChild.ondblclick = L.DomEvent.stopPropagation;
    return div;
};
legend.addTo(map);

crimeClicado = 'Crime';

$('select').on('change', function () {
    crimeClicado = this.value;
    initMap(crimeClicado);
});

anoClicado = undefined;

$('#ano1, #ano2, #ano3').click(function () {
    if (this.id == 'ano1') {
        anoClicado = '2018';
    }
    else if (this.id == 'ano2') {
        anoClicado = '2017';
    }
    else if (this.id == 'ano3') {
        anoClicado = '2016';
    }
    initMap(crimeClicado, anoClicado);
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

initMap(crimeClicado, anoClicado);

function initMap(crimeClicado, anoClicado) {

    markerClusters.clearLayers();

	url = 'http://cidadesinteligentes.lsdi.ufma.br/collector/resources/data/';

	filtros = {"capabilities": ["incidencia_crime"], "matchers":{} }
	
	
    if (!(crimeClicado == '') && !(crimeClicado == 'Crime'))	
		filtros["matchers"]["crime_type.eq"] = crimeClicado;
 

    if (anoClicado === undefined)
            filtros["matchers"]["year.in"] = [2016, 2017,2018];
	else		
		filtros["matchers"]["year.eq"] = anoClicado;
	

		
    $.post(url, filtros,  function (data, textStatus) {

        $.each(data.resources, function (i, recurso) {
			$.each(recurso.capabilities.incidencia_crime, function (j, crime) {

				var houve_prisao = crime.arrest ? 'Sim' : 'Não';

		        var popup = '<div id="content">' +
		            '<div id="siteNotice">' +
		            '</div>' +
		            '<h1 id="firstHeading" class="firstHeading">' + crime.location_description + '</h1>' +
		            '<div id="bodyContent">' +
		            '<p><b>Crime primário:</b> ' + crime.crime_type + '</p>' +
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

				if (crime.lat && crime.lon){

				    var m = L.marker([crime.lat, crime.lon], {icon: myIcon})
				        .bindPopup(popup);

				    markerClusters.addLayer(m);
				}
				
			});

        });
    }, "json");

    map.addLayer(markerClusters);

}


$( "#datepicker" ).datepicker();


