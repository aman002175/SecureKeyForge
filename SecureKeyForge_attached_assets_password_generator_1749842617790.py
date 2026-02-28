import random
import os

# List of words for password
word_list = [
    'alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel',
    'india', 'juliet', 'kilo', 'lima', 'mango', 'nectar', 'omega', 'papa',
    'quartz', 'romeo', 'sierra', 'tango', 'ultra', 'vector', 'whiskey', 'xray',
    'yankee', 'zulu'
]

special_chars = list("!@#$%^&*()-_=+[]{}|;:'\",.<>?/")

def get_random_number():
    return str(random.randint(10, 9999))

def generate_password(length, include_special, include_numbers):
    password_parts = []

    for _ in range(length):
        item_type = random.choice(['word', 'special' if include_special else 'word', 'number' if include_numbers else 'word'])

        if item_type == 'word':
            password_parts.append(random.choice(word_list))
        elif item_type == 'special':
            password_parts.append(random.choice(special_chars))
        elif item_type == 'number':
            password_parts.append(get_random_number())

    random.shuffle(password_parts)
    return ''.join(password_parts)

# === Main Interface ===
def main():
    print("="*40)
    print("🛡️  Welcome to Hardcore Password Generator")
    print("="*40)

    service = input("🔹 App/Website (e.g. Instagram, Facebook): ").strip()
    username = input("🔹 Username used on that app: ").strip()
    email = input("🔹 Email associated: ").strip()

    try:
        length = int(input("🔹 Password length (number of parts): "))
    except ValueError:
        print("⚠️  Invalid number! Defaulting to 30 parts.")
        length = 30

    special = input("🔹 Include special characters? (yes/no): ").lower().startswith("y")
    numbers = input("🔹 Include numbers? (yes/no): ").lower().startswith("y")

    password = generate_password(length, special, numbers)

    print("\n✅ Your Hardcore Password:")
    print(f"🔐 {password}\n")

    # Save to file
    file_name = "passwords.txt"
    entry = f"[{service}]\nUsername: {username}\nEmail: {email}\nPassword: {password}\n{'-'*40}\n"

    with open(file_name, "a") as f:
        f.write(entry)

    print(f"💾 Password saved successfully in '{file_name}'!\n")

    # Show option to generate another
    again = input("Do you want to generate another password? (yes/no): ").lower()
    if again.startswith("y"):
        print("\n" + "="*40 + "\n")
        main()
    else:
        print("\n👋 Thank you for using the generator!\n")

# Run program
if __name__ == "__main__":
    main()