# Generated by Django 3.1.4 on 2021-01-13 21:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('things', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='parent_post',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='things.post'),
        ),
    ]