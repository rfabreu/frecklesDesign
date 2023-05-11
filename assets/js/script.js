// REQUIRED LIBRARIES TO MAKE THE FEATURE WORK AS INTENTED

//https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.1/gsap.min.js
//https://cdnjs.cloudflare.com/ajax/libs/zepto/1.2.0/zepto.min.js


function getImageName(i) {
    const images = [
      'acores.png',
      'andorinha.png',
      'fernando.png',
      'market.png',
      'lisbon.png',
      'nazare.png',
      'immigrants.png',
      'sardinhas.png',
      'sobreiro.png',
      'fado.png'
    ];
    return images[i];
  }  

let xPos = 0;
gsap
    .timeline()
    .set(".ring", { rotationY: 180, cursor: "grab" }) // Set initial rotationY so the parallax jump happens off screen
    .set(".img", {
        //   apply transform rotations to each img
        rotateY: (i) => i * -36,
        transformOrigin: "50% 50% 500px",
        z: -500,
        backgroundImage: (i) =>
            // "url(https://picsum.photos/id/" + (i + 32) + "/600/400/)",
            `url(/assets/images/${getImageName(i)})`,
        backgroundPosition: (i) => getBgPos(i),
        backfaceVisibility: "hidden",
        backgroundSize: "100% 100%",
        objectFit: "cover"
        // backgroundRepeat: "no-repeat"
    })
    .from(".img", {
        duration: 1.5,
        y: 200,
        opacity: 0,
        stagger: 0.1,
        ease: "expo"
    })
    .add(() => {
        $(".img").on("mouseenter", (e) => {
            let current = e.currentTarget;
            gsap.to(".img", {
                opacity: (i, t) => (t == current ? 1 : 0.5),
                ease: "power3"
            });
        });
        $(".img").on("mouseleave", (e) => {
            gsap.to(".img", { opacity: 1, ease: "power2.inOut" });
        });
    }, "-=0.5");
$(window).on("mousedown touchstart", dragStart);
$(window).on("mouseup touchend", dragEnd);
function dragStart(e) {
    if (e.touches) e.clientX = e.touches[0].clientX;
    xPos = Math.round(e.clientX);
    gsap.set(".ring", { cursor: "grabbing" });
    $(window).on("mousemove touchmove", drag);
}
function drag(e) {
    if (e.touches) e.clientX = e.touches[0].clientX;
    gsap.to(".ring", {
        rotationY: "-=" + ((Math.round(e.clientX) - xPos) % 360),
        onUpdate: () => {
            gsap.set(".img", { backgroundPosition: (i) => getBgPos(i) });
        }
    });
    xPos = Math.round(e.clientX);
}
function dragEnd(e) {
    $(window).off("mousemove touchmove", drag);
    gsap.set(".ring", { cursor: "grab" });
}
function getBgPos(i) {
    //   returns the background-position string to create parallax movement in each img
    return (
        100 -
        (gsap.utils.wrap(
            0,
            360,
            gsap.getProperty(".ring", "rotationY") - 180 - i * 36
        ) /
            360) *
        500 +
        "px 0px"
    );
}

// Add interactivity to the Footer icons
const icons = document.querySelectorAll('.icon');

icons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        icon.style.color = '#ff7f50';
        icon.style.transform = 'scale(1.2)';
    });

    icon.addEventListener('mouseleave', () => {
        icon.style.color = '#333';
        icon.style.transform = 'scale(1)';
    });
});
