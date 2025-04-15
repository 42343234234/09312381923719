var upload = document.querySelector(".upload");

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif,.jpg"; // dodałem .jpg na wszelki

document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    input.addEventListener("click", () => {
        element.classList.remove("error_shown");
    });
});

upload.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", async (event) => {
    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected");

    var file = imageInput.files[0];

    if (!file) return;

    var data = new FormData();
    data.append("image", file);

    try {
        const res = await fetch("https://api.imgur.com/3/image", {
            method: "POST",
            headers: {
                Authorization: "Client-ID 74fad879e8270d9" // Twój Client-ID
            },
            body: data
        });

        const response = await res.json();

        if (response.success && response.data && response.data.link) {
            const url = response.data.link;
            upload.classList.remove("error_shown");
            upload.setAttribute("selected", url);
            upload.classList.add("upload_loaded");
            upload.classList.remove("upload_loading");
            upload.querySelector(".upload_uploaded").src = url;
        } else {
            throw new Error("Upload failed");
        }

    } catch (error) {
        console.error("Upload error:", error);
        upload.classList.add("error_shown");
        upload.classList.remove("upload_loading");
    }
});

document.querySelector(".go").addEventListener("click", () => {
    var empty = [];
    var params = new URLSearchParams();

    if (!upload.hasAttribute("selected")) {
        empty.push(upload);
        upload.classList.add("error_shown");
    } else {
        params.append("image", upload.getAttribute("selected"));
    }

    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        params.append(input.id, input.value);

        if (isEmpty(input.value)) {
            empty.push(element);
            element.classList.add("error_shown");
        }
    });

    if (empty.length !== 0) {
        empty[0].scrollIntoView();
    } else {
        forwardToId(params);
    }
});

function isEmpty(value) {
    let pattern = /^\s*$/;
    return pattern.test(value);
}

function forwardToId(params) {
    location.href = "/yObywatel/id?" + params;
}

var guide = document.querySelector(".guide_holder");
guide.addEventListener("click", () => {
    guide.classList.toggle("unfolded");
});
