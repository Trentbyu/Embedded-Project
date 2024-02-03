from rest_framework import generics
from .models import Element
from .serializers import ElementSerializer
from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

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