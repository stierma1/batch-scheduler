var {Predicate, Atom, NumberAtom, List, Variable, Statements} = require("backwords-chainer").Unification;
var {OrStatements, PredicateStatement, OnceStatement} = Statements;

function createWaitingPredicate(task){
  return new Predicate({name:"waiting", argsList:[Atom.fromValue(task)]});
}

function createRunningPredicate(task, box){
  return new Predicate({name:"running", argsList:[Atom.fromValue(task), Atom.fromValue(box)]});
}

function createRunningPredicateVariableBox(task, box){
  return new Predicate({name:"running", argsList:[Atom.fromValue(task), box]});
}

function createAvailablePredicate(box){
  return new Predicate({name:"available", argsList:[Atom.fromValue(box)]});
}

function addElementToList(ele, list){
  if(!list){
    list = List.getEmptyList();
  }

  return new List({argsList:[ele, list]});
}

function createRequirementsPredicate(task, requirements){
  return new Predicate({name:"requirements", argsList:[Atom.fromValue(task), Atom.fromValue(requirements)]});
}

function createQualifiesPredicate(box, requirements){
  return new Predicate({name:"qualifies", argsList:[Atom.fromValue(box), Atom.fromValue(requirements)]});
}

function createGoalFrom(waitingTasks, requirements, availableBoxes, qualifications, desiredRunningTasks, depth, hornClauses){
  var waitingPredicates = waitingTasks.map((task) => {
    return createWaitingPredicate(task);
  });
  var requirementsPredicates = requirements.map(([task, requirement]) => {
    return createRequirementsPredicate(task, requirement);
  })
  var availableBoxesPredicates = availableBoxes.map((box) => {
    return createAvailablePredicate(box);
  });
  var qualificationsPredicates = qualifications.map(([box, requirement]) => {
    return createQualifiesPredicate(box, requirement);
  });

  var runningTasks = desiredRunningTasks.map((desiredRunningTask,idx) => {
    return createRunningPredicateVariableBox(desiredRunningTask, new Variable({name:"Box" + idx}));
  });
  var desiredState = List.fromArray(runningTasks);
  var currentState = List.fromArray(waitingPredicates.concat(availableBoxesPredicates).concat(requirementsPredicates).concat(qualificationsPredicates));

  return createGoal(currentState, desiredState, depth, hornClauses);
}

//planner(CurrentState, DesiredState, ActionList, Z, Depth)
function createGoal(currentState, desiredState, depth, hornClauses){
  var sideState = new Variable({name:"S"});
  var actionList = new Variable({name:"Actions"});
  var depth = new NumberAtom({name:depth});

  var plannerPredicate = new Predicate({name:"planner_iterative_deepening", argsList:[currentState, desiredState, actionList, sideState, depth, new NumberAtom({name:"1"})]});
  var plannerPredicateStatement = new PredicateStatement({predicate:plannerPredicate, hornClauses:hornClauses});
  var goal = new OrStatements({subStatements:[plannerPredicateStatement]});
  return goal;
}

module.exports = createGoalFrom;
