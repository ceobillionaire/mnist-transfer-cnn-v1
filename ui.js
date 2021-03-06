/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

// import * as tf from '@tensorflow/tfjs';
// import * as util from './util';

var ui = ui || {}

ui.status = function(statusText, statusColor) {
  console.log(statusText);
  document.getElementById('status').textContent = statusText;
  document.getElementById('status').style.color = statusColor;
}

ui.prepUI = function(predict, retrain, testExamples, imageSize) {
  setPredictFunction(predict, testExamples, imageSize);
  const imageInput = document.getElementById('image-input');
  imageInput.value = util.imageVectorToText(testExamples['5_1'], imageSize);
  predict(imageInput.value);
  setRetrainFunction(retrain);
}

ui.getImageInput = function() {
  return document.getElementById('image-input').value;
}

ui.getEpochs = function() {
  return Number.parseInt(document.getElementById('epochs').value);
}

function setPredictFunction(predict, testExamples, imageSize) {
  const imageInput = document.getElementById('image-input');
  imageInput.addEventListener('keyup', () => {
    const result = predict(imageInput.value);
  });

  const testImageSelect = document.getElementById('test-image-select');
  testImageSelect.addEventListener('change', () => {
    imageInput.value =
        util.imageVectorToText(testExamples[testImageSelect.value], imageSize);
    predict(imageInput.value);
  });
}

function setRetrainFunction(retrain) {
  const retrainButton = document.getElementById('retrain');
  retrainButton.addEventListener('click', async () => retrain());
}

ui.getProgressBarCallbackConfig = function(epochs) {
  // Custom callback for updating the progress bar at the end of epochs.

  const trainProg = document.getElementById('trainProg');
  const progressBarCallbackConfig = {
    onTrainBegin: async (logs) => {
      ui.status(
          'Please wait and do NOT click anything while the model retrains...',
          'blue');
      trainProg.value = 0;
      await tf.nextFrame();
    },
    onTrainEnd: async (logs) => {
      ui.status('Done retraining ' + epochs + ' epochs. Standing by.', 'black');
      await tf.nextFrame();
    },
    onEpochEnd: async (epoch, logs) => {
      ui.status(
          'Please wait and do NOT click anything while the model retrains... ' +
          '(Epoch ' + (epoch + 1) + ' of ' + epochs + ')');
      trainProg.value = (epoch + 1) / epochs * 100;
      await tf.nextFrame();
    },
  };
  return progressBarCallbackConfig;
}

ui.setPredictError = function(text) {
  const predictHeader = document.getElementById('predict-header');
  const predictValues = document.getElementById('predict-values');
  predictHeader.innerHTML = '<td>Error:&nbsp;' + text + '</td>';
  predictValues.innerHTML = '';
}

ui.setPredictResults = function(predictOut, winner) {
  const predictHeader = document.getElementById('predict-header');
  const predictValues = document.getElementById('predict-values');

  predictHeader.innerHTML =
      '<td>5</td><td>6</td><td>7</td><td>8</td><td>9</td>';
  let valTds = '';
  for (const predictVal of predictOut) {
    const valTd = '<td>' + predictVal.toFixed(6) + '</td>';
    valTds += valTd;
  }
  predictValues.innerHTML = valTds;
  document.getElementById('winner').textContent = winner;
}

ui.disableLoadModelButtons = function() {
  document.getElementById('load-pretrained-remote').style.display = 'none';
  document.getElementById('load-pretrained-local').style.display = 'none';
}
