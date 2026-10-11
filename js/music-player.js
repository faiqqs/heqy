(() => {
    // Mencegah pemutar dipasang dua kali.
    if (window.musicControllerReady) return;
    window.musicControllerReady = true;

    // Mendeteksi halaman Syair Lagu.
    const isSyairPage = window.location.pathname
        .toLowerCase()
        .endsWith("syair-lagu.html");

    // Menentukan lokasi file pemutar musik.
    const currentPath = window.location.pathname;

    const musicPath = currentPath.includes("/berita/")
        ? "../music.html"
        : "music.html";

    // Membuat iframe untuk pemutar musik.
    const player = document.createElement("iframe");

    player.src = new URL(
        musicPath,
        window.location.href
    ).href;

    player.title = "Pemutar Musik";
    player.setAttribute("allow", "autoplay");

    player.style.cssText = `
        position: fixed;
        width: 1px;
        height: 1px;
        opacity: 0;
        pointer-events: none;
        border: 0;
        left: 0;
        bottom: 0;
    `;

    document.body.appendChild(player);

    // Membuat tombol musik.
    const button = document.createElement("button");

    button.type = "button";
    button.className = "tombol-musik";
    button.textContent = "▶ Aktifkan Musik";

    button.style.cssText = `
        display: inline-block;
        margin: 3px 5px;
        padding: 10px 20px;
        border: 1px solid #00a6a6;
        border-radius: 25px;
        background: rgba(255, 255, 255, 0.95);
        color: #006f73;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        vertical-align: middle;
        font-family: inherit;
        font-size: inherit;
    `;

    // Animasi tombol musik.
    const animationStyle = document.createElement("style");

    animationStyle.textContent = `
        @keyframes musikMelompat {
            0%, 100% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-6px);
            }
        }

        .tombol-musik {
            animation: musikMelompat 2s ease-in-out infinite;
            transition:
                background 0.25s ease,
                color 0.25s ease,
                box-shadow 0.25s ease;
        }

        .tombol-musik:hover {
            animation-play-state: paused;
            background: linear-gradient(
                135deg,
                #009c9c,
                #007477
            );
            color: white;
            box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
        }

        @media (prefers-reduced-motion: reduce) {
            .tombol-musik {
                animation: none;
            }
        }
    `;

    document.head.appendChild(animationStyle);

    // Memasukkan tombol ke barisan navigasi.
    const navCell = document.querySelector(
        "table tr:nth-child(2) td"
    );

    if (navCell) {
        // Jika navigasi ditemukan, tombol berada di baris navigasi.
        navCell.appendChild(button);
    } else {
        // Jika tidak ada navigasi yang ditemukan,
        // tombol tetap bisa diakses di pojok bawah.
        button.style.position = "fixed";
        button.style.right = "16px";
        button.style.bottom = "16px";
        button.style.zIndex = "9999";

        document.body.appendChild(button);
    }

    let playing = false;

    // Mengirim perintah kepada pemutar musik.
    button.addEventListener("click", () => {
        player.contentWindow.postMessage(
            { type: "MUSIC_PLAY" },
            window.location.origin
        );
    });

    // Memperbarui tulisan tombol berdasarkan status musik.
    window.addEventListener("message", event => {
        if (event.origin !== window.location.origin) return;

        const data = event.data;

        if (!data || data.type !== "MUSIC_STATE") return;

        playing = data.playing;

        button.textContent = playing
            ? "⏸ Jeda Musik"
            : "▶ Putar Musik";
    });

    // Menentukan jenis musik sesuai halaman.
    player.addEventListener("load", () => {
        player.contentWindow.postMessage(
            {
                type: "MUSIC_TRACK",
                track: isSyairPage ? "syair" : "normal"
            },
            window.location.origin
        );
    });

    // Meminta pemutar menyimpan posisi sebelum berpindah halaman.
    window.addEventListener("pagehide", () => {
        try {
            player.contentWindow.postMessage(
                { type: "MUSIC_SAVE_STATE" },
                window.location.origin
            );
        } catch (error) {
            console.log("Posisi musik disimpan.");
        }
    });
})();
