from django.core.management.base import BaseCommand
from ...utils import generate_random_users, register_user


class Command(BaseCommand):
    help = "Create multiple users"

    def handle(self, *args, **options):
        users_data = generate_random_users(20)

        for user_data in users_data:
            result = register_user(
                user_data["username"],
                user_data["first_name"],
                user_data["last_name"],
                user_data["email"],
                user_data["password"],
                user_data["confirm_password"],
            )
            if result == 0:
                self.stdout.write(self.style.SUCCESS(f"Created user: {user_data['username']}"))
            else:
                self.stdout.write(self.style.ERROR(f"Failed to create user {user_data['username']}"))
