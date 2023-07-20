from django.urls import path
from . import views 


urlpatterns = [
    path("", views.index, name="index"),
    path("accounts/login/", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register_view, name="register"),
    path("create", views.create_recipe, name="create_recipe"),
    path("explore", views.explore, name="explore"),
    path("recipe/<int:recipe_id>", views.recipe_view, name="recipe"),
    path("load_recipes/<str:cuisines>/<str:query>", views.load_recipes, name="load_recipes"),
    path("load_recipes/<str:cuisines>", views.load_recipes, name="load_recipes"),
    path("get_cuisines", views.get_cuisines, name="get_cuisines"),
]
