
from django.shortcuts import render, render_to_response
from django.template import RequestContext

import json
import requests



def exibir_mapa(request):

    headers = {
        'Content-Type': 'application/json',
    }

    headers = {
        'Content-Type': 'application/json',
    }

    url = "http://cidadesinteligentes.lsdi.ufma.br/collector/resources/data/"

    start = 0

    data = {
        "capabilities": ["incidencia_crime"],
        "matchers": {},
        "start": str(start)
    }

    lista_recursos = []
    lista_crimes = []


    sufixo = 'T00:01:00.000Z'

    data_inicio = "2016-01-01T00:01:00.000Z"
    data_fim = "2018-12-31T00:01:00.000Z"

    print (request.GET)

    if request.GET.get('crime_escolhido'):
        print ('dentro do request')
        data.get("matchers")["crime_type.eq"] = request.GET.get('crime_escolhido')



    if request.GET.get('data_inicio'):
        data_inicio = request.GET.get('data_inicio') + sufixo

    if request.GET.get('data_fim'):
        data_fim = request.GET.get('data_fim') + sufixo

    data["start_date"] = data_inicio
    data["end_date"] = data_fim


    r = requests.post(url, data=json.dumps(data), headers=headers)
    recursos = r.json().get('resources')

    lista_recursos.extend(recursos)
    lista_crimes = []

    while (recursos and start < 3000):
        start += 1000
        data["start"] = str(start)
        r = requests.post(url, data=json.dumps(data), headers=headers)
        recursos = r.json().get('resources')
        lista_recursos.extend(recursos)

    for elemento in lista_recursos:
        lista_crimes.extend(elemento.get('capabilities').get('incidencia_crime'))


    lista = json.dumps(lista_crimes)

    return render_to_response('exibir_mapa.html', locals())
    # return render(request, 'exibir_mapa.html', locals(),  RequestContext(request))
    #
    # return HttpResponse(template.render(context, request))
def relatorios(request):

    return render(request, 'relatorios.html', locals())
