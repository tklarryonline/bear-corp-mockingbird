from django.http import HttpResponseRedirect
from django.shortcuts import render
from speeches.forms import SpeechForm

def upload_file(request):
    if request.method == 'POST':
        form = SpeechForm(request.POST, request.FILES)
        if form.is_valid():
            # file is saved
            form.save()
            return HttpResponseRedirect('/accounts/profile/')
    else:
        form = SpeechForm()
    return render(request, 'accounts/speeches.html', {'form': form})

# Create your views here.
