const image = document.getElementById('image');
const upload = document.getElementById('upload');
const borderRadiusControl = document.getElementById('borderRadius');
const blurControl = document.getElementById('blur');
const brightnessControl = document.getElementById('brightness');
const contrastControl = document.getElementById('contrast');
const downloadButton = document.getElementById('downloadButton');
const downloadCanvas = document.getElementById('downloadCanvas');
const canvasContext = downloadCanvas.getContext('2d');

function updateImageStyles() {
    const borderRadius = borderRadiusControl.value;
    const blur = blurControl.value;
    const brightness = brightnessControl.value;
    const contrast = contrastControl.value;

    image.style.borderRadius = `${borderRadius}%`;
    image.style.filter = `blur(${blur}px) brightness(${brightness}) contrast(${contrast})`;
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            image.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

function downloadModifiedImage() {
    const imgWidth = image.naturalWidth;
    const imgHeight = image.naturalHeight;
    downloadCanvas.width = imgWidth;
    downloadCanvas.height = imgHeight;

    // Apply the styles to the canvas
    canvasContext.clearRect(0, 0, downloadCanvas.width, downloadCanvas.height);
    canvasContext.filter = getComputedStyle(image).filter;

    // Draw the image
    canvasContext.drawImage(image, 0, 0, imgWidth, imgHeight);

    // Apply border radius by using a clipping path
    const borderRadius = (borderRadiusControl.value / 100) * Math.min(imgWidth, imgHeight) / 2;
    canvasContext.globalCompositeOperation = 'destination-in';
    canvasContext.beginPath();
    canvasContext.moveTo(borderRadius, 0);
    canvasContext.lineTo(imgWidth - borderRadius, 0);
    canvasContext.quadraticCurveTo(imgWidth, 0, imgWidth, borderRadius);
    canvasContext.lineTo(imgWidth, imgHeight - borderRadius);
    canvasContext.quadraticCurveTo(imgWidth, imgHeight, imgWidth - borderRadius, imgHeight);
    canvasContext.lineTo(borderRadius, imgHeight);
    canvasContext.quadraticCurveTo(0, imgHeight, 0, imgHeight - borderRadius);
    canvasContext.lineTo(0, borderRadius);
    canvasContext.quadraticCurveTo(0, 0, borderRadius, 0);
    canvasContext.closePath();
    canvasContext.fill();

    downloadCanvas.toBlob(function(blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'modified-image.png';
        link.click();
    }, 'image/png');
}

borderRadiusControl.addEventListener('input', updateImageStyles);
blurControl.addEventListener('input', updateImageStyles);
brightnessControl.addEventListener('input', updateImageStyles);
contrastControl.addEventListener('input', updateImageStyles);
upload.addEventListener('change', handleImageUpload);
downloadButton.addEventListener('click', downloadModifiedImage);
