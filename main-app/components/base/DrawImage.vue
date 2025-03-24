<template>
  <v-dialog
    v-model="isDialogVisible"
    transition="dialog-top-transition"
    max-width="1000"
  >
    <v-card class="pa-1">
      <v-toolbar>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" @click="emit('onCloseDialog')" />
      </v-toolbar>
      <canvas id="imageCanvas" />
      <v-card-title class="text-end">
        <v-btn
          color="orange-darken-3"
          size="small"
          variant="flat"
          style="height: 40px; margin-right: 12px"
          @click="onClearDrawing()"
        >
          Clear Drawing
        </v-btn>
        <v-btn
          color="blue-darken-3"
          size="small"
          variant="flat"
          style="height: 40px"
          @click="submit"
        >
          Submit
        </v-btn>
      </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const { getImage } = useUtils();

const props = defineProps({
  message: {
    type: String,
  },
  isShowDialog: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
  },
  imageIdx: {
    type: Number,
  },
});
const emit = defineEmits<{
  (event: "onSubmit", value: string, idx: number): void;
  (event: "onCloseDialog"): void;
}>();

const isDialogVisible = computed(() => props.isShowDialog);

var canvas: any = document.getElementById("imageCanvas");
var ctx: any = "";
var img: any = "";
var pos: any = { x: 0, y: 0 };

onMounted(async () => {
  canvas = document.getElementById("imageCanvas");
  ctx = canvas?.getContext("2d");

  var rect = canvas.getBoundingClientRect();
  canvas.width = rect.width < 712 ? 712 : rect.width;
  canvas.height = rect.height < 400 ? 400 : rect.height;

  const response = await getImage(props.imageUrl!);
  if (!response) return;
  handleImage(response);

  canvas.addEventListener("mousedown", setPosition);
  canvas.addEventListener("mousemove", draw);
  canvas.addEventListener(
    "touchstart",
    function (e: any) {
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousedown", {
        buttons: 1,
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(mouseEvent);
    },
    false,
  );
  canvas.addEventListener(
    "touchmove",
    function (e: any) {
      var touch = e.touches[0];
      var mouseEvent = new MouseEvent("mousemove", {
        buttons: 1,
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(mouseEvent);
    },
    false,
  );

  var imageCanvas: any = document.getElementById("imageCanvas");
  imageCanvas.style.cursor = "crosshair";
});

function handleImage(image: Blob) {
  var reader = new FileReader();
  reader.onload = function (event: any) {
    img = new Image();
    img.onload = function () {
      var ratio = this.height / this.width;
      canvas.height = canvas.width * ratio;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(image);
}

async function setPosition(e: any) {
  var rect = canvas.getBoundingClientRect();

  if (rect.width < 712 && rect.height < 400) {
    var scaleX = 712 / rect.width;
    var scaleY = 400 / rect.height;

    pos.x = (e.clientX - rect.left) * scaleX;
    pos.y = (e.clientY - rect.top) * scaleY;
    return;
  }

  pos.x = e.clientX - rect.left;
  pos.y = e.clientY - rect.top;
}

async function draw(e: any) {
  canvas.style.cursor = "crosshair";

  if (e.buttons !== 1) return;
  if (pos.x === 0 && pos.y === 0) setPosition(e);

  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#FF0000";
  ctx.moveTo(pos.x, pos.y);
  setPosition(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  ctx.closePath();
}

const submit = () => {
  canvas.toBlob((blob: any) => {
    const url = URL.createObjectURL(blob);
    console.log("URL", url);

    emit("onSubmit", url, props.imageIdx!);
  });
};

async function onClearDrawing() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}
</script>
