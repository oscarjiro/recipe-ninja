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
    path("profile/<str:username>", views.profile_view, name="profile"),
    path("edit", views.edit_profile, name="edit_profile"),
    path("feed", views.feed_view, name="feed"),
    path("saved", views.saved_recipes_view, name="saved_recipes"),
    path("load_recipes/<str:cuisines>/<str:query>", views.load_recipes, name="load_recipes"),
    path("load_recipes/<str:cuisines>", views.load_recipes, name="load_recipes"),
    path("load_user_recipes/<str:username>/<int:get_saved>", views.load_user_recipes, name="load_user_recipes"),
    path("load_user_feed", views.load_user_feed_recipes, name="load_user_feed"),
    path("get_cuisines", views.get_cuisines, name="get_cuisines"),
    path("get_difficulties", views.get_difficulties, name="get_difficulties"),
    path("load_comments/<int:recipe_id>", views.load_comments, name="load_comments"),
    path("post_comment/<int:recipe_id>", views.post_comment, name="post_comment"),
    path("delete_recipe/<int:recipe_id>", views.delete_recipe, name="delete_recipe"),
    path("delete_comment/<int:comment_id>", views.delete_comment, name="delete_comment"),
    path("toggle_like_recipe/<int:recipe_id>", views.toggle_like_recipe, name="toggle_like_recipe"),
    path("toggle_like_comment/<int:comment_id>", views.toggle_like_comment, name="toggle_like_comment"),
    path("toggle_save_recipe/<int:recipe_id>", views.toggle_save_recipe, name="toggle_save_recipe"),
    path("toggle_follow/<str:username>", views.toggle_follow, name="toggle_follow"),
    path("get_username", views.get_username, name="get_username"),
    path("get_followers/<str:username>", views.get_followers, name="get_followers"),
    path("get_following/<str:username>", views.get_following, name="get_following"),
]
