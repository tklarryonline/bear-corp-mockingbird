from django.db import models
import os
BASE_DIR = os.path.dirname(__file__)
PATH = os.path.join(BASE_DIR, 'upload')

class Speech(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    title = models.CharField(max_length=100, blank=True, default='')
    filefield = models.FileField(upload_to='upload')
    
    class Meta:
        ordering = ('created',)
# Create your models here.
