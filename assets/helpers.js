/**
 * This file contains functions that help with common tasks such as creating
 * a loading indicator and print data.
 */
 
/**
 * Return a jQuery DOM object representing a loading indicator
 */
function getLoadingIndicator() {
  var $loading = $('<div>').addClass('loading text-center');
  $('<p>').addClass('lead').text('Loading...').appendTo($loading);
  $('<img>').attr('src', '/assets/loader.gif').appendTo($loading);
  return $loading;
}

/**
 * Return a jQuery DOM object representing the HTML display for a person.
 */
function displayPerson(person){
  var $display = $('<div>');
  $('<h1>').text(person.getDisplayName()).appendTo($display);
  
  // Basic display information
  createPanelTable('Display', [
    [
      ['th', 'ID'],
      ['th', 'Gender'],
      ['th', 'Lifespan'],
      ['th', 'Living']
    ],
    [
      ['td', person.getId()],
      ['td', person.getDisplayGender()],
      ['td', person.getDisplayLifeSpan()],
      ['td', person.isLiving()]
    ],
    [
      ['th', 'Birth Date'],
      ['th', 'Birth Place'],
      ['th', 'Death Date'],
      ['th', 'Death Place']
    ],
    [
      ['td', person.getDisplayBirthDate()],
      ['td', person.getDisplayBirthPlace()],
      ['td', person.getDisplayDeathDate()],
      ['td', person.getDisplayDeathPlace()]
    ]
  ]).appendTo($display);
  
  // Names
  $('<h3>').text('Names').appendTo($display);
  var names = person.getNames();
  for(var i = 0; i < names.length; i++){
    displayName(names[i]).appendTo($display);
  }
  
  // Facts
  $('<h3>').text('Facts').appendTo($display);
  var facts = person.getFacts();
  for(var i = 0; i < facts.length; i++){
    displayFact(facts[i]).appendTo($display);
  }
  
  // Raw data
  rawDump(person).appendTo($display);
  
  return $display;
}

/**
 * Return a jQuery DOM object representing a relationship
 */
function displayRelationship(relationship, person1, person2){
  var $display = $('<div>');
  createPanelTable('Couple Relationship', [
    [
      ['th', 'Relationship ID'],
      ['th', 'Person1'],
      ['th', 'Person2']
    ],
    [
      ['td', relationship.getId()],
      ['td', person1.getId()],
      ['td', person2.getId()]
    ],
    [
      ['td', ''],
      ['td', person1.getDisplayName()],
      ['td', person2.getDisplayName()]
    ],
    [
      ['td', ''],
      ['td', person1.getDisplayLifeSpan()],
      ['td', person2.getDisplayLifeSpan()]
    ]
  ]).appendTo($display);
  
  // Facts
  var facts = relationship.getFacts();
  for(var i = 0; i < facts.length; i++){
    displayFact(facts[i]).appendTo($display);
  }
  
  rawDump(relationship).appendTo($display);
  
  return $display;
}

/**
 * Return a jQuery DOM object representing a child and parents relationship
 */
function displayChildAndParentsRelationship(relationship, father, mother, child){
  var $display = $('<div>');
  createPanelTable('Child and Parents Relationship', [
    [
      ['th', 'Father'],
      ['th', 'Mother'],
      ['th', 'Child']
    ],
    [
      ['td', father ? father.getId() : ''],
      ['td', mother ? mother.getId() : ''],
      ['td', child ? child.getId() : '']
    ],
    [
      ['td', father ? father.getDisplayName() : ''],
      ['td', mother ? mother.getDisplayName() : ''],
      ['td', child ? child.getDisplayName() : '']
    ],
    [
      ['td', father ? father.getDisplayLifeSpan() : ''],
      ['td', mother ? mother.getDisplayLifeSpan() : ''],
      ['td', child ? child.getDisplayLifeSpan() : '']
    ]
  ]).appendTo($display);
  
  // Father facts
  var fatherFacts = relationship.getFatherFacts();
  if(fatherFacts.length){
    $('<h4>').text('Father Facts').appendTo($display);
    for(var i = 0; i < fatherFacts.length; i++){
      displayFact(fatherFacts[i]).appendTo($display);
    }
  }
  
  // Mother facts
  var motherFacts = relationship.getMotherFacts();
  if(motherFacts.length){
    $('<h4>').text('Mother Facts').appendTo($display);
    for(var i = 0; i < motherFacts.length; i++){
      displayFact(motherFacts[i]).appendTo($display);
    }
  }
  
  // Raw
  rawDump(relationship).appendTo($display);
  
  return $display;
}

/**
 * Return a jQuery DOM object representing a name
 */
function displayName(name){
  var header = '<code>' + name.getType() + '</code>';
  if(name.isPreferred()){
    header += ' <span class="label label-success">Preferred</span>';
  }
  
  var rows = [
    [
      ['th', 'Full Text'],
      ['th', 'Given'],
      ['th', 'Surname'],
      ['th', 'Lang']
    ]
  ];
  for(var i = 0; i < name.getNameFormsCount(); i++){
    rows.push([
      ['td', name.getFullText(i)],
      ['td', name.getGivenName(i)],
      ['td', name.getSurname(i)],
      ['td', name.getLang(i)]
    ]);
  }
  
  return createPanelTable(header, rows);
}

/**
 * Return a jQuery DOM object representing a fact
 */
function displayFact(fact){
  return createPanelTable('<code>' + fact.getType() + '</code>', [
    [
      ['th', 'Value'],
      ['th', 'Place - Original'],
      ['th', 'Place - Normalized']
    ],
    [
      ['td', fact.getValue()],
      ['td', fact.getOriginalPlace()],
      ['td', fact.getNormalizedPlace()]
    ],
    [
      ['th', 'Date - Original'],
      ['th', 'Date - Formal'],
      ['th', 'Date - Normalized']
    ],
    [
      ['td', fact.getOriginalDate()],
      ['td', fact.getFormalDate()],
      ['td', fact.getNormalizedDate()]
    ]
  ]);
}

/**
 * Return jQuery DOM object for the raw output of an object
 */
function rawDump(obj){
  var $display = $('<div>');
  $('<h3>').text('Raw').appendTo($display);
  $('<pre>').text(JSON.stringify(obj, null, 2)).appendTo($display);
  return $display;
}

/**
 * Print an error. Returns a jQuery DOM object
 */
function displayError(error){
  return $('<div>')
    .addClass('alert alert-danger')
    .html('<strong>Error</strong>: ' + error.message);
}

/**
 * Generate a bootstrap panel with an embedded table
 */
function createPanelTable(header, rows){
  var $panel = $('<div>').addClass('panel panel-default');
  $('<div>').addClass('panel-heading').html(header).appendTo($panel);
  
  var $table = $('<table>').addClass('table').appendTo($panel);
  for(var i = 0; i < rows.length; i++){
    var $row = $('<tr>').appendTo($table);
    for(var j = 0; j < rows[i].length; j++){
      $('<'+rows[i][j][0]+'>').text(rows[i][j][1]).appendTo($row);
    }
  }
  
  return $panel;
}