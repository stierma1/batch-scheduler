
var {BackwordsChainer, Unification} = require("backwords-chainer");
var {Statements, Predicate, Atom} = Unification;
var {HornClause, UnionStatement, AndStatements} = Statements;
var createGoalFrom = require("./utils");
var chainer = new BackwordsChainer();

chainer.loadDefaults();
chainer.parseRules(`
holds(run(Task, Box), CurrentState, [running(Task, Box) | NewState]) :-
  member(waiting(Task), CurrentState), member(available(Box), CurrentState),
  member(requirements(Task, Requirements), CurrentState), member(qualifies(Box, Requirements), CurrentState),
  select(waiting(Task), CurrentState, NState1), select(available(Box), NState1, NewState).

planner_iterative_deepening(CurrentState, DesiredState, Actions, S, Max_Depth, CurrentDepth) :-
  >=(Max_Depth, CurrentDepth), (planner(CurrentState, DesiredState, Actions, S, CurrentDepth) ;
  (+(1, CurrentDepth, NewDepth), planner_iterative_deepening(CurrentState, DesiredState, Actions, S, Max_Depth, NewDepth) )).
`)

function batchSchedule(waitingTasks, taskRequirementsPairs, availableBoxes, boxQualifiactionsPairs, tasksToSchedule){
  var goal = createGoalFrom(waitingTasks, taskRequirementsPairs, availableBoxes, boxQualifiactionsPairs, tasksToSchedule, tasksToSchedule.length, chainer.context.hornClauses);
  var gen = chainer.run(goal);
  var {value} = gen.next();
  if(value){
    var actions = value.Actions;
    var taskBoxPairs = [];
    var currentList = actions;

    while(currentList.name === "_list"){
      var task = currentList.argsList[0].argsList[0].name;
      var box = currentList.argsList[0].argsList[1].name;
      taskBoxPairs.push([task, box]);
      currentList = currentList.argsList[1];
    }

    return taskBoxPairs;
  }
  return null;
}

module.exports = batchSchedule;

/*
class Task{
  constructor(){
    this.s = "WTF";
  }
  toString(){
    return "task_data"
  }
}

class Box{
  constructor(address){
    this.address = address
  }
  toString(){
    return this.address
  }
}

var myTask = new Task();
var yourTask = new Task();
var myBox = new Box("stuff");
var myOtherBox = new Box("other");

var goal = createGoalFrom([myTask, yourTask], [[myTask, "l2"], [yourTask, "l1"]], [myBox, myOtherBox], [[myBox, "l1"], [myOtherBox, "l2"]], [myTask, yourTask], 2, chainer.context.hornClauses)

//console.log(chainer.toString());
var gen = chainer.run(goal)
//console.log(goal.toString())
var gen = chainer.run(`
planner([waiting(task), available(box), requirements(task, l1), qualifies(box, l1)], [running(task,Box)], Actions, S, 3)
`)
console.log(gen.next().value.Actions.toString())
*/
