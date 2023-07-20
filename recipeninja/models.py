from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator
import json


# Create your models here.
class User(AbstractUser):
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.ImageField(upload_to="recipeninja/images/profile_pictures", blank=True, null=True)
    
    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "is_staff": self.is_staff,
            "bio": self.bio,
            "profile_picture": self.profile_picture.url if self.profile_picture else None,
        }
        
    def __str__(self):
        return f"{self.username}"


class Followers(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="followers")
    followers = models.ManyToManyField(User, related_name="followings", blank=True)
    
    class Meta:
        verbose_name = "Followers"
        verbose_name_plural = "Followers"
        
    def serialize(self):
        return {
            "id": self.id,
            "user": self.user,
            "followers": [follower.serialize() for follower in self.followers],
        }
        
    def __str__(self):
        return f"{self.user}'s followers ({self.followers.count()})"


class Cuisine(models.Model):
    name = models.CharField(max_length=20)
    cover = models.ImageField(upload_to="recipeninja/images/cuisine_covers")
    
    def __str__(self):
        return f"{self.name} Cuisine"
    
    
class Difficulty(models.Model):
    name = models.CharField(max_length=20)
    
    class Meta:
        verbose_name ="Difficulty"
        verbose_name_plural = "Difficulties"
    
    def __str__(self):
        return self.name


class Recipe(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to="recipeninja/images/recipe_images", blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    instructions = models.JSONField()
    ingredients = models.JSONField()
    cuisines = models.ManyToManyField(Cuisine, blank=True, related_name="recipes")
    timestamp = models.DateTimeField(auto_now_add=True)
    poster = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posted_recipes")
    likers = models.ManyToManyField(User, related_name="liked_recipes", blank=True)
    savers = models.ManyToManyField(User, related_name="saved_recipes", blank=True)
    difficulty = models.ForeignKey(Difficulty, on_delete=models.PROTECT, related_name="recipes")
    est_duration = models.IntegerField(validators=[MinValueValidator(1)])
    est_carbs = models.IntegerField(validators=[MinValueValidator(1)], blank=True, null=True)
    est_protein = models.IntegerField(validators=[MinValueValidator(1)], blank=True, null=True)
    est_fat = models.IntegerField(validators=[MinValueValidator(1)], blank=True, null=True)
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "image": self.image.url if self.image else None,
            "description": self.description,
            "instructions": json.dumps(self.instructions),
            "ingredients": json.dumps(self.ingredients),
            "poster": self.poster.serialize(),
            "cuisines": [cuisine.name for cuisine in self.cuisines.all()],
            "comments": [comment.serialize() for comment in self.comments.order_by("-timestamp")],
            "likers": [liker.serialize() for liker in self.likers.all()],
            "savers": [saver.serialize() for saver in self.savers.all()],
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "difficulty": self.difficulty.name,
            "carbs": self.est_carbs,
            "protein": self.est_protein,
            "fat": self.est_fat,
            "calories": round((4 * (self.est_carbs + self.est_protein)) + (9 * self.est_fat)) if self.est_carbs and self.est_protein and self.est_fat else None,
            "duration": self.est_duration,
        }
        
    def __str__(self):
        return f"{self.name} by {self.poster}"


class Comment(models.Model):
    content = models.TextField()
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="comments")
    commenter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "content": self.content,
            "recipe": self.recipe.serialize(),
            "commenter": self.commenter.serialize(),
            "timestamp": self.timestamp,
        }

    def __str__(self):
        return f"Comment by {self.commenter} on {self.recipe}"
    