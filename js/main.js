// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-in-out'
});

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });
}

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('shadow-2xl');
    } else {
        navbar.classList.remove('shadow-2xl');
    }
    
    lastScroll = currentScroll;
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString('ar-SA');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString('ar-SA');
        }
    }, 16);
}

// Trigger counter animation when in viewport
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.dataset.target || entry.target.textContent.replace(/[^0-9]/g, ''));
            animateCounter(entry.target, target);
        }
    });
}, observerOptions);

// Observe all counter elements
document.querySelectorAll('[data-counter]').forEach(counter => {
    counterObserver.observe(counter);
});

// Before/After Image Slider
function initBeforeAfterSlider(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const slider = container.querySelector('.slider-handle');
    const beforeImage = container.querySelector('.before-image');
    const afterImage = container.querySelector('.after-image');
    
    let isActive = false;
    
    const updateSlider = (x) => {
        const rect = container.getBoundingClientRect();
        const position = Math.max(0, Math.min(x - rect.left, rect.width));
        const percentage = (position / rect.width) * 100;
        
        slider.style.left = `${percentage}%`;
        beforeImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
    };
    
    slider.addEventListener('mousedown', () => isActive = true);
    document.addEventListener('mouseup', () => isActive = false);
    
    container.addEventListener('mousemove', (e) => {
        if (isActive) updateSlider(e.clientX);
    });
    
    slider.addEventListener('touchstart', () => isActive = true);
    document.addEventListener('touchend', () => isActive = false);
    
    container.addEventListener('touchmove', (e) => {
        if (isActive) updateSlider(e.touches[0].clientX);
    });
    
    // Click to position
    container.addEventListener('click', (e) => {
        updateSlider(e.clientX);
    });
}

// Form Validation
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const errorElement = field.nextElementSibling;
            
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('border-red-500');
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.classList.remove('hidden');
                }
            } else {
                field.classList.remove('border-red-500');
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.classList.add('hidden');
                }
            }
        });
        
        // Email validation
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                isValid = false;
                emailField.classList.add('border-red-500');
            }
        }
        
        // Phone validation (Saudi format)
        const phoneField = form.querySelector('input[type="tel"]');
        if (phoneField && phoneField.value) {
            const phoneRegex = /^(05|5)[0-9]{8}$/;
            const cleanPhone = phoneField.value.replace(/[\s\-\+]/g, '').replace(/^966/, '0');
            if (!phoneRegex.test(cleanPhone)) {
                isValid = false;
                phoneField.classList.add('border-red-500');
            }
        }
        
        if (isValid) {
            // Show success message
            showNotification('تم إرسال طلبك بنجاح! سنتواصل معك قريباً.', 'success');
            
            // Submit form data (replace with actual API endpoint)
            submitFormData(form);
            
            // Reset form
            setTimeout(() => {
                form.reset();
            }, 1000);
        } else {
            showNotification('يرجى ملء جميع الحقول المطلوبة بشكل صحيح', 'error');
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.classList.add('border-red-500');
            } else {
                input.classList.remove('border-red-500');
            }
        });
        
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.classList.remove('border-red-500');
            }
        });
    });
}

// Submit Form Data
async function submitFormData(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    try {
        // Replace with actual API endpoint
        const response = await fetch('/api/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            console.log('Form submitted successfully', data);
        } else {
            console.error('Form submission failed');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-24 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-lg shadow-2xl z-50 text-white font-bold transition-all duration-500 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    }`;
    notification.style.opacity = '0';
    notification.style.transform = 'translate(-50%, -20px)';
    notification.innerHTML = `
        <div class="flex items-center space-x-3 space-x-reverse">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} text-2xl"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translate(-50%, 0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Price Calculator
function initPriceCalculator() {
    const calculator = document.getElementById('price-calculator');
    if (!calculator) return;
    
    const serviceSelect = calculator.querySelector('#service-type');
    const areaInput = calculator.querySelector('#area-size');
    const resultDiv = calculator.querySelector('#price-result');
    
    const prices = {
        'carpet': 15, // SAR per sqm
        'furniture': 200, // SAR per piece
        'sanitize': 10, // SAR per sqm
        'tanks': 500, // SAR flat rate
        'buildings': 5, // SAR per sqm
        'moving': 300 // SAR per room
    };
    
    const calculate = () => {
        const service = serviceSelect.value;
        const area = parseFloat(areaInput.value);
        
        if (service && area > 0) {
            const basePrice = prices[service] * area;
            const tax = basePrice * 0.15; // 15% VAT
            const total = basePrice + tax;
            
            resultDiv.innerHTML = `
                <div class="bg-gradient-to-br from-secondary to-accent text-white p-6 rounded-2xl">
                    <div class="text-center mb-4">
                        <div class="text-4xl font-bold">${total.toFixed(2)} ريال</div>
                        <div class="text-sm opacity-90">السعر التقديري شامل الضريبة</div>
                    </div>
                    <div class="text-sm space-y-2 border-t border-white border-opacity-30 pt-4">
                        <div class="flex justify-between">
                            <span>السعر الأساسي:</span>
                            <span>${basePrice.toFixed(2)} ريال</span>
                        </div>
                        <div class="flex justify-between">
                            <span>ضريبة القيمة المضافة (15%):</span>
                            <span>${tax.toFixed(2)} ريال</span>
                        </div>
                    </div>
                </div>
            `;
        }
    };
    
    if (serviceSelect && areaInput) {
        serviceSelect.addEventListener('change', calculate);
        areaInput.addEventListener('input', calculate);
    }
}

// Gallery Lightbox
function initGalleryLightbox() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    if (galleryImages.length === 0) return;
    
    const lightbox = document.createElement('div');
    lightbox.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 hidden items-center justify-center p-4';
    lightbox.innerHTML = `
        <button class="absolute top-4 left-4 text-white text-4xl hover:text-accent transition" onclick="this.parentElement.classList.add('hidden')">
            <i class="fas fa-times"></i>
        </button>
        <img src="" alt="" class="max-w-full max-h-full object-contain">
        <button class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-accent transition" id="lightbox-next">
            <i class="fas fa-chevron-right"></i>
        </button>
        <button class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-accent transition" id="lightbox-prev">
            <i class="fas fa-chevron-left"></i>
        </button>
    `;
    document.body.appendChild(lightbox);
    
    let currentIndex = 0;
    const images = Array.from(galleryImages);
    
    const showImage = (index) => {
        const img = lightbox.querySelector('img');
        img.src = images[index].src;
        img.alt = images[index].alt;
        currentIndex = index;
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');
    };
    
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', () => showImage(index));
        img.classList.add('cursor-pointer');
    });
    
    document.getElementById('lightbox-next')?.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    });
    
    document.getElementById('lightbox-prev')?.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add('hidden');
            lightbox.classList.remove('flex');
        }
    });
}

// Date Picker for Booking
function initDatePicker() {
    const dateInput = document.getElementById('booking-date');
    if (!dateInput) return;
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    
    // Disable Fridays (Day 5 in Saudi Arabia)
    dateInput.addEventListener('input', function() {
        const selectedDate = new Date(this.value);
        if (selectedDate.getDay() === 5) {
            showNotification('عذراً، لا نعمل يوم الجمعة قبل الساعة 2 ظهراً', 'error');
            this.value = '';
        }
    });
}

// Time Slot Selection
function initTimeSlots() {
    const timeSlots = document.querySelectorAll('.time-slot');
    if (timeSlots.length === 0) return;
    
    timeSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            timeSlots.forEach(s => s.classList.remove('selected', 'bg-secondary', 'text-white'));
            this.classList.add('selected', 'bg-secondary', 'text-white');
            
            const hiddenInput = document.getElementById('selected-time');
            if (hiddenInput) {
                hiddenInput.value = this.dataset.time;
            }
        });
    });
}

// FAQ Accordion
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isOpen = answer.classList.contains('hidden');
                
                // Close all other FAQs
                faqItems.forEach(otherItem => {
                    otherItem.querySelector('.faq-answer')?.classList.add('hidden');
                    otherItem.querySelector('.faq-icon')?.classList.remove('fa-minus');
                    otherItem.querySelector('.faq-icon')?.classList.add('fa-plus');
                });
                
                // Toggle current FAQ
                if (isOpen) {
                    answer.classList.remove('hidden');
                    icon?.classList.remove('fa-plus');
                    icon?.classList.add('fa-minus');
                } else {
                    answer.classList.add('hidden');
                    icon?.classList.remove('fa-minus');
                    icon?.classList.add('fa-plus');
                }
            });
        }
    });
}

// Service Filter
function initServiceFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card-item');
    
    if (filterButtons.length === 0 || serviceCards.length === 0) return;
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active', 'bg-secondary', 'text-white'));
            this.classList.add('active', 'bg-secondary', 'text-white');
            
            // Filter cards
            serviceCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    card.classList.add('animate-fade-in');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// Blog Search
function initBlogSearch() {
    const searchInput = document.getElementById('blog-search');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    if (!searchInput || blogPosts.length === 0) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        blogPosts.forEach(post => {
            const title = post.querySelector('.blog-title')?.textContent.toLowerCase() || '';
            const content = post.querySelector('.blog-excerpt')?.textContent.toLowerCase() || '';
            
            if (title.includes(searchTerm) || content.includes(searchTerm)) {
                post.classList.remove('hidden');
            } else {
                post.classList.add('hidden');
            }
        });
        
        // Show "no results" message if needed
        const visiblePosts = Array.from(blogPosts).filter(post => !post.classList.contains('hidden'));
        const noResults = document.getElementById('no-results');
        
        if (visiblePosts.length === 0 && noResults) {
            noResults.classList.remove('hidden');
        } else if (noResults) {
            noResults.classList.add('hidden');
        }
    });
}

// Initialize Google Map
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || typeof google === 'undefined') return;
    
    const location = { lat: 26.4207, lng: 50.0888 }; // Dammam coordinates
    
    const map = new google.maps.Map(mapContainer, {
        zoom: 15,
        center: location,
        styles: [
            {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }]
            },
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#14b8a6' }]
            }
        ]
    });
    
    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: 'Plaza Clean - الدمام',
        animation: google.maps.Animation.DROP
    });
    
    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div class="p-4 text-right" dir="rtl">
                <h3 class="font-bold text-lg mb-2">Plaza Clean</h3>
                <p class="text-gray-600">طريق الملك فهد، حي الشاطئ</p>
                <p class="text-gray-600">الدمام 32413</p>
                <a href="https://maps.google.com/?q=26.4207,50.0888" target="_blank" class="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                    احصل على الاتجاهات
                </a>
            </div>
        `
    });
    
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

// Lazy Load Images
function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize all functions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initDatePicker();
    initTimeSlots();
    initFAQAccordion();
    initServiceFilter();
    initBlogSearch();
    initPriceCalculator();
    initGalleryLightbox();
    initLazyLoad();
    
    // Initialize forms
    validateForm('booking-form');
    validateForm('contact-form');
    
    // Initialize before/after sliders
    const sliders = document.querySelectorAll('[id^="slider-"]');
    sliders.forEach(slider => {
        initBeforeAfterSlider(slider.id);
    });
});

// Page Load Animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Console message
console.log('%c✨ Plaza Clean - نخلي أماكنك تبرق ✨', 'font-size: 20px; font-weight: bold; color: #14b8a6;');
console.log('%cWebsite developed with ❤️ in Dammam, Saudi Arabia', 'font-size: 12px; color: #1e3a5f;');