import * as posenet from '@tensorflow-models/posenet';
import suitPath from './suit.png'

const color = 'aqua';
const boundingBoxColor = 'red';
const lineWidth = 2;

function toTuple(vec): [any, any] {
  return [vec.y, vec.x];
}

export function drawPoint(ctx, y, x, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawSegment([ay, ax], [by, bx], color, scale, ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

export function drawSkeleton(keypoints: posenet.Keypoint[], minConfidence: number, ctx: CanvasRenderingContext2D, scale = 1) {
  const adjacentKeyPoints =
    posenet.getAdjacentKeyPoints(keypoints, minConfidence);

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(
      toTuple(keypoints[0].position),
      toTuple(keypoints[1].position),
      color,scale, ctx
    );
  });
}

export function drawKeypoints(keypoints: posenet.Keypoint[], minConfidence: number, ctx: CanvasRenderingContext2D, scale = 1) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const { y, x } = keypoint.position;
    drawPoint(ctx, y * scale, x * scale, 3, color);
  }
}

export function drawBoundingBox(keypoints: posenet.Keypoint[], ctx: CanvasRenderingContext2D) {
  const boundingBox = posenet.getBoundingBox(keypoints);

  ctx.rect(
    boundingBox.minX, boundingBox.minY, boundingBox.maxX - boundingBox.minX,
    boundingBox.maxY - boundingBox.minY);

  ctx.strokeStyle = boundingBoxColor;
  ctx.stroke();
}

export function drawRotatedImage(image: HTMLImageElement, x: number, y: number, angle: number, scale: number, ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.drawImage(image, -(image.width/2)*scale, -(image.height/2)*scale);
  ctx.restore();
}


export function drawSuit(keypoints: posenet.Keypoint[], ctx: CanvasRenderingContext2D, suit: HTMLImageElement) {
  const leftShoulder = keypoints[5].position;
  const rightShoulder = keypoints[6].position;

  const xMiddle = (leftShoulder.x + rightShoulder.x) / 2;
  const yMiddle = (leftShoulder.y + rightShoulder.y) / 2;
  const distance = Math.sqrt(Math.pow( leftShoulder.x - rightShoulder.x ,2) + Math.pow( leftShoulder.y - rightShoulder.y ,2));
  const angle  = Math.atan2( rightShoulder.y - leftShoulder.y, rightShoulder.x - leftShoulder.x ) ;

  drawRotatedImage(suit, xMiddle + angle * 200, yMiddle + 1100, angle, distance/2000, ctx);
}

export async function loadSuit(): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    const suit = new Image();
    suit.addEventListener("load",()=>{
      resolve(suit)
    });
    suit.src = suitPath;
  })
}