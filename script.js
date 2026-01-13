const hamburger = document.querySelector(".hamburger"),
  floatingNavbar = document.querySelector(".floating-navbar"),
  logo = document.querySelector(".logo"),
  themeToggle = document.getElementById("theme-toggle"),
  html = document.documentElement,
  icon = themeToggle.querySelector("i"),
  carousel = document.querySelector(".carousel"),
  carouselItems = document.querySelectorAll(".carousel-item"),
  prevBtn = document.querySelector(".carousel-button.prev"),
  nextBtn = document.querySelector(".carousel-button.next"),
  viewMoreBtn = document.getElementById("view-more-btn"),
  productGrid = document.querySelector(".product-grid"),
  services = document.getElementById("services"),
  nav = document.querySelector("nav"),
  phoneLink = document.getElementById("phone-link"),
  emailLink = document.getElementById("email-link")

let currentIndex = 0, autoScroll, touchStartX = 0, touchEndX = 0
const totalItems = carouselItems.length
const closeNav = () => { hamburger.classList.remove("active"); floatingNavbar.classList.remove("active") }
const getItemsPerSlide = () => window.innerWidth >= 768 ? 3 : 1

hamburger.addEventListener("click", () => { hamburger.classList.toggle("active"); floatingNavbar.classList.toggle("active") })
document.querySelectorAll(".nav-link").forEach(i => i.addEventListener("click", closeNav))
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", function(e) {
  e.preventDefault()
  const target = document.querySelector(this.getAttribute("href"))
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" })
}))
logo?.addEventListener("click", e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }) })

const savedTheme = localStorage.getItem("theme") || "dark"
html.setAttribute("data-theme", savedTheme)
icon.className = savedTheme === "dark" ? "uil uil-sun" : "fas fa-moon"

themeToggle.addEventListener("click", () => {
  const newTheme = html.getAttribute("data-theme") === "dark" ? "light" : "dark"
  html.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
  icon.className = newTheme === "dark" ? "uil uil-sun" : "fas fa-moon"
  themeToggle.style.transform = "rotate(720deg)"
  setTimeout(() => themeToggle.style.transform = "", 300)
  closeNav()
})

const reveal = () => document.querySelectorAll(".reveal").forEach(el => {
  if (el.getBoundingClientRect().top < window.innerHeight - 150) el.classList.add("active")
})
window.addEventListener("scroll", reveal); reveal()

const startCounters = () => document.querySelectorAll(".counter").forEach(counter => {
  const target = +counter.getAttribute("data-target"), speed = 200
  const update = () => {
    const count = +counter.innerText
    count < target ? (counter.innerText = Math.ceil(count + target / speed), setTimeout(update, 1)) : counter.innerText = target
  }
  new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { update(); o.unobserve(counter) } }).observe(counter)
})

new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { startCounters(); o.unobserve(document.querySelector(".about")) } }).observe(document.querySelector(".about"))

function updateCarousel() {
  const perSlide = getItemsPerSlide(), width = 100 / perSlide
  carousel.innerHTML = ""
  for (let i = 0; i < perSlide * 2 + totalItems; i++) carousel.appendChild(carouselItems[i % totalItems].cloneNode(true))
  carousel.style.transform = `translateX(-${(currentIndex + perSlide) * width}%)`
}

function showNext() {
  currentIndex++
  carousel.style.transition = "transform 0.5s ease"
  updateCarousel()
  if (currentIndex >= totalItems) {
    currentIndex = 0
    setTimeout(() => { carousel.style.transition = "none"; updateCarousel(); setTimeout(() => carousel.style.transition = "transform 0.5s ease", 50) }, 500)
  }
}

function showPrev() {
  currentIndex--
  carousel.style.transition = "transform 0.5s ease"
  if (currentIndex < 0) {
    updateCarousel()
    currentIndex = totalItems - 1
    setTimeout(() => { carousel.style.transition = "none"; updateCarousel(); setTimeout(() => carousel.style.transition = "transform 0.5s ease", 50) }, 500)
  } else updateCarousel()
}

const startAuto = () => autoScroll = setInterval(showNext, 2000)
const stopAuto = () => clearInterval(autoScroll)

nextBtn.addEventListener("click", () => { stopAuto(); showNext(); startAuto() })
prevBtn.addEventListener("click", () => { stopAuto(); showPrev(); startAuto() })
startAuto()

window.innerWidth >= 768 ? (carousel.addEventListener("mouseenter", stopAuto), carousel.addEventListener("mouseleave", startAuto)) : carousel.addEventListener("touchstart", stopAuto)
carousel.addEventListener("touchstart", e => { touchStartX = e.changedTouches[0].screenX; stopAuto() })
carousel.addEventListener("touchend", e => { touchEndX = e.changedTouches[0].screenX; touchEndX < touchStartX ? showNext() : touchEndX > touchStartX && showPrev(); startAuto() })
window.addEventListener("resize", () => { stopAuto(); updateCarousel(); startAuto() })
updateCarousel()

const animationManager = {
  init() { this.buildElements(); setInterval(() => document.getElementById("material-group")?.classList.toggle("hidden"), 45000) },
  rand: (min, max) => Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min),
  buildElements() {
    document.querySelectorAll(".spark").forEach((spark, i) => {
      const delay = this.rand(1, 15), weld = document.createElement("div")
      weld.className = "weld"; weld.style.animationDelay = delay + "s"
      document.querySelectorAll(".weld-container")[i].appendChild(weld)
      for (let j = 0; j <= 25; j++) spark.appendChild(this.genSpark(delay))
    })
  },
  genSpark(delay) {
    const s = document.createElement("div")
    s.className = "particle " + (this.rand(1, 3) === 2 ? "negative-X" : "positive-X")
    s.style.cssText = `top:${this.rand(25, 35)}px;left:${this.rand(0, 5)}px;width:${this.rand(1, 2)}px;height:${this.rand(4, 7)}px;animation-delay:${this.rand(0, 9) / 10 + delay}s`
    return s
  }
}
document.addEventListener("DOMContentLoaded", () => animationManager.init())

const updateLinks = () => {
  const mobile = window.innerWidth < 768
  phoneLink && (phoneLink.href = mobile ? "tel:+918101370066" : "https://wa.me/918101370066?text=Hey%20there!%0AI'm%20reaching%20out%20via%20the%20Surya%20Steel%20website%20and%20would%20like%20to%20enquire%20about%20your%20products%20and%20services.", phoneLink.target = mobile ? "_self" : "_blank")
  emailLink && (emailLink.href = mobile ? "mailto:suryasteelasn@gmail.com?subject=Client%20Enquiry%20Mail%20-%20Surya%20Steel" : "https://mail.google.com/mail/?view=cm&fs=1&to=suryasteelasn@gmail.com&su=Client%20Enquiry%20Mail%20-%20Surya%20Steel", emailLink.target = mobile ? "_self" : "_blank")
}
updateLinks(); window.addEventListener("resize", updateLinks)

viewMoreBtn?.addEventListener("click", () => {
  const expanded = productGrid.classList.toggle("expanded")
  viewMoreBtn.classList.toggle("expanded", expanded)
  const label = viewMoreBtn.querySelector(".view-more-label")
  if (label) label.textContent = expanded ? "View Less" : "View More"
  setTimeout(() => expanded ? window.scrollTo({ top: services.getBoundingClientRect().top + window.scrollY + services.querySelector("h2").offsetHeight + 10, behavior: "smooth" }) : services.scrollIntoView({ behavior: "smooth", block: "start" }), 100)
})