from django.shortcuts import redirect, render
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django import forms
from django.db.models import Q
from .utils import register_user
import json 


from .models import User, Followers, Cuisine, Recipe, Comment, Difficulty


# Constants
VALID_IMAGE_TYPES = (
            "image/jpeg", "image/png", "image/gif", 
            "image/bmp", "image/tiff", "image/webp",
            "image/x-icon", "image/svg+xml", "image/heif",
            "image/heic", "image/jp2", "image/avif"
        )
MAX_DESCRIPTION_LENGTH = 150
MAX_BIO_LENGTH = 300
MAX_IMAGE_SIZE = 2 * 1024 * 1024


# Forms
class LoginForm(forms.Form):
    username = forms.CharField(
        label=False,
        widget=forms.TextInput(
            attrs={
                "class": "input",
                "placeholder": "Username",
                "name": "username",
                "autocomplete": "off",
                "autofocus": True,
                "spellcheck": False,
            },
        ),
    )
    password = forms.CharField(
        label=False,
        widget=forms.PasswordInput(
            attrs={
                "class": "input",
                "placeholder": "Password",
                "name": "password",
                "autocomplete": "off",
                "spellcheck": False,
            },
        ),
    )


class RegisterForm(forms.Form):
    username = forms.CharField(
        label=False,
        widget=forms.TextInput(
            attrs={
                "class": "input",
                "placeholder": "Username",
                "name": "username",
                "autocomplete": "off",
                "spellcheck": False,
            },
        ),
    )
    first_name = forms.CharField(
        label=False,
        widget=forms.TextInput(
            attrs={
                "class": "input",
                "placeholder": "First Name",
                "name": "first_name",
                "autofocus": True,
                "autocomplete": "off",
                "spellcheck": False,
            },
        ),
    )
    last_name = forms.CharField(
        label=False,
        widget=forms.TextInput(
            attrs={
                "class": "input",
                "placeholder": "Last Name",
                "name": "last_name",
                "autocomplete": "off",
                "spellcheck": False,
            },
        ),
    )
    email = forms.EmailField(
        label=False,
        widget=forms.EmailInput(
            attrs={
                "class": "input",
                "placeholder": "Email",
                "name": "email",
                "autocomplete": "off",
                "spellcheck": False,
            },
        ),
    )
    password = forms.CharField(
        label=False,
        widget=forms.PasswordInput(
            attrs={
                "class": "input",
                "placeholder": "Password",
                "name": "password",
                "autocomplete": "off",
                "spellcheck": False,
            },
        ),
    )
    confirm_password = forms.CharField(
        label=False,
        widget=forms.PasswordInput(
            attrs={
                "class": "input",
                "placeholder": "Confirm Password",
                "name": "confirm_password",
                "autocomplete": "off",
                "spellcheck": False,
            },
        ),
    )


# Create your views here.
def index(request):
    return render(request, "recipeninja/index.html", {
        "cuisines": Cuisine.objects.all().order_by("name"),
    })


def login_view(request):
    
    # Collect form data on POST request
    if request.method == "POST":
        form = LoginForm(request.POST)
        
        # Process collected form if and attemp to sign user in if valid
        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            user = authenticate(request, username=username, password=password)
            
            # Check if authentication successful
            if user is not None:
                login(request, user)
                print(request.GET.get("next"))
                return redirect(request.GET.get("next", "index"))
            else:
                return render(request, "recipeninja/login.html", {
                    "login_form": form,
                    "message": "Invalid username and/or password.",
                })
        
        # Throw back form with error message if invalid
        else:
            return render(request, "recipeninja/login.html", {
                "login_form": form,
            })

    # Login login page on GET request
    else:
        return render(request, "recipeninja/login.html", {
            "login_form": LoginForm(),
        })


def logout_view(request):
    logout(request)
    return redirect("index")


def register_view(request):
    # Redirect to index if already authenticated
    if request.user.is_authenticated:
        return redirect("index")
    
    # Collect form data on POST request
    if request.method == "POST":
        form = RegisterForm(request.POST)
        
        # Process collected form if valid
        if form.is_valid():
            username = form.cleaned_data["username"]
            first_name = form.cleaned_data["first_name"]
            last_name = form.cleaned_data["last_name"]
            email = form.cleaned_data["email"]
            password = form.cleaned_data["password"]
            confirm_password = form.cleaned_data["confirm_password"]
        
            # Attempt to register user
            register_result = register_user(
                username,
                first_name,
                last_name,
                email,
                password,
                confirm_password,
            )    
        
            # Ensure password matches confirmation
            if register_result == 1:
                return render(request, "recipeninja/register.html", {
                    "register_form": form,
                    "message": "Passwords must match.",
                })

            # Ensure username is not taken
            elif register_result == 2:
                return render(request, "recipeninja/register.html", {
                    "register_form": form,
                    "message": "Username already taken."
                })
            
            # Log new user in on successful registration
            elif register_result == 0:
                user = User.objects.get(username=username)
                login(request, user)
                return redirect(request.GET.get("next", "index"))
        
        # Throw back form with error message if invalid
        else:
            return render(request, "recipeninja/register.html", {
                "register_form": form,
            })
    
    # Load registration page on GET request
    else:
        return render(request, "recipeninja/register.html", {
            "register_form": RegisterForm(),
        })
    

@login_required
def create_recipe(request):
    # Collect form data on POST request
    if request.method == "POST":
        print(request.POST)
        print(request.FILES)
        
        name = request.POST.get("name").strip()
        description = request.POST.get("description").strip()
        image = request.FILES.get("image")
        instructions = []
        ingredients = []
        duration_str = request.POST.get("duration").strip()
        duration = int(duration_str) if duration_str and duration_str.isdigit() else None
        carbs_str = request.POST.get("carbs").strip()
        carbs = int(carbs_str) if carbs_str and carbs_str.isdigit() else None
        protein_str = request.POST.get("protein").strip()
        protein = int(protein_str) if protein_str and protein_str.isdigit() else None
        fat_str = request.POST.get("fat").strip()
        fat = int(fat_str) if fat_str and fat_str.isdigit() else None
        servings_str = request.POST.get("servings").strip()
        servings = int(servings_str) if servings_str and servings_str.isdigit() else None
        difficulty = request.POST.get("difficulty").strip()
        cuisines_str = request.POST.get("cuisines").strip()
        cuisines = cuisines_str.split(",") if cuisines_str else []
                
        # Loop form to get the variable number of instructions and ingredients
        for key, value in request.POST.items():
            if key.startswith("instruction") and value.strip():
                instructions.append(value)
            if key.startswith("ingredient") and value.strip():
                ingredients.append(value)
            
        # Initialize errors dictionary
        errors = {}

        # Ensure uploaded image is valid
        invalid_image = image and (image.content_type not in VALID_IMAGE_TYPES or image.size > MAX_IMAGE_SIZE)

        # Ensure valid name
        if not name:
            errors["name"] = "Recipe name is required."
            
        # Ensure valid description
        if description and len(description) > MAX_DESCRIPTION_LENGTH:
            errors["description"] = f"Description should be no more than {MAX_DESCRIPTION_LENGTH} characters"

        # Ensure valid instruction
        if not instructions or len(instructions) > 30:
            errors["instructions"] = "At least 1 instruction is required."

        # Ensure valid ingredient  
        if not ingredients or len(ingredients) > 30:
            errors["ingredients"] = "At least 1 ingredient is required."
            
        # Ensure valid duration
        if not duration or duration < 1:
            errors["duration"] = "Duration is required." if not duration else "Duration must be at least 1 minute."
        
        # Ensure valid nutrition
        if (carbs and carbs < 1) or (protein and protein < 1) or (fat and fat < 1):
            errors["nutrition"] = "Nutrition must be at least 1 unit."
        
        # Ensure valid difficulty
        if not difficulty or difficulty not in set(Difficulty.objects.values_list("name", flat=True)):
            errors["difficulty"] = "You must select a difficulty." if not difficulty else "Invalid difficulty selected."
        
        # Ensure valid cuisines
        if cuisines and not all(cuisine in Cuisine.objects.values_list("name", flat=True) for cuisine in cuisines):
            errors["cuisines"] = "Invalid cuisine selected."
            
        # Ensure valid servings:
        if not servings or servings < 1:
            errors["servings"] = "Servings is required." if not servings else "Servings must be at least 1."

        # Create new recipe object if valid
        if not errors:   
            recipe = Recipe.objects.create(
                name=name,
                description=description,
                instructions=instructions,
                ingredients=ingredients,  
                poster=User.objects.get(username=request.user.username),
                difficulty=Difficulty.objects.get(name=difficulty),
                est_duration=duration,
                est_carbs=carbs,
                est_protein=protein,
                est_fat=fat,
                servings=servings,
            )
            if image and not invalid_image:
                recipe.image = image
            recipe.cuisines.set(Cuisine.objects.filter(name__in=cuisines))
            recipe.save()
            return redirect("recipe", recipe.id)

        return render(request, "recipeninja/create_recipe.html", {
            "cuisines": Cuisine.objects.all(),
            "difficulties": Difficulty.objects.all(),
            "errors": errors,
            "MAX_DESCRIPTION_LENGTH": MAX_DESCRIPTION_LENGTH,
        })

    
    # Load recipe creation page on GET request
    else:
        return render(request, "recipeninja/create_recipe.html", {
            "cuisines": Cuisine.objects.all(),
            "difficulties": Difficulty.objects.all(),
            "MAX_DESCRIPTION_LENGTH": MAX_DESCRIPTION_LENGTH,
        })


def explore(request):    
    return render(request, "recipeninja/explore.html")


def get_cuisines(request):
    # Must be GET request
    if request.method == "GET":
        return JsonResponse({
            "cuisines": [cuisine.name for cuisine in Cuisine.objects.all().order_by("name")],
        }, status=200)
        
    return JsonResponse({
        "error": "GET request required.",
    }, status=400)
    
    
def get_difficulties(request):
    # Must be GET request
    if request.method == "GET":
        return JsonResponse({
            "difficulties": [difficulty.name for difficulty in Difficulty.objects.all()],
        }, status=200)
        
    return JsonResponse({
        "error": "GET request required.",
    }, status=400)
    

def load_recipes(request, cuisines, query=None):
    # Must be GET request
    if request.method == "GET":
        # Split all cuisines into a list
        cuisines = cuisines.split(",")
        cuisines = [cuisine.strip() for cuisine in cuisines]
        
        # Filter by specified cuisine
        if "all" in cuisines:
            recipes = Recipe.objects.all()
        else:
            cuisine_ids = list(Cuisine.objects.filter(name__in=cuisines).values_list("id", flat=True))
            recipes = Recipe.objects.filter(cuisines__in=cuisine_ids)
            
        # Filter again by specified query
        if query:
            query.strip()
            recipes = recipes.filter(
                Q(name__icontains=query) |
                Q(poster__username__icontains=query)
            )
                    
        return JsonResponse({
            "recipes": [recipe.serialize() for recipe in recipes.order_by("-timestamp")],
        }, status=200)
            
    return JsonResponse({
        "error": "GET request required.",
    }, status=400)
    
    
def load_user_recipes(request, username, get_saved):
    # Must be GET request
    if request.method == "GET":
        # Ensure user exists
        try: 
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return JsonResponse({
                "error": "User does not exist.",
            }, status=404)
            
        # If not get saved, get user's posted recipes 
        get_saved = int(get_saved)
        if not get_saved:
            recipes = user.posted_recipes.all()
            
        # Otherwise, get user's saved recipes
        else:
            if request.user != user:
                return JsonResponse({
                    "error": "Non-user is forbidden from viewing saved recipes.",
                }, status=403)
            recipes = user.saved_recipes.all()
            
        return JsonResponse({
            "recipes": [recipe.serialize() for recipe in recipes.order_by("-timestamp")],
        }, status=200)
            
    return JsonResponse({
        "error": "GET request required.",
    }, status=400)
    
    
@login_required
def load_user_feed_recipes(request):
    # Ensure user is signed in
    if not request.user.is_authenticated:
        return JsonResponse({
            "error": "User is not logged in.",
        }, status=401)
        
    # Must be GET request
    if request.method != "GET":
        return JsonResponse({
            "error": "GET request required.",
        }, status=400)
        
    # Get user's followings
    user = User.objects.get(username=request.user.username)
    followings = [following.user for following in user.followings.all()]
    
    # Get all recipes created by user's followings
    recipes = []
    for following in followings:
        recipes += [recipe.serialize() for recipe in following.posted_recipes.all()]
        
    return JsonResponse({
        "recipes": sorted(recipes, key=lambda recipe: recipe["timestamp"], reverse=True),
    })
    
    
def recipe_view(request, recipe_id):
    try:
        recipe_info = Recipe.objects.get(pk=recipe_id).serialize()
        calories = recipe_info["calories"]
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        recipe = None
        calories = None
        
    return render(request, "recipeninja/recipe.html", {
        "recipe": recipe,  
        "calories": calories,
    })
    
    
def profile_view(request, username):
    # Ensure user exists
    try:
        user = User.objects.get(username=username)
        
        # If signed in, check if request user is following the user
        if request.user.is_authenticated:
            current_user = User.objects.get(username=request.user.username)
            
            # Ensure user already has a followers object
            try:
                followers = Followers.objects.get(user=user)
                is_following = current_user in followers.followers.all()
            except Followers.DoesNotExist:
                followers = Followers.objects.create(user=user)
                followers.save()
                is_following = False
        else:
            current_user = None
            is_following = False
            
    except User.DoesNotExist:
        user = None
        is_following = False    
        
    return render(request, "recipeninja/profile.html", {
        "profile": user,  
        "is_following": is_following,
    })
        

@login_required
def edit_profile(request):
    print(request.POST)
    print(request.FILES)
    
    # Collect form data on POST request
    if request.method == "POST":        
        first_name = request.POST.get("firstName").strip()
        last_name = request.POST.get("lastName").strip()
        bio = request.POST.get("bio").strip()
        banner = request.FILES.get("banner")
        profile_picture = request.FILES.get("profilePicture")
        banner_remove = request.POST.get("bannerRemove").strip()
        profile_picture_remove = request.POST.get("profilePictureRemove").strip()
        
        # Initialize errors dictionary
        errors = {}
        
        # Ensure uploaded images are valid
        invalid_banner = banner and (banner.content_type not in VALID_IMAGE_TYPES or banner.size > MAX_IMAGE_SIZE)
        invalid_profile_picture = profile_picture and (profile_picture.content_type not in VALID_IMAGE_TYPES or profile_picture.size > MAX_IMAGE_SIZE) 
        
        # Ensure valid bio
        if bio and len(bio) > MAX_BIO_LENGTH:
            errors["bio"] = "Bio cannot exceed 300 characters."
            
        # Ensure valid first name
        if not first_name:
            errors["first_name"] = "First name is required."    
            
        # Ensure valid last name
        if not last_name:
            errors["last_name"] = "Last name is required."   
            
        # Valid form
        if not errors:
            # Update profile if valid
            user = User.objects.get(username=request.user.username)
            user.first_name = first_name
            user.last_name = last_name
            user.bio = bio
            
            if banner_remove == "y" and not invalid_banner:
                user.banner = None
            elif banner and not invalid_banner:
                user.banner = banner
                
            if profile_picture_remove == "y" and not invalid_profile_picture:
                user.profile_picture = None
            elif profile_picture and not invalid_profile_picture:
                user.profile_picture = profile_picture
            user.save()
                        
            # Redirect to profile page
            return redirect("profile", request.user.username)
            
        
    return render(request, "recipeninja/edit_profile.html", {
        "self": User.objects.get(username=request.user.username) if request.user.is_authenticated else None,
    })
    
    
@login_required
def feed_view(request):
    if not request.user.is_authenticated:   
        return redirect("index")
    user = User.objects.get(username=request.user.username)
    return render(request, "recipeninja/feed.html", {
        "saved_recipes": user.saved_recipes.all().order_by("-timestamp"),
    })
    
    
@login_required
def saved_recipes_view(request):
    if not request.user.is_authenticated:   
        return redirect("index")
    user = User.objects.get(username=request.user.username)
    
    return render(request, "recipeninja/saved_recipes.html", {
        "saved_recipes": user.saved_recipes.all().order_by("-timestamp"),
    })

        
def load_comments(request, recipe_id):
    # Must be GET request:
    if request.method != "GET":
        return JsonResponse({
            "error": "GET request required.",
        }, status=400)
            
    # Ensure recipe exists
    try: 
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        return JsonResponse({
            "error": "Recipe does not exist.",    
        }, status=404)
        
    # Get all comments from recipe
    comments = [comment.serialize() for comment in recipe.comments.all().order_by("-timestamp")]
    return JsonResponse({
        "comments": comments,
    }, status=200)


@csrf_exempt
@login_required
def post_comment(request, recipe_id):
    # Must be POST request
    if request.method != "POST":
        return JsonResponse({
            "error": "POST request required.",
        }, status=400)
    
    # Ensure recipe exists
    try:
        user = User.objects.get(username=request.user.username)
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        return JsonResponse({
            "error": "Recipe does not exist.", 
        }, status=404)
        
    # Ensure content is not empty
    data = json.loads(request.body)
    content = data.get("content").strip()
    if not content:
        return JsonResponse({
            "error": "Comment must not be empty.",
        }, status=400)
            
    # Create a new comment
    comment = Comment.objects.create(commenter=user, content=content, recipe=recipe)
    comment.save()
    
    return JsonResponse({
        "message": "Comment posted successfully.",
        "newCount": recipe.comments.all().count(),
        "newComment": comment.serialize(),
    }, status=201)
    
   
@csrf_exempt
@login_required
def delete_recipe(request, recipe_id):
    # Ensure user is logged in
    if not request.user.is_authenticated:
        return JsonResponse({
            "error": "User is not logged in.",
        }, status=401)

    # Must be DELETE request
    if request.method != "DELETE":
        return JsonResponse({
            "error": "DELETE request is required.",
        }, status=400)
        
    # Ensure recipe exists
    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except Comment.DoesNotExist:
        return JsonResponse({
            "error": "Recipe does not exist.",
        }, status=404)   
        
    # Ensure poster is the same as requester
    if recipe.poster.id != request.user.id:
        return JsonResponse({
            "error": "Non-poster is forbidden from modifying recipe.",
        }, status=403)
    
    # Delete recipe
    recipe.delete()

    return JsonResponse({
        "message": "Recipe deleted successfully.",
    }, status=200)
    
    
@csrf_exempt
@login_required
def delete_comment(request, comment_id):    
    # Ensure user is logged in
    if not request.user.is_authenticated:
        return JsonResponse({
            "error": "User is not logged in.",
        }, status=401)
    
    # Must be DELETE request
    if request.method != "DELETE":
        return JsonResponse({
            "error": "DELETE request is required.",
        }, status=400)
    
    # Ensure comment exists
    try:
        comment = Comment.objects.get(pk=comment_id)
    except Comment.DoesNotExist:
        return JsonResponse({
            "error": "Comment does not exist.",
        }, status=404)   
        
    # Ensure commenter is the same as requester
    if comment.commenter.id != request.user.id:
        return JsonResponse({
            "error": "Non-commenter is forbidden from modifying comment.",
        }, status=403)
    
    # Get corresponding recipe
    recipe = Recipe.objects.get(pk=comment.recipe.id)
    
    # Delete comment
    comment.delete()

    return JsonResponse({
        "message": "Comment deleted successfully.",
        "newCount": recipe.comments.all().count(),
    }, status=200)
    
    
def get_username(request):
    # Must be DELETE request
    if request.method != "GET":
        return JsonResponse({
            "error": "GET request is required.",
        }, status=400)
        
    # Return current user's username
    return JsonResponse({
        "username": request.user.username if request.user.is_authenticated else None     
    }, status=200)


@csrf_exempt
@login_required
def toggle_like_recipe(request, recipe_id):    
    # Ensure user is logged in
    if not request.user.is_authenticated:
        return JsonResponse({
            "error": "User is not logged in.",
        }, status=401)
    
    # Must be PUT request
    if request.method != "PUT":
        return JsonResponse({
            "error": "PUT request is required.",
        })

    # Ensure recipe exists
    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except Recipe.DoesNotExist:
        return JsonResponse({
            "error": "Recipe does not exist.",
        }, status=404)
        
    # Toggle like the recipe
    user = User.objects.get(username=request.user.username)
    if user in recipe.likers.all():
        recipe.likers.remove(user)
        is_liked = False
    else:
        recipe.likers.add(user)
        is_liked = True
    
    return JsonResponse({
        "message": "Toggle liked recipe successfully.",
        "newLikesCount": recipe.likers.all().count(),
        "isLiked": is_liked,
    }, status=200)   


@csrf_exempt
@login_required
def toggle_like_comment(request, comment_id):
    # Ensure user is logged in
    if not request.user.is_authenticated:
        return JsonResponse({
            "error": "User is not logged in.",
        }, status=401)
    
    # Must be PUT request
    if request.method != "PUT":
        return JsonResponse({
            "error": "PUT request is required.",
        })

    # Ensure comment exists
    try:
        comment = Comment.objects.get(pk=comment_id)
    except Comment.DoesNotExist:
        return JsonResponse({
            "error": "Comment does not exist.",
        }, status=404)

    # Toggle like the comment
    user = User.objects.get(username=request.user.username)
    if user in comment.likers.all():
        comment.likers.remove(user)
        is_liked = False
    else:
        comment.likers.add(user)
        is_liked = True

    return JsonResponse({
        "message": "Toggle liked comment successfully.",
        "newLikesCount": comment.likers.all().count(),
        "isLiked": is_liked,
    }, status=200)  
    
    
@csrf_exempt
@login_required
def toggle_save_recipe(request, recipe_id):
    # Ensure user is logged in
    if not request.user.is_authenticated:
        return JsonResponse({
            "error": "User is not logged in.",
        }, status=401)
    
    # Must be PUT request
    if request.method != "PUT":
        return JsonResponse({
            "error": "PUT request is required.",
        })

    # Ensure recipe exists
    try:
        recipe = Recipe.objects.get(pk=recipe_id)
    except recipe.DoesNotExist:
        return JsonResponse({
            "error": "Recipe does not exist.",
        }, status=404)
        
    # Toggle save the recipe
    user = User.objects.get(username=request.user.username)
    if user in recipe.savers.all():
        recipe.savers.remove(user)
        is_saved = False
    else:
        recipe.savers.add(user)
        is_saved = True

    return JsonResponse({
        "message": "Toggle liked saved successfully.",
        "newSavesCount": recipe.savers.all().count(),
        "isSaved": is_saved,
    }, status=200)
    
    
@csrf_exempt
@login_required
def toggle_follow(request, username):
    # Ensure user is logged in
    if not request.user.is_authenticated:
        return JsonResponse({
            "error": "User is not logged in.",
        }, status=401)
    current_user = User.objects.get(username=request.user.username)
    
    # Must be PUT request
    if request.method != "PUT":
        return JsonResponse({
            "error": "PUT request is required.",
        })
    
    # Ensure user exists
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({
            "error": "User does not exist.",
        }, status=404)
        
    # Ensure user is not trying to follow self
    if current_user.username == user.username:
        return JsonResponse({
            "error": "User is forbidden from following self.",
        }, status=403)
        
    # Get followers of the user
    try:
        followers = Followers.objects.get(user=user)
    except Followers.DoesNotExist:
        followers = Followers.objects.create(user=user)
        followers.save()
        
    # Toggle follow user
    if current_user not in followers.followers.all():
        followers.followers.add(current_user)
        is_following = True
    else:
        followers.followers.remove(current_user)
        is_following = False
    
    return JsonResponse({
        "message": "Toggle followed successfully.",
        "newFollowersCount": followers.followers.all().count(),
        "isFollowing": is_following,
    }, status=200)
    
    
def get_followers(request, username):
    # Must be GET request
    if request.method != "GET":
         return JsonResponse({
            "error": "GET request is required.",
        }, status=401)
         
    # Ensure user exists
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({
            "error": "User does not exist",
        }, status=404)
        
    # Get user's followers
    return JsonResponse({
        "followers": [follower.serialize() for follower in user.followers.followers.all()],
    }, status=200)
         

def get_following(request, username):
    # Must be GET request
    if request.method != "GET":
         return JsonResponse({
            "error": "GET request is required.",
        }, status=401)
         
    # Ensure user exists
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return JsonResponse({
            "error": "User does not exist",
        }, status=404)
        
    # Get user's following
    followings = [following for following in user.followings.all()]
    
    return JsonResponse({
        "following": [following.user.serialize() for following in followings],
    }, status=200)
