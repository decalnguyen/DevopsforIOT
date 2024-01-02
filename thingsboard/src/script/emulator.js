var mqtt = require('mqtt');
const ACCESS_TOKEN = process.argv[2];

var client = mqtt.connect('mqtt://thingsboard.cloud', {
  username: ACCESS_TOKEN,
});

client.on('connect', function () {
  console.log('Client connected!');
  console.log('Uploading gps data once per second...');
  setInterval(publishTelemetry, 1000);
  publishTelemetry();
});

var gpsData = [
  37.77121, -122.51096, 37.77134, -122.51098, 37.77134, -122.51098, 37.77136, -122.51085, 37.77138, -122.51055, 37.7714,
  -122.5099, 37.77141, -122.50966, 37.77143, -122.50936, 37.77143, -122.50927, 37.77145, -122.50884, 37.77149,
  -122.50788, 37.77149, -122.50778, 37.77153, -122.50714, 37.77155, -122.50669, 37.77156, -122.50631, 37.7716,
  -122.50564, 37.77165, -122.50454, 37.77167, -122.50399, 37.7717, -122.50349, 37.77174, -122.50243, 37.77179,
  -122.50136, 37.77184, -122.50029, 37.77187, -122.49973, 37.77189, -122.49921, 37.77194, -122.49814, 37.77199,
  -122.49707, 37.772, -122.49669, 37.77202, -122.49635, 37.77203, -122.49611, 37.77204, -122.496, 37.77204, -122.49589,
  37.77206, -122.49544, 37.77209, -122.49493, 37.77212, -122.49416, 37.77213, -122.49386, 37.77218, -122.49279, 37.7722,
  -122.4923, 37.77222, -122.49184, 37.77223, -122.49171, 37.77228, -122.49063, 37.77233, -122.48956, 37.77233,
  -122.48947, 37.77236, -122.48903, 37.77238, -122.48849, 37.77243, -122.48742, 37.77245, -122.48698, 37.77248,
  -122.48636, 37.77252, -122.48528, 37.77256, -122.4844, 37.77257, -122.4843, 37.77257, -122.48415, 37.77262,
  -122.48314, 37.77268, -122.48205, 37.7727, -122.48137, 37.77271, -122.481, 37.77273, -122.48074, 37.77277, -122.47993,
  37.77282, -122.47886, 37.77287, -122.47779, 37.7729, -122.47711, 37.77292, -122.47671, 37.77296, -122.47565, 37.77299,
  -122.47495, 37.77301, -122.47458, 37.77306, -122.47345, 37.77312, -122.47233, 37.77314, -122.47185, 37.77314,
  -122.47173, 37.77315, -122.47164, 37.77317, -122.47126, 37.77319, -122.47057, 37.77321, -122.47019, 37.77323,
  -122.46977, 37.77325, -122.46937, 37.77326, -122.46912, 37.77329, -122.46849, 37.7733, -122.46815, 37.77331,
  -122.46805, 37.77331, -122.46794, 37.77332, -122.46774, 37.77335, -122.46727, 37.77336, -122.46698, 37.77336,
  -122.46687, 37.77337, -122.46661, 37.77339, -122.4663, 37.7734, -122.466, 37.7734, -122.46591, 37.77341, -122.46579,
  37.77343, -122.46552, 37.77346, -122.46521, 37.77349, -122.46498, 37.7735, -122.46491, 37.77346, -122.46483, 37.77356,
  -122.46407, 37.77358, -122.4639, 37.77359, -122.46381, 37.7736, -122.46378, 37.77361, -122.46367, 37.77366,
  -122.46332, 37.77374, -122.4627, 37.77377, -122.46244, 37.77386, -122.46173, 37.77387, -122.46164, 37.77392,
  -122.46126, 37.77397, -122.46089, 37.77401, -122.46057, 37.77411, -122.45976, 37.77414, -122.45949, 37.77427,
  -122.45852, 37.77427, -122.45844, 37.77427, -122.45838, 37.77432, -122.45827, 37.77434, -122.45805, 37.77451,
  -122.45668, 37.77456, -122.45631, 37.7747, -122.45528, 37.77476, -122.45478, 37.77477, -122.45467, 37.77477,
  -122.45467, 37.77467, -122.45465, 37.77467, -122.45465, 37.77458, -122.45464, 37.7743, -122.45458, 37.77419,
  -122.45456, 37.7737, -122.45446, 37.77291, -122.45431, 37.77262, -122.45426, 37.77243, -122.45422, 37.77198,
  -122.45411, 37.77191, -122.4541, 37.77176, -122.45406, 37.77169, -122.45405, 37.77162, -122.45403, 37.77153,
  -122.45401, 37.77138, -122.45397, 37.77125, -122.45395, 37.7711, -122.45393, 37.77102, -122.45392, 37.77092,
  -122.4539, 37.77081, -122.45389, 37.77066, -122.45386, 37.77011, -122.45375, 37.76956, -122.45364, 37.76936,
  -122.4536, 37.76925, -122.45358, 37.76918, -122.45356, 37.76909, -122.45354, 37.76878, -122.45348, 37.76825,
  -122.45338, 37.76816, -122.45336, 37.76782, -122.45329, 37.76731, -122.45319, 37.76716, -122.45316, 37.76701,
  -122.45313, 37.76676, -122.45307, 37.76655, -122.45303, 37.76655, -122.45303, 37.76639, -122.45299, 37.76639,
  -122.45299, 37.76629, -122.45372, 37.76618, -122.45461, 37.76613, -122.45498, 37.76596, -122.45629, 37.76596,
  -122.45634, 37.76596, -122.45636, 37.76596, -122.45638, 37.76596, -122.45641, 37.76596, -122.45646, 37.76594,
  -122.45663, 37.76593, -122.4567, 37.76592, -122.45681, 37.76591, -122.45693, 37.76591, -122.45702, 37.76592,
  -122.45716, 37.76593, -122.45727, 37.76594, -122.45736, 37.76595, -122.45741, 37.76596, -122.45747, 37.76598,
  -122.45756, 37.76601, -122.45766, 37.76607, -122.45783, 37.76607, -122.45783, 37.76612, -122.45798, 37.76618,
  -122.45818, 37.76619, -122.4582, 37.76624, -122.4584, 37.76627, -122.45853, 37.76629, -122.4586, 37.7663, -122.45869,
  37.7663, -122.45888, 37.7663, -122.45897, 37.76628, -122.45947, 37.76627, -122.45952, 37.76627, -122.45956, 37.76628,
  -122.4596, 37.76628, -122.45963, 37.76629, -122.45967, 37.7663, -122.4597, 37.76631, -122.45973, 37.76632, -122.45975,
  37.76633, -122.45977, 37.76635, -122.4598, 37.76639, -122.45986, 37.76634, -122.45997, 37.76629, -122.46015, 37.76629,
  -122.46023, 37.76628, -122.46028, 37.76626, -122.46033, 37.76625, -122.46042, 37.76624, -122.46052, 37.76623,
  -122.46067, 37.76623, -122.4608, 37.76623, -122.4609, 37.76621, -122.46111, 37.76617, -122.46203, 37.76616,
  -122.46217, 37.76615, -122.46252, 37.76612, -122.46326, 37.76609, -122.46413, 37.76607, -122.46435, 37.76607,
  -122.46444, 37.76606, -122.46462, 37.76603, -122.4654, 37.76598, -122.46647, 37.76594, -122.46753, 37.76593,
  -122.46768, 37.76589, -122.4686, 37.76586, -122.46898, 37.76583, -122.46966, 37.76578, -122.47074, 37.76577,
  -122.47103, 37.76577, -122.47114, 37.76576, -122.47138, 37.76574, -122.47182, 37.76569, -122.47295, 37.76568,
  -122.47322, 37.76567, -122.47332, 37.76564, -122.47407, 37.76559, -122.47514, 37.76559, -122.4754, 37.76558,
  -122.47552, 37.76555, -122.4762, 37.7655, -122.47718, 37.7655, -122.47728, 37.76549, -122.4774, 37.76549, -122.47744,
  37.76549, -122.47744, 37.76549, -122.47749, 37.76547, -122.47777, 37.76545, -122.47834, 37.76545, -122.47842,
  37.76543, -122.47887, 37.7654, -122.47943, 37.76538, -122.47981, 37.76535, -122.48048, 37.7653, -122.48157, 37.7653,
  -122.48166, 37.76529, -122.48195, 37.76526, -122.48264, 37.76522, -122.48357, 37.76521, -122.48371, 37.76521,
  -122.48381, 37.76519, -122.48413, 37.76516, -122.48478, 37.76512, -122.48586, 37.76511, -122.48596, 37.7651,
  -122.48617, 37.76507, -122.48693, 37.76502, -122.488, 37.76502, -122.4881, 37.765, -122.48836, 37.76498, -122.48897,
  37.76497, -122.48907, 37.76493, -122.49015, 37.76492, -122.49024, 37.76491, -122.49049, 37.76488, -122.49121,
  37.76483, -122.49229, 37.76479, -122.49326, 37.76478, -122.49335, 37.76474, -122.49442, 37.76472, -122.49473,
  37.76471, -122.4955, 37.7647, -122.49563, 37.76469, -122.49594, 37.76468, -122.49626, 37.76467, -122.49648, 37.7646,
  -122.49749, 37.76459, -122.49765, 37.76455, -122.49872, 37.7645, -122.49978, 37.76445, -122.50087, 37.76444,
  -122.50106, 37.7644, -122.50193, 37.76436, -122.50299, 37.76431, -122.50408, 37.76426, -122.50514, 37.76426,
  -122.50525, 37.76422, -122.50622, 37.76417, -122.50728, 37.76412, -122.50836, 37.7641, -122.50885, 37.7641,
  -122.50915, 37.7641, -122.50944, 37.76409, -122.50976, 37.76408, -122.5102, 37.76407, -122.51032, 37.76406,
  -122.51043, 37.76403, -122.51043, 37.76403, -122.51043, 37.76396, -122.51043, 37.76396, -122.51029, 37.76407,
  -122.51032, 37.76417, -122.51032, 37.76441, -122.51034, 37.76461, -122.51035, 37.76478, -122.51033, 37.76496,
  -122.51031, 37.76534, -122.51028, 37.76557, -122.51026, 37.76584, -122.51025, 37.7659, -122.51025, 37.76614,
  -122.51026, 37.76641, -122.51026, 37.76662, -122.51027, 37.76704, -122.51031, 37.76727, -122.51033, 37.76762,
  -122.51039, 37.76767, -122.51039, 37.76774, -122.51041, 37.76784, -122.51043, 37.76828, -122.51053, 37.76862,
  -122.5106, 37.76869, -122.51062, 37.76902, -122.51069, 37.76926, -122.51073, 37.76942, -122.51075, 37.77001,
  -122.51083, 37.77034, -122.51086, 37.77046, -122.51087, 37.77093, -122.51093, 37.77098, -122.51093,
];

var polygon =
  '[[37.770835, -122.510163],[37.771586, -122.495633],[37.772773, -122.471776],[37.773354, -122.461562],[37.774558, -122.454910],[37.767407, -122.454612],[37.766195, -122.466924],[37.765866, -122.477787],[37.764699, -122.509657]]';

var circle = '{"latitude": 37.770980000, "longitude":-122.510930000, "radius":400}';

var index = 0,
  speed = 40,
  status = 'On route',
  stopTime = -5,
  runTime = 0;

client.on('message', function (topic, message) {
  console.log('request.topic: ' + topic);
  console.log('request.body: ' + message.toString());
  var requestId = topic.slice('v1/devices/me/rpc/request/'.length),
    messageData = JSON.parse(message.toString());
  if (messageData.method === 'setSoftwareVersion') {
    var softwareVersion = messageData.params.value;
    console.log('New software version was successfylly updated!');
    client.publish('v1/devices/me/attributes', JSON.stringify({ softwareVersion: softwareVersion }));
  } else {
    client.publish('v1/devices/me/rpc/response/' + requestId, message);
  }
});

function publishTelemetry() {
  client.publish(
    'v1/devices/me/telemetry',
    JSON.stringify({
      latitude: gpsData[index],
      longitude: gpsData[index + 1],
      coordinates: polygon,
      speed: speed,
      status: status,
      radius: circle,
    }),
  );
  stopTime++;
  runTime++;

  if (stopTime % 20 == 0) {
    status = 'On route';
  }
  if (status == 'On route') {
    speed = (40 + Math.random() * 5 + Math.random() * 20).toFixed(1);
  }

  if (runTime % 20 == 0) {
    status = 'At the stop';
    speed = 0;
  }
  if (status == 'On route') {
    index += 2;
  }
  if (index == 684) {
    index = 0;
  }
}