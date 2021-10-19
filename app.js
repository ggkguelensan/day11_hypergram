let file_input          = document.getElementById("file-input");
let brightness_slider   = document.getElementById("brightness");
let contrast_slider     = document.getElementById("contrast");
let transparent_slider  = document.getElementById("transparent");

function truncate(num){
    if(num < 0) num = 0;
    if(num > 255) num = 255;
    return num;
}

file_input.addEventListener("change", (event_change) => {

    if(event_change.target.files){
        let file = file_input.files[0];
        console.log("created file", file);
        let file_reader = new FileReader();

        file_reader.addEventListener("loadend", (event_loadend) => {
            console.log("file reader loadend");
            let image = new Image();

            image.addEventListener("load", () => {
                console.log("image loaded");
                let canvas = document.getElementById("canvas");
                canvas.width  = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(image, 0, 0);
                const image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const initial_pixels = [...image_data.data];

                const slider_handler = () => {
                    let Contrast = parseFloat(contrast_slider.value);
                    let Brightness = parseFloat(brightness_slider.value);
                    let Factor = 259 * (255 + Contrast) / (255 * (259 - Contrast));
                    console.log(Brightness, Contrast, Factor);
                    for(let i = 0; i < initial_pixels.length; i += 4) {
                        image_data.data[i    ] = truncate(Factor * (initial_pixels[i    ] - 128) + 128 + Brightness);
                        image_data.data[i + 1] = truncate(Factor * (initial_pixels[i + 1] - 128) + 128 + Brightness);
                        image_data.data[i + 2] = truncate(Factor * (initial_pixels[i + 2] - 128) + 128 + Brightness);
                    }
                    ctx.putImageData(image_data, 0, 0);
                }

                brightness_slider.addEventListener("change", slider_handler);
                contrast_slider.addEventListener("change", slider_handler);

                transparent_slider.addEventListener("change", () => {
                    let Transparent = transparent_slider.value;
                    console.log(Transparent);
                    for(let i = 0; i < initial_pixels.length; i += 4) {
                        image_data.data[i + 3] = initial_pixels[i + 3] * Transparent;
                    }
                    ctx.putImageData(image_data, 0, 0);
                });
            })

            image.src = event_loadend.target.result;
            console.log("image src added");

        })

        file_reader.readAsDataURL(file);
    }
})