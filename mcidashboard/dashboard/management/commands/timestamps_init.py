from django.core.management.base import BaseCommand
from dashboard.models import Game, Move
from django.db.models import Min

class Command(BaseCommand):
    help = 'Populate the timestamp field in the Game model based on the first move\'s timestamp.'

    def handle(self, *args, **kwargs):
        # Fetch all games
        games = Game.objects.all()

        # Loop through each game to find the first move's timestamp
        for game in games:
            first_move = Move.objects.filter(gameID=game).order_by('timestamp').first()
            if first_move and not game.timestamp:
                game.timestamp = first_move.timestamp
                game.save()
                self.stdout.write(self.style.SUCCESS(f'Game {game.id} timestamp updated to {game.timestamp}'))
            else:
                if not first_move:
                    self.stdout.write(self.style.WARNING(f'No moves found for game {game.id}'))
                else:
                    self.stdout.write(self.style.NOTICE(f'Game {game.id} already has a timestamp'))

        self.stdout.write(self.style.SUCCESS('Game timestamp population completed.'))
