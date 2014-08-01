from django.forms import ModelForm
from speeches import models

class SpeechForm(ModelForm):
    
    class Meta:
        model = models.Speech
        fields = ['title', 'filefield', 'owner']
