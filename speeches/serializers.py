from django.forms import widgets
from rest_framework import serializers
from speeches.models import Speech

#class SpeechesSerializer(serializers.Serializer):
#    pk = serializers.Field()  # Note: `Field` is an untyped read-only field.
#    title = serializers.CharField(required=False, max_length=100)
#    filefield = serializers.FileField(max_length=None, allow_empty_file=False)
#
#    def restore_object(self, attrs, instance=None):
#        """
#        Create or update a new speech instance, given a dictionary
#        of deserialized field values.
#
#        Note that if we don't define this method, then deserializing
#        data will simply return a dictionary of items.
#        """
#        if instance:
#            # Update existing instance
#            instance.title = attrs.get('title', instance.title)
#            instance.filefield = attrs.get('filefield', instance.filefield)
#            return instance
#
#        # Create new instance
#        return Speech(**attrs)

class SpeechSerializer(serializers.ModelSerializer):

    owner = serializers.PrimaryKeyRelatedField(source='owner')

    class Meta:
        model = Speech
        fields = ('id', 'title', 'filefield', 'owner', 'transcription', 'accuracy', 'pacing')
