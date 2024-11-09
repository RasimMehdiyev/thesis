import random
from datetime import timedelta
from django.db import transaction
from dashboard.models import Game
from django.core.management.base import BaseCommand

class Command(BaseCommand):
    help = "Add random seconds (0-1000) to the timestamps in the games table"

    def handle(self, *args, **kwargs):
        with transaction.atomic():
            games = Game.objects.all()
            for game in games:
                if game.timestamp is not None:
                    # Add a random value between 0 and 1000 to the timestamp
                    random_seconds = random.randint(0, 1000)
                    game.timestamp += random_seconds
                    game.save()

        self.stdout.write(self.style.SUCCESS("Timestamps updated successfully!"))
