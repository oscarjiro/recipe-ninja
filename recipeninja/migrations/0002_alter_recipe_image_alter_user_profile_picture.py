# Generated by Django 4.2 on 2023-07-13 03:10

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("recipeninja", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="recipe",
            name="image",
            field=models.ImageField(upload_to="images/recipe_images"),
        ),
        migrations.AlterField(
            model_name="user",
            name="profile_picture",
            field=models.ImageField(upload_to="images/profile_pictures"),
        ),
    ]
