export default function validate(type: string, input: HTMLInputElement) {
	switch (type) {
		case "username": {
			const usernameRegex = /^[a-zA-Z][a-zA-Z0-9-_]{1,14}$/;

			const isValid = usernameRegex.test(input.value);

			if (!isValid) {
				input.setCustomValidity(
					"The username should be between 2 and 15 characters, begin with a letter and contain only letters, number, '-' or '_'.",
				);
			} else {
				input.setCustomValidity("");
			}

			return isValid;
		}
	}
}