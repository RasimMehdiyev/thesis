from django.core.management.base import BaseCommand
from dashboard.models import Person
import random

class Command(BaseCommand):
    help = "Populate ml_probability field with random float values from 80 to 90"

    def handle(self, *args, **kwargs):
        persons = Person.objects.all()
        for person in persons:
            person.ml_probability = random.uniform(80, 90)
            person.save()

        self.stdout.write(self.style.SUCCESS("ML probabilities populated successfully!"))