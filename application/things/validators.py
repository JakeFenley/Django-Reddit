from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.core.validators import RegexValidator

letters_only = RegexValidator(r'^[a-zA-Z]*$', 'Only letters are allowed.')


def validate_score(value):
    if value < -1 or value > 1:
        raise ValidationError(
            _('%(value)s is not in acceptable range'),
            params={'value': value},
        )


def validate_submission_type(s_type):
    if s_type != "post" and s_type != "comment":
        raise ValidationError(
            _('%(submission_type)s is not correct type'),
            params={'submission_type': s_type},
        )
