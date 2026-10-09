/* =========================================================
   PETER MUMBA PORTFOLIO
   ICT251 INTERACTIVE PERSONAL WEBSITE

   Features:
   1. Light and dark theme
   2. Responsive mobile navigation
   3. Active navigation links
   4. Project filtering
   5. Contact form validation
   6. Live message preview
   7. Scroll reveal animations
   8. Reading progress indicator
   9. Back-to-top button
   10. Dynamic footer year
========================================================= */

"use strict";


/* =========================================================
   1. DOM ELEMENTS
========================================================= */

const body = document.body;

const navbar = document.getElementById("navbar");

const themeToggle = document.getElementById("themeToggle");

const menuToggle = document.getElementById("menuToggle");

const navWrapper = document.getElementById("navWrapper");

const navLinks = document.querySelectorAll(".nav-link");

const sections = document.querySelectorAll("main section[id]");

const filterButtons = document.querySelectorAll(".filter-btn");

const projectCards = document.querySelectorAll(".project-card");

const filterEmpty = document.getElementById("filterEmpty");

const contactForm = document.getElementById("contactForm");

const formPreview = document.getElementById("formPreview");

const closePreviewButton = document.getElementById("closePreview");

const editMessageButton = document.getElementById("editMessage");

const fullNameInput = document.getElementById("fullName");

const emailInput = document.getElementById("email");

const topicInput = document.getElementById("topic");

const messageInput = document.getElementById("message");

const previewName = document.getElementById("previewName");

const previewEmail = document.getElementById("previewEmail");

const previewTopic = document.getElementById("previewTopic");

const previewMessage = document.getElementById("previewMessage");

const messageCount = document.getElementById("messageCount");

const backToTop = document.getElementById("backToTop");

const readingProgress = document.getElementById("readingProgress");

const currentYear = document.getElementById("currentYear");

const liveAnnouncement = document.getElementById("liveAnnouncement");

const revealElements = document.querySelectorAll(".reveal");


/* =========================================================
   2. THEME SWITCHER
========================================================= */

const THEME_KEY = "peter-portfolio-theme";


/*
   Retrieve the user's saved theme.

   If no theme has been saved, the website uses light mode.
*/

function getSavedTheme() {
    try {
        return localStorage.getItem(THEME_KEY);
    } catch (error) {
        return null;
    }
}


/*
   Update the theme button's icon and accessibility labels.
*/

function updateThemeButton() {
    if (!themeToggle) {
        return;
    }

    const isDark =
        body.getAttribute("data-theme") === "dark";

    const themeIcon =
        themeToggle.querySelector(".theme-icon");

    if (themeIcon) {
        themeIcon.textContent = isDark ? "☀" : "☾";
    }

    themeToggle.setAttribute(
        "aria-pressed",
        String(isDark)
    );

    themeToggle.setAttribute(
        "aria-label",
        isDark
            ? "Switch to light mode"
            : "Switch to dark mode"
    );
}


/*
   Apply the saved theme when the website loads.
*/

function applySavedTheme() {
    const savedTheme = getSavedTheme();

    if (savedTheme === "dark") {
        body.setAttribute("data-theme", "dark");
    } else {
        body.removeAttribute("data-theme");
    }

    updateThemeButton();
}


/*
   Save theme preferences safely.
*/

function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
        /*
           The theme still works if local storage is unavailable.
        */
    }
}


/*
   Toggle between light and dark mode.
*/

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isDark =
            body.getAttribute("data-theme") === "dark";

        if (isDark) {
            body.removeAttribute("data-theme");
            saveTheme("light");
        } else {
            body.setAttribute("data-theme", "dark");
            saveTheme("dark");
        }

        updateThemeButton();
    });
}


applySavedTheme();


/* =========================================================
   3. MOBILE NAVIGATION
========================================================= */


/*
   Close the mobile navigation menu.
*/

function closeMobileMenu() {
    if (!menuToggle || !navWrapper) {
        return;
    }

    navWrapper.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

    body.classList.remove("menu-open");
}


/*
   Open the mobile navigation menu.
*/

function openMobileMenu() {
    if (!menuToggle || !navWrapper) {
        return;
    }

    navWrapper.classList.add("open");

    menuToggle.setAttribute("aria-expanded", "true");

    menuToggle.setAttribute(
        "aria-label",
        "Close navigation menu"
    );

    body.classList.add("menu-open");
}


/*
   Respond to clicks on the hamburger button.
*/

if (menuToggle && navWrapper) {
    menuToggle.addEventListener("click", () => {
        const isOpen =
            navWrapper.classList.contains("open");

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
}


/*
   Close the menu when a navigation link is selected.
*/

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        closeMobileMenu();
    });
});


/*
   Close the mobile menu when Escape is pressed.
*/

document.addEventListener("keydown", (event) => {
    if (
        event.key === "Escape" &&
        navWrapper &&
        navWrapper.classList.contains("open")
    ) {
        closeMobileMenu();

        if (menuToggle) {
            menuToggle.focus();
        }
    }
});


/*
   Close the menu when the screen becomes desktop-sized.
*/

window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
        closeMobileMenu();
    }
});


/* =========================================================
   4. NAVBAR SCROLL EFFECT
========================================================= */

function updateNavbar() {
    if (!navbar) {
        return;
    }

    navbar.classList.toggle(
        "scrolled",
        window.scrollY > 20
    );
}


window.addEventListener(
    "scroll",
    updateNavbar,
    { passive: true }
);


updateNavbar();


/* =========================================================
   5. PROJECT FILTER
========================================================= */


/*
   Show only projects belonging to the selected category.

   Categories:
   all
   web
   java
   ai
*/

function filterProjects(selectedCategory) {
    let visibleProjects = 0;

    projectCards.forEach((card) => {
        const category = card.dataset.category;

        const shouldShow =
            selectedCategory === "all" ||
            category === selectedCategory;

        card.hidden = !shouldShow;

        if (shouldShow) {
            visibleProjects++;
        }
    });


    /*
       Update filter button appearance and accessibility.
    */

    filterButtons.forEach((button) => {
        const isActive =
            button.dataset.filter === selectedCategory;

        button.classList.toggle("active", isActive);

        button.setAttribute(
            "aria-pressed",
            String(isActive)
        );
    });


    /*
       Show a message if the selected category has no projects.
    */

    if (filterEmpty) {
        filterEmpty.hidden = visibleProjects !== 0;
    }


    /*
       Announce the result to screen readers.
    */

    if (liveAnnouncement) {
        liveAnnouncement.textContent =
            `${visibleProjects} project${
                visibleProjects === 1 ? "" : "s"
            } displayed.`;
    }
}


/*
   Connect each filter button to the filter function.
*/

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const category = button.dataset.filter || "all";

        filterProjects(category);
    });
});


/*
   Display all projects when the website first loads.
*/

filterProjects("all");


/* =========================================================
   6. FORM VALIDATION HELPERS
========================================================= */


/*
   Retrieve the error message element associated with an input.
*/

function getErrorElement(input) {
    if (!input) {
        return null;
    }

    return document.getElementById(`${input.id}Error`);
}


/*
   Display a validation error.
*/

function showError(input, message) {
    if (!input) {
        return;
    }

    const errorElement = getErrorElement(input);

    input.classList.add("invalid");
    input.classList.remove("valid");

    input.setAttribute("aria-invalid", "true");

    if (errorElement) {
        errorElement.textContent = message;
    }
}


/*
   Remove validation errors from an input.
*/

function clearError(input) {
    if (!input) {
        return;
    }

    const errorElement = getErrorElement(input);

    input.classList.remove("invalid");
    input.classList.remove("valid");

    input.setAttribute("aria-invalid", "false");

    if (errorElement) {
        errorElement.textContent = "";
    }
}


/*
   Mark an input as valid.
*/

function markValid(input) {
    if (!input) {
        return;
    }

    clearError(input);

    input.classList.add("valid");
}


/* =========================================================
   7. INDIVIDUAL VALIDATORS
========================================================= */


/*
   Validate the user's full name.

   Rules:
   - Required
   - At least two characters
*/

function validateName() {
    if (!fullNameInput) {
        return false;
    }

    const value = fullNameInput.value.trim();

    if (!value) {
        showError(
            fullNameInput,
            "Please enter your name."
        );

        return false;
    }

    if (value.length < 2) {
        showError(
            fullNameInput,
            "Your name must contain at least two characters."
        );

        return false;
    }

    markValid(fullNameInput);

    return true;
}


/*
   Validate the email address.

   This is a basic client-side format check.
   It does not verify that an email account exists.
*/

function validateEmail() {
    if (!emailInput) {
        return false;
    }

    const value = emailInput.value.trim();

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
        showError(
            emailInput,
            "Please enter your email address."
        );

        return false;
    }

    if (!emailPattern.test(value)) {
        showError(
            emailInput,
            "Please enter a valid email address."
        );

        return false;
    }

    markValid(emailInput);

    return true;
}


/*
   Validate the selected discussion topic.
*/

function validateTopic() {
    if (!topicInput) {
        return false;
    }

    if (!topicInput.value) {
        showError(
            topicInput,
            "Please select a topic."
        );

        return false;
    }

    markValid(topicInput);

    return true;
}


/*
   Validate the message.

   Rules:
   - Required
   - At least ten characters
   - Maximum one thousand characters
*/

function validateMessage() {
    if (!messageInput) {
        return false;
    }

    const value = messageInput.value.trim();

    if (!value) {
        showError(
            messageInput,
            "Please enter your message."
        );

        return false;
    }

    if (value.length < 10) {
        showError(
            messageInput,
            "Your message must contain at least ten characters."
        );

        return false;
    }

    if (messageInput.value.length > 1000) {
        showError(
            messageInput,
            "Your message cannot exceed 1000 characters."
        );

        return false;
    }

    markValid(messageInput);

    return true;
}


/* =========================================================
   8. MESSAGE CHARACTER COUNTER
========================================================= */

function updateMessageCount() {
    if (!messageInput || !messageCount) {
        return;
    }

    const currentLength = messageInput.value.length;

    messageCount.textContent =
        `${currentLength} / 1000`;

    if (currentLength > 1000) {
        messageCount.style.color = "var(--danger)";
    } else {
        messageCount.style.color = "";
    }
}


if (messageInput) {
    messageInput.addEventListener(
        "input",
        updateMessageCount
    );
}


updateMessageCount();


/* =========================================================
   9. LIVE FORM VALIDATION
========================================================= */


/*
   Validate a field while the user types.

   Once the user has started entering information,
   the relevant validator provides immediate feedback.
*/

if (fullNameInput) {
    fullNameInput.addEventListener(
        "input",
        validateName
    );
}


if (emailInput) {
    emailInput.addEventListener(
        "input",
        validateEmail
    );
}


if (topicInput) {
    topicInput.addEventListener(
        "change",
        validateTopic
    );
}


if (messageInput) {
    messageInput.addEventListener(
        "input",
        validateMessage
    );
}


/* =========================================================
   10. VALIDATE THE COMPLETE FORM
========================================================= */

function validateForm() {
    const nameIsValid = validateName();

    const emailIsValid = validateEmail();

    const topicIsValid = validateTopic();

    const messageIsValid = validateMessage();

    return (
        nameIsValid &&
        emailIsValid &&
        topicIsValid &&
        messageIsValid
    );
}


/* =========================================================
   11. CLOSE MESSAGE PREVIEW
========================================================= */

function closeFormPreview() {
    if (!formPreview) {
        return;
    }

    formPreview.hidden = true;
}


/*
   Close the preview using the X button.
*/

if (closePreviewButton) {
    closePreviewButton.addEventListener(
        "click",
        closeFormPreview
    );
}


/*
   Return to the form when Edit Message is selected.
*/

if (editMessageButton) {
    editMessageButton.addEventListener("click", () => {
        closeFormPreview();

        if (fullNameInput) {
            fullNameInput.focus();
        }
    });
}


/* =========================================================
   12. CONTACT FORM SUBMISSION
========================================================= */

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {

        /*
           ICT251 requirement:

           Prevent the browser from submitting the form
           and refreshing the page.
        */

        event.preventDefault();


        /*
           Validate every required field.
        */

        const formIsValid = validateForm();


        /*
           If validation fails, hide the preview and
           move the user's focus to the first invalid field.
        */

        if (!formIsValid) {
            closeFormPreview();

            const firstInvalidField =
                contactForm.querySelector(".invalid");

            if (firstInvalidField) {
                firstInvalidField.focus();
            }

            if (liveAnnouncement) {
                liveAnnouncement.textContent =
                    "Please correct the highlighted form fields.";
            }

            return;
        }


        /*
           ICT251 security requirement:

           Use textContent to insert user-provided information.

           Do not use innerHTML for values entered by users.
        */

        if (
            !previewName ||
            !previewEmail ||
            !previewTopic ||
            !previewMessage ||
            !formPreview
        ) {
            return;
        }


        previewName.textContent =
            fullNameInput.value.trim();

        previewEmail.textContent =
            emailInput.value.trim();

        previewTopic.textContent =
            topicInput.options[
                topicInput.selectedIndex
            ].textContent;

        previewMessage.textContent =
            messageInput.value.trim();


        /*
           Display the message preview.
        */

        formPreview.hidden = false;


        /*
           Tell the user that the preview is ready.
        */

        if (liveAnnouncement) {
            liveAnnouncement.textContent =
                "Your message has passed validation. Review the preview below.";
        }


        /*
           Scroll the preview into view.
        */

        formPreview.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth",

            block: "nearest"
        });

    });
}


/* =========================================================
   13. SCROLL REVEAL ANIMATIONS
========================================================= */

function initializeRevealAnimations() {

    /*
       Respect the visitor's motion accessibility preference.
    */

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /*
       If reduced motion is enabled, display all elements
       immediately without entrance animations.
    */

    if (
        prefersReducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });

        return;
    }


    /*
       Observe elements and reveal them as they enter the viewport.
    */

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("visible");

                observer.unobserve(entry.target);
            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );


    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });

}


initializeRevealAnimations();


/* =========================================================
   14. ACTIVE NAVIGATION
========================================================= */

function initializeActiveNavigation() {

    if (!("IntersectionObserver" in window)) {
        return;
    }

    const sectionObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const sectionId = entry.target.id;

                navLinks.forEach((link) => {
                    const target = link.getAttribute("href");

                    const isActive =
                        target === `#${sectionId}`;

                    link.classList.toggle(
                        "active",
                        isActive
                    );
                });

            });

        },
        {
            rootMargin: "-30% 0px -60% 0px",
            threshold: 0
        }
    );


    sections.forEach((section) => {
        sectionObserver.observe(section);
    });

}


initializeActiveNavigation();


/* =========================================================
   15. READING PROGRESS INDICATOR
========================================================= */

function updateReadingProgress() {
    if (!readingProgress) {
        return;
    }

    const scrollTop = window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

    if (documentHeight <= 0) {
        readingProgress.style.width = "0%";
        return;
    }

    const progress = Math.min(
        100,
        Math.max(
            0,
            (scrollTop / documentHeight) * 100
        )
    );

    readingProgress.style.width = `${progress}%`;
}


window.addEventListener(
    "scroll",
    updateReadingProgress,
    { passive: true }
);


window.addEventListener(
    "resize",
    updateReadingProgress
);


updateReadingProgress();


/* =========================================================
   16. BACK TO TOP
========================================================= */

function updateBackToTop() {
    if (!backToTop) {
        return;
    }

    const shouldShow = window.scrollY > 450;

    backToTop.classList.toggle(
        "visible",
        shouldShow
    );

    backToTop.setAttribute(
        "aria-hidden",
        String(!shouldShow)
    );

    backToTop.tabIndex = shouldShow ? 0 : -1;
}


window.addEventListener(
    "scroll",
    updateBackToTop,
    { passive: true }
);


updateBackToTop();


if (backToTop) {
    backToTop.addEventListener("click", () => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        window.scrollTo({
            top: 0,

            behavior: prefersReducedMotion
                ? "auto"
                : "smooth"
        });
    });
}


/* =========================================================
   17. DYNAMIC FOOTER YEAR
========================================================= */

if (currentYear) {
    currentYear.textContent = String(
        new Date().getFullYear()
    );
}


/* =========================================================
   18. INITIALIZE MEDIA FALLBACKS
========================================================= */


/*
   If a gallery image fails to load, hide the broken image
   and show a clean fallback background.
*/

document.querySelectorAll(".gallery-item img").forEach(
    (image) => {

        image.addEventListener("error", () => {
            image.style.visibility = "hidden";

            const galleryItem =
                image.closest(".gallery-item");

            if (galleryItem) {
                galleryItem.style.background =
                    "var(--surface-alt)";
            }
        });

    }
);


/*
   Media files are optional until you add your own.
   Hide the player if its source cannot be loaded.
*/

document.querySelectorAll("video, audio").forEach(
    (media) => {

        media.addEventListener("error", () => {
            media.setAttribute(
                "aria-label",
                "Media file unavailable. Please check the file path."
            );
        });

    }
);


/* =========================================================
   19. STARTUP MESSAGE
========================================================= */

console.log(
    "%c PETER MUMBA PORTFOLIO ",
    "background: linear-gradient(120deg, #635bff, #06b6d4); color: white; padding: 8px 12px; font-weight: bold; border-radius: 6px;"
);

console.log(
    "ICT251 Interactive Personal Website initialized."
);

console.log(
    "Theme switching, navigation, project filtering, form validation, and accessibility features are ready."
);