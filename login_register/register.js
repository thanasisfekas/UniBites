document.addEventListener('DOMContentLoaded', () => {
	const languageTrigger = document.querySelector('.utility-trigger');
	const languageMenu = document.getElementById('language-menu');
	const languageInputs = document.querySelectorAll('input[name="language"]');
	const languageLabel = document.getElementById('language-label');

	const dictionary = {
		en: {
			login: 'Login',
			signup: 'Sign Up',
			registerTitle: 'Create Your UniBites Account',
			fullName: 'Full Name',
			email: 'Email',
			password: 'Password',
			confirmPassword: 'Confirm Password',
			haveAccount: 'Already have an account?',
			loginHere: 'Login here',
			quickLinks: 'Quick Links',
			home: 'Home',
			about: 'About',
			contact: 'Contact'
		},
		gr: {
			login: 'Σύνδεση',
			signup: 'Εγγραφή',
			registerTitle: 'Δημιούργησε λογαριασμό στο UniBites',
			fullName: 'Ονοματεπώνυμο',
			email: 'Email',
			password: 'Κωδικός',
			confirmPassword: 'Επιβεβαίωση Κωδικού',
			haveAccount: 'Έχεις ήδη λογαριασμό;',
			loginHere: 'Σύνδεση εδώ',
			quickLinks: 'Σύντομοι Σύνδεσμοι',
			home: 'Αρχική',
			about: 'Σχετικά',
			contact: 'Επικοινωνία'
		}
	};

	const closeLanguageMenu = () => {
		if (languageTrigger) {
			languageTrigger.setAttribute('aria-expanded', 'false');
		}
		if (languageMenu) {
			languageMenu.hidden = true;
		}
	};

	const setLanguage = (lang) => {
		const selected = dictionary[lang] || dictionary.en;

		if (languageLabel) {
			languageLabel.textContent = lang === 'gr' ? 'ΕΛΛ' : 'ENG';
		}

		document.documentElement.lang = lang === 'gr' ? 'el' : 'en';

		document.querySelectorAll('[data-i18n]').forEach((element) => {
			const key = element.getAttribute('data-i18n');
			if (selected[key]) {
				element.textContent = selected[key];
			}
		});

		localStorage.setItem('unibites-language', lang);
	};

	if (languageTrigger && languageMenu) {
		languageTrigger.addEventListener('click', (event) => {
			event.stopPropagation();
			const isOpen = languageTrigger.getAttribute('aria-expanded') === 'true';

			closeLanguageMenu();

			if (!isOpen) {
				languageTrigger.setAttribute('aria-expanded', 'true');
				languageMenu.hidden = false;
			}
		});
	}

	document.addEventListener('click', (event) => {
		if (!event.target.closest('.utility-group')) {
			closeLanguageMenu();
		}
	});

	languageInputs.forEach((input) => {
		input.addEventListener('change', () => {
			setLanguage(input.value);
			closeLanguageMenu();
		});
	});

	const savedLanguage = localStorage.getItem('unibites-language') || 'en';
	const selectedLanguageInput = document.querySelector(`input[name="language"][value="${savedLanguage}"]`);

	if (selectedLanguageInput) {
		selectedLanguageInput.checked = true;
	}

	setLanguage(savedLanguage);
});
