from django.contrib import admin

from .models import User, Followers, Cuisine, Recipe, Comment, Difficulty


# Register your models here.
admin.site.register(User)
admin.site.register(Followers)
admin.site.register(Cuisine)
admin.site.register(Recipe) 
admin.site.register(Comment)
admin.site.register(Difficulty)