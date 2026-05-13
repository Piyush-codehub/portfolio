document.addEventListener("DOMContentLoaded", () => {
  
  // Mobile Menu Logic
  const hamburger = document.querySelector(".hamburger");
  const closeMenu = document.querySelector(".close-menu");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-nav-links a");

  function toggleMenu() {
    mobileMenu.classList.toggle("open");
  }

  if (hamburger && closeMenu && mobileMenu) {
    hamburger.addEventListener("click", toggleMenu);
    closeMenu.addEventListener("click", toggleMenu);
    
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
      });
    });
  }

  // Navbar Scroll Effect
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }

  // Accordion Logic
  const accordions = document.querySelectorAll(".accordion-item");
  accordions.forEach(item => {
    const trigger = item.querySelector(".accordion-trigger");
    trigger.addEventListener("click", () => {
      // Close others
      accordions.forEach(acc => {
        if (acc !== item) {
          acc.classList.remove("active");
          const otherContent = acc.querySelector(".accordion-content");
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });
      // Toggle current
      item.classList.toggle("active");
      const content = item.querySelector(".accordion-content");
      if (item.classList.contains("active")) {
        content.style.maxHeight = content.scrollHeight + "px";
      } else {
        content.style.maxHeight = null;
      }
    });
  });

  // Back to Top Button
  const backToTop = document.getElementById('back-to-top');
  
  window.addEventListener('scroll', () => {
    if (backToTop) {
      if (window.scrollY > 400) {
        backToTop.classList.add('active');
      } else {
        backToTop.classList.remove('active');
      }
    }
  });

  // Scroll Reveal Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // Optional: stop observing once visible to only animate once
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // --- Contact Modal & EmailJS ---
  // Initialized with Kabir's Public Key
  emailjs.init("2gF1B_2cyqA3uK-oF"); 

  const contactModal = document.getElementById('contact-modal');
  const closeBtn = document.querySelector('.close-modal');
  const contactBtns = document.querySelectorAll('.contact-btn');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn.querySelector('.btn-text');

  // Open Modal
  contactBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      contactModal.classList.add('active');
    });
  });

  // Close Modal
  const closeModal = () => {
    contactModal.classList.remove('active');
    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
      contactForm.reset();
    }, 400);
  };

  closeBtn.addEventListener('click', closeModal);
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) closeModal();
  });

  // Handle Form Submit
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // UI Loading state
    btnText.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Send Email using Kabir's Service ID and Template ID
    emailjs.sendForm('service_zyi87ca', 'template_tlvjs3r', this)
      .then(() => {
          btnText.textContent = 'Sent Successfully!';
          formStatus.textContent = 'Your message has been sent. I will get back to you soon.';
          formStatus.className = 'form-status success';
          
          setTimeout(() => {
            closeModal();
            btnText.textContent = 'Send Message';
            submitBtn.disabled = false;
          }, 3000);
      }, (error) => {
          console.error("EmailJS Error:", error);
          btnText.textContent = 'Send Message';
          submitBtn.disabled = false;
          formStatus.textContent = 'Failed to send message. Make sure you added your EmailJS keys!';
          formStatus.className = 'form-status error';
      });
  });

  document.querySelectorAll(".fade-up").forEach(el => {
    observer.observe(el);
  });

  // --- Interactive Particle Background ---
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Mouse tracking
    let mouse = { x: -1000, y: -1000 };
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseout', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    }
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.baseRadius = Math.random() * 1.5 + 0.5;
        this.radius = this.baseRadius;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Bounce off edges
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        
        // Mouse interaction (push away gently)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 150) {
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * 1.5;
          this.y -= Math.sin(angle) * 1.5;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.5)'; // Amber color
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      let numParticles = (width * height) / 12000; // Density
      if (numParticles > 120) numParticles = 120; // Maximum limit to keep smooth
      
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.15 - dist/120})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
        
        // Connect to mouse cursor
        const mdx = particles[i].x - mouse.x;
        const mdy = particles[i].y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 180) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.35 - mdist/180})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
      }
      requestAnimationFrame(animate);
    }
    
    resize();
    animate();
  }
});
