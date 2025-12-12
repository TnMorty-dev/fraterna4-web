/**
 * Main Application Controller
 */
(function () {
    'use strict';

    class App {
        constructor() {
            this.navToggle = document.querySelector('.nav-toggle');
            this.navLinks = document.querySelector('.nav-links');
        }

        init() {
            this.setupMobileNav();
            this.setupTabs();
            this.setupFAQ();
        }

        setupMobileNav() {
            if (this.navToggle && this.navLinks) {
                this.navToggle.addEventListener('click', () => {
                    this.navToggle.classList.toggle('active');
                    this.navLinks.classList.toggle('active');
                });
            }
        }

        setupTabs() {
            const tabBtns = document.querySelectorAll('.tab-btn');
            const tabPanels = document.querySelectorAll('.tab-panel');

            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabId = btn.dataset.tab;

                    // Update buttons
                    tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Update panels
                    tabPanels.forEach(panel => {
                        panel.classList.remove('active');
                        if (panel.id === `tab-${tabId}`) {
                            panel.classList.add('active');
                        }
                    });
                });
            });
        }

        setupFAQ() {
            const faqItems = document.querySelectorAll('.faq-item');

            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                if (question) {
                    question.addEventListener('click', () => {
                        const isActive = item.classList.contains('active');
                        // Close all
                        faqItems.forEach(i => i.classList.remove('active'));
                        // Open current if wasn't active
                        if (!isActive) {
                            item.classList.add('active');
                        }
                    });
                }
            });
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const app = new App();
        app.init();
    });

})();
