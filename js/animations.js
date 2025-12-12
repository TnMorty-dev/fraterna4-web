/**
 * Animations Controller
 */
(function() {
    'use strict';

    class ParticleSystem {
        constructor(container) {
            this.container = container;
            this.particles = [];
        }

        init() {
            if (!this.container) return;
            const types = ['block', 'diamond', 'emerald', 'gold'];
            for (let i = 0; i < 15; i++) {
                const p = document.createElement('div');
                const type = types[Math.floor(Math.random() * types.length)];
                p.classList.add('particle', `particle-${type}`);
                p.style.cssText = `left:${Math.random()*100}%;animation-delay:${Math.random()*20}s;animation-duration:${15+Math.random()*20}s;transform:scale(${0.5+Math.random()})`;
                this.container.appendChild(p);
            }
        }
    }

    class ScrollReveal {
        init() {
            const els = document.querySelectorAll('.about-card, .wl-step, .rule-item, .step, .timeline-item, .access-card');
            if ('IntersectionObserver' in window) {
                const obs = new IntersectionObserver((entries) => {
                    entries.forEach(e => { if(e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }});
                }, { threshold: 0.1 });
                els.forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = `${i%4*0.1}s`; obs.observe(el); });
            }
        }
    }

    class NavbarController {
        init() {
            const nav = document.querySelector('.navbar');
            if(nav) window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.pageYOffset > 50), {passive:true});
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        new ParticleSystem(document.getElementById('particles-container')).init();
        new ScrollReveal().init();
        new NavbarController().init();
        document.querySelectorAll('a[href^="#"]').forEach(a => {
            a.addEventListener('click', e => {
                const t = document.querySelector(a.getAttribute('href'));
                if(t) { e.preventDefault(); t.scrollIntoView({behavior:'smooth'}); }
            });
        });
    });
})();
