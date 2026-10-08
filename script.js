
const routes = {
  bus: [
    { name: "Bengaluru → Mysuru", from: "Bengaluru", to: "Mysuru", price: 180 },
    { name: "Bengaluru → Tumakuru", from: "Bengaluru", to: "Tumakuru", price: 100 },
    { name: "Mysuru → Bengaluru", from: "Mysuru", to: "Bengaluru", price: 180 },
    { name: "Bengaluru → Hassan", from: "Bengaluru", to: "Hassan", price: 220 }
  ],

  train: [
    { name: "Bengaluru → Chennai", from: "Bengaluru", to: "Chennai", price: 450 },
    { name: "Bengaluru → Mysuru", from: "Bengaluru", to: "Mysuru", price: 250 },
    { name: "Bengaluru → Hyderabad", from: "Bengaluru", to: "Hyderabad", price: 650 },
    { name: "Chennai → Bengaluru", from: "Chennai", to: "Bengaluru", price: 450 }
  ]
};

let selectedType = "bus";

const bookingForm = document.getElementById("bookingForm");
const routeSelect = document.getElementById("route");
const ticketsInput = document.getElementById("tickets");
const priceElement = document.getElementById("price");
const totalElement = document.getElementById("total");
const toast = document.getElementById("toast");


function getBooking() {
  return JSON.parse(
    localStorage.getItem("busTrainBooking")
  );
}


function saveBooking(booking) {
  localStorage.setItem(
    "busTrainBooking",
    JSON.stringify(booking)
  );
}


function clearBooking() {
  localStorage.removeItem("busTrainBooking");
}


function showToast(message) {
  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}


function showPage(pageId) {

  document.querySelectorAll(".page").forEach(page => {

    page.classList.toggle(
      "active",
      page.id === pageId
    );

  });


  document.querySelectorAll("[data-page]").forEach(button => {

    if (button.classList.contains("nav-btn")) {

      button.classList.toggle(
        "active",
        button.dataset.page === pageId
      );

    }

  });


  if (pageId === "view") {
    renderViewBooking();
  }


  if (pageId === "cancel") {
    renderCancelBooking();
  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


document.querySelectorAll("[data-page]").forEach(button => {

  button.addEventListener("click", () => {
    showPage(button.dataset.page);
  });

});


function loadRoutes() {

  routeSelect.innerHTML = "";

  routes[selectedType].forEach((route, index) => {

    const option =
      document.createElement("option");

    option.value = index;

    option.textContent =
      `${route.name} — ₹${route.price}`;

    routeSelect.appendChild(option);

  });

  updateFare();
}


document
  .querySelectorAll(".transport-card")
  .forEach(card => {

    card.addEventListener("click", () => {

      document
        .querySelectorAll(".transport-card")
        .forEach(c =>
          c.classList.remove("selected")
        );

      card.classList.add("selected");

      selectedType =
        card.dataset.type;

      loadRoutes();

    });

  });


function updateFare() {

  const route =
    routes[selectedType][
      Number(routeSelect.value) || 0
    ];

  const tickets =
    Number(ticketsInput.value) || 1;

  priceElement.textContent =
    `₹${route.price}`;

  totalElement.textContent =
    `₹${route.price * tickets}`;

}


routeSelect.addEventListener(
  "change",
  updateFare
);


ticketsInput.addEventListener(
  "input",
  updateFare
);


/* ========================================
   🎙️ ANIME GAMING JOURNEY VOICE
   ======================================== */


function speakJourneyQuote() {

  /*
    Lower the background music
    while the girl is speaking.
  */

  if (window.bgMusic) {

    window.bgMusic.volume = 0.12;

  }


  const voices =
    speechSynthesis.getVoices();


  const femaleVoice =
    voices.find(
      voice =>
        voice.name ===
        "Google UK English Female"
    );


  const speech =
    new SpeechSynthesisUtterance(
      "BOOYAH! Ticket secured! Your adventure begins NOW! Let's GO!"
    );


  speech.voice =
    femaleVoice;


  speech.lang =
    "en-GB";


  /* 🎙️ VOICE SETTINGS */

  speech.rate =
    1.05;

  speech.pitch =
    1.25;

  speech.volume =
    1;


  speechSynthesis.cancel();


  /*
    When the girl finishes speaking,
    bring the music back.
  */

  speech.onend =
    function () {

      if (window.bgMusic) {

        window.bgMusic.volume =
          0.5;

      }

    };


  speechSynthesis.speak(
    speech
  );

}


/* ========================================
   🎫 BOOKING
   ======================================== */


bookingForm.addEventListener(
  "submit",
  (event) => {

    event.preventDefault();


    if (getBooking()) {

      showToast(
        "You already have an active booking."
      );

      return;

    }


    const name =
      document
        .getElementById("passengerName")
        .value
        .trim();


    const date =
      document
        .getElementById("travelDate")
        .value;


    const route =
      routes[selectedType][
        Number(routeSelect.value)
      ];


    const tickets =
      Number(ticketsInput.value);


    if (
      !name ||
      !date ||
      !route ||
      tickets < 1
    ) {

      showToast(
        "Please fill all details."
      );

      return;

    }


    const booking = {

      id:
        `${selectedType
          .toUpperCase()
          .slice(0, 3)}${Date.now()
          .toString()
          .slice(-6)}`,

      type:
        selectedType.toUpperCase(),

      name,

      from:
        route.from,

      to:
        route.to,

      route:
        route.name,

      date,

      tickets,

      price:
        route.price,

      total:
        route.price * tickets,

      status:
        "BOOKED"

    };


    saveBooking(
      booking
    );


    bookingForm.reset();


    ticketsInput.value =
      1;


    loadRoutes();


    showToast(
      "Booking confirmed successfully!"
    );


    speakJourneyQuote();


    showPage(
      "view"
    );

  }
);


function formatDate(
  dateString
) {

  const [
    year,
    month,
    day
  ] =
    dateString.split("-");


  return `${day}/${month}/${year}`;

}


function bookingHTML(
  booking,
  includeCancel = false
) {

  return `

    <div class="ticket">

      <h3>
        🎫 Booking Confirmed
      </h3>


      <div class="ticket-row">

        <span>
          Booking ID
        </span>

        <span>
          ${booking.id}
        </span>

      </div>


      <div class="ticket-row">

        <span>
          Transport
        </span>

        <span>
          ${
            booking.type === "BUS"
              ? "🚌 Bus"
              : "🚆 Train"
          }
        </span>

      </div>


      <div class="ticket-row">

        <span>
          Passenger
        </span>

        <span>
          ${escapeHTML(
            booking.name
          )}
        </span>

      </div>


      <div class="ticket-row">

        <span>
          From
        </span>

        <span>
          ${escapeHTML(
            booking.from
          )}
        </span>

      </div>


      <div class="ticket-row">

        <span>
          To
        </span>

        <span>
          ${escapeHTML(
            booking.to
          )}
        </span>

      </div>


      <div class="ticket-row">

        <span>
          Travel Date
        </span>

        <span>
          ${formatDate(
            booking.date
          )}
        </span>

      </div>


      <div class="ticket-row">

        <span>
          Tickets
        </span>

        <span>
          ${booking.tickets}
        </span>

      </div>


      <div class="ticket-row">

        <span>
          Price / Ticket
        </span>

        <span>
          ₹${booking.price}
        </span>

      </div>


      <div class="ticket-row">

        <span>
          Total Amount
        </span>

        <span>
          ₹${booking.total}
        </span>

      </div>


      <div class="ticket-row">

        <span>
          Status
        </span>

        <span>

          <span class="status">
            ${booking.status}
          </span>

        </span>

      </div>


      ${
        includeCancel
          ? `

            <button
              id="cancelButton"
              class="cancel-btn"
            >
              CANCEL THIS BOOKING
            </button>

          `
          : ""
      }


    </div>

  `;

}


function escapeHTML(value) {

  return value.replace(
    /[&<>"']/g,

    char =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[char])

  );

}


function renderViewBooking() {

  const container =
    document.getElementById(
      "viewBooking"
    );


  const booking =
    getBooking();


  if (!booking) {

    container.innerHTML = `

      <div class="empty-card">

        <h3>
          No Active Booking
        </h3>

        <p>
          You haven't booked a bus
          or train ticket yet.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML =
    bookingHTML(
      booking
    );

}


function renderCancelBooking() {

  const container =
    document.getElementById(
      "cancelBooking"
    );


  const booking =
    getBooking();


  if (!booking) {

    container.innerHTML = `

      <div class="empty-card">

        <h3>
          No Active Booking
        </h3>

        <p>
          There is no booking
          available to cancel.
        </p>

      </div>

    `;

    return;

  }


  container.innerHTML =
    bookingHTML(
      booking,
      true
    );


  document
    .getElementById(
      "cancelButton"
    )
    .addEventListener(
      "click",
      () => {

        const confirmCancel =
          confirm(
            "Are you sure you want to cancel this booking?"
          );


        if (confirmCancel) {

          clearBooking();


          showToast(
            "Booking cancelled successfully!"
          );


          renderCancelBooking();

        }

      }
    );

}


const today =
  new Date()
    .toISOString()
    .split("T")[0];


document
  .getElementById(
    "travelDate"
  )
  .min = today;


loadRoutes();


/* ========================================
   🎙️ LOAD AVAILABLE BROWSER VOICES
   ======================================== */


speechSynthesis.addEventListener(
  "voiceschanged",
  () => {

    const voices =
      speechSynthesis.getVoices();


    console.log(
      "AVAILABLE VOICES:"
    );


    voices.forEach(
      (voice, index) => {

        console.log(
          index +
          ": " +
          voice.name +
          " | " +
          voice.lang
        );

      }
    );

  }
);

