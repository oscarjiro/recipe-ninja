def format_time(minutes):        
    if minutes < 0:
        return "Invalid time"

    if minutes == 1:
        return "1 min"

    units = [
        (365 * 24 * 60, "y"),
        (7 * 24 * 60, "w"),
        (24 * 60, "d"),
        (60, "h"),
        (1, "min")
    ]

    result_parts = []

    for unit_minutes, unit_label in units:
        if minutes >= unit_minutes:
            unit_count = minutes // unit_minutes
            result_parts.append(f"{unit_count} {unit_label}")
            minutes -= unit_count * unit_minutes

    return ' '.join(result_parts)


def generate_random_name():
    import random

    first_names = ["John", "Emma", "Mohammed", "Sophia", "Liam", "Olivia", "Mateo", "Amina", "Sofia", "Yusuf", "Leila", "Carlos", "Mei", "Daniel", "Layla", "Ella", "Ahmed", "Isabella", "Amir", "Aisha"]
    last_names = ["Smith", "Garcia", "Lee", "Chen", "Nguyen", "Gonzalez", "Patel", "Santos", "Ahmed", "Wang", "Silva", "Martinez", "Kim", "Carter", "Khan", "Ng", "Rodriguez", "Lopez", "Li", "Al-Mansoori"]

    first_name = random.choice(first_names)
    last_name = random.choice(last_names)

    return first_name, last_name


def generate_random_users(num_users):
    users = []

    for _ in range(num_users):
        first_name, last_name = generate_random_name()

        user = {
            'username': f'{first_name.lower()}{last_name.lower()}',
            'first_name': first_name,
            'last_name': last_name,
            'email': f'{first_name.lower()}.{last_name.lower()}@mail.com',
            'password': 'pass',
            'confirm_password': 'pass',
        }

        users.append(user)

    return users


def register_user(username, first_name, last_name, email, password, confirm_password):
    from .models import User, Followers
    from django.db import IntegrityError
    
     # Ensure password matches confirmation
    if password != confirm_password:
        return 1

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
        return 2

    return 0