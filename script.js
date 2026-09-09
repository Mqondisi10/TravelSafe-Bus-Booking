/* =========================================
   EMAILJS INITIALIZATION
========================================= */

emailjs.init("QxIbqPP8qkCYuUpYz");


/* =========================================
   ROUTE PRICES
========================================= */

const routePrices = {

    "Johannesburg-Durban": 450,

    "Durban-Johannesburg": 450,

    "Johannesburg-Cape Town": 900,

    "Cape Town-Johannesburg": 900,

    "Johannesburg-Pretoria": 120,

    "Pretoria-Johannesburg": 120,

    "Johannesburg-Bloemfontein": 500,

    "Bloemfontein-Johannesburg": 500,

    "Johannesburg-Gqeberha": 750,

    "Gqeberha-Johannesburg": 750,

    "Durban-Cape Town": 700,

    "Cape Town-Durban": 700,

    "Pretoria-Durban": 500,

    "Durban-Pretoria": 500

};


/* =========================================
   VARIABLES
========================================= */

let selectedSeat = null;

let selectedPrice = 0;


/* =========================================
   GENERATE SEATS
========================================= */

const seatContainer =
    document.getElementById("seatContainer");


const bookedSeats = [
    6,
    15,
    20,
    27,
    42,
    59
];


for (let i = 1; i <= 60; i++) {

    const seat = document.createElement("button");

    seat.type = "button";

    seat.classList.add("seat");

    seat.textContent = i;

    seat.dataset.seat = i;


    if (bookedSeats.includes(i)) {

        seat.classList.add("booked-seat");

        seat.disabled = true;

    }


    seat.addEventListener("click", function () {

        document
            .querySelectorAll(".seat")
            .forEach(s =>
                s.classList.remove("selected-seat")
            );


        seat.classList.add("selected-seat");

        selectedSeat = i;

    });


    seatContainer.appendChild(seat);
}


/* =========================================
   CALCULATE PRICE
========================================= */

function calculatePrice() {

    const from =
        document.getElementById("from").value;

    const to =
        document.getElementById("to").value;


    if (!from || !to) {

        selectedPrice = 0;

        document.getElementById("priceDisplay")
            .textContent = "R0";

        document.getElementById("routeDisplay")
            .textContent =
            "Please select your route";

        return 0;
    }


    if (from === to) {

        selectedPrice = 0;

        document.getElementById("priceDisplay")
            .textContent = "Invalid Route";

        document.getElementById("routeDisplay")
            .textContent =
            "Departure and destination cannot be the same";

        return 0;
    }


    const route = `${from}-${to}`;


    selectedPrice =
        routePrices[route] || 600;


    document.getElementById("routeDisplay")
        .textContent =
        `${from} → ${to}`;


    document.getElementById("priceDisplay")
        .textContent =
        `R${selectedPrice}`;


    return selectedPrice;
}


/* =========================================
   UPDATE DEPARTURE TIME
========================================= */

function updateDepartureTime() {

    const selected =
        document.querySelector(
            'input[name="travelTime"]:checked'
        );


    if (!selected) {

        document.getElementById(
            "departureDisplay"
        ).textContent = "-";

        return;
    }


    const time =
        selected.dataset.time;


    document.getElementById(
        "departureDisplay"
    ).textContent = time;
}


/* =========================================
   ROUTE EVENTS
========================================= */

document.getElementById("from")
    .addEventListener(
        "change",
        calculatePrice
    );


document.getElementById("to")
    .addEventListener(
        "change",
        calculatePrice
    );


/* =========================================
   TIME EVENTS
========================================= */

document
    .querySelectorAll(
        'input[name="travelTime"]'
    )
    .forEach(option => {

        option.addEventListener(
            "change",
            updateDepartureTime
        );

    });


/* =========================================
   SET MINIMUM TRAVEL DATE
========================================= */

const today =
    new Date().toISOString().split("T")[0];


document.getElementById("travelDate")
    .setAttribute(
        "min",
        today
    );


/* =========================================
   GENERATE BOOKING REFERENCE
========================================= */

function generateBookingReference() {

    const randomNumber =
        Math.floor(
            100000 + Math.random() * 900000
        );


    return `TS-${randomNumber}`;

}


/* =========================================
   BOOKING FORM
========================================= */

document
    .getElementById("bookingForm")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* =========================
               GET CUSTOMER INFORMATION
            ========================= */

            const fullname =
                document.getElementById(
                    "fullname"
                ).value.trim();


            const email =
                document.getElementById(
                    "email"
                ).value.trim();


            const phone =
                document.getElementById(
                    "phone"
                ).value.trim();


            const age =
                document.getElementById(
                    "age"
                ).value;


            const from =
                document.getElementById(
                    "from"
                ).value;


            const to =
                document.getElementById(
                    "to"
                ).value;


            const travelDate =
                document.getElementById(
                    "travelDate"
                ).value;


            const selectedTime =
                document.querySelector(
                    'input[name="travelTime"]:checked'
                );


            /* =========================
               VALIDATION
            ========================= */

            if (from === to) {

                showMessage(
                    "Departure and destination cannot be the same.",
                    "error"
                );

                return;
            }


            if (!selectedTime) {

                showMessage(
                    "Please select Morning or Night.",
                    "error"
                );

                return;
            }


            if (!selectedSeat) {

                showMessage(
                    "Please select a seat.",
                    "error"
                );

                return;
            }


            /* =========================
               GET TIME
            ========================= */

            const travelPeriod =
                selectedTime.value;


            const departureTime =
                selectedTime.dataset.time;


            /* =========================
               PRICE
            ========================= */

            const price =
                calculatePrice();


            if (price === 0) {

                showMessage(
                    "Please select a valid route.",
                    "error"
                );

                return;
            }


            /* =========================
               BOOKING REFERENCE
            ========================= */

            const bookingRef =
                generateBookingReference();


            /* =========================
               EMAILJS PARAMETERS
            ========================= */

            const templateParams = {

                fullname: fullname,

                email: email,

                phone: phone,

                age: age,

                from: from,

                to: to,

                travelDate: travelDate,

                travelPeriod: travelPeriod,

                departureTime: departureTime,

                seat: selectedSeat,

                price: price,

                bookingRef: bookingRef

            };


            /* =========================
               SHOW SENDING MESSAGE
            ========================= */

            showMessage(
                "Processing your booking...",
                "loading"
            );


            /* =========================
               SEND EMAIL
               YOUR EXISTING EMAILJS
               FUNCTION IS KEPT
            ========================= */

            emailjs.send(

                "service_kkm9fon",

                "template_fwgg9rw",

                templateParams

            )

            .then(function () {

                /* =====================
                   SUCCESS
                ===================== */

                showMessage(
                    `Booking successful! Your ticket has been sent to ${email}. Booking Reference: ${bookingRef}`,
                    "success"
                );


                /* =====================
                   RESET FORM
                ===================== */

                document
                    .getElementById(
                        "bookingForm"
                    )
                    .reset();


                /* =====================
                   RESET SEAT
                ===================== */

                document
                    .querySelectorAll(".seat")
                    .forEach(seat =>
                        seat.classList
                            .remove(
                                "selected-seat"
                            )
                    );


                selectedSeat = null;

                selectedPrice = 0;


                document
                    .getElementById(
                        "priceDisplay"
                    )
                    .textContent = "R0";


                document
                    .getElementById(
                        "routeDisplay"
                    )
                    .textContent =
                    "Please select your route";


                document
                    .getElementById(
                        "departureDisplay"
                    )
                    .textContent = "-";

            })

            .catch(function (error) {

                console.log(
                    "EMAILJS ERROR:",
                    error
                );


                showMessage(
                    "Booking was not completed because the confirmation email could not be sent. Please try again.",
                    "error"
                );

            });

        }
    );


/* =========================================
   MESSAGE FUNCTION
========================================= */

function showMessage(message, type) {

    const messageElement =
        document.getElementById(
            "message"
        );


    messageElement.textContent =
        message;


    if (type === "success") {

        messageElement.style.color =
            "#168b25";

    }

    else if (type === "error") {

        messageElement.style.color =
            "#d62828";

    }

    else {

        messageElement.style.color =
            "#1769d1";

    }

}