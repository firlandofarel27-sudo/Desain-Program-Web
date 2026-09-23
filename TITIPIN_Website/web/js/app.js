let currentScreen = "login";

let activeCategory = "Semua";

let reportMode = "Barang Hilang";


const itemEmoji = {

    Elektronik: "💻",

    Fashion: "🎒",

    Aksesoris: "🎧",

    Fasilitas: "🪑"

};


// =========================
// SCREEN
// =========================

function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove("active");

        });


    const target =
        document.getElementById(id);


    if (target) {

        target.classList.add("active");

    }


    currentScreen = id;


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =========================
// TOAST
// =========================

function toast(message) {

    const element =
        document.getElementById("toast");


    element.textContent = message;


    element.classList.add("show");


    clearTimeout(window.toastTimer);


    window.toastTimer =
        setTimeout(() => {

            element.classList.remove(
                "show"
            );

        }, 2400);
}


// =========================
// LOGIN / REGISTER
// =========================

function setAuth(mode) {

    document
        .querySelectorAll(".tab")
        .forEach(tab => {

            tab.classList.toggle(
                "active",
                tab.dataset.auth === mode
            );

        });


    document
        .getElementById("loginForm")
        .classList.toggle(
            "hidden",
            mode !== "login"
        );


    document
        .getElementById("registerForm")
        .classList.toggle(
            "hidden",
            mode !== "register"
        );
}


// =========================
// API
// =========================

async function api(
    url,
    options = {}
) {

    const response =
        await fetch(
            url,
            {

                headers: {

                    "Content-Type":
                        "application/x-www-form-urlencoded",

                    ...(options.headers || {})

                },

                ...options

            }
        );


    return response.json();
}


// =========================
// LOAD ITEMS
// =========================

async function loadItems() {

    const items =
        await api("/api/items");


    renderItems(items);
}


// =========================
// RENDER ITEMS
// =========================

function renderItems(items) {

    const query =
        (
            document
                .getElementById("searchInput")
                .value || ""
        )
        .toLowerCase();


    const grid =
        document.getElementById(
            "itemGrid"
        );


    const filtered =
        items.filter(item =>

            (
                activeCategory === "Semua"
                ||
                item.category === activeCategory
            )

            &&

            item.name
                .toLowerCase()
                .includes(query)

        );


    grid.innerHTML =
        filtered
            .map(
                (item, index) => `

        <article class="item-card">

            <div
                class="
                    product-photo
                    ${
                        index % 3 === 0
                            ? "laptop"
                            : index % 3 === 1
                                ? "camera"
                                : "bag"
                    }
                "
            >

                ${
                    itemEmoji[item.category]
                    || "📦"
                }

            </div>


            <div class="body">

                <h3>
                    ${item.name}
                </h3>


                <p>
                    ${item.description}
                </p>


                <div class="foot">

                    <div>

                        <div class="price">
                            ${item.price}
                        </div>


                        <span
                            class="
                                badge
                                ${
                                    item.status === "Tersedia"
                                        ? "green"
                                        : "orange"
                                }
                            "
                        >
                            ${item.status}
                        </span>

                    </div>


                    <button
                        class="open-btn"
                        onclick="showScreen('detail')"
                    >
                        Detail
                    </button>

                </div>

            </div>

        </article>

    `
            )
            .join("");


    if (!filtered.length) {

        grid.innerHTML = `

            <div
                class="panel"
                style="
                    grid-column:1/-1;
                    text-align:center
                "
            >

                Barang tidak ditemukan.

            </div>

        `;

    }

}


// =========================
// VERIFY
// =========================

async function verifyTicket() {

    const code =
        document
            .getElementById("ticketCode")
            .value
            .trim();


    const result =
        document.getElementById(
            "verifyResult"
        );


    if (!code) {

        toast(
            "Masukkan kode tiket terlebih dahulu"
        );

        return;
    }


    const data =
        await api(
            "/api/verify",
            {

                method: "POST",

                body:
                    new URLSearchParams({
                        code: code
                    })

            }
        );


    result.classList.remove(
        "hidden"
    );


    result.textContent =
        data.message;


    result.style.background =
        data.success
            ? "#dff8eb"
            : "#ffe1e5";


    result.style.color =
        data.success
            ? "#116e4a"
            : "#a32f3d";
}


// =========================
// HANDOVER
// =========================

function completeHandover() {

    const checked =
        document
            .getElementById(
                "handoverCheck"
            )
            .checked;


    if (!checked) {

        toast(
            "Centang persetujuan serah terima"
        );

        return;
    }


    toast(
        "Serah terima berhasil dikonfirmasi"
    );
}


// =========================
// CLICK HANDLER
// =========================

document.addEventListener(
    "click",
    event => {

        const screenButton =
            event.target.closest(
                "[data-screen]"
            );


        if (screenButton) {

            showScreen(
                screenButton.dataset.screen
            );

        }


        const chip =
            event.target.closest(
                ".chip"
            );


        if (chip) {

            activeCategory =
                chip.dataset.cat;


            document
                .querySelectorAll(".chip")
                .forEach(element => {

                    element.classList.toggle(
                        "active",
                        element === chip
                    );

                });


            loadItems();

        }


        const mode =
            event.target.closest(
                ".mode"
            );


        if (mode) {

            reportMode =
                mode.dataset.mode;


            document
                .querySelectorAll(".mode")
                .forEach(element => {

                    element.classList.toggle(
                        "active",
                        element === mode
                    );

                });

        }


        const tab =
            event.target.closest(
                ".tab"
            );


        if (tab) {

            setAuth(
                tab.dataset.auth
            );

        }

    }
);


// =========================
// SEARCH
// =========================

document
    .getElementById("searchInput")
    .addEventListener(
        "input",
        loadItems
    );


// =========================
// LOGIN
// =========================

document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const data =
                await api(
                    "/api/login",
                    {

                        method: "POST",

                        body:
                            new URLSearchParams(
                                new FormData(
                                    event.target
                                )
                            )

                    }
                );


            if (data.success) {

                toast(
                    data.message
                );


                showScreen("home");


                loadItems();

            }

        }
    );


// =========================
// REGISTER
// =========================

document
    .getElementById("registerForm")
    .addEventListener(
        "submit",
        event => {

            event.preventDefault();


            toast(
                "Akun berhasil dibuat. Silakan login."
            );


            setAuth("login");

        }
    );


// =========================
// REPORT
// =========================

document
    .getElementById("reportForm")
    .addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const formData =
                new FormData(
                    event.target
                );


            const body =
                new URLSearchParams();


            body.set(
                "name",
                formData.get("name")
            );


            body.set(
                "type",
                reportMode
            );


            body.set(
                "location",
                formData.get("location")
            );


            body.set(
                "description",
                formData.get("description")
            );


            const data =
                await api(
                    "/api/reports",
                    {

                        method: "POST",

                        body: body

                    }
                );


            toast(
                data.message
            );


            event.target.reset();

        }
    );


// =========================
// PASSWORD VISIBILITY
// =========================

document
    .querySelectorAll(".eye")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const input =
                    button
                        .parentElement
                        .querySelector(
                            "input"
                        );


                input.type =
                    input.type === "password"
                        ? "text"
                        : "password";

            }
        );

    });


// =========================
// MOBILE MENU
// =========================

document
    .getElementById("menuBtn")
    .addEventListener(
        "click",
        () => {

            const choice =
                prompt(
                    "Menu: home / report / profile / admin / analytics",
                    "home"
                );


            if (
                choice
                &&
                document.getElementById(
                    choice
                )
            ) {

                showScreen(choice);

            }

        }
    );


// =========================
// START
// =========================

loadItems();