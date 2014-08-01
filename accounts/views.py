from django.shortcuts import render_to_response

def profile(request):
    return render_to_response('accounts/profile.html');
