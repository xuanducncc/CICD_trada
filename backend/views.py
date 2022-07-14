from django.http import JsonResponse

def backend404(request, exception=None):
    return JsonResponse({
        'status_code': 404,
        'error': 'The resource was not found'
    })