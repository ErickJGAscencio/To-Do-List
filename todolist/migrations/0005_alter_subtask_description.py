# Generated by Django 5.1.1 on 2024-09-24 04:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('todolist', '0004_alter_task_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='subtask',
            name='description',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
