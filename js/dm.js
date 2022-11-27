const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const savebutton = document.getElementById("DrawSave");
const resetbutton = document.getElementById("Reset");

let isAbleDraw = false;
const controls__button = {
  type: "stroke",
  strokeStyle: "black",
  lineWidth: 5,
};
var rects = [];
let currentRect = null;
canvas.addEventListener("mousedown", () => {
  isAbleDraw = true;
  currentRect = {
    type: controls__button.type,
    strokeStyle: controls__button.strokeStyle,
    lineWidth: controls__button.lineWidth,
    coordinates: [],
  };
});
canvas.addEventListener("mousemove", (e) => {
  if (isAbleDraw) {
    const [x, y] = [e.offsetX, e.offsetY];
    currentRect.coordinates.push([x, y]);
    drawTools.clear();
    drawTools.execute(rects);
    if (currentRect.type === "stroke")
      drawTools.stroke(
        currentRect.coordinates,
        "rgba(255, 255, 0, .3)",
        currentRect.lineWidth
      );
    if (currentRect.type === "eraser")
      drawTools.eraser(currentRect.coordinates, currentRect.lineWidth);
    if (currentRect.type === "square")
      drawTools.square(currentRect.coordinates, "rgba(255, 255, 0, .3)");
    if (currentRect.type === "triangle")
      drawTools.triangle(currentRect.coordinates, "rgba(255, 255, 0, .3)");
    if (currentRect.type === "circle")
      drawTools.circle(currentRect.coordinates, "rgba(255, 255, 0, .3)");
  }
});
canvas.addEventListener("mouseup", () => {
  isAbleDraw = false;
  rects.push(currentRect);
  drawTools.clear();
  currentRect = null;
  drawTools.execute(rects);
  console.log(rects);
});

function handleImageView(files) {
  var file = files[0];

  if (!file.type.match(/image.*/)) {
    alert("not image file!");
  }
  var reader = new FileReader();

  reader.onload = function (e) {
    var img = new Image();
    img.onload = function () {
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      rects.push(img);
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

const drawTools = {
  clear() {
    // 캔버스 내용 제거
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  },
  stroke(coordinates, color, lineWidth) {
    // 마우스가 이동한 경로를 따라 실선 그리기
    if (coordinates.length > 0) {
      const firstCoordinate = coordinates[0];
      ctx.beginPath();
      ctx.moveTo(firstCoordinate[0], firstCoordinate[1]);
      for (let i = 1; i < coordinates.length; i += 1) {
        ctx.lineTo(coordinates[i][0], coordinates[i][1]);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      ctx.closePath();
    }
  },
  eraser(coordinates, lineWidth) {
    // 마우스가 이동한 좌표에 따라 하얀색으로 원을 그려서 지우개 기능처럼 동작
    for (let i = 0; i < coordinates.length; i += 1) {
      ctx.beginPath();
      const coordinate = coordinates[i];
      const [x, y] = coordinate;
      ctx.fillStyle = "white";
      ctx.arc(x, y, lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
  },
  execute(rects) {
    // rects 배열에 저장 된 도형을 기준으로 다시 캔버스에 그림
    for (let i = 0; i < rects.length; i += 1) {
      const rect = rects[i];
      const { type } = rect;
      if (type === "stroke")
        this.stroke(rect.coordinates, rect.strokeStyle, rect.lineWidth);
      if (type === "eraser") this.eraser(rect.coordinates, rect.lineWidth);
      if (type === "square") this.square(rect.coordinates, rect.strokeStyle);
      if (type === "triangle")
        this.triangle(rect.coordinates, rect.strokeStyle);
      if (type === "circle") this.circle(rect.coordinates, rect.strokeStyle);
      if (type === "image") {
        this.image();
      }
    }
  },
  square(coordinates, color) {
    // 사각형을 그림
    const start = coordinates[0];
    const end = coordinates[coordinates.length - 1];
    const [startX, startY] = start;
    const [endX, endY] = [end[0] - startX, end[1] - startY];
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(startX, startY, endX, endY);
    ctx.closePath();
  },
  triangle(coordinates, color) {
    // 삼각형을 그림
    const start = coordinates[0];
    const end = coordinates[coordinates.length - 1];
    const [startX, startY] = start;
    const [endX, endY] = [end[0] - startX, end[1] - startY];
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + endX, startY);
    ctx.lineTo(startX + endX / 2, startY + endY);
    ctx.fill();
    ctx.closePath();
  },
  circle(coordinates, color) {
    // 원을 그림
    const start = coordinates[0];
    const end = coordinates[coordinates.length - 1];
    const [startX, startY] = start;
    const [endX, endY] = [end[0] - startX, end[1] - startY];
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(startX, startY, Math.sqrt(endX ** 2 + endY ** 2), 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  },

  image() {
    // 이미지를 캔버스에 그림
    img.onload = function handleImageView() {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  },
};
function SaveClick() {
  const text = canvas.toDataURL();
  const link = document.createElement("a");
  link.href = text;
  link.download = "MyDraw";
  link.click();
}
if (resetbutton) {
  resetbutton.addEventListener("click", () => {
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    rects = [];
  });
}
if (savebutton) {
  savebutton.addEventListener("click", SaveClick);
}
document.getElementById("type").addEventListener("change", (e) => {
  controls__button.type = e.target.value;
});
document.getElementById("strokeStyle").addEventListener("change", (e) => {
  controls__button.strokeStyle = e.target.value;
});
document.getElementById("lineWidth").addEventListener("change", (e) => {
  controls__button.lineWidth = e.target.value;
});

//메모장

function changeFont(font) {
  document.getElementById("content").style.fontFamily = font.value;
}
function changeSize(n) {
  var s = document.getElementById("content");
  s.style.fontSize = n.value;
}
function Bold() {
  var bol = document.getElementById("content").style.fontWeight;
  if (bol == "normal") {
    document.getElementById("content").style.fontWeight = "bold";
  } else {
    document.getElementById("content").style.fontWeight = "normal";
  }
}
function Italic() {
  var bol = document.getElementById("content").style.fontStyle;
  if (bol == "normal") {
    document.getElementById("content").style.fontStyle = "Italic";
  } else {
    document.getElementById("content").style.fontStyle = "normal";
  }
}
function reset() {
  document.getElementById("content").style.fontStyle = "Normal";
  document.getElementById("content").style.textDecoration = "none";
  document.getElementById("content").style.fontWeight = "normal";
}
function remove() {
  document.getElementById("content").value = "";
}
function downloadFile(filename, content) {
  const element = document.createElement("a");
  const blob = new Blob([content], {
    type: "plain/text",
  });
  const fileUrl = URL.createObjectURL(blob);
  element.setAttribute("href", fileUrl);
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
window.onload = () => {
  document.getElementById("download").addEventListener("click", (e) => {
    const filename = document.getElementById("filename").value;
    const content = document.getElementById("content").value;
    if (filename && content) {
      downloadFile(filename, content);
    }
  });
};
