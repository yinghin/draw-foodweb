/*
 * Draw Food Web
 * Copyright (c) 2024 Lim Ying Hin
 * All rights reserved.
 * 
 * This script may not be used, copied, modified, or distributed without explicit written permission.
 * 
 * A script for drawing food web on a canvas with automated marking capabilities.
 * 
 * @file: script.js
 * @author: Lim Ying Hin
 * @version: 1.0.0
 * @date: 25 December 2024
 */

const stage = new Konva.Stage({
  container: 'container',
  width: window.innerWidth,
  height: window.innerHeight,
});

const layer = new Konva.Layer();
stage.add(layer);

const images = [
{'id': 'grass', 'src': 'images/grass.png' },
{'id': 'cricket', 'src': 'images/cricket.png' },
{'id': 'sparrow', 'src': 'images/sparrow.png' },
{'id': 'hawk', 'src': 'images/hawk.png' },
{'id': 'rabbit', 'src': 'images/rabbit.png' },
{'id': 'fox', 'src': 'images/fox.png' }
];

const answers = [
  {'id': 1, 'start': 'grass', 'end': 'cricket'},
  {'id': 2, 'start': 'cricket', 'end': 'sparrow'},
  {'id': 3, 'start': 'sparrow', 'end': 'hawk'},
  {'id': 4, 'start': 'grass', 'end': 'rabbit'},
  {'id': 5, 'start': 'rabbit', 'end': 'hawk'},
  {'id': 6, 'start': 'rabbit', 'end': 'fox'}
]
const correctAns = [];
let wrongAns = 0;
const arrows = [];
let activeArrow = null;

// Function to load an image and create a draggable Konva Image
function createDraggableImage(obj, x, y) {
  const img = new Image();
  img.src = obj.src;
  img.onload = () => {
      const konvaImage = new Konva.Image({
          x: x,
          y: y,
          image: img,
          width: 100,
          height: 100,
          draggable: true,
          id: obj.id
      });

      konvaImage.on('dblclick dbltap', () => {
          if (activeArrow) return;
          activeArrow = new Konva.Arrow({
              points: [konvaImage.x() + konvaImage.width() / 2, konvaImage.y() + konvaImage.height() / 2, konvaImage.x()+5, konvaImage.y()+5],
              pointerLength: 10,
              pointerWidth: 10,
              fill: 'black',
              stroke: 'black',
              strokeWidth: 3,
          });

          activeArrow.on('dblclick dbltap', (e) => {
              firstMatchIndex = arrows.findIndex((arrow) => {
                  if(arrow.getAttr('startImg') === e.target.getAttr('startImg') && arrow.getAttr('endImg') === e.target.getAttr('endImg')){
                      return true;
                  } else {
                      return false;
                  }
              });
              if (firstMatchIndex !== -1) {
                  arrows.splice(firstMatchIndex,1);
              }
              e.target.destroy();
          });

          layer.add(activeArrow);

          stage.on('mousemove touchmove', (e) => {
              if (!activeArrow) return;

              const pos = stage.getPointerPosition();
              const points = [
                  konvaImage.x() + konvaImage.width() / 2,
                  konvaImage.y() + konvaImage.height() / 2,
                  pos.x+10,
                  pos.y+10,
              ];

              activeArrow.points(points);
              layer.batchDraw();
          });

          stage.on('mouseup touchend', (e) => {
              if (!activeArrow) return;
              if (e.target.getClassName() === 'Image' && e.target.id() !== konvaImage.id()) {
                  let endShape = e.target;
                  const points = [
                      konvaImage.x() + konvaImage.width() / 2,
                      konvaImage.y() + konvaImage.height() / 2,
                      endShape.x() + endShape.width() / 2,
                      endShape.y() + endShape.height() / 2,
                  ];
                  activeArrow.points(points);
                  activeArrow.setAttr('startImg', konvaImage.id());
                  activeArrow.setAttr('endImg', endShape.id());
                  layer.batchDraw();
                  arrows.push(activeArrow);
              } else {
                  activeArrow.destroy();
              }
              activeArrow = null;
              stage.off('mousemove touchmove');
              stage.off('mouseup touchend');
          });
      });

      //when repositioning images, check for affected arrows and redefine their point coordinates
      konvaImage.on('dragmove dragend', (e) => {
          //no need to redraw layer after defining new points as drag will auto trigger redraw
          arrows.forEach((arrow) => {
              if (arrow.getAttr('startImg') === e.target.id()){
                  const newPoints = [...arrow.points()];
                  newPoints.splice(0, 2, e.target.x() + e.target.width() / 2, e.target.y() + e.target.height() / 2);
                  arrow.points(newPoints);
              } else if (arrow.getAttr('endImg') === e.target.id()) {
                  const newPoints = [...arrow.points()];
                  newPoints.splice(2, 2, e.target.x() + e.target.width() / 2, e.target.y() + e.target.height() / 2);
                  arrow.points(newPoints);
              }
          });
      });

      obj.konovaimg = konvaImage;
      layer.add(konvaImage);
      layer.draw();
  };
}

// Distribute images on the canvas
if(stage.width() < 640) {
  const padding = 0.05 * stage.width();
  const columns = 2;
  const imageWidth = 0.3 * stage.width();
  const imageHeight = imageWidth;

  images.forEach((obj, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);

      const x = 0.1 * stage.width() + col * (imageWidth + padding) + padding;
      const y = row * (imageHeight + padding) + padding;

      createDraggableImage(obj, x, y);
  });
} else {
  const padding = 0.05 * stage.width();
  const columns = 3;
  const imageWidth = 0.1 * stage.width();
  const imageHeight = imageWidth;

  images.forEach((obj, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);

      const x = 0.2 * stage.width() + col * (imageWidth + padding) + padding;
      const y = row * (imageHeight + padding) + padding;
      createDraggableImage(obj, x, y);
  });
}

document.getElementById('check-button').addEventListener('click', () => {
      arrows.forEach((arrow) => {
          ansIndex = answers.findIndex((answer) => {
                  if(arrow.getAttr('startImg') === answer.start && arrow.getAttr('endImg') === answer.end){
                      return true;
                  } else {
                      return false;
                  }
              });
          if (ansIndex === -1) { //incorrect arrow drawn
              wrongAns++;
              arrow.stroke('red');
              arrow.fill('red');
          } else { //correct arrow drawn
              const ansId = answers[ansIndex].id;
              if(!correctAns.includes(ansId)){ //not a duplicate arrow, has not been scored yet
                  correctAns.push(ansId); 
              }
          }
      });
      let totalScore = correctAns.length - wrongAns;
      stage.listening(false);
      document.getElementById('score').innerHTML = "Correct: " + correctAns.length + "<br>" + "Incorrect: " + wrongAns + "<br>" + "Final Score: " + totalScore;
      document.getElementById('score').style.display = "block";
});

window.addEventListener('resize', () => {
  stage.width(window.innerWidth);
  stage.height(window.innerHeight);
});