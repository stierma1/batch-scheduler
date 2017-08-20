
var batchSchedule = require("./lib/batch-schedule");

var myTask = {"hello": "world"};
var yourTask = {"goodbye": "mars"};
var thirdTask = {"stuff":3}
var myBox = {"box":1};
var myOtherBox = {"otherBox": 2}
var myThirdBox = {"thirdBox": 3}

console.log(
  batchSchedule([myTask, yourTask, thirdTask],
    [[myTask, "l1"], [yourTask, "l1"], [thirdTask, "l1"]],
    [myBox, myOtherBox, myThirdBox],
    [[myBox, "l1"], [myOtherBox, "l1"], [myThirdBox, "l1"]],
    [myTask,yourTask,thirdTask]
  )
)

console.log(
  batchSchedule([myTask, yourTask, thirdTask],
    [[myTask, "l1"], [yourTask, "l1"], [thirdTask, "l1"]],
    [myBox, myOtherBox, myThirdBox],
    [[myBox, "l1"], [myOtherBox, "l1"], [myThirdBox, "l1"]],
    [myTask, yourTask,thirdTask]
  )
)
