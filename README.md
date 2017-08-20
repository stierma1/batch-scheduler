# batch-scheduler

Unopinionated batch-scheduler.

Takes a list of available tasks, list of boxes/vhosts/things that run tasks... , a list of [tasks, requirements], a list of [box/vhosts, requirements], and list desired tasks to batch.  The "tasks" and "boxes" can be any type of object, requirements do not need to be strings but can be objects as well.

## Usage

```js
var batchSchedule = require("batch-scheduler");


var myBatch = batchSchedule([myTask, yourTask, thirdTask], //<-- tasks can be any object type
  [[myTask, "l1"], [yourTask, "l2"], [thirdTask, "l1"]], // <-- [tasks, requirements] requirements do not have to be strings  
  [myBox, myOtherBox, myThirdBox], //<-- boxes can be any object type
  [[myBox, "l1"], [myOtherBox, "l2"], [myThirdBox, "l1"]], //<-- [boxes, requirements] requirements should be same objects shared with tasks
  [myTask,yourTask,thirdTask] //<-- desired tasks list
);

//myBatch is a list of [task, box]


```
