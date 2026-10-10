(() => {
    // Cegah pemasangan pemutar dua kali pada halaman yang sama.
    if (window.musicControllerReady) return;
    window.musicControllerReady = true;

    const isSyairPage = window.location.pathname
        .toLowerCase()
        .endsWith("syair-lagu.html");

    const player = document.createElement("iframe");

const currentPath = window.location.pathname;

const musicPath = currentPath.includes("/berita/")
    ? "../music.html"
    : "music.html";

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

    const button = document.createElement("button");

    button.type = "button";
    button.textContent = "▶ Aktifkan Musik";

    button.style.cssText = `
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 9999;
        padding: 12px 18px;
        border: 1px solid #00a6a6;
        border-radius: 24px;
        background: #e0ffff;
        color: #007777;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 12px #0002;
    `;

    document.body.appendChild(button);

    let playing = false;

    button.addEventListener("click", () => {
        player.contentWindow.postMessage(
            { type: "MUSIC_PLAY" },
            window.location.origin
        );
    });

    window.addEventListener("message", event => {
        if (event.origin !== window.location.origin) return;

        const data = event.data;

        if (!data || data.type !== "MUSIC_STATE") return;

        playing = data.playing;

        button.textContent = playing
            ? "⏸ Jeda Musik"
            : "▶ Putar Musik";
    });

    player.addEventListener("load", () => {
        player.contentWindow.postMessage(
            {
                type: "MUSIC_TRACK",
                track: isSyairPage ? "syair" : "normal"
            },
            window.location.origin
        );
    });
        // Simpan posisi musik sebelum pindah halaman.
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