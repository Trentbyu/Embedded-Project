from django.db import models

class Element(models.Model):
    ELEMENT_CHOICES = (
        ('ImageViewer', 'ImageViewer'),
        ('TemperatureViewer', 'TemperatureViewer'),
    )
    element_type = models.CharField(max_length=20, choices=ELEMENT_CHOICES)
    ip_address = models.CharField(max_length=15)  # For IP address
    name = models.CharField(max_length=50)  # For name
    device_type = models.CharField(max_length=10)  # For type of esp


