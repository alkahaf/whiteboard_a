const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');
let drawing = false;
canvas.width = 1920;
canvas.height = 1080;
let lastX = 0;
let lastY = 0;
let color = '#000000';
let undoStack = [];
let redoStack = [];

function startDrawing(e) {
    drawing = true;
    lastX = e.clientX - canvas.offsetLeft;
    lastY = e.clientY - canvas.offsetTop;
}

function draw(e) {
    if (!drawing) return;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
    lastX = e.clientX - canvas.offsetLeft;
    lastY = e.clientY - canvas.offsetTop;
}

    function stopDrawing() {
        if (!drawing) return;
        drawing = false;
        undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    }
    function undo() {
        if (undoStack.length === 0) return;
        redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.putImageData(undoStack.pop(), 0, 0);
    }
    function redo() {
        if (redoStack.length === 0) return;
        undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.putImageData(redoStack.pop(), 0, 0);
    }

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function saveDrawing() {
    const dataUrl = canvas.toDataURL();
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'whiteboard.png';
    link.click();
}

function setColor(e) {
    color = e.target.value;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);

const clearButton = document.getElementById('clear-button');
clearButton.addEventListener('click', clearCanvas);

const saveButton = document.getElementById('save-button');
saveButton.addEventListener('click', saveDrawing);

const colorPicker = document.getElementById('color-picker');
colorPicker.addEventListener('change', setColor);

document.getElementById('undo').addEventListener('click', undo);
document.getElementById('redo').addEventListener('click', redo);