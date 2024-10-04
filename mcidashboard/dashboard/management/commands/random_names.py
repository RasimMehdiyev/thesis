from django.core.management.base import BaseCommand
from dashboard.models import Person
from faker import Faker

class Command(BaseCommand):
    help = 'Populate the full_name field in the Person model with random names if empty.'

    def handle(self, *args, **kwargs):
        # Initialize the Faker library
        faker = Faker()

        # Fetch all persons without a full name
        persons_without_fullname = Person.objects.filter(full_name__isnull=True)

        # Loop through each person and assign a random name
        for person in persons_without_fullname:
            person.full_name = faker.name()
            person.save()
            self.stdout.write(self.style.SUCCESS(f'Person {person.id} full name updated to {person.full_name}'))

        # Summary message
        self.stdout.write(self.style.SUCCESS(f'Pseudonymized {persons_without_fullname.count()} records.'))
