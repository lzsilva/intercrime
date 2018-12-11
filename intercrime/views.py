from django.shortcuts import render


def exibir_mapa(request):
    ola = u'Olá Mundo'
    return render(request, 'exibir_mapa.html', locals())