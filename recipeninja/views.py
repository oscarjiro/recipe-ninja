from django.shortcuts import redirect, render
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.db import IntegrityError
from django import forms
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
        "cuisines": Cuisine.objects.all(),
    })


def login_view(request):
    # Redirect to index if already authenticated
    if request.user.is_authenticated:
        return redirect("index")
    
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
                return redirect("index")
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
            confirmation = form.cleaned_data["confirm_password"]
            
            # Ensure password matches confirmation
            if password != confirmation:
                return render(request, "recipeninja/register.html", {
                    "register_form": form,
                    "message": "Passwords must match.",
                })

            # Attempt to create new user
            try:
                user = User.objects.create_user(
                    username=username,
                    first_name=first_name,
                    last_name=last_name,
                    email=email, 
                    password=password,
                )
                user.save()
                followers = Followers.objects.create(user=user)
                followers.save()
                
            # Invalidate existing usernames
            except IntegrityError:
                return render(request, "recipeninja/register.html", {
                    "register_form": form,
                    "message": "Username already taken."
                })
            
            # Log new user in on successful registration
            login(request, user)
            return redirect("index")
        
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
        name = request.POST.get("name")
        description = request.POST.get("description")
        image = request.FILES.get("image")
        instructions = []
        ingredients = []
        
        # Loop form to get the variable number of instructions and ingredients
        for key, value in request.POST.items():
            if key.startswith("instruction") and value.strip():
                instructions.append(value)
            if key.startswith("ingredient") and value.strip():
                ingredients.append(value)
       
        # Valid form boolean
        form_is_valid = True
            
        # Initialize errors dictionary
        errors = {}

        # Ensure uploaded file is image
        if image and image.content_type not in VALID_IMAGE_TYPES:
            errors["image"] = "Uploaded file should be an image file."

        # Ensure valid name
        if not name:
            errors["name"] = "Recipe name is required."

        # Ensure valid instruction
        if not instructions:
            errors["instructions"] = "At least 1 instruction is required."

        # Ensure valid ingredient  
        if not ingredients:
            errors["ingredients"] = "At least 1 ingredient is required."

        # Ensure valid description
        if description and len(description) > MAX_DESCRIPTION_LENGTH:
            errors["description"] = f"Description should be no more than {MAX_DESCRIPTION_LENGTH} characters"

        # Create new recipe object if valid
        if not errors:   
            recipe = Recipe.objects.create(
                name=name,
                description=description,
                image=image,
                instructions=instructions,
                ingredients=ingredients,  
                poster=User.objects.get(username=request.user.username),
            )
            recipe.save()
            return redirect("explore")

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
            "cuisines": [cuisine.name for cuisine in Cuisine.objects.all()],
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
            recipes = recipes.filter(name__icontains=query.strip())
            
        return JsonResponse({
            "recipes": [recipe.serialize() for recipe in recipes.order_by("-timestamp")],
        }, status=200)
            
    return JsonResponse({
        "error": "GET request required.",
    }, status=400)
    
    
def recipe_view(request, recipe_id):
    try:
        recipe_info = Recipe.objects.get(pk=recipe_id).serialize()
        calories = recipe_info["calories"]
        
        recipe = Recipe.objects.get(pk=recipe_id)
    except ObjectDoesNotExist:
        recipe = None
        calories = None
        
    return render(request, "recipeninja/recipe.html", {
        "recipe": recipe,  
        "calories": calories,
    })
        