from rest_framework import generics
from .models import Element
from .serializers import ElementSerializer
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import os
from django.http import HttpResponse, FileResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import FileResponse
import json

class ElementListCreateView(generics.ListCreateAPIView):
    queryset = Element.objects.all()
    serializer_class = ElementSerializer

class ElementRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Element.objects.all()
    serializer_class = ElementSerializer


class PageSettingsViewSet(viewsets.ModelViewSet):
    queryset = Element.objects.all()  # Replace YourModel with your actual model
    serializer_class = ElementSerializer  # Replace YourModelSerializer with your actual serializer
class ElementDeleteView(generics.DestroyAPIView):
    queryset = Element.objects.all()
    serializer_class = ElementSerializer

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def create_element(request):
    serializer = ElementSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def get_video(request):
    video_path = r'C:\Users\trent\OneDrive\Documents\GitHub\Embedded-Project\videos\192.168.0.100\video_2024-02-03_192.168.0.100.mp4'  # Update this with the actual path to your video file
    if os.path.exists(video_path):
        response = FileResponse(open(video_path, 'rb'), content_type='video/mp4')
        response['Access-Control-Allow-Origin'] = '*'  # Allow requests from any origin
        return response
    else:
        return HttpResponse(status=404)