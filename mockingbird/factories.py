from django.contrib.auth.models import User
from speeches.models import Speech
import factory

from faker import Factory
fake = Factory.create()

class UserFactory(factory.django.DjangoModelFactory):
    username = factory.LazyAttribute(lambda n: fake.user_name())
    password = factory.PostGenerationMethodCall('set_password', 'password')

    class Meta:
        model = User
        django_get_or_create = ('username',)


class SpeechFactory(factory.django.DjangoModelFactory):
    title = factory.LazyAttribute(lambda n: fake.sentence(nb_words=3, variable_nb_words=True))
    owner = factory.SubFactory(UserFactory)
    filefield = "upload/demo.wav"
    accuracy = factory.LazyAttribute(lambda n: fake.pyfloat(left_digits=2, right_digits=2, positive=True) / 100)
    transcription = factory.LazyAttribute(lambda n: fake.sentence(nb_words=3))
    pacing = factory.LazyAttribute(lambda n: fake.pyfloat(left_digits=2, right_digits=2, positive=True) / 100)

    class Meta:
        model = Speech
