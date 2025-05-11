		document.addEventListener('DOMContentLoaded', () => {
            // --- DOM Element References ---
            const animatedElement = document.getElementById('myAnimatedElement');
            const triggerAnimationButton = document.getElementById('triggerAnimationButton');

            const usernameInput = document.getElementById('usernameInput');
            const boxColorInput = document.getElementById('boxColorInput');
            const themeSelector = document.getElementById('themeSelector');
            const savePreferencesButton = document.getElementById('savePreferencesButton');
            const applyPrefsBtn = document.getElementById('applyPrefsBtn');
            const displayUsername = document.getElementById('displayUsername');
            const feedbackDiv = document.getElementById('feedback');

            // --- 1. JavaScript to Trigger CSS Animation ---
            triggerAnimationButton.addEventListener('click', () => {
                // Remove class first to allow re-triggering if animation already played
                animatedElement.classList.remove('animate-now');

                //offsetHeight is a trick to force a reflow, ensuring the class removal is processed
                //before re-adding it, thus restarting the animation.
                void animatedElement.offsetHeight; 

                animatedElement.classList.add('animate-now');
                feedbackDiv.textContent = 'Animation triggered!';

                // Optional: Remove class after animation completes to allow clean re-trigger
                // This is useful if animation-fill-mode is 'forwards' and you want to reset to original state visually before next trigger
                // However, for 'bounceAndSpin', 'forwards' ensures it ends in the final state of the animation.
                // If you remove 'animate-now' it would snap back.
                // For this specific animation, we might not need to remove it automatically.
                // But if the animation was a one-time "slide in", you'd remove it.
                /*
                animatedElement.addEventListener('animationend', () => {
                    // animatedElement.classList.remove('animate-now'); // Uncomment if needed
                }, { once: true }); // Ensure listener only runs once per trigger
                */
            });

            // --- 2. Store and Retrieve Data using localStorage ---
            const PREFS_KEY = 'userAppPreferences'; // Key for storing all preferences as a JSON string

            function savePreferences() {
                const preferences = {
                    username: usernameInput.value.trim(),
                    boxColor: boxColorInput.value,
                    theme: themeSelector.value
                };
                localStorage.setItem(PREFS_KEY, JSON.stringify(preferences));
                feedbackDiv.textContent = 'Preferences saved to localStorage!';
                applyPreferences(preferences); // Apply immediately after saving
            }

            function loadAndApplyPreferences() {
                const savedPrefsString = localStorage.getItem(PREFS_KEY);
                if (savedPrefsString) {
                    const preferences = JSON.parse(savedPrefsString);
                    applyPreferences(preferences);
                    feedbackDiv.textContent = 'Preferences loaded from localStorage and applied!';
                    return true;
                } else {
                    feedbackDiv.textContent = 'No preferences found in localStorage. Using defaults.';
                    // Apply default visual state if needed (though CSS handles initial defaults)
                    applyPreferences({ // Apply default values to UI elements
                        username: '',
                        boxColor: '#3498db', // Match CSS default
                        theme: 'light'
                    }, false); // Don't say "loaded"
                    return false;
                }
            }

            function applyPreferences(prefs, showLoadedMessage = true) {
                // Apply username
                usernameInput.value = prefs.username || '';
                displayUsername.textContent = prefs.username || 'N/A';

                // Apply box color
                boxColorInput.value = prefs.boxColor || '#3498db';
                animatedElement.style.backgroundColor = prefs.boxColor || '#3498db';

                // Apply theme
                themeSelector.value = prefs.theme || 'light';
                document.body.classList.remove('light-theme', 'dark-theme'); // Remove any existing theme
                if (prefs.theme === 'dark') {
                    document.body.classList.add('dark-theme');
                } else {
                    document.body.classList.add('light-theme'); // Default or explicitly light
                }

                if (showLoadedMessage && feedbackDiv.textContent.includes('No preferences found')) {
                     // If we just applied defaults because nothing was found, don't override that message
                } else if (showLoadedMessage) {
                    // feedbackDiv.textContent = 'Preferences applied!'; // Can be noisy
                }
            }

            // Event Listeners for localStorage
            savePreferencesButton.addEventListener('click', savePreferences);
            applyPrefsBtn.addEventListener('click', loadAndApplyPreferences);

            // Load and apply preferences when the page loads
            loadAndApplyPreferences();
        });