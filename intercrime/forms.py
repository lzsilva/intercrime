from django import forms
from django.contrib.admin.widgets import AdminDateWidget


class FormMapa(forms.Form):

    choices_ano = [
        ('', 'TODOS'),
        (2018, '2018'),
        (2017, '2017'),
        (2016, '2016'),

    ]


    endereco = forms.CharField(required=False)

    data_inicio = forms.DateField(required=False)

    data_fim = forms.DateField(required=False, widget=AdminDateWidget())

    choice_field_ano = forms.ChoiceField(required=False, choices=choices_ano,  widget=forms.Select(attrs={'onchange': "submit();"}))



    def init__(self, *args, **kwargs):
        super(FormMapa, self).__init__(*args, **kwargs)
        # self.fields['choice_titulacao'].initial = ['', 'TODOS']
