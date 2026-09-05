/* ---------- Preloader ---------- */
window.addEventListener('load', function(){
    var pre = document.getElementById('preloader');
    setTimeout(function(){ pre.classList.add('hidden'); }, 400);
});
 
/* ---------- Animated typing greeting ---------- */
var greeting = document.getElementById("greeting");
var text = "I'm Lusanda Banzi";
var i = 0;
function typeWriter(){
    if(i < text.length){
        greeting.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, 65);
    }
}
typeWriter();
 
/* ---------- Mobile nav toggle ---------- */
var navToggle = document.getElementById('navToggle');
var navMenu = document.getElementById('navMenu');
navToggle.addEventListener('click', function(){
    navMenu.classList.toggle('open');
});
navMenu.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){ navMenu.classList.remove('open'); });
});
 
/* ---------- Active nav link on scroll ---------- */
var sections = document.querySelectorAll('section[id]');
var navLinks = document.querySelectorAll('nav ul li a');
 
var navObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
        if(entry.isIntersecting){
            navLinks.forEach(function(link){
                link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
            });
        }
    });
}, { rootMargin: '-45% 0px -45% 0px' });
 
sections.forEach(function(sec){ navObserver.observe(sec); });
 
/* ---------- Scroll reveal for cards/sections ---------- */
var revealEls = document.querySelectorAll('.reveal');
var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry, idx){
        if(entry.isIntersecting){
            setTimeout(function(){ entry.target.classList.add('active'); }, idx * 60);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
revealEls.forEach(function(el){ revealObserver.observe(el); });
 
/* ---------- Gallery: shuffle order on every load ---------- */
(function shuffleGallery(){
    var container = document.getElementById('galleryContainer');
    var items = Array.prototype.slice.call(container.querySelectorAll('.gallery-item'));
 
    // Fisher-Yates shuffle
    for(var i = items.length - 1; i > 0; i--){
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = items[i];
        items[i] = items[j];
        items[j] = tmp;
    }
 
    items.forEach(function(item){ container.appendChild(item); });
})();
 
/* ---------- Gallery: lazy load + reveal-in-view ---------- */
var galleryItems = document.querySelectorAll('.gallery-item');
 
var galleryObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry, idx){
        if(entry.isIntersecting){
            var item = entry.target;
            var frame = item.querySelector('.img-frame');
            var img = item.querySelector('img');
 
            setTimeout(function(){ item.classList.add('in-view'); }, idx * 70);
 
            if(img && img.dataset.src && !img.src){
                var realSrc = img.dataset.src;
                img.src = realSrc;
                img.addEventListener('load', function(){
                    img.classList.add('loaded');
                    frame.classList.add('loaded');
                });
                img.addEventListener('error', function(){
                    frame.classList.add('loaded');
                    frame.style.background = 'linear-gradient(135deg, var(--bg-elevated-2), var(--bg-elevated))';
                });
            }
 
            galleryObserver.unobserve(item);
        }
    });
}, { threshold: 0.1, rootMargin: '80px' });
 
galleryItems.forEach(function(item){ galleryObserver.observe(item); });
 
/* ---------- Gallery arrow navigation ---------- */
var galleryContainer = document.getElementById('galleryContainer');
document.getElementById('galleryPrev').addEventListener('click', function(){
    galleryContainer.scrollBy({ left: -340, behavior: 'smooth' });
});
document.getElementById('galleryNext').addEventListener('click', function(){
    galleryContainer.scrollBy({ left: 340, behavior: 'smooth' });
});
 
/* ---------- Lightbox ---------- */
var lightbox = document.getElementById('lightbox');
var lightboxImg = document.getElementById('lightbox-img');
var closeBtn = document.getElementById('close');
 
galleryItems.forEach(function(item){
    item.addEventListener('click', function(){
        var img = item.querySelector('img');
        if(!img.src) return;
        lightbox.style.display = 'flex';
        lightboxImg.src = img.src;
        document.body.style.overflow = 'hidden';
    });
});
 
function closeLightbox(){
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
}
closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', function(e){
    if(e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeLightbox();
});
 
/* ---------- Contact form (submits to Formspree, no page reload) ---------- */
var contactForm = document.getElementById('contactForm');
var formStatus = document.getElementById('formStatus');
 
if(contactForm){
    contactForm.addEventListener('submit', function(e){
        e.preventDefault();
 
        var submitBtn = contactForm.querySelector('button[type="submit"]');
        var originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
        formStatus.textContent = '';
        formStatus.className = 'form-status';
 
        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: { 'Accept': 'application/json' }
        })
        .then(function(response){
            if(response.ok){
                formStatus.textContent = "Thanks — your message is on its way!";
                formStatus.classList.add('success');
                contactForm.reset();
            }else{
                formStatus.textContent = "Something went wrong. Please email me directly instead.";
                formStatus.classList.add('error');
            }
        })
        .catch(function(){
            formStatus.textContent = "Something went wrong. Please email me directly instead.";
            formStatus.classList.add('error');
        })
        .finally(function(){
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
    });
}
 
/* ---------- Visitor counter (admin only, ?admin=1) ---------- */
var visits = localStorage.getItem("portfolioVisits");
visits = visits ? Number(visits) + 1 : 1;
localStorage.setItem("portfolioVisits", visits);
 
var params = new URLSearchParams(window.location.search);
if(params.get("admin") === "1"){
    var counter = document.getElementById("visitorCounter");
    counter.style.display = "block";
    counter.innerHTML = "Visits: " + visits;
}
