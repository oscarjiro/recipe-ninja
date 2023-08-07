# RecipeNinja: CS50W Capstone


### **Video Demo:**  <https://youtu.be/DXMZCxlD4lI>


## **Introducing *RecipeNinja*: Unleash Your Inner Culinary Master**

Step into the world of culinary mastery with ***RecipeNinja***, a platform designed to make sharing and exploring recipes a seamless and delightful experience. Embracing the essence of the legendary Japanese ninja, RecipeNinja empowers every user to become a culinary "ninja" by effortlessly mastering the art of cooking. Our vision centers on the belief that anyone can attain the status of a cooking virtuoso.

### **Developed with Cutting-Edge Technologies**
Powered by Django as the robust backend and adorned with the finesse of Tailwind CSS and JavaScript, RecipeNinja boasts a sophisticated, minimalistic, and fully-responsive user interface that ensures an exceptional and intuitive user experience.

### **Unleash Your Culinary Creativity**
Seamlessly craft and share your culinary masterpieces. From delectable images to comprehensive step-by-step instructions, ingredients, difficulty levels, estimated durations, and even nutritional information, every detail finds its place in your recipe's canvas.

### **Embark on a Gastronomic Journey**
Delve into a vast collection of recipes, organized by cuisines or easily found through a convenient search bar. Each recipe beckons with its own dedicated and elegantly designed page, where you can like, save, and offer your insights through reviews.

### **Forge Connections, Spark Inspiration**
Tailor your profile to reflect your unique culinary persona. Personalize your name, bio, profile picture, and banner to curate a visually captivating profile page. By following other users, you effortlessly stay attuned to their latest creations, fostering a community bound by culinary curiosity.

At RecipeNinja, we believe that culinary expertise should be accessible to all. Join us in this gastronomic adventure where every recipe shared, every dish explored, and every connection forged contributes to a shared tapestry of culinary mastery. Your journey starts here—immerse yourself in the flavors, colors, and aromas that await your touch.


## **Distinctiveness and Complexity**

RecipeNinja, my recipe-sharing website project, demonstrates both distinctiveness and complexity that sets it apart from the other projects in the course. Here's how RecipeNinja fulfills the mentioned requirements:

### **Distinctiveness**

RecipeNinja is undoubtedly distinct from other projects in the course such as the general social networks and especially e-commerce sites, both two themes that were notably stated to be rejected in the project requirements. 

While it is community-based and involves simple social interactions such as leaving reviews and following other users, RecipeNinja revolves around culinary creativity and sharing, making it more than just a typical social network; the core of RecipeNinja is to simplify the process of learning and sharing recipes as opposed to being a social network for people to interact with each other.

### **Complexity**

RecipeNinja showcases an adequate amount of complexity in its features and development. Here are some of the main points:

1. **Search and Exploration**

>The sophisticated search functionality that allows users to explore recipes by cuisine(s) or/and through a search bar without the need of reloading demonstrates a pretty fair complexity.

2. **Community Engagement**

>The intricate features related to following users and liking, saving, and reviewing recipes foster a complete community engagement and interaction, elevating the complexity of the project.

3. **Customizable Profiles**

>The ability for users to personalize their profiles with banners, profile pictures, and bios enhances user experience and the complexity of the project.

4. **Seamless, Robbust Recipe Crafting and Dynamic Interaction** 

> Immerse yourself in the art of culinary creation with RecipeNinja's intuitive and sophisticated recipe creation form. Designed for both elegance and comprehensiveness, our form simplifies the process of crafting recipes. It empowers users to effortlessly provide crucial details such as the recipe's name, captivating image, concise description, up to 30 step-by-step instructions, 30 distinct ingredients, difficulty level, estimated preparation time, designated cuisines, and even basic nutritional facts (carbohydrates, protein, and fats).

> Navigating the creation process becomes a breeze with our intuitive shortcuts. Experience convenience like never before – tap the 'Enter' key to dynamically add a new input field and use 'Backspace' to swiftly delete an input field. These dynamic features ensure that your journey from idea to fully composed recipe is smooth and intuitive, elevating your experience to new culinary heights.

> Moreover, the recipe creation form also employs both a client-side and server-side form validation so that users would not be bothered by a reload after every minor invalidities.

6. **Diverse Pages**

> RecipeNinja has multiple main views such as a catchy homepage, login page, register page, explore page, personalized timeline, saved recipes page, individual profile pages, profile customization page, and dedicated pages for every recipe in the website.

7. **Convenient Deletions**

> The ability to conveniently delete one's own review and even recipe adds to the array of various features RecipeNinja offers, adding to its completeness and complexity.

8. **APIs for Enhanced UX**

> As opposed to reloading the page after every action, RecipeNinja utilizes its built-in APIs for most of its features such as searching, commenting, liking, saving, following, loading recipes, and much more.

9. **Highly-Dedicated UI**

> RecipeNinja is powered by Tailwind CSS which allowed for faster and easier development. It is fully-responsive and flaunts a minimalistic, gorgeous design with complex media queries and even the utilization of JavaScript to further create a beautiful interface e.g. the hiding and showing of a sidebar in accordance to the screen width.

10. **Advanced Usage of Django**

> In the backend, aside from its main functionality to serve views and manage URLs, a lot of other more advanced Django features were used such as the creation of custom utilities for various uses, usage of custom template tag filters, and usage of Django management commands to automate creation of multiple users at once.

11. **Advanced Usage of JavaScript**

> Usage of modules, import statements, JQuery, and a lot of async functions demonstrate the complexity of the scripts needed to create the frontend of RecipeNinja.


## **File Contents**

The following are the contents of every notable files (and folders) located in `/recipeninja/` in ascending alphabetical order:

- `images/**/*.{image/type}`

> This is where all the uploaded images are stored, i.e. profile pictures, profile banners, homepage cuisine covers, and recipe images.

- `management/commands/create_users.py`: 

> This is a custom Django management command to automate the creation of multiple users (currently set at 20 per call) with different and randomized names, utilizing custom-created functions in `utils.py`. It can be executed in the terminal by simply running `python manage.py create_users`.

- `static/recipeninja/scripts/*.js`

> Each `.js` file is a dedicated script for every main view, e.g. Homepage, Login, Register, Explore, Feed, Profile Page, Edit profile, and Saved Recipes, except for `navbar.js` which is specifically dedicated for the website's navigation bar. 

> Different from the others, `const.js` and `utils.js`, both act as modules that are reused in other `.js` files, each respectively providing global constants and reusable utility functions for the rest of the code.

- `static/recipeninja/logo.svg`

> This is the RecipeNinja logo.

- `static/recipeninja/ninja-cooking.png`

> This is the ninja image seen in the Homepage.

- `static/recipeninja/styles.css`

> This is the global CSS file for the website which contains styling for global font and scrollbar, although technically all the main CSS is mainly configured in a `style` tag of type `text/tailwindcss` in the `head` tag of `templates/recipeninja/layout.html` in the form of Tailwind CSS utility classes.

- `templates/recipeninja/*.html`

> Each `.html` file is an HTML file for every main view, e.g. Homepage, Login, Register, Explore, Feed, Profile Page, Edit profile, and Saved Recipes, except for `layout.html` which is basically the main layout in which other HTML files extend from. The main CSS in the form of Tailwind CSS utility classes is also found in `layout.html`.

- `templatetags/custom_filters.py`

> Contains a single custom filter, `format_time_filter` which is used in `templates/recipeninja/recipe.html` in the form of template tags to convert durations in minutes to more flexible forms such as hours, hours and minutes, and more.

- `admin.py`

> Mainly used to register all the models from `models.py` in the Django admin page.


- `apps.py`

> Mainly used to specify the app name for RecipeNinja, which is "recipeninja", in this project `capstone`.

- `models.py`

> Used to create the 6 main models and their respective fields and methods in RecipeNinja: User, Followers, Cuisine, Difficulty, Recipe, Comment.

- `tests.py`

> Designated to test various parts of the app but not used.

- `urls.py`

> Used to specify the URLs of every view from `views.py`, both for API paths and rendered pages.

- `utils.py`

> Contains 4 utility functions used in other parts of the app, namely `format_time` to format time in minutes to more flexible formats, `generate_random_name` to generate a random name, `generate_random_users` to generate a given amount of users with random names, and `register_user` to modularize the process of registering a new user into the database.

- `views.py`

> Contains all the main logic behind RecipeNinja, mainly rendered page views and API views. `views.py` also uses Django Forms to handle login and register requests.


## **How to Run RecipeNinja**

To run RecipeNinja, simply run in the terminal `python manage.py runserver` in the root directory of this project. Open RecipeNinja immediately at the development server, generally at `http://127.0.0.1:8000/` and start exploring RecipeNinja! 

To start engaging such as liking recipes, saving recipes, reviewing recipes, creating recipes, liking reviews, following users, and customizing your own profile, you will need to first create an account and get logged in. Without an account, you can still explore recipes and check out other users, but any attempt at engagement will redirect you to the login page.

Also, **ensure you have an established internet connection** because RecipeNinja uses the Tailwind Play CDN instead of a development version, which makes it reliant on an internet connection. Without an internet all styling is gone and the website would be barely usable.


## **Addendum**

Before running RecipeNinja, make sure to have `django-browser-reload` installed as a python package. This is because this project used the package's hot reload feature to make development faster. To do this, simply run `pip install django-browser-reload` or `python -m pip install django-browser-reload` if PIP is not already added to `PATH` system variables. That would be the only dependency in this project. Also, *again*, ensure to have an **established internet connection**. Enjoy!
