# Generated by Django 5.1.2 on 2024-12-14 10:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Gowesin', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='stasiun',
            name='url_lokasi',
            field=models.CharField(default=None, max_length=200),
        ),
    ]
