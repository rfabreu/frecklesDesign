// REQUIRED LIBRARIES TO MAKE THE FEATURE WORK AS INTENTED

//https://cdnjs.cloudflare.com/ajax/libs/gsap/3.6.1/gsap.min.js
//https://cdnjs.cloudflare.com/ajax/libs/zepto/1.2.0/zepto.min.js



function getImageName(i) {
    console.log('getImageName called with index:', i);
    const images = [
        'id_0.png',
        'id_1.png',
        'id_2.png',
        'id_3.png',
        'id_4.png',
        'id_5.png',
        'id_6.png',
        'id_7.png',
        'id_8.png',
        'id_9.png',
        'id_10.png',
        'id_11.png'
    ];
    const imageName = images[i];
    console.log('Returning image name:', imageName);
    // return images[i];
    return imageName;
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
        // backgroundSize: "100% 100%",
        backgroundSize: "600px 400px",
        objectFit: "cover",
        // backgroundRepeat: "no-repeat"
        onComplete: function () {
            // set the title attribute of the img element
            this.target.setAttribute("title", getImageName(this.index));
        }
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

// const images = document.querySelectorAll('.img');

// images.forEach(img => {
//     let isExpanded = false;
//     img.addEventListener('click', () => {
//         if (!isExpanded) {
//             gsap.to(img, {scale: 2});
//             isExpanded = true;
//         } else {
//             gsap.to(img, {scale: 1});
//             isExpanded = false;
//         }
//     });
// });

// $(".img").on("click", function() {
//     const $this = $(this);
//     if ($this.hasClass("full-size")) {
//       // Image is already full size, so animate it back to original size
//       gsap.to($this, { scale: 1, opacity: 1 });
//       $this.removeClass("full-size");
//     } else {
//       // Image is not full size, so animate it to full size
//       gsap.to($this, { scale: 1.5, opacity: 1 });
//       $this.addClass("full-size");
//     }
//   });


$(".img").on("click", function () {
    var $this = $(this);
    var $ring = $(".ring");
    var isActive = $this.hasClass("active");

    // If the image is already active, remove the active class and animate back to original size
    if (isActive) {
        $this.removeClass("active");
        $ring.removeClass("ring-active");
        gsap.to($this, { scale: 1, ease: "power2.inOut" });
    } else {
        // Otherwise, add the active class, animate to full size and show image title
        $this.addClass("active");
        $ring.addClass("ring-active");
        gsap.to($this, { scale: 1.5, ease: "power2.inOut", width: "auto", height: "auto" });
        $this.append("<div class='img-title'>" + $this.attr("title") + "</div>");
    }
});
$(document).on("click", function (event) {
    if (!$(event.target).closest(".img").length) {
        $(".img").removeClass("active");
        $(".ring").removeClass("ring-active");
        gsap.to(".img", { scale: 1, ease: "power2.inOut" });
        $(".img-title").remove();
    }
});
