# mnist-transfer-cnn-v1
MNIST CNN Transfer Learning : TensorFlow.js Demo

This demo shows how to perform transfer learning using TensorFlow.js.

A simple convnet was trained on only the first 5 digits [0..4] from the MNIST dataset. The convolutional layers are frozen, and the dense layers are fine-tuned in the browser to classify the digits [5..9].

Reference : TensorFlow.js Examples ( https://github.com/tensorflow/tfjs-examples )
