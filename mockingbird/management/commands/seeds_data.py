from django.core.management.base import NoArgsCommand, make_option, CommandError
from mockingbird.factories import UserFactory, SpeechFactory
from speeches.models import Speech

class Command(NoArgsCommand):
    help = "Seeding database"

    option_list = NoArgsCommand.option_list + (
        make_option('--verbose', action='store_true'),
    )

    def handle_noargs(self, **options):
        Speech.objects.all().delete()

        for i in range(10):
            try:
                speech = SpeechFactory()
            except:
                pass

            self.stdout.write('Created speech "%s"' % speech.title)
